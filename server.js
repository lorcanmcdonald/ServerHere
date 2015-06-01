var http = require('http'),
    templates = require('./templates');
exports.Server = (function(proc){
    var port = proc.argv[3] || 7800;
    var serverIP = proc.argv[2] || 'localhost';
    var library = { new: function(func){
                    http.createServer(func).listen(port, serverIP);
                    console.log('Server running at http://' + serverIP + ':' + port +'/');
           }
           , serverError: function(res, message){
             var _message = message || "";
             res.writeHead(500, library.contentTypes['text/html']);
             res.end(templates.serverError({message: _message}));
           }
           , notFound: function(res){
             res.writeHead(404, library.contentTypes['text/html']);
             res.end(templates.notFound());
           }
           , mimetype: function(pathname){
             var contentType = 'text/plain';
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
             return contentType;
           }
           , contentTypes: { 'text/html':  {'Content-Type': 'text/html; charset=utf-8'}
                           , 'text/css': {'Content-Type': 'text/css; charset=utf-8'}
                           , 'text/plain': {'Content-Type': 'text/plain; charset=utf-8'}
                           , 'text/javascript': {'Content-Type': 'text/javascript; charset=utf-8'}
                           }
           };
    return library;
}(process));
