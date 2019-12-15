require('./config/config');
const express = require('express')
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    res.json('get usuario')
});

app.post('/usuario', function(req, res) {
    let persona = req.body;
    if (persona.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es nesesario'
        });
    } else {
        res.json({
            persona
        });
    }

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
});


app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto: ', process.env.PORT);
});