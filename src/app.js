import express from 'express';
import Connection from 'tedious/lib/connection.js';
import Request from 'tedious/lib/request.js';

const APP = express();
const PORT = 3000;

const DBCONFIG = {
  authentication: {
    options: {
      userName: "server-boss",
      password: "123Queso"
    },
    type: "default"
  },
  server: "ulacit-ws-the-spot.database.windows.net",
  options: {
    database: "TheSpotBusinessDB2",
    encrypt: true
  }
};

const DBCONNECTION = new Connection(DBCONFIG);

DBCONNECTION.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT TOP (1000) * FROM [dbo].[Management_User]`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  DBCONNECTION.execSql(request);
}

APP.listen(PORT, () => console.log(`- || APP RUNNING ||--> http://localhost:${PORT}`));
