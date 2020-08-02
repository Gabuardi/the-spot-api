import express from 'express';
import sql from 'mssql';
import {createDecodedData} from '../utils/common.js';
import {encode, decode} from '../utils/codification.js';
import {sqlResponseHandler} from "../utils/handlers.js";

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
    languageFk: el.language_fk,
    artistFk: el.artist_fk,
    editorialFk: el.editorial_fk,
    genres: parseGenres(el.genres)
  }
};

function generateBookTitle(el) {
  return {
    bookId: el.book_id,
    title: decode(el.title)
  }
};

// -------------------------------------------------------
// GET ALL BOOKS
// > Stored Procedure with FOR JSON is not working 
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
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

// -------------------------------------------------------
// GET SPECIFIC BOOK (OPTIONAL)
// -------------------------------------------------------
// ROUTER.get('/:bookId', (request, response) => {
//   let bookId = request.params.bookId;

//   let sqlRequest = new sql.Request();

//   sqlRequest.input('book_id', bookId);

//   let responseHandler = (err, result) => {
//     sqlResponseHandler(err, result, response, (response, result) => {
//       // let decoded = createDecodedData(result.recordset[0], generateBook);
//       // response.json(decoded);
//       response.json(result.recordset);
//     });
//   };

//   sqlRequest.execute('[usp_books_get_specific]', responseHandler);
// });

export default ROUTER;
