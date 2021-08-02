// File dependencies
const bcrypt = require('bcrypt');
const saltRound = 10;
const cookieInterval = (5 * 60 * 1000);

// Create password hash
const createHash = (password) => {
    return bcrypt.hashSync(password, saltRound, (err, hash) => {
        return hash;
    });
}

// Compair entered pass with hashed one
const compairPass = (password, hash) => {
    return bcrypt.compareSync(password, hash, function (err, res) {
        if (res) {
            return true;    
        } else {
            return false;
        }
    });
}

// Set cookie url for returning to the same page
const setCookieURL = (request) => {
    request.session.current_url  = request.protocol + '://' + request.get('host') + request.originalUrl;
}

// Extend cookie max age
const extendCookie = (request) => {
    request.session.cookie.maxAge = Date.now() +  cookieInterval;
}

// Check if cookie is valid 
const checkCookie = (request) => request.session.cookie.maxAge > Date.now();


module.exports = {
    "createHash" : createHash,
    "compairPass" : compairPass,
    "setCookieURL" : setCookieURL,
    "extendCookie" : extendCookie,
    "checkCookie" : checkCookie
}


