const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../modelos/usuario.model');

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.put('/upload/:tipo/:id', function(req, res) {

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
    if (tiposValidos.indexOf( tipo ) < 0) {
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

    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extencion }`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, function(err){
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'Archivo subido'
        });
    });
});

module.exports = app;
