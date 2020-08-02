import express from 'express';
import sql from 'mssql';
import {createDecodedData} from '../utils/common.js';
import {encode, decode} from '../utils/codification.js';
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function generateEditorial(el) {
  return {
    editorialId: el.editorial_id,
    name: decode(el.name)
  }
};

// -------------------------------------------------------
// GET ALL EDITORIALS
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateEditorial);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_editorials_get_all]', responseHandler)
});

// -------------------------------------------------------
// CREATE NEW EDITORIAL
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('name', encode(data.name));

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ EDITORIAL -> ${data.name} has been added`))
  }

  sqlRequest.execute('[usp_editorials_insert]', responseHandler)
});

export default ROUTER;
