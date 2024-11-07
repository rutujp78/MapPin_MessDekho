const Pin = require("../models/Pin");
const cacheService = require("../cacheService/cacheService");

const createPin = async (req,res)=>{
    const user = req.user;
    const newPin = new Pin(req.body);
    try {
        if(user.username===newPin.username) {
            const savedPin = await newPin.save();
            cacheService.clear();
            res.status(200).json(savedPin);
        }
        else res.status(403).json("You are not allowed to add pin to map")
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllPins = async (req,res)=>{
    try {
        const cachedPins = cacheService.get();

        if(cachedPins.length > 0) {
            return res.status(200).json(cachedPins);
        }
        else {
            const freshPins = await Pin.find();
            cacheService.set(freshPins);
            res.status(200).json(freshPins);
            return;
        }
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
        cacheService.clear();
        res.status(200).json({ editedPin, success: true });
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

const deletePin = async (req, res) => {
    try {
        const pinId = req.params.id;
        const deletedPin = await Pin.deleteOne({_id: pinId});
        cacheService.clear();
        res.status(200).send(deletedPin);
    } catch (error) {
        res.status(500).json({ error, success: false });
    }
};

module.exports = { createPin, getAllPins, updatePin, deletePin };