const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');
//default option
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no se a seleccionado ni un archivo'
            }
        });
    }


    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidas son' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extencion = nombreArchivo[nombreArchivo.length - 1];
    //extenciones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //valida extenciones
    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extenciones permitidas son' + extencionesValidas.join(', '),
                ext: extencion
            }
        })
    }


    //cambia el nombre al archivo
    let nombreArchivoFinal = `${id}-${new Date().getMilliseconds() }.${extencion}`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivoFinal }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //aqui, imagen ya guardada

        imagenUsuario(id, res, nombreArchivoFinal);
    });


});




function imagenUsuario(id, res, nombreArchivoFinal) {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borra_archivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borra_archivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'usuario no encontrado'
                }
            });
        }

        //no repite la imagen, borra la anterior
        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }
        borra_archivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivoFinal;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivoFinal
            });
        });


    });

}

function imagenProducto() {

}


function borra_archivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;