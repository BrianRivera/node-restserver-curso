const express = require('express');
//este es para encriptar
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const Usuario = require('../models/usuario');


app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(usuario) o contraseña incorrecto'
                }
            });
        } else {
            //compareSync compara contraseña ingresada con la de la bd
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'usuario o (contraseña) incorrecto'
                    }
                });
            }
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        }

    });
});






module.exports = app;