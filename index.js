#!/usr/bin/env node

var fs   = require('fs'),
    path = require('path'),
    url  = require('url'),
    templates = require('./templates'),
    Server = require('./server').Server;

Server.new(function (req, res) {
    console.log(req.url);
    var parsedUrl = url.parse(req.url, true);
    var pathname = path.normalize(parsedUrl.pathname);

    fs.stat('.' + pathname, function (err, stats) {
        if(err && err.code === "ENOENT") {
            Server.notFound(res);
        } else if (err) {
            Server.serverError(res, err);
        } else if(stats.isDirectory()) {
            res.writeHead(200, Server.contentTypes['text/html']);

            fs.readdir('.' + pathname, function(err, files) {
                if (err) {
                    Server.serverError(res, err);
                }
                var baseUrl = pathname.match(/^\/$/)? '': pathname + '/';
                res.end(templates.main({baseUrl: baseUrl, files: files}));
            });
        } else {
            var contentType = Server.mimetype(pathname);
            res.writeHead(200, Server.contentTypes[contentType]);
            fs.readFile('.' + pathname, function(err, data){
                if(err) { throw err; }
                res.end(data);
            });
        }
    });
});
