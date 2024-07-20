const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req,res)=>{
    try {
        //generate Pass
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        
        //create new user
        const newUsr = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        //save user and send response
        const user = await newUsr.save();
        res.status(200).json(user._id);
    } catch (error) {
        res.status(500).json(error);
    }
};

const login = async (req,res)=>{
    try {
        //find user
        const user = await User.findOne({username: req.body.username});
        if (!user) return res.status(400).json("Wrong username or password");
        
        // validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).json("Wrong username or password");

        // create token
        const token = jwt.sign({
            email: user.email, 
            username: user.username,
            userId: user._id,
        }, process.env.SECRET_KEY);
        
        res.status(200).json({username: user.username, token: token});
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getUser = async (req, res) => {
    const user = req.user;
    res.status(200).json({ user, success: true });
}

module.exports = { register, login, getUser };