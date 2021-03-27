const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const getDailyNutritionByUserId = async (req, res, next) => {
    console.log('getDailyNutritionByUserId');
    res.json({ message: 'getDailyNutritionByUserId' })
}

const createDailyNutrition = async (req, res, next) => {
    console.log('createDailyNutrition');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    res.json({ message: 'createDailyNutrition' })
}

const updateDailyNutrition = async (req, res, next) => {
    console.log('updateDailyNutrition');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    res.json({ message: 'updateDailyNutrition' })
}


exports.getDailyNutritionByUserId = getDailyNutritionByUserId;
exports.createDailyNutrition = createDailyNutrition;
exports.updateDailyNutrition = updateDailyNutrition;