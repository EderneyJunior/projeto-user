const express = require("express")
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController")
const AdminAuth = require("../middleware/AdminAuth")

router.get('/', HomeController.index);
router.post("/user", UserController.create)
router.get("/user", AdminAuth, UserController.index)
router.get("/user/:id", AdminAuth, UserController.findUser)
router.put("/user/:id", AdminAuth, UserController.edit)
router.delete("/user/:id", AdminAuth, UserController.remove)
router.post("/recoverpassword", UserController.recoverPassword)
router.post("/changepassword", UserController.changePassword)
router.post("/login", UserController.login)

module.exports = router;