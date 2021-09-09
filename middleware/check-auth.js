const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!')
        }
        const decodedToken = jwt.verify(token, 'dont_ever_share_this_private_key_11231');
        req.userData = {
            userId: decodedToken.userId,
            admin: decodedToken.admin
        }
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }
}