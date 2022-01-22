require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, user) {
            if (err) return reject(err)
            resolve(user)
        })
    })
};

const anthenticate = async (req, res, next) => {
    
        
    if (!req.headers?.authorization)
        return res.status(400).send({ message: "please provide a token" });
        
    const bearerToken = req.headers.authorization;
    
    
    if (!bearerToken.startsWith("Bearer "))
            return res.status(400).send({ message: "please provide a valide token" });
        
    const token = bearerToken.split(" ")[1];
    //console.log(token)

    let user;
    try {
        user = await verifyToken(token);
    }
    catch (err) {
        
        return res.status(500).send(err.message);
        
    }
    req.user = user.user;
    next();
}

module.exports = anthenticate;