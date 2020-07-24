import express from 'express';
import sql from 'mssql';

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('[Book.GET.All]', (err, result) => {
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
  sqlRequest.input('Title', requestData.title);
  sqlRequest.input('Year', requestData.year);
  sqlRequest.input('LanguageID', requestData.languageId);
  sqlRequest.input('AAAID', requestData.celebrityId);
  sqlRequest.input('GenreID', requestData.genreId);
  sqlRequest.input('EditorialID', requestData.publisherId);

  sqlRequest.execute('[Book.INSERT]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ MOVIE -> ${requestData.title} has been created`);
    }
  });
});

export default ROUTER;
