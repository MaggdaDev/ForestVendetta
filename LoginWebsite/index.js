const http = require('http');
const url = require('url');
const fs = require('fs');

const host = "localhost";
const port = "42069";


const requestListener = function (req, res) {
    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write(fs.readFileSync(req.url.split("/")[req.url.split("/").length - 1]));
    res.end();
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});