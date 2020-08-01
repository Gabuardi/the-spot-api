import express from 'express';
import sql from 'mssql';
import {encode, decode} from '../utils/codification.js';
import {dateStringParser} from "../utils/parsers.js";
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function createDecodedData (encodedData) {
  let decodedData = [];
  encodedData.forEach(element => {
    let data = {
      employeeId: element.employee_id,
      username: decode(element.username),
      password: decode(element.password),
      securityQuestion: decode(element.security_question),
      securityAnswer: decode(element.security_answer),
      email: decode(element.email_addr),
      created: dateStringParser(element.date_created)
    };
    decodedData.push(data);
  });
  return decodedData;
}

// GET ALL
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decodedData = createDecodedData(result.recordset);
      response.json(decodedData);
    });
  };

  sqlRequest.execute('[usp_staff_get_all]', responseHandler);
});

// INSERT
ROUTER.post('/', (request, response) => {
  let body = request.body;
  let sqlRequest = new sql.Request();
  sqlRequest.input('username', encode(body.userName));
  sqlRequest.input('password', encode(body.password));
  sqlRequest.input('email_addr', encode(body.email));
  sqlRequest.input('security_question', encode(body.securityQuestion));
  sqlRequest.input('security_answer', encode(body.securityAnswer));
  sqlRequest.input('role_fk', body.roleID);

  sqlRequest.execute('[usp_staff_insert]', (err) => {
    if (err) {
      console.log(err);
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send('✅ New management user created');
    }
  });
});


// GET SPECIFIC
ROUTER.get('/:userName', (request, response) => {
  let userId = request.params.userName;
  let sqlRequest = new sql.Request();
  sqlRequest.input('username', userId);

  sqlRequest.execute('[usp_staff_get_specific]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.json(result.recordset);
    }
  });
});


// AUTHENTICATE
ROUTER.post('/authenticate', (request, response) => {
  let body = request.body;
  let userName = body.userName;
  let password = body.password;

  let sqlRequest = new sql.Request();
  sqlRequest.input('username', body.userName);
  sqlRequest.execute('[usp_staff_validate]', (err, result) => {
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


// UPDATE PASSWORD
ROUTER.put('/password/:userId', (request, response) => {
  let userId = request.params.userId;
  let newPassword = request.body.newPassword;
  let sqlRequest = new sql.Request();
  sqlRequest.input('id', userId);
  sqlRequest.input('new_password', newPassword);

  sqlRequest.execute('[usp_staff_update_password]', (err) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send('✅ Password updated');
    }
  });
});

// UPDATE ROLE
ROUTER.put('/role/:userName', (request, response) => {
  let userName = request.params.userName;
  let newRoleId = request.body.newRoleId;
  let sqlRequest = new sql.Request();
  sqlRequest.input('userName', userName);
  sqlRequest.input('role_fk', newRoleId);

  sqlRequest.execute('[usp_staff_update_role]', (err) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ ${userName} role updated`);
    }
  });
});

export default ROUTER;
