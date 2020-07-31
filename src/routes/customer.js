import express from 'express';
import sql from 'mssql';
import {encode, decode} from "../utils/codification.js";
import {dateStringParser} from "../utils/parsers.js";
import {sqlResponseHandler} from "../utils/handlers.js";

const ROUTER = express.Router();

function createDecodedCustomerList (encodedCustomerList) {
  let decodedCustomerList = [];
  encodedCustomerList.forEach(element => {
    let customer = {
      customerId: element.customer_id,
      username: decode(element.username),
      password: decode(element.password),
      firstName: decode(element.first_name),
      lastName: decode(element.last_name),
      email: decode(element.email_addr),
      created: dateStringParser(element.date_created)
    };
    decodedCustomerList.push(customer);
  });
  return decodedCustomerList;
}

// -------------------------------------------------------
// GET ALL CUSTOMERS
// -------------------------------------------------------
ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  let responseHandler = (err, result) => {
    sqlResponseHandler(err, result, response, (response, result) => {
      let decodedCustomerList = createDecodedCustomerList(result.recordset);
      response.json(decodedCustomerList);
    });
  };

  sqlRequest.execute('usp_customers_get_all', responseHandler);
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
