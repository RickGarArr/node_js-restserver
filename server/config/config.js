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
process.env.CADUCIDAD_TOKEN = 60 * 60  * 24 * 30;
// seed
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';