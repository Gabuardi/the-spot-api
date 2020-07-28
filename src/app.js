import express from 'express';
import sql from 'mssql';
import base64 from 'base-64';
import randomString from 'randomstring';

const APP = express();
const PORT = process.env.PORT || 3000;

const DB_CONFIG = {
  user: "server-boss",
  password: "123Queso",
  server: "ulacit-ws-the-spot.database.windows.net",
  database: "TheSpotMVP",
  parseJSON: true,
};

APP.use(express.json());

sql.connect(DB_CONFIG, error => {
  if (error) {
    console.error(error);
  } else {
    console.log('✅ - CONNECTION POOL CREATED');
  }
});

APP.listen(PORT, () => console.log(`- || APP RUNNING ||--> http://localhost:${PORT}`));


// -----------------------------------------------------------------
import roleRouter from './routes/role.js'
import managementUserRouter from './routes/managementUser.js';
import consecutiveRouter from './routes/consecutive.js';
import languageRouter from './routes/language.js';
import celebrityRouter from './routes/celebrity.js';
import visualGenreRouter from './routes/visualGenre.js';
import publisherRouter from './routes/publisher.js';
import movieRouter from './routes/movie.js';
import bookRouter from './routes/book.js';
import logRouter from './routes/log.js';

APP.use('/role', roleRouter);
APP.use('/managementUser', managementUserRouter);
APP.use('/consecutive', consecutiveRouter);
APP.use('/language', languageRouter);
APP.use('/celebrity', celebrityRouter);
APP.use('/visualGenre', visualGenreRouter);
APP.use('/publisher', publisherRouter);
APP.use('/movie', movieRouter);
APP.use('/book', bookRouter);
APP.use('/log', logRouter);

APP.post('/encrypt', (request, response) => {
  let data = request.body;
  let randomGeneratedString = randomString.generate(data.length, data.readeable);
  let encodedString = base64.encode(randomGeneratedString);
  response.json({originalValue: randomGeneratedString, encodedValue: encodedString, encodedLength: encodedString.length});
});

