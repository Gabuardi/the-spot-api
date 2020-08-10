import express from 'express';
import path from 'path';
import {readTemplate} from "../utils/common.js";

const __dirname = path.resolve();
const ROUTER = express.Router();

// -------------------------------------------------------
// PAGE
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  // let homeOutput = await readTemplate(`${__dirname}/views/client/payment/index.html`, 'utf-8');
  // res.status(200).type('text/html').send(homeOutput);
  let movieId = request.query.product;
  console.log(movieId);
  let file = `${__dirname}/resources/movies/media/${movieId}.mp4`;
  res.download(file);
});

export default ROUTER;
