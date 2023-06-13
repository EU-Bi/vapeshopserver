const Router = require("express");
const router = new Router();
const bannerController = require('../controllers/bannerController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, bannerController.create)
router.get('/', bannerController.getAll)
router.get('/:id', bannerController.getOne)

module.exports = router;