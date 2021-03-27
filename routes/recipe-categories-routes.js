const express = require('express');

const recipeCategoriesController = require('../controllers/recipe-categories-controller');

const router = express.Router();


router.get('/', recipeCategoriesController.getRecipeCategories);

module.exports = router;