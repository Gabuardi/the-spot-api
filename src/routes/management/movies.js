const express = require('express');
const {root} = require('../../../root');
const {readTemplate} = require('../../utils/common.js');

const ROUTER = express.Router();

// -------------------------------------------------------
// CREATE NEW PAGE
// -------------------------------------------------------
ROUTER.get('/new', async (request, res) => {
  let homeOutput = await readTemplate(`${root}/views/management/catalogues/movies/createMovie/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});

module.exports = ROUTER;
