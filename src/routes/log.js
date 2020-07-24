import express from 'express';
import sql from 'mssql';

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.query('SELECT * FROM Log', (err, result) => {
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
  sqlRequest.input('User_name', requestData.userName);
  sqlRequest.input('Reg_ID', requestData.regId);
  sqlRequest.input('Action_ID', requestData.actionId);
  sqlRequest.input('Title', requestData.title);
  sqlRequest.input('Year', requestData.year);
  sqlRequest.input('LanguageID', requestData.languageId);
  sqlRequest.input('AAAID', requestData.aaaId);
  sqlRequest.input('GenreID', requestData.genreId);

  sqlRequest.execute('[log.INSERT.Movie]', (err) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send('✅ log created');
    }
  });
});

export default ROUTER;
