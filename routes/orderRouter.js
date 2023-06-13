const Router = require("express");
const orderController = require('../controllers/orderController')
const router = new Router();

router.post('/', orderController.create)
router.get('/', orderController.getAll)
router.get('/:id', orderController.getOne)

module.exports = router;