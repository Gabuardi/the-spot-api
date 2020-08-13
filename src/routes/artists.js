const express = require('express');
const sql = require('mssql');
const createDecodedData = require('../utils/common');
const {encode, decode} = require('../utils/codification');
const sqlResponseHandler = require('../utils/handlers');

const ROUTER = express.Router();

function generateArtist(el) {
  return {
    artistId: el.artist_id,
    fullName: decode(el.full_name)
  }
}

// -------------------------------------------------------
// GET ALL ARTISTS
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateArtist);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_artists_get_all]', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW ARTIST
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('full_name', encode(data.fullName));

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Artist -> ${data.fullName} has been added`));
  };

  sqlRequest.execute('[usp_artists_insert]', responseHandler);
});

// -------------------------------------------------------
// UPDATE ARTIST
// -------------------------------------------------------
ROUTER.put('/update/:artistId', (request, response) => {
  let artistId = request.params.artistId;
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('id', artistId);
  sqlRequest.input('full_name', encode(data.full_name));

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Artist ${data.full_name} has been updated`));
  };

  sqlRequest.execute('[usp_artists_update]', responseHandler);
});

exports.module = ROUTER;
