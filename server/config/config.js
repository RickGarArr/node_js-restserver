// PUERTO
process.env.PORT = process.env.PORT || 3000;
// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
// Base de datos

let urlBD;

if ( process.env.NODE_ENV === 'dev' ) {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://rick_gar_arr007:GvkHGfgGamKPzUDM@cluster0.tmhxu.mongodb.net/cafe';
}

process.env.URLBD = urlBD;