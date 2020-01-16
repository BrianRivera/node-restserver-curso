const express = require('express');
const { verificaToken } = require('../../middlewares/autentificacion');
let app = express();
const _ = require('underscore');
let Producto = require('../models/producto');


//listar productos
app.get('/productos', verificaToken, (req, res) => {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 8)
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoBD
            });
        });
});

//buscar productos
app.get('/productos/:id', (req, res) => {
    let id_producto = req.params.id;
    Producto.findById(id_producto)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                productoBD
            });
        });
});


//buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = new RegExp(req.params.termino, 'i');

    Producto.find({ nombre: termino })
        .populate('categoria', 'nombre')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoBD
            });
        });
});

//ingresar productos
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let id_usuario = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: id_usuario
    });
    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoBD
        });
    });

});

//modificar productos
app.put('/productos/:id', (req, res) => {
    let id_producto = req.params.id;
    let body = _.pick(req.body, ['disponible', 'nombre', 'precioUni', 'descripcion', 'categoria', 'usuario']);

    Producto.findByIdAndUpdate(id_producto, body, { new: true }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoBD
        });
    });

});


//eliminar productos
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoBD
        });
    });
});



module.exports = app;