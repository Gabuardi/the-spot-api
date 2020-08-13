const express = require('express');
const {root} = require('../../root');
const {readTemplate} = require('../utils/common');

const ROUTER = express.Router();

// -------------------------------------------------------
// HOME PAGE
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  let homeOutput = await readTemplate(`${root}/views/client/home/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});

module.exports = ROUTER;
