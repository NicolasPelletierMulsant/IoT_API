const pool = require('./sql_pool.js');

// User

module.exports = app => {
    app.post('/user', (req, res) => {
        console.log(req.body.username);
        pool.query(`INSERT INTO user (username, password) VALUES ('${req.body.username}', '${req.body.password}')`, (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).send('User already exists');
                } else {
                    console.log(err);
                }
            } else {
                res.status(200).send("User " + req.body.username + " added");
            }
        });
    })

    app.post('/user/login', (req, res) => {
        console.log(req.body);
        pool.query(`SELECT * FROM user WHERE username = '${req.body.username}' AND password = '${req.body.password}'`, (err, result) => {
            if (err) {
                console.log(err);
                res.status(404).send("Error!");
            } else if (result.length !== 0) {
                res.status(200).send("User logged in!");
            } else {
                res.status(400).send("Wrong username or password!");
            }
        });
    })

    app.post('/user/logout', (req, res) => {
        res.send("Not implemented yet.");
    })

    app.get('/user/:name', (req, res) => {
        console.log(req.params);
        pool.query(`SELECT id, username FROM user WHERE username = '${req.params.name}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.length === 0) {
                res.status(404);
                res.send(`User ${req.params.name} not found!`);
            } else {
                console.log(`Fetched user ${result[0].username} (id: ${result[0].id})`);
                res.send(JSON.stringify( { "id": result[0].id, "username": result[0].username }));
            }
        });
    })

    app.delete('/user/:name', (req, res) => {
        pool.query(`DELETE FROM user WHERE username = '${req.params.name}'`, (err, result) => {
            if (err) {
                console.log(err);
                res.status(404).send("Error!");
            } else if (result.affectedRows === 0) {
                res.status(400).send("No user found!");
            } else {
                console.log(`Deleted user ${req.params.name}`);
                res.send("Deleted user " + req.params.name);
            }
        });
    })
};