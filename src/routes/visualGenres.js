import express from 'express';
import sql from 'mssql';
import {createDecodedData} from '../utils/common.js';
import {encode, decode} from '../utils/codification.js';
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function generateGenre(el) {
  return {
    visualGenreId: el.visual_genre_id,
    title: decode(el.title)
  }
};

// -------------------------------------------------------
// GET ALL VISUAL GENRES
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateGenre);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_visual_genres_get_all]', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW VISUAL GENRE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('title', encode(data.title));
  
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ VISUAL GENRE -> ${data.title} has been added`));
  };

  sqlRequest.execute('[usp_visual_genres_insert]', responseHandler);
});

export default ROUTER;
