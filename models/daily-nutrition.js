const mongoose = require('mongoose');
const nutritionSchema = require('../utils/nutritionSchema');

const Schema = mongoose.Schema;

const dailyNutritionSchema = new Schema({
    day: { type: Date, required: true },
    nutrition: nutritionSchema,
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('DailyNutrition', dailyNutritionSchema);