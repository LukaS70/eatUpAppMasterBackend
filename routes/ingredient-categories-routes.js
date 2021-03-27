const express = require('express');

const ingredientCategoriesController = require('../controllers/ingredient-categories-controller');

const router = express.Router();


router.get('/', ingredientCategoriesController.getIngredientCategories);

module.exports = router;