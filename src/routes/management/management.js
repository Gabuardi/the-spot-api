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
const managementStaffRouter = require('./staff');

ROUTER.use('/movies', managementMoviesRouter);
ROUTER.use('/staff', managementStaffRouter);

module.exports = ROUTER;
