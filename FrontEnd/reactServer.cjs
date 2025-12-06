/*
# Citation for the following code:
# Date: 2025-11-19
# Based on: OSU CS 340 course materials for connecting to class server
# Source URL: https://canvas.oregonstate.edu/courses/2017561/assignments/10111722
*/

// reactServer.cjs
// Serves the React build folder (/dist)

const express = require('express');
const path = require('path');
const app = express();

const PORT = 52630; // Hardcoded port (usually from .env)

// Serve static files from /dist
app.use(express.static(path.join(__dirname, 'dist')));

// Return index.html for unmatched routes (React Router handles routing)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running: http://classwork.engr.oregonstate.edu:${PORT}`);
});
