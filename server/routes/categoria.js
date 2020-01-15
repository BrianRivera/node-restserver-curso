const express = require('express')
    //este son minifunciones
const _ = require('underscore');

const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../../middlewares/autentificacion');

const app = express();

// =============================
// mostrar todas las categorias
// =============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .populate('usuario', 'nombre')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoriaDB
            });

        });

});

// =============================
// mostrar una categoria por id
// =============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id_categoria = req.params.id;

    Categoria.findById(id_categoria)
        .then(categoriaDB => {
            res.json({
                ok: true,
                categoriaDB
            });
        }).catch(err => {
            return res.status(400).json({
                ok: false,
                err
            });
        });
});




// =============================
// crear nueva categoria
// =============================
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let id_usuario = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id_usuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });

});

// =============================
// modificar una categoria
// =============================

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id_categoria = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id_categoria, body, { new: true })
        .then(categoria_mod => {
            res.json({
                ok: true,
                categoria_mod
            });
        }).catch(err => {
            return res.status(400).json({
                ok: false,
                err
            });
        });
});


// eliminar
// modificar una categoria
// =============================

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id_categoria = req.params.id;
    Categoria.findByIdAndRemove(id_categoria)
        .then(categoria_elim => {
            res.json({
                ok: true,
                categoria_elim
            });
        }).catch(err => {
            return res.status(400).json({
                ok: false,
                err
            });
        });
});

module.exports = app;