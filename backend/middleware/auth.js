const jwt = require('jsonwebtoken');

const verifyToken  = async (req,res,next) => {
    try {
        let token = req.header("Authorization");
    
        if(!token) {
            return res.status(403).send({ msg: "Access Denied", success: false });
        }
        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        // verified contains payload of token
        // console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
}

module.exports = verifyToken;
