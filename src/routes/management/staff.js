const express = require('express');
const {root} = require('../../../root');
const sql = require('mssql');
const {encode, decode} = require('../../utils/codification');
const dateStringParser = require("../../utils/parsers");
const sqlResponseHandler = require("../../utils/handlers.js");
const {readTemplate, createDecodedData} = require('../../utils/common');

const ROUTER = express.Router();

function generatePublicStaff(el) {
  return {
    username: decode(el.username),
    email: decode(el.email_addr),
    securityQuestion: decode(el.security_question),
    securityAnswer: decode(el.security_answer),
    role: decode(el.role),
    created: dateStringParser(el.date_created),
    avatar: el.avatar
  }
}

function replaceTemplate(template, data) {
  let output = template.replace(/{%USERNAME%}/g, data.username);
  output = output.replace(/{%EMAIL%}/g, data.email);
  output = output.replace(/{%ROLE%}/g, data.role);
  output = output.replace(/{%DATE%}/g, data.created);
  output = output.replace(/{%AVATAR%}/g, data.avatar);
  return output
}

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
    avatar: el.avatar
  }
}

// -------------------------------------------------------
// STAFF LIST
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  try {
    let sqlRequest = new sql.Request();

    let homeOutput = await readTemplate(`${root}/views/management/staff/users-list/index.html`, 'utf-8');
    let employeeOutput = await readTemplate(`${root}/views/management/staff/users-list/template/staff-info.html`, 'utf-8');

    sqlRequest.execute('[usp_staff_get_all]', async (err, data) => {
      if(err) console.log(`ERROR!!! ${err}`);

      let employeeData = await createDecodedData(data.recordset, generatePublicStaff);

      employeeOutput = await employeeData.map(el => replaceTemplate(employeeOutput, el)).join('');
      homeOutput = await homeOutput.replace('{%EMPLOYEE%}', employeeOutput);

      res.status(200).type('text/html').send(homeOutput);
    });
  } catch(err) {
    res.status(400).json({status: 'failed', message: `ERROR!!! ${err}`});
  }
});

// -------------------------------------------------------
// CREATE NEW
// -------------------------------------------------------
ROUTER.get('/new', async (request, res) => {
  let homeOutput = await readTemplate(`${root}/views/management/staff/create-user/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});

// -------------------------------------------------------
// GET ALL STAFF
// -------------------------------------------------------
ROUTER.get('/all', (request, response) => {
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
      let decoded = createDecodedData(result.recordset, generatePrivateStaff);
      response.json(decoded);
    })
  };

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
  sqlRequest.input('email_addr', encode(data.email));
  sqlRequest.input('security_question', encode(data.securityQuestion));
  sqlRequest.input('security_answer', encode(data.securityAnswer));
  sqlRequest.input('role_fk', data.roleFk);
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
  let responseHandler = (err, result) => {
    if(err){
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      if (result.recordset[0].exists === 'true') {
        response.send(`❌ This employee "${username}" already exists`);
      } else if (result.recordset[0].exists === 'false') {
        response.send(`✅ This employee "${username}" does not exist`);
      }
    }
  };

  sqlRequest.input('username', encode(username));
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
      } else {
        let decoded = createDecodedData(result.recordset, generatePrivateStaff);
        response.json(decoded[0]);
      }
    }
  });
});


// -------------------------------------------------------
// UPDATE EMPLOYEE PASSWORD
// -------------------------------------------------------
ROUTER.put('/password/:employeeId', (request, response) => {
  let userId = request.params.employeeId;
  let newPassword = request.body.newPassword;
  let sqlRequest = new sql.Request();
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Password of employee updated`));
  };

  sqlRequest.input('id', userId);
  sqlRequest.input('new_password', encode(newPassword));
  sqlRequest.execute('[usp_staff_update_password]', responseHandler);
});

// -------------------------------------------------------
// UPDATE EMPLOYEE AVATAR
// -------------------------------------------------------
ROUTER.put('/avatar/:employeeId', (request, response) => {
  let employeeId = request.params.employeeId;
  let data = request.body;
  let sqlRequest = new sql.Request();
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Employee id:${employeeId} avatar changed`));
  };

  sqlRequest.input('id', employeeId);
  sqlRequest.input('new_avatar', data.newAvatar);
  sqlRequest.execute('[usp_staff_update_avatar]', responseHandler);
});
// -------------------------------------------------------
// REMOVE EMPLOYEE
// -------------------------------------------------------
ROUTER.post('/remove/:employeeId', (request, response) => {
  let employeeId = request.params.employeeId;
  let sqlRequest = new sql.Request();
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ Employee with id: ${employeeId} has been removed`));
  };

  sqlRequest.input('id', employeeId);
  sqlRequest.execute('[usp_staff_remove]', responseHandler);
});

module.exports = ROUTER;
