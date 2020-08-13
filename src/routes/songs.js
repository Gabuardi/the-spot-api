const ROUTER = require('express').Router();
const {root} = require('../../root');
const sql = require('mssql');
const {encode, decode} = require('../utils/codification');
const sqlResponseHandler = require("../utils/handlers.js");
const {createDecodedData, readTemplate, filteredData, filterArrayValues, generateFilterOptions} = require('../utils/common');

function parseArtists(artistArray) {
  let artists = [];
  artistArray.forEach(el => {
    artists.push(decode(el.full_name));
  });
  return artists;
};

function generateSong(el) {
  return {
    songId: el.song_id,
    title: decode(el.title),
    releaseYear: el.release_year,
    album: decode(el.album),
    recordLabel: decode(el.record_label),
    genres: decode(el.genres),
    artists: parseArtists(el.artists)
  }
};

function generateSongTitles(el) {
  return {
    songId: el.song_id,
    title: encode(el.title)
  }
};

function replaceTemplate(html, data){
  let output = html.replace(/{%SONGID%}/g, data.songId);
  output = output.replace(/{%IMAGE%}/g, data.songId);
  output = output.replace(/{%TITLE%}/g, data.title);
  output = output.replace(/{%ARTIST%}/g, data.artists);
  output = output.replace(/{%GENRE%}/g, data.genres);
  output = output.replace(/{%ALBUM%}/g, data.album);
  output = output.replace(/{%RECORD-LABEL%}/g, data.recordLabel);
  output = output.replace(/{%YEAR%}/g, data.releaseYear);

  return output;
};

// -------------------------------------------------------
// MUSIC HOME PAGE
// -------------------------------------------------------
ROUTER.get('/', async (req, res) => {
  try {
    let queryObj = {...req.query};

    let sqlRequest = new sql.Request();

    let homeOutput = await readTemplate(`${root}/views/client/music/index.html`, 'utf-8');
    let cardOutput = await readTemplate(`${root}/views/client/music/templates/card-song.html`, 'utf-8');
    let artistsOutput = '<option>{%ARTIST%}</option>';
    let genresOutput = '<option>{%GENRE%}</option>';
    let albumsOutput = '<option>{%ALBUM%}</option>';
    let yearsOutput = '<option>{%YEAR%}</option>';
    let recordLabelsOutput = '<option>{%RECORD-LABEL%}</option>';

    sqlRequest.execute('[usp_songs_get_all]', async (err, data) => {
      if(err) console.log(`ERROR!!! ${err}`);

      let songData = await createDecodedData(data.recordset[0], generateSong);

      let finalData = filteredData(songData, queryObj);

      let artists = await filterArrayValues(finalData, 'artists');
      artistsOutput = await artists.map(el => artistsOutput.replace(/{%ARTIST%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%ARTISTS_OPTION%}', artistsOutput);

      let genres = await generateFilterOptions(finalData, 'genres');
      genresOutput = await genres.map(el => genresOutput.replace(/{%GENRE%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%GENRES_OPTION%}', genresOutput);

      let album = await generateFilterOptions(finalData, 'album');
      albumsOutput = await album.map(el => albumsOutput.replace(/{%ALBUM%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%ALBUMS_OPTION%}', albumsOutput);

      let year = await generateFilterOptions(finalData, 'releaseYear');
      yearsOutput = await year.map(el => yearsOutput.replace(/{%YEAR%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%YEARS_OPTION%}', yearsOutput);

      let recordLabel = await generateFilterOptions(finalData, 'recordLabel');
      recordLabelsOutput = await recordLabel.map(el => recordLabelsOutput.replace(/{%RECORD-LABEL%}/g, el)).join('');
      homeOutput = await homeOutput.replace('{%RECORD_LABEL_OPTION%}', recordLabelsOutput);

      cardOutput = await finalData.map(el => replaceTemplate(cardOutput, el)).join('');
      homeOutput = await homeOutput.replace('{%MUSIC_CARD%}', cardOutput);

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
// GET ALL SONGS
// -------------------------------------------------------
ROUTER.get('/all', (request, response) => {
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

module.exports = ROUTER;
