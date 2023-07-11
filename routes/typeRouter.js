const Router = require("express");
const router = new Router();
const typeController = require('../controllers/typeController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, typeController.create)
router.get('/', typeController.getAll)
router.get('/:id', typeController.getOne)
router.delete('/:id', authMiddleware, typeController.delete);
router.put('/:id', authMiddleware, typeController.update);

module.exports = router;