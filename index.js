const http = require('http');
const fs = require('fs');
const path = require('path');
var querystring = require("querystring");

const rootDirectory = `/maven/`
const hostname = '0.0.0.0';
const port = 8080;

const rootUrl = `http://${hostname}:${port}`;

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`)
    switch (req.method) {
        case "GET":
        case "HEAD":
            const requestPath = querystring.unescape(path.join(rootDirectory, req.url));
            if (!fs.existsSync(requestPath)) {
                res.statusCode = 404;
                res.end("Not found");
                console.log(`${req.method} ${requestPath} 404 not found`);
                return;
            }
            if (req.method == "HEAD") {
                res.statusCode = 200;
                res.end();
                console.log(`${req.method} ${requestPath} 200`);
                return;
            }
            const pathStats = fs.lstatSync(requestPath)
            if (pathStats.isDirectory()) {
                let outputString = `<html><body><h1>Folder content:</h1><ul>`;
                if (req.url != "/") {
                    const parentDir = path.resolve(req.url, '..');
                    outputString += `<li><a href="${parentDir}">..</a><l/i></li>`
                }
                try {
                    fs.readdirSync(requestPath).forEach(file => {
                        let filePath = path.join(req.url, querystring.escape(file));
                        outputString += `<li><a href="${filePath}">${file}</a><l/i>`;
                    });
                    outputString += `</ul></body></html>`;
                    res.statusCode = 200;
                    res.end(outputString);
                    console.log(`${req.method} ${requestPath} 200`);
                } catch (ex) {
                    res.statusCode = 500;
                    res.end(ex.toString());
                }

                return;
            }
            try {
                res.statusCode = 200;
                res.end(Buffer.from(fs.readFileSync(requestPath, 'binary'), 'binary'));
                console.log(`${req.method} ${requestPath} 200`);
            } catch (ex) {
                res.statusCode = 500;
                res.end(ex.toString());
            }
            return;
        case "PUT":
        case "POST":
            const saveRequestPath = path.join(rootDirectory, req.url);
            const dirName = path.dirname(saveRequestPath);
            if (!fs.existsSync(dirName)) {
                const pathParts = dirName.split(path.sep);
                let runningPath = "/"
                pathParts.forEach((part) => {
                    runningPath = path.join(runningPath, part);
                    if (!fs.existsSync(runningPath)) {
                        fs.mkdirSync(runningPath);
                    }
                });
            }

            let body = [];
            req.on('data', chunk => {
                body.push(chunk);
            });
            req.on('end', () => {
                // save file
                fs.writeFile(saveRequestPath, Buffer.concat(body), (error) => {
                    if (error) {
                        res.statusCode = 400;
                        res.end(error);
                    } else {
                        res.statusCode = 200;
                        res.end();
                    }
                });
            });
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at ${rootUrl}`);
});