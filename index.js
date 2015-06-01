#!/usr/bin/env node

var fs   = require('fs'),
    url  = require('url'),
    templates = require('./templates'),
    Server = require('./server').Server;

Server.new(function (req, res) {
    console.log('req.url', req.url);
    var parsedUrl = url.parse(req.url, true);
    var pathname = parsedUrl.pathname;
    var contentType = 'text/plain';
    if(pathname === '/' || pathname.match(/html$/)) {
        contentType = 'text/html';
    } else if(pathname.match(/js$/)) {
        contentType = 'text/javascript';
    }

    fs.stat('.' + pathname, function (err, stats) {
        if(err && err.code === "ENOENT") {
            Server.notFound(res);
        } else if (err) {
            Server.serverError(res, err);
        } else if(stats.isDirectory()) {
            res.writeHead(200, Server.contentTypes['text/html']);

            fs.readdir('.' +pathname, function(err, files) {
                if (err) {
                    Server.serverError(res, err);
                }
                var baseUrl = pathname.match(/^\/$/)? '': pathname+'/';
                res.end(templates.main({baseUrl: baseUrl, files: files}));
            });
        } else {
            contentType = 'text/plain';
            if(pathname.match(/html$/)) {
                contentType = 'text/html';
            } else if(pathname.match(/\.css$/)) {
                contentType = 'text/css';
            } else if(pathname.match(/\.svg$/)){
                contentType = 'image/svg';
            } else if(pathname.match(/\.json$/)){
                contentType = 'application/json';
            } else if(pathname.match(/\.js$/)){
                contentType = 'text/javascript';
            }
            res.writeHead(200, Server.contentTypes[contentType]);
            fs.readFile('.' + pathname, function(err, data){
                if(err) { throw err; }
                res.end(data);
            });
        }
    });
});
