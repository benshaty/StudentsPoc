const bcrypt = require('bcrypt');
const saltRound = 10;
const cookieInterval = (5 * 60 * 1000);

const createHash = (password) => {
    return bcrypt.hashSync(password, saltRound, (err, hash) => {
        return hash;
    });
}
const compairPass = (password, hash) => {
    return bcrypt.compareSync(password, hash, function (err, res) {
        if (res) {
            return true;    
        } else {
            return false;
        }
    });
}

const setCookieURL = (request) => {
    request.session.current_url  = request.protocol + '://' + request.get('host') + request.originalUrl;
}

const extendCookie = (request) => {
    request.session.cookie.maxAge = Date.now() +  cookieInterval;
}

const checkCookie = (request) => request.session.cookie.maxAge > Date.now();

module.exports = {
    "createHash" : createHash,
    "compairPass" : compairPass,
    "setCookieURL" : setCookieURL,
    "extendCookie" : extendCookie,
    "checkCookie" : checkCookie
}


