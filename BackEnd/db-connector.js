/*
# Citation for the following code:
# Date: 2025-11-19
# Based on: OSU CS 340 course materials for connecting to DB
# Source URL: https://canvas.oregonstate.edu/courses/2017561/assignments/10111722
*/

// MySQL connection pool for Beaver Cellars app
const mysql = require("mysql2");

const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_loefflek',       // OSU MySQL username
    password: '9440',             // last 4 digits of OSU ID
    database: 'cs340_loefflek'    // database name (same as user)
}).promise(); // Enables async/await queries

module.exports = pool;
