import express from 'express';
import sql from 'mssql';
import bodyParser from 'body-parser';

const APP = express();
const PORT = 3000;

const DB_CONFIG = {
  user: "server-boss",
  password: "123Queso",
  server: "ulacit-ws-the-spot.database.windows.net",
  database: "TheSpotMVP",
  parseJSON: true,
};

APP.use(bodyParser.json());

sql.connect(DB_CONFIG, error => {
  if (error) {
    console.error(error);
  } else {
    console.log('✓ - CONNECTION POOL CREATED');
  }
});

APP.listen(PORT, () => console.log(`- || APP RUNNING ||--> http://localhost:${PORT}`));

APP.get('/managementUser', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('GET_Management_Users', (err, result) => {
    if (err) {
      console.error(err);
    } else {
      response.send(result.recordset);
    }
  });
});

APP.post('/managementUser/new', (request, response) => {
  let body = request.body;
  let sqlRequest = new sql.Request();
  sqlRequest.input('userName', body.userName);
  sqlRequest.input('password', body.password);
  sqlRequest.input('email', body.email);
  sqlRequest.input('secQues', body.securityQuestion);
  sqlRequest.input('secAns', body.securityAnswer);
  sqlRequest.input('roleID', body.roleID);

  sqlRequest.query(`INSERT INTO [Management_User] (userName, Password, Email, SecurityQuestion, SecurityAnswer, RoleID)` +
    `VALUES (@userName, @password, @email, @secQues, @secAns, @roleID)`, (err, result) => {
    response.send(result);
  });
});

APP.post('/new/role', (request, response) => {
  let body = request.body;
  let sqlRequest = new sql.Request();
  sqlRequest.input('roleName', body.roleName);
  sqlRequest.query(`INSERT INTO [Roles] (Name)` +
    `VALUES (@roleName)`, (err, result) => {
    response.send(`Role ${body.roleName} created successfully`);
  });
});

