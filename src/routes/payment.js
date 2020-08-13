import express from 'express';
import path from 'path';
import {readTemplate} from "../utils/common.js";
import sql from 'mssql';
import {decode} from "../utils/codification.js";

const __dirname = path.resolve();
const ROUTER = express.Router();

function proccessType(data) {
  switch (data.type) {
    case "movie":
      data.type = "Movie";
      data.resources = "movies";
      break;
    case "music":
      data.type = "Music";
      data.resources = "music";
      break;
    case "book":
      data.type = "Book";
      data.resources = "books";
  }
  return data;
}

async function getProductTitle(data) {
  let sqlRequest = new sql.Request();
  sqlRequest.input('id', data.product);

  let responseHandler = (err, result) => {
    return result.recordset[0].title;
  };

  sqlRequest.execute(`[usp_${data.type}_get_title]`, responseHandler);
}

function replaceMovieValues(html, data) {
  let output = html;
  output = output.replace(/{%TYPE%}/g, data.type);
  output = output.replace(/{%RESOURCES%}/g, data.resources);
  output = output.replace(/{%PRODUCT%}/g, data.product);
  output = output.replace(/{%TITLE%}/g, data.title);
  return output;
}

// -------------------------------------------------------
// PAGE
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  let page = await readTemplate(`${__dirname}/views/client/payment/index.html`, 'utf-8');
  let data = request.query;

  let sqlRequest = new sql.Request();
  sqlRequest.input('id', data.product);
  sqlRequest.execute(`[usp_${data.type}_get_title]`, (err, result) => {
    data.title = decode( result.recordset[0].title);
    data = proccessType(request.query);
    page = replaceMovieValues(page, data);
    res.status(200).type('text/html').send(page);
  });


  // let file = `${__dirname}/resources/movies/media/${movieId}.mp4`;
  // res.download(file);
});

export default ROUTER;
