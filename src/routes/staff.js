import express from 'express';
import sql from 'mssql';
import {createDecodedData} from '../utils/common.js';
import {encode, decode} from '../utils/codification.js';
import {dateStringParser} from "../utils/parsers.js";
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function generatePublicStaff(el) {
  return {
    username: decode(el.username),
    email: decode(el.email_addr),
    securityQuestion: decode(el.security_question),
    securityAnswer: decode(el.security_answer),
    roleFk: el.role_fk,
    created: dateStringParser(el.date_created),
    profilePic: el.profile_pic
  }
};

function generatePrivateStaff(el) {
  return {
    employeeId: el.employee_id,
    username: decode(el.username),
    password: decode(el.password),
    email: decode(el.email_addr),
    securityQuestion: decode(el.security_question),
    securityAnswer: decode(el.security_answer),
    roleFk: el.role_fk,
    created: dateStringParser(el.date_created),
    profilePic: el.profile_pic
  }
};

// -------------------------------------------------------
// GET ALL STAFF
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decoded = createDecodedData(result.recordset, generatePublicStaff);
      response.json(decoded);
    });
  };

  sqlRequest.execute('[usp_staff_get_all]', responseHandler);
});

// -------------------------------------------------------
// GET SPECIFIC EMPLOYEE
// -------------------------------------------------------
ROUTER.get('/:username', (request, response) => {
  let username = request.params.username;

  let sqlRequest = new sql.Request();

  sqlRequest.input('username', encode(username));

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (err, result) => {
      let decoded = createDecodedData(result.recordset, generatePrivateStaff)
      response.json(decoded);
    })
  }

  sqlRequest.execute('[usp_staff_get_specific]', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW EMPLOYEE
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();

  sqlRequest.input('username', encode(data.username));
  sqlRequest.input('password', encode(data.password));
  sqlRequest.input('email_addr', encode(data.email_addr));
  sqlRequest.input('security_question', encode(data.security_question));
  sqlRequest.input('security_answer', encode(data.security_answer));
  sqlRequest.input('role_fk', data.role_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ New management user ${data.username} created`));
  };

  sqlRequest.execute('[usp_staff_insert]', responseHandler);
});

// -------------------------------------------------------
// EMPLOYEE EXISTS
// -------------------------------------------------------
ROUTER.post('/check/:username', (request, response) => {
  let username = request.params.username;

  let sqlRequest = new sql.Request();

  sqlRequest.input('username', encode(username));

  let responseHandler = (err, result) => {
    if(err){
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      if (result.recordset[0].exists === 'true') {
        response.send(`❌ This employee "${username}" already exists`);
      } else if (result.recordset[0].exists === 'false') {
        response.send(`✅ This employee "${username}" does not exist`);
      };
    };
  };

  sqlRequest.execute('[usp_staff_exists]', responseHandler)
});

// -------------------------------------------------------
// AUTHENTICATE
// -------------------------------------------------------
ROUTER.post('/authenticate', (request, response) => {
  let body = request.body;
  let username = body.username;
  let password = body.password;

  let sqlRequest = new sql.Request();

  sqlRequest.input('username', encode(username));
  sqlRequest.input('password', encode(password));

  sqlRequest.execute('[usp_staff_validate]', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
        if (result.recordset.length === 0) {
          response.status(404).send(`❌ Management user ${username} not found`);
        } else if (decode(result.recordset[0].password) !== password) {
          response.status(401).send(`❌ Wrong password for ${username}`);
        } else {
          // let decoded = createDecodedData(result.recordset, 'specific')
          // response.json(decoded);
          response.send(`✅ You've been successfully authenticaded`);
        }
      }
  });
});


// -------------------------------------------------------
// UPDATE EMPLOYEE PASSWORD
// -------------------------------------------------------
ROUTER.put('/password/:employeeId', (request, response) => {
  let userId = request.params.employeeId;
  let newPassword = request.body.new_password;

  let sqlRequest = new sql.Request();

  sqlRequest.input('id', userId);
  sqlRequest.input('new_password', encode(newPassword));

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Password of employee updated`));
  };

  sqlRequest.execute('[usp_staff_update_password]', responseHandler);
});

// -------------------------------------------------------
// UPDATE EMPLOYEE ROLE
// -------------------------------------------------------
ROUTER.put('/role/:username', (request, response) => {
  let username = request.params.username;
  let data = request.body;
  
  let sqlRequest = new sql.Request();

  sqlRequest.input('username', encode(username));
  sqlRequest.input('role_fk', data.role_fk);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ ${username}'s role updated to ${data.role_fk}`));
  };

  sqlRequest.execute('[usp_staff_update_role]', responseHandler);
});

export default ROUTER;
