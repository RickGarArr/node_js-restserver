const express = require('express');
let app = express();

let { verificaToken } = require('../middlewares/auth');
let Producto = require('../modelos/producto.model');

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                res.json({
                    ok: true,
                    productos
                });
            }
        })

});
// Obtener productos de forma paginada
app.get('/productos', verificaToken, (req, res) => {

    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 20;

    Producto.find({ disponible: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .skip(desde)
        .limit(hasta)
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                res.json({
                    ok: true,
                    productosDB
                });
            }
        });
});
// obtener un producto
app.get('/productos/:id', verificaToken, (req, res) => {
    const id = req.params.id;

    Producto.findById(id)
        .populate('categorias', 'descripcion')
        .populate('usuario', 'nommbre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            } else {
                res.json({
                    ok: true,
                    productoDB
                });
            }
        });
})

app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else {
            res.status(201).json({
                ok: true,
                productoDB
            });
        }
    });
});

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        } else {
            productoDB.nombre = body.nombre;
            productoDB.precioUni = body.precioUni;
            productoDB.categoria = body.categoria;
            productoDB.disponible = body.disponible;
            productoDB.descripcion = body.descripcion;

            productoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                } else {
                    res.json({
                        ok: true,
                        productoGuardado
                    });
                }
            });
        }
    });
});

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let disponibleNV = req.body.disponible;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else if (!productoDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe'
                }
            });
        } else {
            productoDB.disponible = disponibleNV;

            productoDB.save((err, borrado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                } else {
                    res.json({
                        ok: true,
                        borrado,
                        message: 'Producto Borrado'
                    });
                }
            });
        }
    });
});

module.exports = app;