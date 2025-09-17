const { Router } = require('express');
const dogController = require('../controllers/dogController');
const { requireAuth } = require('../middlewares/userAuth');

const router = Router();

router.post('/dogs/register', requireAuth, dogController.dog_register_post);
router.post('/dogs/adopt/:id', requireAuth, dogController.dog_adopt_post);
router.post('/dogs/remove/:id', requireAuth, dogController.dog_remove_post);
router.get('/dogs/registered', requireAuth, dogController.dogs_registered_get);
router.get('/dogs/adopted', requireAuth, dogController.dogs_adopted_get);

module.exports = router;