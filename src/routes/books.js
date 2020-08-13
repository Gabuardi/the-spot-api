const express = require('express');
const {root} = require('../../root');
const sql = require('mssql');
const {encode, decode} = require('../utils/codification');
const sqlResponseHandler = require('../utils/handlers');
const {createDecodedData, readTemplate, filteredData, filterArrayValues, generateFilterOptions} = require('../utils/common');

const ROUTER = express.Router();

function parseGenres(genresArray) {
  let genres = [];
  genresArray.forEach(el => {
    genres.push(decode(el.title));
  });
  return genres;
};

function generateBook(el) {
  return {
    bookId: el.book_id,
    title: decode(el.title),
    releaseYear: el.release_year,
    language: decode(el.language),
    artist: decode(el.artist),
    editorial: decode(el.editorial),
    genres: parseGenres(el.genres)
  }
}

function generateBookTitle(el) {
  return {
    bookId: el.book_id,
    title: decode(el.title)
  }
}

function replaceTemplate(html, data){
  let output = html.replace(/{%BOOKID%}/g, data.bookId);
  output = output.replace(/{%IMAGE%}/g, data.bookId);
  output = output.replace(/{%TITLE%}/g, data.title);
  output = output.replace(/{%AUTHOR%}/g, data.artist);
  output = output.replace(/{%GENRE%}/g, data.genres);
  output = output.replace(/{%EDITORIAL%}/g, data.editorial);
  output = output.replace(/{%YEAR%}/g, data.releaseYear);
  output = output.replace(/{%LANGUAGE%}/g, data.language);

  return output;
}

// -------------------------------------------------------
// BOOK HOME PAGE
// -------------------------------------------------------
ROUTER.get('/', async (req, res) => {
  try {
    let queryObj = {...req.query};

    let sqlRequest = new sql.Request();

    let homeOutput = await readTemplate(`${root}/views/client/books/index.html`, 'utf-8');
    let cardOutput = await readTemplate(`${root}/views/client/books/templates/card-book.html`, 'utf-8');
    let artistsOutput = '<option>{%AUTHOR%}</option>';
    let genresOutput = '<option>{%GENRE%}</option>';
    let editorialsOutput = '<option>{%EDITORIAL%}</option>';
    let yearsOutput = '<option>{%YEAR%}</option>';
    let languagesOutput = '<option>{%LANGUAGE%}</option>';

    sqlRequest.execute('[usp_books_get_all]', async (err, data) => {
      if(err) console.log(`ERROR!!! ${err}`);

      let bookData = await createDecodedData(data.recordset[0], generateBook);

      let finalData = filteredData(bookData, queryObj);

      let authors = await generateFilterOptions(finalData, 'artist');
      artistsOutput = await authors.map(el => artistsOutput.replace(/{%AUTHOR%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%AUTHORS_OPTION%}', artistsOutput);

      let genres = await filterArrayValues(finalData, 'genres');
      genresOutput = await genres.map(el => genresOutput.replace(/{%GENRE%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%GENRES_OPTION%}', genresOutput);

      let editorials = await generateFilterOptions(finalData, 'editorial');
      editorialsOutput = await editorials.map(el => editorialsOutput.replace(/{%EDITORIAL%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%EDITORIALS_OPTION%}', editorialsOutput);

      let year = await generateFilterOptions(finalData, 'releaseYear');
      yearsOutput = await year.map(el => yearsOutput.replace(/{%YEAR%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%YEARS_OPTION%}', yearsOutput);

      let language = await generateFilterOptions(finalData, 'language');
      languagesOutput = await language.map(el => languagesOutput.replace(/{%LANGUAGE%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%LANGUAGES_OPTION%}', languagesOutput);

      cardOutput = await finalData.map(el => replaceTemplate(cardOutput, el)).join('');
      homeOutput = await homeOutput.replace('{%BOOK_CARD%}', cardOutput);

      res
        .status(200)
        .type('text/html')
        .send(homeOutput);
    });
  } catch(err) {
    res
      .status(400)
      .json({
        status: 'failed',
        message: `ERROR!!! ${err}`
      });
  };
});

// -------------------------------------------------------
// GET ALL BOOKS
// -------------------------------------------------------
ROUTER.get('/all', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset[0], generateBook);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_books_get_all]', responseHandler);
});

// -------------------------------------------------------
// GET ALL BOOK TITLES
// -------------------------------------------------------
ROUTER.get('/titles', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateBookTitle);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_books_get_titles]', responseHandler);
});

// -------------------------------------------------------
// ADD NEW BOOK
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('title', encode(data.title));
  sqlRequest.input('release_year', data.release_year);
  sqlRequest.input('language_fk', data.language_fk);
  sqlRequest.input('artist_fk', data.artist_fk);
  sqlRequest.input('editorial_fk', data.editorial_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ BOOK -> ${data.title} has been added`));
  };

  sqlRequest.execute('[usp_books_insert]', responseHandler);
});

// -------------------------------------------------------
// UPDATE BOOK
// -------------------------------------------------------
ROUTER.put('/update/:bookId', (request, response) => {
  let bookId = request.params.bookId;
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('book_id', bookId);
  sqlRequest.input('title', encode(data.title));
  sqlRequest.input('release_year', data.release_year);
  sqlRequest.input('language_fk', data.language_fk);
  sqlRequest.input('artist_fk', data.artist_fk);
  sqlRequest.input('editorial_fk', data.editorial_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Book ${data.title} has been updated`));
  };

  sqlRequest.execute('[usp_books_update]', responseHandler);
});

// -------------------------------------------------------
// REMOVE BOOK
// -------------------------------------------------------
// TO BE MADE

// -------------------------------------------------------
// ADD AUTHORS TO BOOK
// -------------------------------------------------------
ROUTER.post('/genre/:bookId', (request, response) => {
  let bookId = request.params.bookId;
  let genre = request.body.visual_genre_fk;

  let sqlRequest = new sql.Request();

  sqlRequest.input('book_fk', bookId);
  sqlRequest.input('visual_genre_fk', genre);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Genre succesfully assigned to book`));
  };

  sqlRequest.execute('[usp_book_genres_insert]', responseHandler);
});

// -------------------------------------------------------
// BOOK LOG
// > NEEDS REVISION !!!
// -------------------------------------------------------
ROUTER.post('/log/:username', (request, response) => {
  let username = request.params.username;
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('username', encode(username)),
  sqlRequest.input('reg_id', data.reg_id),
  sqlRequest.input('action_id', 1),
  sqlRequest.input('title', encode(data.title));
  sqlRequest.input('release_year', data.release_year);
  sqlRequest.input('language_fk', data.language_fk);
  sqlRequest.input('artist_fk', data.artist_fk);
  sqlRequest.input('editorial_fk', data.editorial_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => esponse.send(`✅ BOOK log saved`));
  };

  sqlRequest.execute('[usp_activity_logs_book]', responseHandler);
});

module.exports = ROUTER;
