/*jshint node:true*/
'use strict';

const zmq = require('zmq');
const socket = zmq.socket('pull');

// Instead of a Unix socket you can use 'tcp://...' etc.
const socketAddress = process.platform == 'win32' ? "tcp://127.0.0.1:5556/logger.socket" : 'ipc://' + __dirname + '/logger.socket';
let count = 0;
// multi-part message parts go in separate arguments
socket.on('message', function (level, data) {
    count++;
    level = level.toString();
    data = data.toString();

    process.stdout.write(count + ' ');

    try {
        console[level].apply(this, JSON.parse(data));
    } catch (e) {
        console[level](data);
    }
    if (count>100000) {
        //TODO: process.memoryUsage().external should be added on top for aditional memory used by c(++) bindings
        console.log('Used '+Math.floor(process.memoryUsage().heapTotal/1024/1024)+'MB RAM to benchmark 10000 connections at');
        console.timeEnd("benchmark");
        process.exit(0);
    }

});

// Once everything is ready start listening for messages
socket.bind(socketAddress);
console.time("benchmark");
console.log('Logger is ready');
