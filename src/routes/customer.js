import express from 'express';
import sql from 'mssql';
import {encode, decode} from "../utils/codification.js";
import {dateStringParser} from "../utils/parsers.js";

const ROUTER = express.Router();

ROUTER.get('/', (request, response) => {
  let sqlRequest = new sql.Request();
  sqlRequest.execute('usp_customers_get_all', (err, result) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      let customerList = result.recordset;
      let decodedCustomerList = [];
      customerList.forEach(element => {
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
      response.json(decodedCustomerList);
    }
  })
});


ROUTER.post('/', (request, response) => {
  let data = request.body;

  let sqlRequest = new sql.Request();
  sqlRequest.input('username', encode(data.username));
  sqlRequest.input('password', encode(data.password));
  sqlRequest.input('first_name', encode(data.firstName));
  sqlRequest.input('last_name', encode(data.lastName));
  sqlRequest.input('email_addr', encode(data.email));
  sqlRequest.execute('usp_customers_insert', (err) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ CUSTOMER -> ${data.username} has been created`);
    }
  })
});

export default ROUTER;
