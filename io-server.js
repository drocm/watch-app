const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const http = require('http');
const https = require('https');

let lastAction = {
    action: null,
    src: null,
    timestamp: null,
    player: 'youtube'
};

io.on('connection', (socket) => {
    console.log('user connected...');

    socket.emit('PlayerInit', lastAction);

    socket.on('PlayerAction', function (data) {
        //console.log('PlayerAction', action);
        const action = {
            action: data.playerAction,
            src: lastAction.src,
            timestamp: parseFloat(data.timestamp),
            player: lastAction.player
        };
        lastAction = action;
        io.emit('PlayerAction', action);
    });

    socket.on('ChangeSource', function (data) {
        //console.log('ChangeSource', src);
        const action = {
            action: 'pause',
            src: data.src,
            timestamp: parseFloat(data.timestamp),
            player: data.player
        };
        lastAction = action;
        io.emit('ChangeSource', action);
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