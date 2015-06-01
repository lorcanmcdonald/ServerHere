#!/usr/bin/env node

var fs   = require('fs'),
    url  = require('url'),
    templates = require('./templates'),
    Server = require('./server').Server;

Server.new(function (req, res) {
    console.log('req.url', req.url);
    var parsedUrl = url.parse(req.url, true);
    var contentType = 'text/plain';
    if(parsedUrl.pathname === '/' || parsedUrl.pathname.match(/html$/)) {
        contentType = 'text/html';
    } else if(parsedUrl.pathname.match(/js$/)) {
        contentType = 'text/javascript';
    }

    fs.stat('.' + parsedUrl.pathname, function (err, stats) {
        if(err && err.code === "ENOENT") {
            Server.notFound(res);
        } else if (err) {
            Server.serverError(res, err);
        } else if(stats.isDirectory()) {
            res.writeHead(200, Server.contentTypes['text/html']);

            fs.readdir('.' +parsedUrl.pathname, function(err, files) {
                if (err) {
                    Server.serverError(res, err);
                }
                var baseUrl = parsedUrl.pathname.match(/^\/$/)? '': parsedUrl.pathname+'/';
                res.end(templates.main({baseUrl: baseUrl, files: files}));
            });
        } else {
            contentType = 'text/plain';
            if(parsedUrl.pathname.match(/html$/)) {
                contentType = 'text/html';
            } else if(parsedUrl.pathname.match(/\.css$/)) {
                contentType = 'text/css';
            } else if(parsedUrl.pathname.match(/\.svg$/)){
                contentType = 'image/svg';
            } else if(parsedUrl.pathname.match(/\.json$/)){
                contentType = 'application/json';
            } else if(parsedUrl.pathname.match(/\.js$/)){
                contentType = 'text/javascript';
            }
            res.writeHead(200, Server.contentTypes[contentType]);
            fs.readFile('.' + parsedUrl.pathname, function(err, data){
                if(err) { throw err; }
                res.end(data);
            });
        }
    });
});
