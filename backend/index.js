const express = require("express");
const app = express();
const { connectDB } = require("./utils/connectDB");
const { middlewareConfig } = require("./middleware/middlewareConfig");
const { configEnv } = require("./configs/configEnv");
const { configRoutes } = require("./routes/configRoutes");
const { initRedis } = require("./utils/redisClient");

// config env (dotenv)
configEnv();

// cors, express.json
middlewareConfig(app);

// connect to db
connectDB();
initRedis();

// routes
configRoutes(app);

app.listen(5000, ()=>{
    console.log("Backend server is running");
});