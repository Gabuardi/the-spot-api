import express from 'express';
import sql from 'mssql';
import base64 from 'base-64';
import randomString from 'randomstring';
import fileUpload from 'express-fileupload';

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
import homeRouter from './routes/home.js';
import managementRouter from './routes/management/management.js';
import rolesRouter from './routes/roles.js'
import staffRouter from './routes/staff.js';
import consecutivesRouter from './routes/consecutives.js';
import languagesRouter from './routes/languages.js';
import artistsRouter from './routes/artists.js';
import visualGenresRouter from './routes/visualGenres.js';
import musicalGenresRouter from './routes/musicalGenres.js';
import editorialsRouter from './routes/editorials.js';
import recordLabelsRouter from './routes/recordLabels.js';
import moviesRouter from './routes/movies.js';
import booksRouter from './routes/books.js';
import songsRouter from './routes/songs.js';
import logsRouter from './routes/logs.js';
import customersRouter from './routes/customers.js';

APP.use('/', homeRouter);
APP.use('/management', managementRouter);
APP.use('/roles', rolesRouter);
APP.use('/staff', staffRouter);
APP.use('/consecutives', consecutivesRouter);
APP.use('/languages', languagesRouter);
APP.use('/artists', artistsRouter);
APP.use('/visualGenres', visualGenresRouter);
APP.use('/musicalGenres', musicalGenresRouter);
APP.use('/editorials', editorialsRouter);
APP.use('/recordLabels', recordLabelsRouter);
APP.use('/movies', moviesRouter);
APP.use('/books', booksRouter);
APP.use('/songs', songsRouter);
APP.use('/logs', logsRouter);
APP.use('/customers', customersRouter);

APP.use('/avatar', express.static('resources/avatars'));
APP.use('/movies/artworks/', express.static('resources/movies/artworks/'));

APP.use(express.static('resources'));
APP.use(express.static('views'));

APP.post('/encrypt', (request, response) => {
  let data = request.body;
  let randomGeneratedString = randomString.generate(data.length, data.readeable);
  let encodedString = base64.encode(randomGeneratedString);
  response.json({originalValue: randomGeneratedString, encodedValue: encodedString, encodedLength: encodedString.length});
});
