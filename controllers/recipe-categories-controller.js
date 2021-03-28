const HttpError = require('../models/http-error');
const RecipeCategory = require('../models/recipe-category');

const getRecipeCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await RecipeCategory.find();
    } catch (err) {
        const error = new HttpError('Fetching recipe categories faild, please try again later', 500);
        return next(error);
    }
    res.status(201).json({ recipeCategories: categories.map(category => category.toObject({ getters: true })) });
}

/* const createRecipeCategories = async (req, res, next) => {
    const { name, displayName } = req.body;

    const createdCategory = new RecipeCategory({
        name: name,
        displayName: displayName
    });

    try {
        await createdCategory.save();
    } catch (err) {
        const error = new HttpError('Err', 500);
        return next(error);
    }

    res.json({ message: 'category added' })
}

exports.createRecipeCategories = createRecipeCategories; */
exports.getRecipeCategories = getRecipeCategories;