const Router = require("express");
const router = new Router();
const tasteController = require('../controllers/tasteController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, tasteController.create)
router.get('/', tasteController.getAll)
router.delete('/:id', authMiddleware, tasteController.delete);
router.put('/:id', authMiddleware, tasteController.update);

module.exports = router;