//variable s y constantes de forma gloval

//===============================
//Puerto
//===============================
process.env.PORT = process.env.PORT || 3000


//===============================
//Entorno
//===============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================
//base de datos
//===============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://strider:Y1S6z7htAV3xMnRX@cluster0-g9igt.mongodb.net/cafe?retryWrites=true&w=majority'
}


process.env.URLDB = urlDB;
//mongodb://localhost:27017/cafe
//mongodb+srv://strider:<password>@cluster0-g9igt.mongodb.net/test?retryWrites=true&w=majority