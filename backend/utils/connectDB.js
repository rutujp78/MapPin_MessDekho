const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("MongoDB connected");
    }).catch((err)=>console.log(err));
};

module.exports = { connectDB };