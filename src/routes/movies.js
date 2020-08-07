import express from 'express';
import sql from 'mssql';
import {sqlResponseHandler} from '../utils/handlers.js';
import {encode, decode} from '../utils/codification.js';
import {createDecodedData} from '../utils/common.js';

const ROUTER = express.Router();

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
    languageFk: el.language_fk,
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

// -------------------------------------------------------
// ADD NEW MOVIE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('title', encode(data.title));
  sqlRequest.input('release_year', data.release_year);
  sqlRequest.input('language_fk', data.language_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ MOVIE -> ${data.title} has been created`))
  };

  sqlRequest.execute('[usp_movies_insert]', responseHandler);
});

// -------------------------------------------------------
// UPLOAD MOVIE FILE
// -------------------------------------------------------
ROUTER.post('/upload/media/:movieId', (request, response) => {
  let movieFile = request.files.file;
  let movieId = request.params.movieId;
  movieFile.mv(`././resources/movies/media/${movieId}.mp4`);
  response.send('Movie created');
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
ROUTER.get('/', (request, response) => {
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
// GET ALL MOVIE TITLES
// -------------------------------------------------------
ROUTER.get('/titles', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateMovieTitles);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_movies_get_titles]', responseHandler);
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
