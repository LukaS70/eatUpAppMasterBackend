const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.post(
    '/signup',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 }),
        check('firstName').not().isEmpty(),
        check('lastName').not().isEmpty(),
        check('gender').not().isEmpty(),
        check('dateOfBirth').not().isEmpty(),
        check('height').isFloat({ min: 0 }),
        check('weight').isFloat({ min: 0 }),
        check('maxCalories').isFloat({ min: 0 })
    ],
    usersControllers.signup);

router.post('/login', usersControllers.login);

router.use(checkAuth);

router.get('/:uid', usersControllers.getUserData);

module.exports = router;