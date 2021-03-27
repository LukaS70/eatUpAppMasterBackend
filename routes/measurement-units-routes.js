const express = require('express');

const measurementUnitsController = require('../controllers/measurement-units-controller');

const router = express.Router();


router.get('/', measurementUnitsController.getMeasurementUnits);

module.exports = router;