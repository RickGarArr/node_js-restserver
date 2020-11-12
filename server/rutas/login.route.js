const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario.model');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.post('/login', function (req, res) {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

// Config google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
// verify().catch(console.error);


app.post('/google', async function (req, res) {
    // del post unicamente se recibe un token
    let token = req.body.idtoken;

    // obtengo un objeto de la funcion verify de google
    let googleUser = await verify(token).catch( e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });
    
    // consulta para verificar si ya existe ese correo en la base de datos
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // si existe un usuario que coincida
        if ( usuarioDB) {
            // se verifica si se logueo con google en primera instancia
            if (usuarioDB.google === false ){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar autenticación normal'
                    }
                });
                // si si fue con google
            } else {
                // se genera un nuevo token (nuestro)
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si usuario no existe en base de Datos
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':)'
            });
            // se gurda en la base de datos
            usuario.save( (err, usuarioDB )=> {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                // se le genera un nuevo token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});

module.exports = app;