import express from 'express';
import sql from 'mssql';
import {encode, decode} from '../utils/codification.js';
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function createDecodedData (encodedData){
  let decodedData = [];
  encodedData.forEach(el => {
    let data = {
      languageId: el.language_id,
      language: decode(el.language)
    };
    decodedData.push(data);
  });
  return decodedData;
};

// -------------------------------------------------------
// GET ALL LANGUAGES
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset);
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
    sqlResponseHandler(err, result, response, () => {
      response.send(`✅ LANGUAGE -> ${data.language} has been added`)
    });
  };

  sqlRequest.execute('[usp_languages_insert]', responseHandler);
});

export default ROUTER;
