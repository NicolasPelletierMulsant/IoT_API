const pool = require('./sql_pool.js');

// Connected Object

module.exports = app => {
    app.post('/connectedObject', (req, res) => {
        console.log(req.body);
        pool.query(`INSERT INTO connected_object (type, name, ip_address, user) VALUES ('${req.body.type}', '${req.body.name}', '${req.body.ip_address}', '${req.body.user}')`, (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).send('Connected object already exists');
                } else {
                    res.status(404).send('Error!');
                }
            } else {
                res.status(200).send("Connected object " + req.body.name + " added");
            }
        });
    });

    app.get('/connectedObject/findByUsername/:username', (req, res) => {
        console.log(req.params.username);
        pool.query(`SELECT o.* FROM connected_object o JOIN user u ON o.user = u.username WHERE username = '${req.params.username}'`, (err, result) => {
            if (err) {
                console.log(err);
                res.status(404).send("Error!");
            } else if (result.length === 0) {
                res.status(400).send("No connected object found!");
            } else {
                console.log(`Fetched connected objects for user ${req.params.username}`);
                res.send(JSON.stringify(result));
            }
        });
    });

    // Get object based on name + IP? (ip in headers?)
    app.get('/connectedObject/:name', (req, res) => {
        console.log(req.params);
        pool.query(`SELECT type, name, ip_address, user FROM connected_object WHERE name = '${req.params.name}' AND user = '${req.query.user}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.length === 0) {
                res.status(404);
                res.send(`Connected object ${req.params.name} not found!`);
            } else {
                console.log(`Fetched connected object ${result[0].name} (id: ${result[0].id})`);
                res.send(JSON.stringify(result[0]));
            }
        });
    });

    // Delete object based on name + IP? (ip in headers?)
    app.delete('/connectedObject/:name', (req, res) => {
        pool.query(`DELETE FROM connected_object WHERE name = '${req.params.name}' AND user = '${req.query.user}'`, (err, result) => {
            if (err) {
                console.log(err);
                res.status(404).send("Error!");
            } else if (result.affectedRows === 0) {
                res.status(400).send("No connected object with this name found!");
            } else {
                console.log(`Deleted connected object ${req.params.name}`);
                res.send("Deleted object " + req.params.name);
            }
        });
    })
};