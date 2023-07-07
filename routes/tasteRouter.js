const Router = require("express");
const router = new Router();
const tasteController = require('../controllers/tasteController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, tasteController.create)
router.get('/', tasteController.getAll)

module.exports = router;