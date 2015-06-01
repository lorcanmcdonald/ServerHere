var http = require('http');
exports.Server = (function(proc){
    var port = proc.argv[3] || 7800;
    var serverIP = proc.argv[2] || 'localhost';
    return { new: function(func){
                    http.createServer(func).listen(port, serverIP);
                    console.log('Server running at http://' + serverIP + ':' + port +'/');
                }
           , contentTypes: { 'text/html':  {'Content-Type': 'text/html; charset=utf-8'}
                           , 'text/css': {'Content-Type': 'text/css; charset=utf-8'}
                           , 'text/plain': {'Content-Type': 'text/plain; charset=utf-8'}
                           , 'text/javascript': {'Content-Type': 'text/javascript; charset=utf-8'}
                           }
           

           };
}(process));
