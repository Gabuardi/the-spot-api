import express from 'express';
import path from 'path';
import {readTemplate} from "../../utils/common.js";

const __dirname = path.resolve();
const ROUTER = express.Router();

// -------------------------------------------------------
// STAFF LIST
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  let homeOutput = await readTemplate(`${__dirname}/views/management/staff/users-list/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});

// -------------------------------------------------------
// CREATE NEW
// -------------------------------------------------------
ROUTER.get('/new', async (request, res) => {
  let homeOutput = await readTemplate(`${__dirname}/views/management/staff/create-user/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});


export default ROUTER;
