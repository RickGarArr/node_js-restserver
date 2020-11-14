const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../modelos/usuario.model');
const Producto = require('../modelos/producto.model');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Ningun archivo'
            }
        });
    }
    // validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido, Tipos Validos = ' + tiposValidos,
                tipo: tipo
            }
        });
    }

    let archivo = req.files.archivo;
    // arreglo del nombre separado por punto
    let nombreCortado = archivo.name.split('.');
    // obtener extencion del archivo
    let extencion = nombreCortado[nombreCortado.length - 1];
    // Estenciones permtitas
    let extValidas = ['png', 'jpeg', 'jpg', 'gif'];
    if (extValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no valido, Extenciones validas = ' + extValidas,
                extencion: extencion
            }
        });
    }
    // cambiar nombre archivo
    let fecha = new Date().getTime().toString();
    let nombreArchivo = `${id}_${fecha}.${extencion}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function (err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } 
        if (tipo === tiposValidos[0]) {
            ImagenProducto(id, res, nombreArchivo);
        } else {
            ImagenUsuario(id, res, nombreArchivo);
        }
    });
});

function ImagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        } else if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El Usuario no existe'
                }
            });
        } else {
            borraArchivo(productoDB.img, 'productos');
            productoDB.img = nombreArchivo;
            productoDB.save((err, usuarioGuardado) => {
                res.json({
                    ok: true,
                    producto: usuarioGuardado,
                    img: nombreArchivo
                });
            });
        }
    });
}

function ImagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        } else if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El Usuario no existe'
                }
            });
        } else {
            borraArchivo(usuarioDB.img, 'usuarios');
            usuarioDB.img = nombreArchivo;
            usuarioDB.save((err, usuarioGuardado) => {
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombreArchivo
                });
            });
        }
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}
module.exports = app;
