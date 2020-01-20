const express = require('express');
let app = express();
const fs = require('fs');
const path = require('path');


const { verificaAdminImg } = require('../../middlewares/autentificacion')

app.get('/imagen/:tipo/:img', verificaAdminImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `.uploads/${tipo}/${img}`;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${img}`);


    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/img-prueba.jpg');
        res.sendFile(noImagePath);
    }

});


module.exports = app;