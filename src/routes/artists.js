import express from 'express';
import sql from 'mssql';

const ROUTER = express.Router();

// -------------------------------------------------------
// CREATE NEW ARTIST
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let requestData = request.body;
  let sqlRequest = new sql.Request();
  sqlRequest.input('full_name', requestData.fullName);
  sqlRequest.execute('[Author_Actor_Artist.INSERT]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ New celebrity created`);
    }
  });
});

// -------------------------------------------------------
// GET ALL ARTISTS
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('[Author_Actor_Artist.GET.All]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.json(result.recordset);
    }
  });
});

export default ROUTER;
