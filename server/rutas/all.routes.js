const express = require('express');
const app = express();

app.use(require('./usuario.route'));
app.use(require('./login.route'));
app.use(require('./categoria.route'));
app.use(require('./producto.route'));
app.use(require('./upload.route'));

module.exports = app;