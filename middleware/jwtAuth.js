const jwt = require('jsonwebtoken');
const user = require('../model/userModel');

const jwtAuth = (req, res, next) => {
    const token = (req.cookies && req.cookies.token) || null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided"
        });
    }

    try {
        // Verify the JWT token
        const payload = jwt.verify(token, process.env.SECRET);
        req.user = { id: payload.id, email: payload.email };
        next(); // Continue processing the request
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token"
        });
    }
};

module.exports = jwtAuth;
