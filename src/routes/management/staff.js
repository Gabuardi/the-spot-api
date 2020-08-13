import express from 'express';
import sql from 'mssql';
import path from 'path';
import {readTemplate, createDecodedData} from "../../utils/common.js";
import {encode, decode} from '../../utils/codification.js';
import {dateStringParser} from "../../utils/parsers.js";

const __dirname = path.resolve(); 
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
};

function replaceTemplate(template, data) {
  let output = template.replace(/{%USERNAME%}/g, data.username);
  output = output.replace(/{%EMAIL%}/g, data.email);
  output = output.replace(/{%ROLE%}/g, data.role);
  output = output.replace(/{%DATE%}/g, data.created);
  output = output.replace(/{%AVATAR%}/g, data.avatar);

  return output
}

// -------------------------------------------------------
// STAFF LIST
// -------------------------------------------------------
ROUTER.get('/', async (request, res) => {
  try {
    let sqlRequest = new sql.Request();

    let homeOutput = await readTemplate(`${__dirname}/views/management/staff/users-list/index.html`, 'utf-8');
    let employeeOutput = await readTemplate(`${__dirname}/views/management/staff/users-list/template/staff-info.html`, 'utf-8');

    sqlRequest.execute('[usp_staff_get_all]', async (err, data) => {
      if(err) console.log(`ERROR!!! ${err}`);

      let employeeData = await createDecodedData(data.recordset, generatePublicStaff);

      employeeOutput = await employeeData.map(el => replaceTemplate(employeeOutput, el)).join('');
      homeOutput = await homeOutput.replace('{%EMPLOYEE%}', employeeOutput);

      res.status(200).type('text/html').send(homeOutput);
    });
  } catch(err) {
    res
      .status(400)
      .json({
        status: 'failed',
        message: `ERROR!!! ${err}`
      });
  }
});

// -------------------------------------------------------
// CREATE NEW
// -------------------------------------------------------
ROUTER.get('/new', async (request, res) => {
  let homeOutput = await readTemplate(`${__dirname}/views/management/staff/create-user/index.html`, 'utf-8');
  res.status(200).type('text/html').send(homeOutput);
});


export default ROUTER;
