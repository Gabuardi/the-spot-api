const express = require('express');
const sql = require('mssql');
const {createDecodedData} = require('../utils/common.js');
const {encode, decode} = require('../utils/codification');
const sqlResponseHandler = require("../utils/handlers.js");

const ROUTER = express.Router();

function generateLanguage(el) {
  return {
    languageId: el.language_id,
    language: decode(el.language)
  }
}

// -------------------------------------------------------
// GET ALL LANGUAGES
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateLanguage);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_languages_get_all]', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW LANGUAGE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('language', encode(data.language));

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ LANGUAGE -> ${data.language} has been added`));
  };

  sqlRequest.execute('[usp_languages_insert]', responseHandler);
});

module.exports = ROUTER;
