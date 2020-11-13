const express = require('express');
let { verificaToken, verificaRole } = require('../middlewares/auth');
let app = express();
let Categoria = require('../modelos/categoria.model');

// traer todas categorias
app.get('/categoria', verificaToken ,function(req, res){
    let desde = Number(req.query.desde);
    let hasta = Number(req.query.hasta);
    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde).limit(hasta)
        .exec((err, categoriasDB) => {
            
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Categoria.countDocuments().skip(desde).limit(hasta).exec( (err, conteo)=> {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                res.json({
                    ok: true,
                    conteo,
                    categoriasDB
                });
            }   
        });
    });
});

// traer solo una categoria
app.get('/categoria/:id', function(req, res){
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                categoriaDB
            });
        }
    })
});

// crear una categoria
app.post('/categoria', [verificaToken, verificaRole], function(req, res){
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// editar una categoria
app.put('/categoria/:id', [verificaToken, verificaRole] ,function(req, res){
    let id = req.params.id;
    let body = req.body

    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id No Existe'
                }
            });
        } else {
            res.json({
                ok: true,
                categoriaDB
            });
        }
    });
});

// remover categoria
app.delete('/categoria/:id', [verificaToken, verificaRole], function(req, res){
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }else if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id No Existe'
                }
            });
        } else {
            res.json({
                ok: true,
                usuario: req.body._id,
                categoriaDB
            });
        }
    });
});

module.exports = app;