const express = require('express');
const app = express();

app.use(express.json());

require('./user.js')(app);
require('./connected_object.js')(app);
require('./ambience.js')(app);

app.listen(8080, () => {
    console.log("Hello");
});