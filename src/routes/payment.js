const ROUTER = require('express').Router();
const {root} = require('../../root');
const {readTemplate} = require('../utils/common');
const sql = require('mssql');
const {decode} = require('../utils/codification');

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
  let page = await readTemplate(`${root}/views/client/payment/index.html`, 'utf-8');
  let data = request.query;

  let sqlRequest = new sql.Request();
  sqlRequest.input('id', data.product);
  sqlRequest.execute(`[usp_${data.type}_get_title]`, (err, result) => {
    console.log(result);
    data.title = decode( result.recordset[0].title);
    data = proccessType(request.query);
    page = replaceMovieValues(page, data);
    res.status(200).type('text/html').send(page);
  });
});

module.exports = ROUTER;
