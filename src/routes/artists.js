import express from 'express';
import sql from 'mssql';
import {createDecodedData} from '../utils/common.js';
import {encode, decode} from '../utils/codification.js';
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function generateArtist(el) {
  return {
    artistId: el.artist_id,
    fullName: decode(el.full_name)
  }
}; 

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
  }

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

export default ROUTER;
