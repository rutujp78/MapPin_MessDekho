const { register, login, getUser } = require("../controllers/userController");
const verifyToken = require("../middleware/auth");
const router = require("express").Router();

//register
router.post("/register", register)

//login
router.post("/login", login);


// getUser
router.get("/getUser", verifyToken, getUser);
module.exports = router;