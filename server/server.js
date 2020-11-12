require('./config/config');
// Importaciones Necesarias
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// habilitar public folder
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion global de las rutas
app.use( require('./rutas/all.routes') );

let mongooseSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

mongoose.connect(process.env.URLDB, mongooseSettings, (err, res) => {
    if (err) {
        console.log();
    } else {
        console.log('Base de Datos Online');
    }
});

app.listen(process.env.PORT, function () {
    console.log('Escuchando en el puerto', process.env.PORT);
})