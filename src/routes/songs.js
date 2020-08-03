import express from 'express';
import sql from 'mssql';
import {sqlResponseHandler} from '../utils/handlers.js';
import {encode, decode} from '../utils/codification.js';
import {createDecodedData} from '../utils/common.js';

const ROUTER = express.Router();

function generateArtists(artistArray) {
  let artists = [];
  artistArray.forEach(el => {
    artists.push(decode(el.full_name));
  });
};

function generateSong(el) {
  return {
    songId: el.song_id,
    title: decode(el.title),
    releaseYear: el.release_year,
    album: decode(el.album),
    recordLabel: el.record_label_fk,
    genre: el.musical_genre_fk,
    artists: generateArtists(el.artists)
  }
};

function generateSongTitles(el) {
  return {
    songId: el.song_id,
    title: encode(el.title)
  }
};

// -------------------------------------------------------
// GET ALL SONGS
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset[0], generateSong);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_songs_get_all]', responseHandler);
});

// -------------------------------------------------------
// GET ALL SONG TITLES
// -------------------------------------------------------
ROUTER.get('/titles', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateSongTitles);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_songs_get_titles]', responseHandler);
});

// -------------------------------------------------------
// ADD NEW SONG
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('title', encode(data.title));
  sqlRequest.input('release_year', data.release_year);
  sqlRequest.input('album', encode(data.album));
  sqlRequest.input('record_label_fk', data.record_label_fk);
  sqlRequest.input('musical_genre_fk', data.musical_genre_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ SONG -> ${data.title} has been created`))
  };

  sqlRequest.execute('[usp_songs_insert]', responseHandler);
});

// -------------------------------------------------------
// UPDATE SONG
// -------------------------------------------------------
ROUTER.put('/:songId', (request, response) => {
  let songId = request.params.songId;
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('songId', songId);
  sqlRequest.input('title', encode(data.title));
  sqlRequest.input('release_year', data.release_year);
  sqlRequest.input('album', encode(data.album));
  sqlRequest.input('record_label_fk', data.record_label_fk);
  sqlRequest.input('musical_genre_fk', data.musical_genre_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ SONG -> ${data.title} has been updated`));
  };

  sqlRequest.execute('[usp_songs_update]', responseHandler);
});

// -------------------------------------------------------
// REMOVE SONG
// -------------------------------------------------------
// TO BE MADE

// -------------------------------------------------------
// ADD ARTIST TO SONG
// -------------------------------------------------------
ROUTER.post('/artists/:songId', (request, response) => {
  let songId = request.params.songId;
  let artist = request.body.artist_fk;

  let sqlRequest = new sql.Request();

  sqlRequest.input('song_fk', songId);
  sqlRequest.input('artist_fk', artist);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Artist succesfully assigned to song`));
  };

  sqlRequest.execute('[usp_song_artists_insert]', responseHandler);
});

// -------------------------------------------------------
// SONG LOG
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
    sqlRequest.input('album', encode(data.album));
    sqlRequest.input('record_label_fk', data.record_label_fk);
    sqlRequest.input('musical_genre_fk', data.musical_genre_fk);
  
    let responseHandler = (err, result) => {
      sqlResponseHandler(err, result, response, () => esponse.send(`✅ SONG log saved`));
    };
  
    sqlRequest.execute('[usp_activity_logs_song]', responseHandler);
  });

export default ROUTER;
