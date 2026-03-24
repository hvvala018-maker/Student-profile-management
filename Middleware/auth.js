const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../Config/jwtSecret');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'Access Denied. No token provided.' });

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ msg: 'Invalid token.' });
    }
};