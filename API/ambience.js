const pool = require('./sql_pool.js');

// Ambience

module.exports = app => {
    app.post('/ambience', (req, res) => {
        console.log(req.body.name);
        const states_json = JSON.stringify(req.body.states);
        pool.query(`INSERT INTO ambience (name, user, states_json) VALUES ('${req.body.name}', '${req.body.user}', '${states_json}')`, (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).send('Ambience already exists');
                } else {
                    console.log(err);
                }
            } else {
                res.status(200).send("Ambience " + req.body.name + " added");
            }
        });
    });

    app.get('/ambience/:name', (req, res) => {
        console.log(req.params);
        pool.query(`SELECT id, name, user, states_json FROM ambience WHERE name = '${req.params.name}' AND user = '${req.query.user}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.length === 0) {
                res.status(404);
                res.send(`Ambience ${req.params.name} not found!`);
            } else {
                console.log(`Fetched ambience ${result[0].name} (id: ${result[0].id})`);
                res.send(JSON.stringify( { "id": result[0].id, "name": result[0].name, "user": result[0].user, "states": JSON.parse(result[0].states_json) }));
            }
        });
    });

    // Delete uniquement l'ambiance de l'utilisateur (vérif si l'utilisateur est bien celui qui a créé l'ambiance + si il est login)
    app.delete('/ambience/:name', (req, res) => {
        pool.query(`DELETE FROM ambience WHERE name = '${req.params.name}' AND user = '${req.query.user}'`, (err, result) => {
            if (err) {
                console.log(err);
                res.status(404).send("Error!");
            } else if (result.affectedRows === 0) {
                res.status(400).send("No ambience found!");
            } else {
                res.status(200).send("Ambience " + req.params.name + " deleted");
            }
        });
    });
};