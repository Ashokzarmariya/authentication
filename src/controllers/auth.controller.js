require("dotenv").config();
const jwt = require("jsonwebtoken");
const { findOne } = require("../models/user.model");
const User = require("../models/user.model");

const newToken = (user) => {
    return jwt.sign({ user: user }, process.env.JWT_SECRET_KEY);
};

const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send({ message: "email is alrady exist" })
        
        user = await User.create(req.body);
        const token = newToken(user);
        
        return res.status(201).send({ user, token });
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send({ message: "user is not exist" });
        
        const match = user.checkPassword(req.body.password);
        if (!match)
            return res.status(400).send({ message: "incorrect email or password" });
        const token = newToken(user);
        return res.status(201).send({ user, token });
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}
    
    
    
module.exports = { register, login };