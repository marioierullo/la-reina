const express = require('express');
const server = express();

// Get port, or default to 3000
const port = process.env.PORT || 3000;

server.all(`/`, (req, res) => {
    res.send(`Result: [OK].`);
});

function keepAlive() {
    server.listen(port, () => {
        console.log(`Server is now ready! | ` + Date.now());
    });
}

module.exports = keepAlive;