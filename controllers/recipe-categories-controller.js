const getRecipeCategories = async (req, res, next) => {
    console.log('getRecipeCategories');
    res.json({ message: 'getRecipeCategories' })
}

exports.getRecipeCategories = getRecipeCategories;