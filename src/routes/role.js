import express from 'express';
import sql from 'mssql';

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('[Roles.GET]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(result.recordset);
    }
  });
});

export default ROUTER;
