const mongoose = require('mongoose');
const nutritionSchema = require('../utils/nutritionSchema');

const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    /* calories: { type: Number, required: true, min: 0 },
    totalFats: { type: Number, required: true, min: 0 },
    saturatedFats: { type: Number, required: true, min: 0 },
    totalCarbohydrates: { type: Number, required: true, min: 0 },
    sugar: { type: Number, required: true, min: 0 },
    proteine: { type: Number, required: true, min: 0 }, */
    nutrition: nutritionSchema,
    public: { type: Boolean, required: true },
    reviewRequested: { type: Boolean, required: true },
    measurementUnit: { type: mongoose.Types.ObjectId, required: true, ref: 'MeasurementUnit' },
    category: { type: mongoose.Types.ObjectId, required: true, ref: 'IngredientCategory' },
    recipes: [{type: mongoose.Types.ObjectId, required: true, ref: 'Recipe'}],
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);