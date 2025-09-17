const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // check if json web token exists and is valid
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            return res.status(401).json({ error: 'Unauthorized'});
        } 
        req.userId = decodedToken.id;
        next();
    })
}

module.exports = { requireAuth };