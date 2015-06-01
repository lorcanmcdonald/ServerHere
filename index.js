#!/usr/bin/env node

var fs   = require('fs'),
    url  = require('url'),
    Server = require('./server').Server;

Server.new(function (req, res) {
    console.log('req.url', req.url);
    var parsedUrl = url.parse(req.url, true);
    var contentType = 'text/plain';
    if(parsedUrl.pathname === '/' || parsedUrl.pathname.match(/html$/))
    {
        contentType = 'text/html';
    } else if(parsedUrl.pathname.match(/js$/)) {
        contentType = 'text/javascript';
    }
    res.writeHead(200, Server.contentTypes[contentType]);

    fs.stat('.' + parsedUrl.pathname, function (err, stats){
        if(err){
            res.writeHead(404, Server.contentTypes['text/html']);
            res.end('<h1>404 Not found</h1>');
        } else if(stats === undefined)
        {
            res.writeHead(404, Server.contentTypes['text/html']);
            res.end('<h1>404 Not found</h1>');
        } else if(stats.isDirectory()) {
            res.writeHead(200, Server.contentTypes['text/html']);
            var html = [ '<html>'
                       , '<head>'
                       , '<title>'
                       , 'ServerHere - Directory Listing</title>'
                       , '<style>'
                       , '</style>'
                       , '<script id="_7800ScriptTag" src="http://lorcanmcdonald.com/static_media/_7800/_7800.js">'
                       , '</script>'
                       , '<script id="_7800ScriptTag" src="http://lorcanmcdonald.com/static_media/select.js"></script>'
                       , '</head>'
                       , '<h1>'
                       , 'Server Here</h1>'
                       , '<h2>'
                       , 'Directory Listing:</h2>'
                       , '<ol>' ].join('');

            fs.readdir('.' +parsedUrl.pathname, function(err, files){
                var baseUrl = parsedUrl.pathname.match(/^\/$/)? '': parsedUrl.pathname+'/';
                var filesList = files.map(function(name){
                    return '<li><a href="' + baseUrl + name+'">' + name + '</a></li>';
                });
                res.end(html + filesList.join('') + '</ol></body></html>');
            });
        } else {
            contentType = 'text/plain';
            if(parsedUrl.pathname.match(/html$/))
            {
                contentType = 'text/html';
            }
            else if(parsedUrl.pathname.match(/\.css$/))
            {
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
