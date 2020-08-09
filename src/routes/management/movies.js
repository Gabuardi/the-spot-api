import express from 'express';
import path from 'path';
import {readTemplate} from "../../utils/common.js";

const __dirname = path.resolve();
const ROUTER = express.Router();

// -------------------------------------------------------
// CREATE NEW PAGE
// -------------------------------------------------------
ROUTER.get('/new', async (request, res) => {
  let homeOutput = await readTemplate(`${__dirname}/views/management/catalogues/movies/createMovie/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});

export default ROUTER;
