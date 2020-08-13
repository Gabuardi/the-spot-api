const express = require('express');
const sql = require('mssql');
const {createDecodedData} = require('../utils/common.js');
const {encode, decode} = require('../utils/codification.js');
const sqlResponseHandler = require("../utils/handlers.js");

const ROUTER = express.Router();

function generateConsecutive(el) {
  return {
    consecutiveTypeId: el.consecutive_type_id,
    description: decode(el.description),
    consecutiveFk: el.consecutive_fk
  }
}

// -------------------------------------------------------
// CREATE NEW CONSECUTIVE TYPE
// -------------------------------------------------------
ROUTER.post('/types', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('description', encode(data.description));
  sqlRequest.input('consecutive_fk', data.consecutive_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ CONSECUTIVE TYPE -> ${data.description} has been created`));
  };

  sqlRequest.execute('[usp_consecutive_types_insert]', responseHandler);
});

// -------------------------------------------------------
// GET ALL CONSECUTIVE TYPES
// -------------------------------------------------------
ROUTER.get('/types', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateConsecutive);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_consecutive_types_get_all]', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW CONSECUTIVE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('prefix', data.prefix);
  sqlRequest.input('max_value', data.max);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ CONSECUTIVE -> ${data.prefix} has been created with a Max Value of ${data.max}`));
  };

  sqlRequest.execute('[usp_consecutives_insert]', responseHandler);
});

// -------------------------------------------------------
// GET ALL CONSECUTIVES
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => response.json(result.recordset));
  };

  sqlRequest.execute('[usp_consecutives_get_all]', responseHandler);
});

// -------------------------------------------------------
// UPDATE CONSECUTIVE
// -------------------------------------------------------
ROUTER.put('/:consecutiveId', (request, response) => {
  let consecutiveId = request.params.consecutiveId;
  let prefix = request.body.prefix;
  let maxValue = request.body.max_value;

  let sqlRequest = new sql.Request();

  sqlRequest.input('consecutive_id', consecutiveId);
  sqlRequest.input('prefix', prefix);
  sqlRequest.input('max_value', maxValue);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Consecutive updated`));
  };

  sqlRequest.execute('[usp_consecutives_update]', responseHandler);
});

module.exports = ROUTER;
