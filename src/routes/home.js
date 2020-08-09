import express from 'express';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const ROUTER = express.Router();

const readTemplate = (file, type) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, type, (err, data) => {
            if(err) reject('File Not Found!')
            resolve(data);
        });
    });
};

// -------------------------------------------------------
// GET ALL MOVIES
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
    let homeOutput = await readTemplate(`${__dirname}/client/home/index.html`, 'utf-8');

    res
        .status(200)
        .type('text/html')
        .send(homeOutput);
});

export default ROUTER;