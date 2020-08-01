import express from 'express';
import sql from 'mssql';

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('[Consecutive.GET.All]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.json(result.recordset);
    }
  });});

ROUTER.get('/types', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('[Type_Consecutive.GET.All]', (err, result) => {
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
  sqlRequest.input('Prefix', requestData.prefix);
  sqlRequest.input('MaxValue', requestData.max);

  sqlRequest.execute('[Consecutive.INSERT]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ New consecutive created`);
    }
  });
});

export default ROUTER;
