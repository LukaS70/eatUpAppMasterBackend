const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    height: { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0 },
    maxCalories: { type: Number, required: true, min: 0 },
    shoppingList: { type: mongoose.Types.ObjectId, required: false, ref: 'ShoppingList' },
    dailyNutrition: [{ type: mongoose.Types.ObjectId, required: true, ref: 'DailyNutrition' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);