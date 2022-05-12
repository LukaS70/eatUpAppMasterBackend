const fs = require('fs');   // za rad sa fajl sistemom
const path = require('path')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const recipesRoutes = require('./routes/recipes-routes');
const ingredientsRoutes = require('./routes/ingredients-routes');
const usersRoutes = require('./routes/users-routes');
const shoppingListRoutes = require('./routes/shopping-list-routes');
const recipeCategoriesRoutes = require('./routes/recipe-categories-routes');
const ingredientCategoriesRoutes = require('./routes/ingredient-categories-routes');
const measurementUnitsRoutes = require('./routes/measurement-units-routes');
const dailyNutritionRoutes = require('./routes/daily-nutrition-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requsted-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/recipes', recipesRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/recipe-categories', recipeCategoriesRoutes);
app.use('/api/ingredient-categories', ingredientCategoriesRoutes);
app.use('/api/measurement-units', measurementUnitsRoutes);
app.use('/api/daily-nutrition', dailyNutritionRoutes);

app.use((req, res, next) => {
    throw new HttpError('Could not find this route.', 404);
});

app.use((error, req, res, next) => {    // error handler middleware iz epress.js, ako se desi error negde, izvrsava se
    if (req.file) {                        // .file je property na req koji stavlja multer ukliko postoji fajl u requestu, ovaj if je ovde, da kad god da se desi error, ako smo uploadovali fajl, da rollbackujemo to
        fs.unlink(req.file.path, (err) => {     // brisemo fajl
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error ocured!' });
});

mongoose.connect('connectionString',{useNewUrlParser: true})
    .then(() => {
        app.listen(5000);
    })
    .catch((err) => {
        console.log(err);
    });
