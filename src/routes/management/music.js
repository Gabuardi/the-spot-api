const express = require('express');
const sql = require('mssql');
const {root} = require('../../../root');
const {decode} = require('../../utils/codification');
const {readTemplate, createDecodedData} = require('../../utils/common');

const ROUTER = express.Router();

function generateSongTitles(el) {
  return {
    songId: el.song_id,
    title: decode(el.title)
  }
}

function replaceTemplate(template, data) {
  let output = template.replace(/{%SONGID%}/g, data.songId);
  output = output.replace(/{%TITLE%}/g, data.title);

  return output
}

// -------------------------------------------------------
// ADD NEW SONG
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

        let homeOutput = await readTemplate(`${root}/views/management/catalogues/music/list/index.html`, 'utf-8');
        let songOutput = await readTemplate(`${root}/views/management/catalogues/music/list/template/song-info.html`, 'utf-8');

        sqlRequest.execute('[usp_songs_get_titles]', async (err, data) => {
        if(err) console.log(`ERROR!!! ${err}`);

        let songData = await createDecodedData(data.recordset, generateSongTitles);

        songOutput = await songData.map(el => replaceTemplate(songOutput, el)).join('');
        homeOutput = await homeOutput.replace('{%MUSIC%}', songOutput);

        res.status(200).type('text/html').send(homeOutput);
        });
    }catch(err) {
        res.status(400).json({status: 'failed', message: `ERROR!!! ${err}`});
    }
});

module.exports = ROUTER;
