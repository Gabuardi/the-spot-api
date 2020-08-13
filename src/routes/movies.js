import express from 'express';
import path from 'path';
import sql from 'mssql';
import {sqlResponseHandler} from '../utils/handlers.js';
import {encode, decode} from '../utils/codification.js';
import {createDecodedData, readTemplate, filteredData, filterArrayValues, generateFilterOptions} from '../utils/common.js';

const __dirname = path.resolve();

const ROUTER = express.Router();

function insertActorsInMovieSP(movie, artists) {
  let artistArray = Array.isArray(artists) ? artists : [artists];
  artistArray.forEach((artist) => {
    let sqlRequest = new sql.Request();
    sqlRequest.input('movie_fk', movie);
    sqlRequest.input('artist_fk', artist);
    sqlRequest.execute('usp_movies_cast_insert');
  })
}

function insertGenresInMovie(movie, genres) {
  let genresArray = Array.isArray(genres) ? genres : [genres];
  genresArray.forEach((genre) => {
    let sqlRequest = new sql.Request();
    sqlRequest.input('movie_fk', movie);
    sqlRequest.input('visual_genre_fk', genre);
    sqlRequest.execute('usp_movie_genres_insert');
  });
}

function parseCast(castArray) {
  let cast = [];
  castArray.forEach(el => {
    cast.push(decode(el.full_name));
  });
  return cast;
}

function parseGenre(genreArray) {
  let genres = [];
  genreArray.forEach(el => {
    genres.push(decode(el.title));
  });
  return genres;
}

function generateMovie(el) {
  return {
    movieId: el.movie_id,
    title: decode(el.title),
    releaseYear: el.release_year,
    language: decode(el.language),
    cast: parseCast(el.cast),
    genres: parseGenre(el.genres)
  }
}

function generateMovieTitles(el) {
  return {
    movieId: el.movie_id,
    title: encode(el.title)
  }
}

function replaceTemplate(html, data){
  let output = html;
  output = output.replace(/{%MOVIEID%}/g, data.movieId);
  output = output.replace(/{%TITLE%}/g, data.title);
  output = output.replace(/{%YEAR%}/g, data.releaseYear);
  output = output.replace(/{%LANGUAGE%}/g, data.language);
  output = output.replace(/{%GENRE%}/g, data.genres);
  output = output.replace(/{%CAST%}/g, data.cast);
  output = output.replace(/{%IMAGE%}/g, data.movieId);
  return output;
}

// -------------------------------------------------------
// ADD NEW MOVIE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let dataBody = request.body;
  let movieFile = request.files.movieFile;
  let artwork = request.files.artworkFile;
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let movieId = result.recordset[0]['movie_id'];
      insertActorsInMovieSP(movieId, dataBody.cast);
      insertGenresInMovie(movieId, dataBody.genres);
      artwork.mv(`././resources/movies/artworks/${movieId}.jpg`);
      movieFile.mv(`././resources/movies/media/${movieId}.mp4`);
      response.send(movieId);
    });
  };

  sqlRequest.input('title', encode(dataBody.title));
  sqlRequest.input('release_year', dataBody.year);
  sqlRequest.input('language_fk', dataBody.language);
  sqlRequest.execute('[usp_movies_insert]', responseHandler);
});

// -------------------------------------------------------
// UPLOAD TEMP ARTWORK FILE
// -------------------------------------------------------
ROUTER.post('/upload/temp/artwork', (request, response) => {
  console.log('ASD');

  let artworkFile = request.files.artworkFile;
  artworkFile.mv(`././resources/movies/artworks/temp.jpg`);
  response.sendStatus(200);
});

// -------------------------------------------------------
// ADD CAST TO MOVIE
// -------------------------------------------------------
ROUTER.post('/cast/:movieId', (request, response) => {
  let movieId = request.params.movieId;
  let artist = request.body.artist_fk;

  let sqlRequest = new sql.Request();

  sqlRequest.input('movie_fk', movieId);
  sqlRequest.input('artist_fk', artist);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Artist succesfully assigned to movie`));
  };

  sqlRequest.execute('[usp_movies_cast_insert]', responseHandler);
});

// -------------------------------------------------------
// ADD GENRE TO MOVIE
// -------------------------------------------------------
ROUTER.post('/genre/:movieId', (request, response) => {
  let movieId = request.params.movieId;
  let genre = request.body.visual_genre_fk;

  let sqlRequest = new sql.Request();

  sqlRequest.input('movie_fk', movieId);
  sqlRequest.input('visual_genre_fk', genre);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Genre succesfully assigned to movie`));
  };

  sqlRequest.execute('[usp_movie_genres_insert]', responseHandler);
});

// -------------------------------------------------------
// GET ALL MOVIES
// -------------------------------------------------------
ROUTER.get('/all', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset[0], generateMovie);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_movies_get_all]', responseHandler);
});

// -------------------------------------------------------
// GET HOME MOVIE VIEW
// -------------------------------------------------------
ROUTER.get('/', async (req, res) => {
  try {
    let queryObj = {...req.query};

    let sqlRequest = new sql.Request();

    let homeOutput = await readTemplate(`${__dirname}/views/client/movies/index.html`, 'utf-8');
    let cardOutput = await readTemplate(`${__dirname}/views/client/movies/templates/card-movie.html`, 'utf-8');
    let genresOutput = '<option>{%GENRE%}</option>';
    let artistsOutput = '<option>{%ARTIST%}</option>';
    let yearsOutput = '<option>{%YEAR%}</option>';
    let languagesOutput = '<option>{%LANGUAGE%}</option>';

    sqlRequest.execute('[usp_movies_get_all]', async (err, data) => {
      if(err) console.log(`ERROR!!! ${err}`);

      let movieData = await createDecodedData(data.recordset[0], generateMovie);

      let finalData = filteredData(movieData, queryObj);

      let year = await generateFilterOptions(finalData, 'releaseYear');
      yearsOutput = await year.map(el => yearsOutput.replace(/{%YEAR%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%YEAR_OPTION%}', yearsOutput);

      let language = await generateFilterOptions(finalData, 'language');
      languagesOutput = await language.map(el => languagesOutput.replace(/{%LANGUAGE%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%LANGUAGE_OPTION%}', languagesOutput);

      cardOutput = await finalData.map(el => replaceTemplate(cardOutput, el)).join('');
      homeOutput = await homeOutput.replace('{%MOVIE_CARD%}', cardOutput);

      let artists = await filterArrayValues(finalData, 'cast');
      artistsOutput = await artists.map(el => artistsOutput.replace(/{%ARTIST%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%CAST_OPTION%}', artistsOutput);

      let genres = await filterArrayValues(finalData, 'genres');
      genresOutput = await genres.map(el => genresOutput.replace(/{%GENRE%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%GENRES_OPTION%}', genresOutput);

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
// UPDATE MOVIE
// -------------------------------------------------------
ROUTER.put('/:movieId', (request, response) => {
  let movieId = request.params.movieId;
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('movie_id', movieId);
  sqlRequest.input('title', encode(data.title));
  sqlRequest.input('release_year', data.release_year);
  sqlRequest.input('language_fk', data.language_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ MOVIE -> ${data.title} has been updated`));
  };

  sqlRequest.execute('[usp_movies_update]', responseHandler);
});

// -------------------------------------------------------
// DOWNLOAD MOVIE
// -------------------------------------------------------
ROUTER.get('/download/:movieId', (request, response) => {
  let movieId = request.params.movieId;
  let file = `${__dirname}/resources/movies/media/${movieId}.mp4`;
  response.download(file);
});

// -------------------------------------------------------
// MOVIE LOG
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

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => esponse.send(`✅ MOVIE log saved`));
  };

  sqlRequest.execute('[usp_activity_logs_movie]', responseHandler);
});

export default ROUTER;
