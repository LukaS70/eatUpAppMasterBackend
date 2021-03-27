const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const recipeCategorySchema = new Schema({
    name: { type: String, required: true, unique: true  },
    displayName: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('RecipeCategory', recipeCategorySchema);