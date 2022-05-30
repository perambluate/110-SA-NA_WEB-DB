const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const fs = require('fs');
const DBSOURCE = "db/data.db";


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log(`db ${DBSOURCE} cannot open!`);
        console.log(err.message);
        throw err;
    };    
});

module.exports = db;
