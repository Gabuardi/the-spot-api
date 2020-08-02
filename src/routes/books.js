import express from 'express';
import sql from 'mssql';
import {encode, decode} from '../utils/codification.js';
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();


// -------------------------------------------------------
// GET ALL BOOKS TITLES
// -------------------------------------------------------
// ROUTER.get('/', (request, response) => {
//   let sqlRequest = new sql.Request();

//   let responseHandler = (err, result) => {
//     sqlResponseHandler(err, result, response, (response, result) => {
//       let 
//     })
//   }

//   sqlRequest.execute('[Book.GET.All]', (err, result) => {
//     if (err) {
//       response.json({name: err.name, code: err.code, info: err.originalError.info});
//     } else {
//       response.json(result.recordset);
//     }
//   });
// });

// -------------------------------------------------------
// ADD NEW BOOK
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('title', data.title);
  sqlRequest.input('release_year', data.release_year);
  sqlRequest.input('language_fk', data.language_fk);
  sqlRequest.input('artist_fk', data.artist_fk);
  sqlRequest.input('editorial_fk', data.editorial_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => {
      response.send(`✅ MOVIE -> ${data.title} has been added`);
    });
  };

  sqlRequest.execute('[usp_books_insert]', responseHandler);
});

export default ROUTER;
