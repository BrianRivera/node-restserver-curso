require('./config/config');
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require('./routes/index.js'));



let conexion = async() => {
    let resp = await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
}
conexion();
// mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {

//     if (err) throw err;
//     console.log('bd ONLINE');


// });






app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto: ', process.env.PORT);
});