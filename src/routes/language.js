import express from 'express';
import sql from 'mssql';

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('[Language.GET.All]', (err, result) => {
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
  sqlRequest.input('Language', requestData.language);

  sqlRequest.execute('[Language.INSERT]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ New language created`);
    }
  });
});

export default ROUTER;