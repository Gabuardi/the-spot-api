const express = require('express');
const {root} = require('../../../root');
const {readTemplate} = require('../../utils/common.js');

const ROUTER = express.Router();

// -------------------------------------------------------
// HOME PAGE
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  let homeOutput = await readTemplate(`${root}/views/management/home/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});

// -------------------------------------------------------
// MANAGEMENT INDEX
// -------------------------------------------------------
const managementMoviesRouter = require('./movies');
const managementMusicRouter = require('./music');
const managementBooksRouter = require('./books');
const managementStaffRouter = require('./staff');

ROUTER.use('/staff', managementStaffRouter);
ROUTER.use('/movies', managementMoviesRouter);
ROUTER.use('/music', managementMusicRouter);
ROUTER.use('/books', managementBooksRouter);

module.exports = ROUTER;
