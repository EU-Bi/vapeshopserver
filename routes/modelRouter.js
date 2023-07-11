const Router = require("express");
const router = new Router();
const modelController = require('../controllers/modelController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, modelController.create);
router.get('/', modelController.getAll);
router.get('/:id', modelController.getOne);
router.delete('/:id', authMiddleware, modelController.delete);
router.put('/:id', authMiddleware, modelController.update);

module.exports = router;
