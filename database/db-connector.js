// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_*',    // Remove asterick and replace with your username
    password        : '*',          // Replace asterick with your password
    database        : 'cs340_*'     // Replace asterick with your username
})

// Export it for use in our application
module.exports.pool = pool;