import express from 'express';
import sql from 'mssql';
import {createDecodedData} from '../utils/common.js';
import {encode, decode} from "../utils/codification.js";
import {dateStringParser} from "../utils/parsers.js";
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function generateCustomer(el) {
  return {
    customerId: el.customer_id,
    username: decode(el.username),
    password: decode(el.password),
    firstName: decode(el.first_name),
    lastName: decode(el.last_name),
    email: decode(el.email_addr),
    created: dateStringParser(el.date_created)
  }
};

// -------------------------------------------------------
// GET ALL CUSTOMERS
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decodedCustomerList = createDecodedData(result.recordset, generateCustomer);
      response.json(decodedCustomerList);
    });
  };

  sqlRequest.execute('usp_customers_get_all', responseHandler);
});

// -------------------------------------------------------
// GET SPECIFIC CUSTOMER
// -------------------------------------------------------
ROUTER.get('/:customerId', (request, response) => {
  let customerId = request.params.customerId;

  let sqlRequest = new sql.Request();

  sqlRequest.input('customer_id', customerId);

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decodedCustomerList = createDecodedData(result.recordset, generateCustomer);
      response.json(decodedCustomerList);
    });
  };

  sqlRequest.execute('usp_customers_get_specific', responseHandler);
});

// -------------------------------------------------------
// CREATE NEW CUSTOMER
// -------------------------------------------------------
ROUTER.post('/', (request, response) => {
  let data = request.body;
  
  let sqlRequest = new sql.Request();

  sqlRequest.input('username', encode(data.username));
  sqlRequest.input('password', encode(data.password));
  sqlRequest.input('first_name', encode(data.firstName));
  sqlRequest.input('last_name', encode(data.lastName));
  sqlRequest.input('email_addr', encode(data.email));

  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, () => response.send(`✅ CUSTOMER -> ${data.username} has been created`));
  };
  sqlRequest.execute('usp_customers_insert', responseHandler);
});

export default ROUTER;
