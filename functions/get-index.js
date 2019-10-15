'use strict';

//================= Load of html file =============
// Next version of JS not yet supported by lambda => use tools for promise

const co = require("co");
// co: use a syntax similar to await
//    https://github.com/tj/co
//    $ npm install co -save

const Promise = require("bluebird");
// Bluebird: It's a library that turns callback-style functions into async functions that returns a promise.
//    $ npm install bluebird -save
// we can use Bluebird to promisify the file (fs) module, which will turn all of 
// these callback-style functions into async functions that returns a promise
const fs = Promise.promisifyAll(require("fs"));

// and with this, let's rewrite our handler function as a generator function 
// and wrap it with co so we can use "yield" for promises inside this generator function.
module.exports.handler = co.wrap(function* (event, context, callback) {
  // we want to load html and wait for its result
  let html = yield loadHtml();
  // construct the HTML response
  // by default, API Gateway will return the content type as JSON, so we need to override the headers as well
  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'    //lambda returns JSON by default, so we convert
    }
  };
  // call the callback function with null for error and the response object as the result
  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
});

var html;

function* loadHtml() {
  // since html file is static, does not need to be re-loaded all the time, lazy loading. 
  if (!html) {
    html = yield fs.readFileAsync('static/index.html', 'utf-8');
  }
  return html;
}
