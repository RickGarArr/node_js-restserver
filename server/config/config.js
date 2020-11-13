// PUERTO
process.env.PORT = process.env.PORT || 3000;
// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// Base de datos

let urlDB;

// Local
if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // Servidor
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// fecha de expiracion token
// 60 segundos * 60 minutos * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = '15d';
// seed
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// google client

process.env.CLIENT_ID = process.env.CLIENT_ID || '489497265262-9d2t45fdldg9nei8td3jf4nqevb14qgu.apps.googleusercontent.com';