const express = require('express');
const Usuario = require('../modelos/usuario.model');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificaToken, verificaRole } = require('../middlewares/auth');

const app = express();

app.put('/usuario/:id', [verificaToken, verificaRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado' ]);

    let options = {
        new: true,
        runValidators: true,
        context: 'query'
    };

    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });
});

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });
});

app.get('/usuario', verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number (desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Usuario.find({ estado: true }, 'nombre email role estado google img').skip(desde).limit(hasta).exec( (err, usuarios) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                } else {
                    res.json({
                        ok: true,
                        lenght: conteo,
                        usuarios
                    });
                }
            });
        }
    });
});

app.delete('/usuario', [verificaToken, verificaRole], function(req, res) {

    let id = req.query.id;
    let body = {estado: false};
    console.log(body);

    Usuario.findByIdAndUpdate(id, body, {new: true}, (err, usuarioEliminado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else if (!usuarioEliminado) {
            res.status(400).json({
                ok: false,
                err: 'El usuario no se encontró'
            });
        } else {
            res.json({
                ok: true,
                usuarioEliminado
            });
        }
    });
});

//#region delete antiguo
// app.delete('/usuario/:id', verificaToken, function (req, res) {
    
//     let id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             res.status(400).json({
//                 ok: false,
//                 err
//             });
//         } else if (!usuarioBorrado){
//             res.json({
//                 ok: false,
//                 err: 'el usuario no se encuentra' 
//             });
//         } else {
//             res.json({
//                 ok: true,
//                 usuario: usuarioBorrado
//             });
//         }
//     });

// });
//#endregion delete antiguo

module.exports = app;