const path = require('path');
const express = require('express');
const Transport = require('winston-transport');

const logs = []; // TODO change to use memcache or redis or anything better then this

// HACK This is a mockup for testing
module.exports = class ContextLoggerViewer extends Transport {
    constructor(opts) {
        super(opts);

        // Allow port to be past in
        // Allow remote server to be passed in. If so don't start express
        
        var app = express();

        app.use('/', express.static(path.join(__dirname, 'node_modules', 'context-logger-viewer-ui', 'public')));
        app.use('/dist', express.static(path.join(__dirname, 'node_modules', 'context-logger-viewer-ui', 'dist')));

        app.use('/getLogs', (req, res, next) => {
            res.status(200).json({ logs: logs });
        });
        
        app.listen(3002); // TODO Magic Number
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        logs.push(info);
        callback();
    }
};