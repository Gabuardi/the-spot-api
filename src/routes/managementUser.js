import express from 'express';
import sql from 'mssql';

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('[Management_User.GET.All]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.json(result.recordset[0]);
    }
  });
});

ROUTER.post('/', (request, response) => {
  let body = request.body;
  let sqlRequest = new sql.Request();
  sqlRequest.input('user_name', body.userName);
  sqlRequest.input('password', body.password);
  sqlRequest.input('email', body.email);
  sqlRequest.input('security_question', body.securityQuestion);
  sqlRequest.input('security_answer', body.securityAnswer);
  sqlRequest.input('role', body.roleID);

  sqlRequest.execute('[Management_User.INSERT]', (err) => {
    if (err) {
      console.log(err);
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send('✅ New management user created');
    }
  });
});

ROUTER.get('/:userName', (request, response) => {
  let userId = request.params.userName;
  let sqlRequest = new sql.Request();
  sqlRequest.input('user_name', userId);

  sqlRequest.execute('[Management_User.GET]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.json(result.recordset);
    }
  });
});

ROUTER.post('/authenticate', (request, response) => {
  let body = request.body;
  let userName = body.userName;
  let password = body.password;

  let sqlRequest = new sql.Request();
  sqlRequest.input('user_name', body.userName);
  sqlRequest.execute('[Management_User.GET]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
        if (result.recordset.length === 0) {
          response.status(404).send(`❌ Management user ${userName} not found`);
        } else if (result.recordset[0].Password !== password) {
          response.status(401).send(`❌ Wrong password for ${userName}`);
        } else {
          response.json(result.recordset[0]);
        }
      }
  });
});

ROUTER.put('/password/:userId', (request, response) => {
  let userId = request.params.userId;
  let newPassword = request.body.newPassword;
  let sqlRequest = new sql.Request();
  sqlRequest.input('ID', userId);
  sqlRequest.input('new_password', newPassword);

  sqlRequest.execute('[Management_User.UPDATE.Password]', (err) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send('✅ Password updated');
    }
  });
});

ROUTER.put('/role/:userName', (request, response) => {
  let userName = request.params.userName;
  let newRoleId = request.body.newRoleId;
  let sqlRequest = new sql.Request();
  sqlRequest.input('userName', userName);
  sqlRequest.input('Role_ID', newRoleId);

  sqlRequest.execute('[Management_User.UPDATE.Role]', (err) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ ${userName} role updated`);
    }
  });
});

export default ROUTER;
