const DATA_HANDLER = require('./node/DataHandler');

class app3 {
    constructor() {
        this.dataHandler = new DATA_HANDLER();
        this.ejsData = null;
        this.loadServer();
    }

    loadServer() {
        const HTTP = require('http'),
            PORT = process.env.PORT || 8005,
            EJS = require('ejs');

        HTTP.createServer((request, response) => {
            // console.log(request);

            // -- DOM RESPONDER -- //

            let httpHandler = (error, string, contentType) => {
                if (error) {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end('An error has occurred: ' + error.message);
                } else if (contentType.indexOf('image') >= 0) {
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(string, 'binary');
                } else if (contentType.indexOf('html') >= 0) {
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(EJS.render(string, {
                        data: this.ejsData,
                        filename: 'index.ejs'
                    }));
                } else {
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(string, 'utf-8');
                }
            };

            // -- ROUTES -- //

            if (request.method === 'POST') {
                if (request.headers['x-requested-with'] === 'XMLHttpRequest0') {
                    this.loadData(request, response, 0);
                } else if (request.headers['x-requested-with'] === 'XMLHttpRequest1') {
                    this.loadData(request, response, 1);
                } else if (request.headers['x-requested-with'] === 'XMLHttpRequest2') {
                    this.loadData(request, response, 2);
                } else {
                    console.log("[405] " + request.method + " to " + request.url);
                    response.writeHead(405, "Method not supported", { 'Content-Type': 'text/html' });
                    response.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
                }
            } else if (request.url.indexOf('.js') >= 0) {
                this.render(request.url.slice(1), 'application/javascript', httpHandler, 'utf-8');
            } else if (request.url.indexOf('.css') >= 0) {
                this.render(request.url.slice(1), 'text/css', httpHandler, 'utf-8');
            } else if (request.url.indexOf('.png') >= 0) {
                this.render(request.url.slice(1), 'image/png', httpHandler, 'binary');
            } else if (request.url.indexOf('/') >= 0) {
                this.render('public/views/index.ejs', 'text/html', httpHandler, 'utf-8');
            } else {
                this.render(`HEY! What you're looking for: it's not here!`, 'text/html', httpHandler, 'utf-8');
            }
        }).listen(PORT, () => {
            console.log('-= App Listening at 127.0.0.1:' + PORT + ' =-');
        });
    }

    render(path, contentType, callback, encoding) {
        const FS = require('fs');
        FS.readFile(path, encoding ? encoding : 'utf-8', (error, string) => { // ternary
            callback(error, string, contentType);
        });
    }

    loadData(req, res, whichAjax) {
        if (whichAjax === 0) {
            req.on('data', (data) => {
                let cleanData = data.toString('utf8');
                let user = DATA_HANDLER.handleUserData(cleanData, whichAjax);
                if (user !== 'false') {
                    res.writeHead(200, {'content-type': 'application/json'});
                    res.end(user);
                } else {
                    res.writeHead(200, {'content-type': 'text/plain'});
                    res.end('false');
                }
            });
        } else if (whichAjax === 1) {
            const FORMIDABLE = require('formidable');  // https://docs.nodejitsu.com/articles/HTTP/servers/how-to-handle-multipart-form-data
            let formData = {};
            new FORMIDABLE.IncomingForm().parse(req).on('field', (field, name) => {
                formData[field] = name;
            }).on('error', (err) => {
                next(err);
            }).on('end', () => {
                formData = JSON.stringify(formData);
                DATA_HANDLER.handleUserData(formData, whichAjax);
                res.writeHead(200, {'content-type': 'application/json'});
                res.end(formData);
            });
        } else if (whichAjax === 2) {
            const FORMIDABLE = require('formidable');  // https://docs.nodejitsu.com/articles/HTTP/servers/how-to-handle-multipart-form-data
            let formData = {};
            new FORMIDABLE.IncomingForm().parse(req).on('field', (field, name) => {
                formData[field] = name;
            }).on('error', (err) => {
                next(err);
            }).on('end', () => {
                // DATA_HANDLER.queryData(formData);
                this.dataHandler.addData(formData);
                res.writeHead(200, {'content-type': 'application/json'});
                formData = JSON.stringify(formData);
                res.end(formData);
            });
        }
    }
}

module.exports = app3;

// http://ejs.co
// http://stackoverflow.com/questions/336859/var-functionname-function-vs-function-functionname
// http://stackoverflow.com/questions/8131344/what-is-the-difference-between-dirname-and-in-node-js