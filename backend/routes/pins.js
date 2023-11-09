const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const Pin = require("../models/Pin");

//create a pin
router.post("/", verifyToken, async (req,res)=>{
    const user = req.user;
    const newPin = new Pin(req.body);
    try {
        if(user.username===newPin.username) {
            const savedPin = await newPin.save();
            res.status(200).json(savedPin);
        }
        else res.status(403).json("You are not allowed to add pin to map")
    } catch (error) {
        res.status(500).json(error);
    }
})

//get all pins
router.get("/", async (req,res)=>{
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    } catch (error) {
        res.status(500).json(error);
    }
})

// Edit pin
router.put("/editpin", verifyToken, async (req, pin) => {
    try {
        const user = req.user;
        const pin = [...req.body];
        
    } catch (error) {
        
    }
})

module.exports = router;