const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req,res)=>{
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
})

// Refresh Token
// router.post("/refresh", (req, res) => {
//     // take the refresh token from the user
//     const refreshToken = req.body.token;

//     // send error if there is no token or it's invalid
//     if(!refreshToken) res.status(401).send("You are not authenticated");
// });

//login
router.post("/login", async (req,res)=>{
    try {
        //find user
        const user = await User.findOne({username: req.body.username});
        if (!user) return res.status(400).json("Wrong username or password");
        
        // validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).json("Wrong username or password");

        const token = jwt.sign({
            email: user.email, 
            username: user.username
        }, process.env.SECRET_KEY);

        //send res
        // res.status(200).json({_id: user._id, username: user.username});
        res.cookie("messdekho", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true,
        })
        res.status(200).json({_id: user._id, username: user.username, token: token});
    } catch (error) {
        return res.status(500).json(error);
    }
})

module.exports = router;