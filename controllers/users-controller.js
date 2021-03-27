const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUserData = async (req, res, next) => {
    console.log('getUserData');
    res.json({ message: 'getUserData' })
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const { email, password, firstName, lastName, gender, dateOfBirth, height, weight, maxCalories } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Signing up faild, please try again later', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create user, please try again.', 500);
        return next(error);
    }

    const createdUser = new User({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        height: height,
        weight: weight,
        maxCalories: maxCalories,
        shoppingList: null,     // izmeni da pre nego sto se napravi user, da se napravi novi shopping list
        dailyNutrition: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again.', 500);
        console.log('here');
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            'dont_ever_share_this_private_key_11231',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token                //  token saljemo na front
    });
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Logging in faild, please try again later', 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('Invalid credentials, could not log you in.', 403);
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);        // compare metodom proveravamo plain text password sa hashovanim (existingUser.password)
    } catch (err) {
        const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials, could not log you in.', 403);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },       // pravimo token i u njega encodujemo userid i email npr
            'dont_ever_share_this_private_key_11231',                   // drugi argument je string koji je private key... NIKAD GA NE DELITI NIGDE, ON JE NA SERVERU SAMO 
            { expiresIn: '1h' }                                         // da istekne posle 1h
        );
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again.', 500);
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
}

exports.getUserData = getUserData;
exports.signup = signup;
exports.login = login;