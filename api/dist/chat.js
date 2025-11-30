"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
// api/chat.ts
const http_1 = require("http");
function handler(req, res) {
    // Add headers to explicitly disable caching for this route
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    if (req.method === 'GET') {
        // Now, send the 200 OK response with the body
        res.status(200).send('Hello from the backend!');
    }
    else {
        res.status(405).end(); // Method Not Allowed
    }
}
if (require.main === module) {
    const port = process.env.PORT || 3001;
    const server = (0, http_1.createServer)((req, res) => handler(req, res));
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
