const express = require("express");
const app = express();
const dotenv = require("dotenv");
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const cors = require("cors");
const { connectDB } = require("./utils/connectDB");

dotenv.config();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(5000, ()=>{
    console.log("Backend server is running");
});