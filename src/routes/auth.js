const express = require('express');
const router = express.Router();

const authController = require('../controllers/authcontroller');
const { validateSignup} = require('../middleware/validation');
const { validateLogin } = require('../middleware/validation');

router.post('/register', validateSignup, authController.register);
router.post('/login', validateLogin, authController.login);


module.exports = router;
