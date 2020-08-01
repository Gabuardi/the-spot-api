import express from 'express';
import sql from 'mssql';
import {encode, decode} from '../utils/codification.js';
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function createDecodedData (encodedData){
  let decodedData = [];
  encodedData.forEach(el => {
    let data = {
      roleId: el.role_id,
      name: decode(el.name)
    };
    decodedData.push(data);
  });
  return decodedData;
};

// -------------------------------------------------------
// CREATE NEW ROLE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;
  let sqlRequest = new sql.Request();

  sqlRequest.input('name', encode(data.name));

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => {
      response.send(`✅ ROLE -> ${data.name} has been created`)
    });
  };

  sqlRequest.execute('usp_roles_insert', responseHandler);
});

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

  sqlRequest.execute('usp_roles_get', responseHandler);
});

export default ROUTER;
