const test = require('tape');
const requestPromise = require('request-promise');




test('User Integration Tests', async (t) => {
  const baseUrl = 'http://localhost'; 
  
  
   t.test('GET /customers', async (t) => {
    try {
      const response = await requestPromise({
        method: 'GET',
        uri: `http://localhost/orders`,
        json: true,
      });

      t.equal(response.statusCode, 200, 'Response status code should be 200');
      t.ok(response._embedded.customer, 'Response should contain the customers array');

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
    } catch (error) {
      t.fail(`GET /customers request failed: ${error.message}`);
      t.end();
    }
  });

  t.test('POST /register', async (t) => {
    try {
      const requestBody =  {"username":"deepaksingh","password":"12345","email":"dddv76@gmail.com","firstName":"deepak","lastName":"singh"};

      const response = await requestPromise({
        method: 'POST',
        uri: `http://localhost/register`,
        body: requestBody,
        json: true,
      });

      t.equal(response.statusCode, 200, 'Response status code should be 200');
      t.ok(response.id, 'Response should contain the user ID');
      // Add more assertions as needed to validate the response

      t.end();
    } catch (error) {
      t.fail(`POST /register request failed: ${error.message}`);
      t.end();
    }
  });
});

