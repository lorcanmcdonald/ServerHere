var handlebars = require('handlebars');

var main = handlebars.compile([
'<html>',
'<head>',
'<title>ServerHere - Directory Listing</title>',
'</head>',
'<h1>Server Here</h1>',
'<h2>Directory Listing:</h2>',
'<ol>',
'{{#each files}}',
'<li>',
'<a href="{{baseUrl}}{{this}}">{{this}}</a></li>',
'{{/each}}',
'</ol>',
'</body>',
'</html>'].join(''));

var serverError = handlebars.compile([
    '<h1>500 Internal server error</h1>',
    '<pre>{{message}}pre>'].join(''));

var notFound = handlebars.compile([
    '<h1>404 Not found</h1>'].join(''));

module.exports = {
    main: main,
    serverError: serverError,
    notFound: notFound
};
