const express = require('express');
const server = express();

// Get port
const port = process.env.PORT;

server.all(`/`, (req, res) => {
    res.send(`Result: [OK].`);
});

function keepAlive() {
    server.listen(port, () => {
        console.log(`Server is now ready! | ` + Date.now());
    });
}

module.exports = keepAlive;