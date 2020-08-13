const express = require('express');
const sql = require('mssql');
const {createDecodedData} = require('../utils/common.js');
const {encode, decode} = require('../utils/codification');
const sqlResponseHandler = require("../utils/handlers.js");

const ROUTER = express.Router();

function generateLabel(el) {
  return {
    recordLabelId: el.record_label_id,
    name: decode(el.name)
  }
}

// -------------------------------------------------------
// GET ALL RECORD LABELS
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generateLabel);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_record_labels_get_all]', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW RECORD LABEL
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;
  let sqlRequest = new sql.Request();
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ RECORD LABEL -> ${data.name} has been added`));
  };

  sqlRequest.input('name', encode(data.name));
  sqlRequest.execute('[usp_record_labels_insert]', responseHandler);
});

module.exports = ROUTER;
