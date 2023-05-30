const test = require('tape');
const http = require('http');

let registeredUserId; // Variable to store the ID of the last registered user
const username='sss';
const email="sss@gmail.com"

test('User Integration Tests', (t) => {

  t.test('POST /register', (t) => {
    const requestBody = JSON.stringify({
      username: username,
      password: '123456',
      email: email,
      firstName: 'deepakk',
      lastName: 'singhh'
    });

    const options = {
      host: 'user',
      port: 80,
      path: '/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);

        t.equal(res.statusCode, 200, 'Response status code should be 200');

        t.end();
      });
    });

    req.on('error', (error) => {
      t.fail(`POST /register request failed: ${error.message}`);
      t.end();
    });

    req.write(requestBody);
    req.end();
  });


  

  t.test('GET /customers', (t) => {
    const options = {
      host: 'edge-router',
      port: 80,
      path: '/customers',
      method: 'GET',
    };
  
    const req = http.request(options, (res) => {
      let data = '';
  
      res.on('data', (chunk) => {
        data += chunk;
      });
  
      res.on('end', () => {
        const response = JSON.parse(data);
  
        t.equal(res.statusCode, 200, 'Response status code should be 200');
        t.ok(response._embedded.customer, 'Response should contain the customers array');
  
        const customers = response._embedded.customer;
        if (customers.length > 0) {
          const lastCustomer = customers[customers.length - 1];
          registeredUserId = lastCustomer.id;
        } else {
          t.fail('No customers found');
        }
  
        // Add more assertions as needed to validate the response structure and data
        t.ok(Array.isArray(response._embedded.customer), 'Customers should be an array');
  
        const customer = response._embedded.customer[0];
        t.ok(customer.firstName, 'Customer should have a firstName');
        t.ok(customer.lastName, 'Customer should have a lastName');
        t.ok(customer.username, 'Customer should have a username');
        t.ok(customer._links.self.href, 'Customer should have a self link');
        t.ok(customer._links.customer.href, 'Customer should have a customer link');
        t.ok(customer._links.addresses.href, 'Customer should have an addresses link');
        t.ok(customer._links.cards.href, 'Customer should have a cards link');
  
        t.end();
      });
    });
  
    req.on('error', (error) => {
      t.fail(`GET /customers request failed: ${error.message}`);
      t.end();
    });
  
    req.end();
  });

  t.test('GET /catalogue', (t) => {
    const options = {
      host: 'edge-router',
      port: 80,
      path: '/catalogue',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    const req = http.request(options, (res) => {
      let data = '';
  
      res.on('data', (chunk) => {
        data += chunk;
      });
  
      res.on('end', () => {
        const response = JSON.parse(data);
  
        t.equal(res.statusCode, 200, 'Response status code should be 200');
        t.ok(Array.isArray(response), 'Response should be an array');
  
        // Add assertions to validate the structure and data of the catalogue items
        if (response.length > 0) {
          const item = response[0];
          t.ok(item.id, 'Item should have an ID');
          t.ok(item.name, 'Item should have a name');
          t.ok(item.description, 'Item should have a description');
          t.ok(Array.isArray(item.imageUrl), 'Item imageUrl should be an array');
          t.ok(typeof item.price === 'number', 'Item price should be a number');
          t.ok(typeof item.count === 'number', 'Item count should be a number');
          t.ok(Array.isArray(item.tag), 'Item tag should be an array');
        }
  
        t.end();
      });
    });
  
    req.on('error', (error) => {
      t.fail(`GET /catalogue request failed: ${error.message}`);
      t.end();
    });
  
    req.end();
  });

  t.test('DELETE /customers/{registeredUserId}', (t) => {
    if (!registeredUserId) {
      t.fail('No registered user ID available');
      t.end();
      return;
    }

    const options = {
      host: 'user',
      port: 80,
      path: `/customers/${registeredUserId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);

        t.equal(res.statusCode, 200, 'Response status code should be 200');

        t.end();
      });
    });

    req.on('error', (error) => {
      t.fail(`DELETE /customers/{id} request failed: ${error.message}`);
      t.end();
    });

    req.end();
  });
});


