const express = require('express');
const sql = require('mssql');
const fileUpload = require('express-fileupload');

const APP = express();
const PORT = process.env.PORT || 3000;

const DB_CONFIG = {
  user: "server-boss",
  password: "123Queso",
  server: "ulacit-ma-the-spot.database.windows.net",
  database: "TheSpotMVP",
  parseJSON: true
};

APP.use(express.json());
APP.use(fileUpload({createParentPath: true}));

sql.connect(DB_CONFIG, error => {
  if (error) {
    console.error(error);
  } else {
    console.log('✅ - CONNECTION POOL CREATED');
  }
});

APP.listen(PORT, () => console.log(`- || APP RUNNING ||--> http://localhost:${PORT}`));


// -----------------------------------------------------------------
const homeRouter = require('./routes/home');
const managementRouter = require ('./routes/management/management');
const rolesRouter = require('./routes/roles');
const consecutivesRouter = require('./routes/consecutives');
const languagesRouter = require('./routes/languages');
const artistsRouter = require('./routes/artists');
const visualGenresRouter = require('./routes/visualGenres');
const musicalGenresRouter = require('./routes/musicalGenres');
const editorialsRouter = require('./routes/editorials');
const recordLabelsRouter = require('./routes/recordLabels');
const moviesRouter = require('./routes/movies');
const booksRouter = require('./routes/books');
const songsRouter = require('./routes/songs');
const customersRouter = require('./routes/customers');
const paymentRouter = require('./routes/payment');

APP.use('/', homeRouter);
APP.use('/management', managementRouter);
APP.use('/roles', rolesRouter);
APP.use('/consecutives', consecutivesRouter);
APP.use('/languages', languagesRouter);
APP.use('/artists', artistsRouter);
APP.use('/visualGenres', visualGenresRouter);
APP.use('/musicalGenres', musicalGenresRouter);
APP.use('/editorials', editorialsRouter);
APP.use('/recordLabels', recordLabelsRouter);
APP.use('/movies', moviesRouter);
APP.use('/books', booksRouter);
APP.use('/music', songsRouter);
APP.use('/customers', customersRouter);
APP.use('/payment', paymentRouter);

APP.use('/avatar', express.static('resources/avatars'));
APP.use('/movies/artworks/', express.static('resources/movies/artworks/'));

APP.use(express.static('resources'));
APP.use(express.static('views'));
