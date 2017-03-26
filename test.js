const test = require('tape');
const shot = require('shot');

const fs = require('fs');

const router = require('./src/router');

// EXAMPLE SINGLE ROUTE TEST
const singleRoute = () => {
  // Shot options
  const requireOptions = {url:'/', method:'get'};
  const responseOptions = {statusCode: 200, headers:{'Content-Type':'text/html'}};

  // Function call with above options.
  // Optional second argument (string) not included (adds a custom test name).
  testRoute([requireOptions, responseOptions]);

};

// EXAMPLE STATIC FILE TESTS
const singleStaticFile = () => {

  const requireOptions = {url:'/'};
  const responseOptions = {statusCode: 200};
  fs.readFile('./public/index.html', 'utf8', (err, file) => {
    responseOptions.payload = file;
    testRoute([requireOptions, responseOptions]);
  });

};

// EXAMPLE OBJECT TO RUN MULTIPLE ROUTE TESTS
// Each key in the object is the name of a test.
// Each value is an array with two objects:
// The first - require options for Shot
// The second - options to test the response with
// For example in 'route' the object passes in require options of '/' and 'get'
// and validates the server response of statusCode '200' and payload 'hello'
const routesToTest = {
  route:[{url:'/', method:'get'},{statusCode: 200, headers:{'Content-Type':'text/html'}}],
  test1:[{url:'/test1', method:'get'},{statusCode: 404, headers:{'Content-Type':'text/html'}}],
  unknownUrl:[{url:'/fsdfsdfsfs', method:'get'},{statusCode: 404, headers:{'Content-Type':'text/html'}}],
  brokenurl:[{url:'/brokenurl'},{statusCode: 404}],
  asset:[{url:'/assets/test.css', method:'get'},{statusCode: 200, headers:{'Content-Type':'text/css'}}],
  assetsCorrect:[{url:'/assets/test.css'},{statusCode: 200}],
  assetsBroken:[{url:'/assets'},{statusCode: 404}],
  assetsUpADirectory:[{url:'/assets/../index.html'},{statusCode: 404}],
  assetsVeryBroken:[{url:'/assetsdfsfs'},{statusCode: 404}],

};

singleRoute();

singleStaticFile();

testMultipleRoutes(routesToTest);


/**
 * @param  {object} routesToTest
 * Runs tests on an object filled with routes
 */
function testMultipleRoutes (routesToTest) {
  Object.keys(routesToTest).forEach(route => {
    testRoute(routesToTest[route], route);
  });
}

function testRoute ([reqOptions, resOptions], name = '') {
  const method = reqOptions.method || 'get';
  const url = reqOptions.url || '/';

  test(`Testing '${name || url}' with ${method}`, (t) => {
    shot.inject(router, reqOptions,
      (res) => {
        Object.keys(resOptions).forEach(option => {

          // second level objects (headers[content-type], etc.)
          if (typeof resOptions[option] === 'object') {
            Object.keys(resOptions[option]).forEach(innerOption => {
              // cut long result strings from test name
              const result = res[option][innerOption].length > 30 ?
                                  'Correct result' :
                                  res[option];

              t.equal(res[option][innerOption], resOptions[option][innerOption],
                `${option}[${innerOption}] = ${res[option][innerOption]}`
              );
            });
            return;
          }

          // cut long result strings from test name
          const result = res[option].length > 30 ? 'Correct result' :
          res[option];

          // first level objects (statusCode, etc.)
          t.equal(res[option], resOptions[option],
            `${option} = ${result}`);

        });
        t.end();
      });
  });
}

module.export = testMultipleRoutes(routesToTest);
