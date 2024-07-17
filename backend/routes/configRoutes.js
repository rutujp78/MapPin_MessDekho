const pinRoute = require("./pins");
const userRoute = require("./users");

const configRoutes = (app) => {
    app.use("/api/users", userRoute);
    app.use("/api/pins", pinRoute);
}

module.exports = { configRoutes };