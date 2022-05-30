// Create express app
const express = require('express');
const app = express();
const db = require('./db.js');
const TABLE_NAME = 'kv_pairs';
const PORT = 6060;

app.use(express.json());

// Start server, and listen at port 8080
app.listen(PORT, () => {
    console.log(`NA/SA app listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    console.log('get root request');
    res.send('Hello Nyaaaa!\n');
});


// Get all keys
app.get('/key', (req, res, cb) => {
    var sql = `SELECT DISTINCT key FROM ${TABLE_NAME}`;
    db.all(`SELECT DISTINCT key FROM ${TABLE_NAME}`, (err, rows) => {
        if (err) {
            console.error("error: ", err.message);
            res.status(400).send();
            return;
        };

        console.log('Get keys!');
        // console.log(rows);
        var keys = [];
        for (let i in rows) {
            keys.push(rows[i].key); 
        }
        console.log(keys);
        res.status(200).json(keys);
    });
});

// Get a single key-value pair
app.get('/key/:key', (req, res, cb) => {
    var query = req.params.key;
    db.get(`SELECT * FROM ${TABLE_NAME} WHERE key = ?`, [query], (err, rst) => {
        if (err) {
            console.error('Errors occur when querying data');
            res.status(404).send();
        } else if (rst != undefined) {
            console.log(`Get key ${query}`);
            console.log(rst);
            var query_rst = {};
            query_rst[rst.key] = rst.value;
            res.status(200).json(query_rst);
        } else {
            console.error(`The query data,${query}, is not existed`);
            res.status(404).send();
        }
    });
});

// Check whether the key existed
function checkKeyExisted(key) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT key FROM ${TABLE_NAME} WHERE key= ?`, [key], (err, rst) => {
            if (err) {
                console.log('errors occur when check key');
                console.error(err);
                reject();
                return;
            } else if (rst != undefined) {
                EXISTED = true;
                console.log(`key, ${key}, already existed`);
                resolve(false);
            } else {
                resolve(true);
            };
        });
    });
};

// Create a key-value pair (db-operation)
function createKey(key, value) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO ${TABLE_NAME} (key, value) VALUES (?, ?)`, 
            [key, value], (err, rst) => {
                if (err) {
                    console.log("error occurs when create key");
                    console.error(err);
                    reject();
                } else {
                    console.log(`successfully add {${key}: ${value}} into database`);
                    // res.status(201).send();
                    resolve();
                };
            });
    });
};

// Update a key-value pair (db-operation)
function updateKey(key, value) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE ${TABLE_NAME} SET value = ? WHERE key = ?`, [value, key], (err, rst, cb) => {
            if (err) {
                console.log('errors occur when update data');
                console.error(err);
                //res.status(400).send();
                reject();
            } else {
                console.log(`successfully update the key-value pair, {${key}: ${value}} `);
                //res.status(200).send();
                resolve();
            }
        });
    });
}

// Create a key-value pair (http-request)
app.post('/key', (req, res, cb) => {
    var key = req.body.key;
    var value = req.body.value;
    (async () => {
        checkKeyExisted(key)
            .then(success => {
                if (success) {
                    createKey(key, value)
                        .then(() => { res.status(201).send(); })
                        .catch(() => { res.status(400).send(); })
                } else {
                    res.status(400).send();
                };
            })
            .catch(() => { res.status(400).send(); })
   })();
});

// Update a key-value pair (http-request)
app.put('/key/:key', (req, res, cb) => {
    var key = req.params.key;
    var value = req.body.value;
    (async () => {
        let EXISTED;
        try{
            EXISTED = ! (await checkKeyExisted(key));
            if (EXISTED) {
               updateKey(key, value)
                    .then(() => { res.status(200).send(); })
                    //.catch(() => { res.status(400).send(); })
            } else {
                createKey(key, value)
                    .then(() => { res.status(201).send(); })
                    //.catch(() => { res.status(400).send(); })
            }
        } catch(e){
            res.status(400).send();
        }
    })();
});

// Delete a key
app.delete('/key/:key', (req, res, cb) => {
    var key = req.params.key;
    db.run(`DELETE FROM ${TABLE_NAME} WHERE key = ?`, key, (err, rst, cb) => {
        if (err) {
            console.log('errors occur when delete key');
            console.error(err);
            return;
        };

        console.log(`successfully delete key, ${key}`);
        res.status(200).send();
    });
});

// Delete all keys
app.delete('/key', (req, res, cb) => {
    db.run(`DELETE FROM ${TABLE_NAME}`, (err, rst, cb) => {
        if (err) {
            console.log('errors occur when delete key');
            console.error(err);
            return;
        };

        console.log('successfully delete all keys');
        res.status(200).send();
    });
});
