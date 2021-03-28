const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const ShoppingList = require('../models/shopping-list');

const getUserData = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId, '-password').populate('dailyNutrition').populate('shoppingList');
    } catch (err) {
        const error = new HttpError('Fetching user data failed, please try again later', 500);
        return next(error);
    }

    if (userId !== req.userData.userId) {
        return next(new HttpError('Unauthorized', 404));
    }

    if (!user) {
        const error = new HttpError('User not found, please try again later', 500);
        return next(error);
    }

    res.status(201).json({ user: user.toObject({ getters: true }) });
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

    const createdShoppingList = new ShoppingList({
        item: [],
        creator: createdUser.id
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdShoppingList.save({ session: sess });
        createdUser.shoppingList = createdShoppingList.id;
        await createdUser.save({ session: sess });
        await sess.commitTransaction();
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
        token: token
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
        isValidPassword = await bcrypt.compare(password, existingUser.password);
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
            { userId: existingUser.id, email: existingUser.email },
            'dont_ever_share_this_private_key_11231',
            { expiresIn: '1h' }
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