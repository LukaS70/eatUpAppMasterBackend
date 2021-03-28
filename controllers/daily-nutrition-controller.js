const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const DailyNutrition = require('../models/daily-nutrition');
const User = require('../models/user');

const getDailyNutritionByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let user;
    try {
        user = await User.findById(userId).populate('dailyNutrition');
    } catch (err) {
        const error = new HttpError('Fetching daily nutrition failed, please try again later', 500);
        return next(error);
    }

    if (userId !== req.userData.userId) {
        return next(new HttpError('Unauthorized', 404));
    }

    if (!user || user.dailyNutrition.length === 0) {
        const error = new HttpError('Could not find daily nutrition data for provided user id.', 500);
        return next(error);
    }

    res.json({ dailyNutrition: user.dailyNutrition.map(dn => dn.toObject({ getters: true })) });
}

const addDailyNutrition = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { nutrition } = req.body;

    let user;
    try {
        user = await User.findById(req.userData.userId).populate('dailyNutrition');
    } catch (err) {
        const error = new HttpError('Adding to daily nutrition failed, please try again later', 500);
        return next(error);
    }

    if (!user) {
        return next(new HttpError('Could not find a user for the provided user id.', 404));
    }

    let maxDate = null;
    let objLatest = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.dailyNutrition && user.dailyNutrition.length !== 0) {
        maxDate = new Date(Math.max.apply(Math, user.dailyNutrition.map((o) => new Date(o.day)))); // proveriti da l radi
        objLatest = user.dailyNutrition.find((o) => new Date(o.day).getTime() === maxDate.getTime());
        maxDate.setHours(0, 0, 0, 0);
    }

    if (maxDate && objLatest && maxDate.getTime() === today.getTime()) {
        objLatest.nutrition.calories = Math.round((objLatest.nutrition.calories + nutrition.calories + Number.EPSILON) * 100) / 100;
        objLatest.nutrition.totalFats = Math.round((objLatest.nutrition.totalFats + nutrition.totalFats + Number.EPSILON) * 100) / 100;
        objLatest.nutrition.saturatedFats = Math.round((objLatest.nutrition.saturatedFats + nutrition.saturatedFats + Number.EPSILON) * 100) / 100;
        objLatest.nutrition.totalCarbohydrates = Math.round((objLatest.nutrition.totalCarbohydrates + nutrition.totalCarbohydrates + Number.EPSILON) * 100) / 100;
        objLatest.nutrition.sugar = Math.round((objLatest.nutrition.sugar + nutrition.sugar + Number.EPSILON) * 100) / 100;
        objLatest.nutrition.proteine = Math.round((objLatest.nutrition.proteine + nutrition.proteine + Number.EPSILON) * 100) / 100;
        try {
            await objLatest.save();
        } catch (err) {
            const error = new HttpError('Adding to daily nutrition failed, please try again later', 500);
            return next(error);
        }
    } else {
        let createdDailyNutrition = new DailyNutrition({
            day: today,
            nutrition: nutrition,
            creator: req.userData.userId
        });

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await createdDailyNutrition.save({ session: sess });
            user.dailyNutrition.push(createdDailyNutrition);
            await user.save({ session: sess });
            await sess.commitTransaction();
        } catch (err) {
            const error = new HttpError('Adding to daily nutrition failed, please try again later', 500);
            return next(error);
        }
    }
    res.status(201).json({ message: 'Daily nutrition added.' });
}

exports.getDailyNutritionByUserId = getDailyNutritionByUserId;
exports.addDailyNutrition = addDailyNutrition;