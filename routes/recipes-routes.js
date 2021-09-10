const express = require('express');
const { check } = require('express-validator');

const recipesController = require('../controllers/recipes-controller');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();


router.get('/', recipesController.getRecipes);

router.get('/single/:rid', recipesController.getRecipeById);

router.use(checkAuth);

router.get('/my-recipes', recipesController.getMyRecipes);

router.get('/admin', recipesController.getAdminRecipes);

router.post(
    '/upload',
    fileUpload.single('image'),
    recipesController.uploadRecipeImage
);

router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('instructions').not().isEmpty(),
        check('image').not().isEmpty(),
        check('ingredients').isArray({ min: 1 }),
        check('ingredients.*.amount').isFloat({ min: 0 }),
        check('ingredients.*.ingredient').not().isEmpty(),
        check('reviewRequested').isBoolean(),
        check('category').not().isEmpty()
    ],
    recipesController.createRecipe
);

router.patch(
    '/:rid',
    [
        check('name').not().isEmpty(),
        check('instructions').not().isEmpty(),
        check('image').not().isEmpty(),
        check('ingredients').isArray({ min: 1 }),
        check('ingredients.*.amount').isFloat({ min: 0 }),
        check('ingredients.*.ingredient').not().isEmpty(),
        check('reviewRequested').isBoolean(),
        check('category').not().isEmpty()
    ],
    recipesController.updateRecipe
);

router.patch('/make-public/:rid', recipesController.makeRecipePublic);
router.patch('/unmake-public/:rid', recipesController.unmakeRecipePublic);

router.delete('/:rid', recipesController.deleteRecipe);

module.exports = router;