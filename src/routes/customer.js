import express from 'express';
import sql from 'mssql';
import utf8 from 'utf8';
import base64 from 'base-64';

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
          username: utf8.decode(base64.decode(element.username)),
          password: utf8.decode(base64.decode(element.password)),
          firstName: utf8.decode(base64.decode(element.first_name)),
          lastName: base64.decode(element.last_name),
          email: base64.decode(element.email_addr),
          created: `${new Date(Date.parse(element.date_created)).toLocaleDateString()}`
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
  sqlRequest.input('username', base64.encode(utf8.encode(data.username)));
  sqlRequest.input('password', base64.encode(utf8.encode(data.password)));
  sqlRequest.input('first_name', base64.encode(utf8.encode(data.firstName)));
  sqlRequest.input('last_name', base64.encode(utf8.encode(data.lastName)));
  sqlRequest.input('email_addr', base64.encode(utf8.encode(data.email)));
  sqlRequest.execute('usp_customers_insert', (err) => {
    if (err) {
      response.json({name: err.name, code: err.code, info: err.originalError.info});
    } else {
      response.send(`✅ CUSTOMER -> ${data.username} has been created`);
    }
  })
});

export default ROUTER;
