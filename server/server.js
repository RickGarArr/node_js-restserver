require('./config/config');

// Importaciones Necesarias
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( require('./rutas/usuario') );

mongoose.connect(process.env.URLBD,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },
    (err) => {
        if ( err ) throw err;
        console.log('Base de Datos Online');
});

app.listen(process.env.PORT, function (){
    console.log('Escuchando en el puerto', process.env.PORT);
})