const express = require('express');
const app = express();

app.use(require('./usuario.route'));
app.use(require('./login.route'));

module.exports = app;