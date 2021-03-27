const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nutritionSchema = new Schema({
    calories: { type: Number, required: true, min: 0 },
    totalFats: { type: Number, required: true, min: 0 },
    saturatedFats: { type: Number, required: true, min: 0 },
    totalCarbohydrates: { type: Number, required: true, min: 0 },
    sugar: { type: Number, required: true, min: 0 },
    proteine: { type: Number, required: true, min: 0 }
});

module.exports = nutritionSchema;