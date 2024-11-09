const Pin = require("../models/Pin");
const redisClient = require("../utils/redisClient").redisClient;

const createPin = async (req,res)=>{
    const user = req.user;
    const newPin = new Pin(req.body);
    try {
        if(user.username===newPin.username) {
            const savedPin = await newPin.save();
            await redisClient.set("pins", null);
            res.status(200).json(savedPin);
        }
        else res.status(403).json("You are not allowed to add pin to map")
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllPins = async (req,res)=>{
    try {
        let pins = await redisClient.get("pins");
        if(pins) {
            pins = JSON.parse(pins);
        }
        else {
            pins = await Pin.find();
            await redisClient.set("pins", JSON.stringify(pins));
        }
        return res.status(200).json(pins);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updatePin = async (req, res) => {
    try {
        // const user = req.user;
        const pinId = req.body._id;
        const resPin = await Pin.findByIdAndUpdate(pinId, req.body);
        console.log(resPin);
        const editedPin = await Pin.findById(pinId);
        console.log(editedPin);
        await redisClient.set("pins", null);
        res.status(200).json({ editedPin, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

const deletePin = async (req, res) => {
    try {
        const pinId = req.params.id;
        const deletedPin = await Pin.deleteOne({_id: pinId});
        await redisClient.set("pins", null);
        res.status(200).send(deletedPin);
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

module.exports = { createPin, getAllPins, updatePin, deletePin };