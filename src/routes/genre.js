import express from 'express';
import sql from 'mssql';

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('[Base_Genre.GET.All]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.json(result.recordset);
    }
  });
});

ROUTER.post('/', (request, response) => {
  let requestData = request.body;
  let sqlRequest = new sql.Request();
  sqlRequest.input('genre_title', requestData.title);
  sqlRequest.execute('[Base_Genre.INSERT]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ New genre created`);
    }
  });
});

export default ROUTER;
