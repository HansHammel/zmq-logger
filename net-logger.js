/*jshint node:true*/
'use strict';

const net = require('net')
    , JSONStream = require('JSONStream');
const HOST = '127.0.0.1';
const PORT = 6969;

const client = new net.Socket();
client.connect(PORT, HOST, function () {
    console.time("benchmark");
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('I am Chuck Norris!');

});
let count = 0;
client.pipe(JSONStream.parse()).on('data', function (data) {
    count++;
    process.stdout.write(count + ' ');
    try {
        console[data.level].apply(this, data.data);
    } catch (e) {
        console.error(data);
        //console[data.level](data.data);
    }
    if (count>100000) {
        //TODO: process.memoryUsage().external should be added on top for aditional memory used by c(++) bindings
        console.log('Used '+Math.floor(process.memoryUsage().heapTotal/1024/1024)+'MB RAM to benchmark 10000 connections at');
        console.timeEnd("benchmark");
        process.exit(0);
    }
});

// Add a 'close' event handler for the client socket
client.on('close', function () {
    // Close the client socket completely
    client.destroy();
    console.log('Connection closed');
});


console.log('Logger is ready');
