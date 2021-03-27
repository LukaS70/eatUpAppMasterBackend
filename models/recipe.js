const mongoose = require('mongoose');
const nutritionSchema = require('../utils/nutritionSchema');

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: { type: String, required: true },
    instructions: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: [{
        ingredient: { type: mongoose.Types.ObjectId, ref: 'Ingredient' },       // ???
        amount: { type: Number, required: true, min: 0 }
    }],
    /* calories: { type: Number, required: true, min: 0 },
    totalFats: { type: Number, required: true, min: 0 },
    saturatedFats: { type: Number, required: true, min: 0 },
    totalCarbohydrates: { type: Number, required: true, min: 0 },
    sugar: { type: Number, required: true, min: 0 },
    proteine: { type: Number, required: true, min: 0 }, */
    nutrition: nutritionSchema,
    public: { type: Boolean, required: true },
    reviewRequested: { type: Boolean, required: true },
    category: { type: mongoose.Types.ObjectId, required: true, ref: 'RecipeCategory' },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Recipe', recipeSchema);