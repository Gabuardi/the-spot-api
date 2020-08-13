const express = require('express');
const sql = require('mssql');
const {createDecodedData} = require('../utils/common.js');
const {encode, decode} = require('../utils/codification');
const sqlResponseHandler = require("../utils/handlers.js");

const ROUTER = express.Router();

function generateGenre(el) {
  return {
    musicalGenreId: el.musical_genre_id,
    title: decode(el.title)
  }
}

// -------------------------------------------------------
// GET ALL MUSICAL GENRES
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateGenre);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_musical_genres_get_all]', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW MUSICAL GENRE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;
  let sqlRequest = new sql.Request();
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ MUSICAL GENRE -> ${data.title} has been added`));
  };

  sqlRequest.input('title', encode(data.title));
  sqlRequest.execute('[usp_musical_genres_insert]', responseHandler);
});

module.exports = ROUTER;
