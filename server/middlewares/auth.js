const jwt = require('jsonwebtoken');
// Verificar token
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, function (err, decoded) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

// Verifica Admin ROLE

let verificaRole = function(req, res, next) {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es adminisrtador'
            }
        });
    }
}

let verificaTokenUrl = function(req, res, next){
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, function (err, decoded) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaRole,
    verificaTokenUrl
}