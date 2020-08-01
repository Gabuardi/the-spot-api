import express from 'express';
import sql from 'mssql';
import {encode, decode} from '../utils/codification.js';
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function createDecodedData (encodedData){
  let decodedData = [];
  encodedData.forEach(el => {
    let data = {
      visualGenreId: el.visual_genre_id,
      title: decode(el.title)
    };
    decodedData.push(data);
  });
  return decodedData;
};

// -------------------------------------------------------
// GET ALL ROLES
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_visual_genres_get_all]', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW ROLE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let requestData = request.body;
  let sqlRequest = new sql.Request();
  sqlRequest.input('title', encode(requestData.title));
  
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => {
      response.send(`✅ VISUAL GENRE -> ${data.title} has been added`)
    });
  };

  sqlRequest.execute('[usp_visual_genres_insert]', responseHandler);
});

export default ROUTER;