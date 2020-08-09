import express from 'express';
import path from 'path';
import {readTemplate} from "../../utils/common.js";

const __dirname = path.resolve();
const ROUTER = express.Router();

// -------------------------------------------------------
// HOME PAGE
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  let homeOutput = await readTemplate(`${__dirname}/views/management/home/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});

// -------------------------------------------------------
// MANAGEMENT INDEX
// -------------------------------------------------------
import managementMoviesRouter from './movies.js';

ROUTER.use('/movies', managementMoviesRouter);

export default ROUTER;
