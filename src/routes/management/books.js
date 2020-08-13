const express = require('express');
const {root} = require('../../../root');
const sql = require('mssql');
const {decode} = require('../../utils/codification');
const {readTemplate, createDecodedData} = require('../../utils/common');

const ROUTER = express.Router();

function generateBookTitles(el) {
  return {
    bookId: el.book_id,
    title: decode(el.title)
  }
}

function replaceTemplate(template, data) {
  let output = template.replace(/{%BOOKID%}/g, data.bookId);
  output = output.replace(/{%TITLE%}/g, data.title);
  return output
}

// -------------------------------------------------------
// ADD NEW BOOK
// -------------------------------------------------------
// ROUTER.get('/new', async (request, res) => {
//   let homeOutput = await readTemplate(`${__dirname}/views/management/catalogues/movies/createMovie/index.html`, 'utf-8');
//   res.status(200).type('text/html').send(homeOutput);
// });

// -------------------------------------------------------
// LIST PAGE
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
    try {
        let sqlRequest = new sql.Request();

        let homeOutput = await readTemplate(`${root}/views/management/catalogues/books/list/index.html`, 'utf-8');
        let bookOutput = await readTemplate(`${root}/views/management/catalogues/books/list/template/books-info.html`, 'utf-8');

        sqlRequest.execute('[usp_books_get_titles]', async (err, data) => {
        if(err) console.log(`ERROR!!! ${err}`);

        let bookData = await createDecodedData(data.recordset, generateBookTitles);

        bookOutput = await bookData.map(el => replaceTemplate(bookOutput, el)).join('');
        homeOutput = await homeOutput.replace('{%BOOK%}', bookOutput);

        res.status(200).type('text/html').send(homeOutput);
        });
    }catch(err) {
        res.status(400).json({status: 'failed', message: `ERROR!!! ${err}`});
    }
});

module.exports = ROUTER;
