const net = require('net');
let util = require('util');
const os = require('os');

const HOST = '127.0.0.1';
const PORT = 6969;



const cluster = require('cluster');

cluster.on('exit', (worker, code, signal) => {
    console.log('worker %d died (%s). restarting...',
        worker.process.pid, signal || code);
    cluster.fork();
});

if (cluster.isMaster) {




// Receive messages from the master process.
    /*
     process.on('message', function(msg) {
     console.log('Worker ' + cluster.worker.process.pid + ' received message from master.', msg);
     });
     */


//some tests
    console.log('c');
    const o = {b: 'g'};
    console.log('c', o);
    console.error(o);
    console.log('d');
    console.log('e');
    console.log('f');

    //Start workers
    const cpuCount = require('os').cpus().length;
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

} else {

    // Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
    net.createServer(function (sock) {

        // We have a connection - a socket object is assigned to the connection automatically
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        // Add a 'data' event handler to this instance of socket
        sock.on('data', function (data) {
            console.log('DATA ' + sock.remoteAddress + ': ' + data);
            // Write the data back to the socket, the client will receive it as data from the server
            //sock.write('You said "' + data + '"');
        });
        // Add a 'close' event handler to this instance of socket
        sock.on('close', function () {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

        console.log('Starting...');

// send some multi-part messages
//socket.send(['info', 'Message #1']);
//socket.send(['info', 'Message #2']);
//socket.send(['info', 'Message #3']);
        let count = [];
        (function (con) {
            //let empty = {};
            const dummy = function () {
            };
            //let properties = 'memory'.split(',');
            const methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
            'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
            'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
            //while (prop = properties.pop()) con[prop] = con[prop] || empty;
            let i = 0;
            const len = methods.length;
            for (; i < len; i++) {

                (function (method) {
                    count[method] = 0;
                    const oldLog = console[method];
                    if (oldLog) {
                        console[method] = function () {
                            count[method]++;
                            //this.history = console.history || []; // store logs to an array for reference
                            //this.history.push(arguments);
                            // DO MESSAGE HERE.

                            //oldLog.apply(console, arguments);
                            arguments.callee = arguments.callee.caller;
                            const newarr = [].slice.call(arguments);
                            (typeof console[method] === 'object' ? oldLog.apply.call(oldLog, console, newarr) : oldLog.apply(console, newarr));
                            //socket.send([method, util.inspect(newarr, { showHidden: true, depth: null, breakLength: Infinity })]);

                            newarr.unshift(cluster.isMaster ? process.pid : cluster.worker.process.pid);
                            newarr.unshift(os.hostname());
                            newarr.unshift(new Date().toISOString());
                            newarr.unshift(count[method]);
                            sock.write(JSON.stringify({level: method, data: newarr}, null, null));
                            //socket.send([method, JSON.stringify(arguments, null, null)]);
                        };
                    } else console[method] = dummy;
                })(methods[i]);
            }
        })(this.console = this.console || {});

    }).listen(PORT, HOST);
    console.log('Server listening on ' + HOST + ':' + PORT);

    console.info('Worker', cluster.worker.id, 'spawned');

    let tid = setInterval(mycode, 0);

    function mycode() {
        console.log("Test Message!", Math.random());
    }

//clearInterval(tid);


}


