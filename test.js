const test = require('tape');
const shot = require('shot');

const fs = require('fs');

const router = require('./src/router');

// EXAMPLE SINGLE ROUTE TEST
const singleRoute = (cb) => {
  // Shot options
  const requireOptions = {url:'/', method:'get'};
  const responseOptions = {statusCode: 200, headers:{'content-type':'text/html'}};

  // Function call with above options.
  // Optional second argument (string) not included (adds a custom test name).
  testRoute([requireOptions, responseOptions]);

  // cb(null, 'DONE');
};

// EXAMPLE STATIC FILE TESTS
const singleStaticFile = (cb) => {

  const requireOptions = {url:'/'};
  const responseOptions = {statusCode: 200};
  fs.readFile('./public/index.html', 'utf8', (err, file) => {
    responseOptions.payload = file;
    testRoute([requireOptions, responseOptions]);
  });

  // cb(null, 'DONE');
};

// EXAMPLE OBJECT TO RUN MULTIPLE ROUTE TESTS
// Each key in the object is the name of a test.
// Each value is an array with two objects:
// The first - require options for Shot
// The second - options to test the response with
// For example in 'route' the object passes in require options of '/' and 'get'
// and validates the server response of statusCode '200' and payload 'hello'
const routesToTest = {
  route:[{url:'/', method:'get'},{statusCode: 200, headers:{'content-type':'text/html'}}],
  brokenurl:[{url:'/brokenurl'},{statusCode: 404}],
};

// FUNCTION CALL FOR ALL OF THE ABOVE
// (() => {
//   singleRoute(()=>{
//     singleStaticFile(()=>{
//       testMultipleRoutes(routesToTest, ()=>{});
//     });
//   });
// })();

singleRoute();

singleStaticFile();

testMultipleRoutes(routesToTest);


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
