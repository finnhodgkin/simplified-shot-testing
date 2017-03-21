const test = require('tape');
const shot = require('shot');

const router = require('./router');

// EXAMPLE SINGLE ROUTE TEST
(() => {
  // Shot options
  const requireOptions = {url:'/', method:'get'};
  const responseOptions = {statusCode: 200, payload:'hello'};

  // Function call with above options.
  // Optional second argument (string) not included (adds a custom test name).
  testRoute([requireOptions, responseOptions]);
})();

// EXAMPLE OBJECT TO RUN MULTIPLE ROUTE TESTS
// Each key in the object is the name of a test.
// Each value is an array with two objects:
// The first - require options for Shot
// The second - options to test the response with
// For example in 'route' the object passes in require options of '/' and 'get'
// and validates the server response of statusCode '200' and payload 'hello'
const routesToTest = {
  route:[{url:'/', method:'get'},{statusCode: 200, payload:'hello', headers:{'content-type':'text/html'}}],
  brokenurl:[{url:'/brokenurl'},{statusCode: 404}],
};

// FUNCTION CALL WITH ABOVE OBJECT
testMultipleRoutes(routesToTest);


function testMultipleRoutes (routesToTest) {
  Object.keys(routesToTest).forEach(route => {
    testRoute(routesToTest[route], route);
  });
}

function testRoute ([reqOptions, resOptions], name = '') {
  const method = reqOptions.method || 'get';
  const url = reqOptions.url || '/';

  shot.inject(router, reqOptions,
    (res) => {
      test(`Testing '${name || url}' with ${method}`, (t) => {

        Object.keys(resOptions).forEach(option => {

          // second level options (headers[content-type], etc.)
          if (typeof resOptions[option] === 'object') {
            Object.keys(resOptions[option]).forEach(innerOption => {
              t.equal(res[option][innerOption], resOptions[option][innerOption],
                `${option}[${innerOption}] = ${res[option][innerOption]}`
              );
            });
            return;
          }

          // first level objects (statusCode, etc.)
          t.equal(res[option], resOptions[option],
            `${option} = ${res[option]}`);

        });

        t.end();
      });
    });
}
