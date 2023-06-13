const Router = require("express");
const router = new Router();
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', adminController.registration)
router.post("/login", adminController.login);
router.get("/auth",authMiddleware, adminController.check);

module.exports = router;