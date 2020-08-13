const express = require('express');
const sql = require('mssql');
const {root} = require('../../../root');
const {decode} = require('../../utils/codification');
const {readTemplate, createDecodedData} = require('../../utils/common');

const ROUTER = express.Router();

function generateMovieTitles(el) {
  return {
    movieId: el.movie_id,
    title: decode(el.title)
  }
}

function replaceTemplate(template, data) {
  let output = template.replace(/{%MOVIEID%}/g, data.movieId);
  output = output.replace(/{%TITLE%}/g, data.title);

  return output
}

// -------------------------------------------------------
// ADD NEW MOVIE
// -------------------------------------------------------
ROUTER.get('/new', async (request, res) => {
  let homeOutput = await readTemplate(`${root}/views/management/catalogues/movies/createMovie/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});

// -------------------------------------------------------
// LIST PAGE
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  try {
    let sqlRequest = new sql.Request();

    let homeOutput = await readTemplate(`${root}/views/management/catalogues/movies/list/index.html`, 'utf-8');
    let movieOutput = await readTemplate(`${root}/views/management/catalogues/movies/list/template/movie-info.html`, 'utf-8');

    sqlRequest.execute('[usp_movies_get_titles]', async (err, data) => {
      if(err) console.log(`ERROR!!! ${err}`);

      let movieData = await createDecodedData(data.recordset, generateMovieTitles);

      movieOutput = await movieData.map(el => replaceTemplate(movieOutput, el)).join('');
      homeOutput = await homeOutput.replace('{%MOVIE%}', movieOutput);

      res.status(200).type('text/html').send(homeOutput);
    });
  }catch(err) {
    res.status(400).json({status: 'failed', message: `ERROR!!! ${err}`});
  }
});

module.exports = ROUTER;
