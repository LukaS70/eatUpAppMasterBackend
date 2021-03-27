const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller');

const router = express.Router();

router.get('/:uid', usersControllers.getUserData);

router.post(
    '/signup',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 }),
        check('firstName').not().isEmpty(),
        check('lastName').not().isEmpty(),
        check('gender').not().isEmpty(),
        check('dateOfBirth').not().isEmpty(),
        check('height').isNumeric(),
        check('weight').isNumeric(),
        check('maxCalories').isNumeric()
    ],
    usersControllers.signup);

router.post('/login', usersControllers.login);

module.exports = router;