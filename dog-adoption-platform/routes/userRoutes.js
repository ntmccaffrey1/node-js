const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router.post('/user/register', userController.register_post);
router.post('/user/login', userController.login_post);
router.post('/user/logout', userController.logout_post);

module.exports = router;