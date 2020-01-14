const jwt = require('jsonwebtoken');



//=====================
//Verificar token
//=====================
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization'); //lo trae de los heders
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};



//=====================
//Verificar token
//=====================
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario.role;

    if (usuario != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'no posee el rol nesesario'
            }
        });
    }
    next();
};

module.exports = {
    verificaToken,
    verificaAdminRole
}