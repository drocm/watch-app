const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const http = require('http');
const https = require('https');

let lastAction = {
    action: null,
    src: null,
    timestamp: null
};

io.on('connection', (socket) => {
    console.log('user connected...');

    socket.emit('PlayerInit', lastAction);

    socket.on('PlayerAction', function (action) {
        //console.log('PlayerAction', action);
        lastAction.action = action;
        lastAction.timestamp = Date.now();
        io.emit('PlayerAction', action);
    });

    socket.on('ChangeSource', function (url) {
        //console.log('ChangeSource', url);
        io.emit('ChangeSource', url);
    });

    socket.on('probe', function (timestamp) {
        //console.log('probed...', timestamp);
        socket.emit('probe', timestamp);
    });

    socket.on('testUrl', function (url) {

        if(url.includes('https')){
            https.get(url, (res) => {
                const { statusCode } = res;
                if (statusCode === 200) {
                    lastAction.src = url;
                    socket.emit('testUrlResult', 'pass');
                } else {
                    socket.emit('testUrlResult', 'fail');
                }
            });
        } else {
            http.get(url, (res) => {
                const { statusCode } = res;
                if (statusCode === 200) {
                    lastAction.src = url;
                    socket.emit('testUrlResult', 'pass');
                } else {
                    socket.emit('testUrlResult', 'fail');
                }
            });
        }

    });
});

server.listen(5000, () => {
    console.log('listening on port 5000...');
});