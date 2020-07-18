import express from 'express';
import sql from 'mssql';

const APP = express();
const PORT = 3000;

const DB_CONFIG = {
  user: "server-boss",
  password: "123Queso",
  server: "ulacit-ws-the-spot.database.windows.net",
  database: "TheSpotBusinessDB2",
};

sql.connect(DB_CONFIG, error => {
  if (error) {
    console.error(error);
  } else {
    console.log('✓ - CONNECTION POOL CREATED');
  }
});

APP.listen(PORT, () => console.log(`- || APP RUNNING ||--> http://localhost:${PORT}`));

APP.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.query('SELECT TOP (5) * FROM [SalesLT].[Product] FOR JSON PATH', (err, result) => {
    response.send(result);
  });
});
