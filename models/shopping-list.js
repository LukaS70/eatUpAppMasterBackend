const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shoppingListSchema = new Schema({
    items: [{
        ingredient: { type: mongoose.Types.ObjectId, ref: 'Ingredient' },       // ???
        amount: { type: Number, required: true, min: 0 },
        checked: { type: Boolean, required: true }
    }],
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);