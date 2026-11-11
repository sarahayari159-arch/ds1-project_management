const express = require('express');
const router = express.Router();

const authController = require('../controllers/authcontroller');
const { validateSignup} = require('../middleware/validation');
const { validateLogin } = require('../middleware/validation');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/register', validateSignup, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/add-manager', authenticate, requireAdmin, validateSignup, authController.addManager);


module.exports = router;
