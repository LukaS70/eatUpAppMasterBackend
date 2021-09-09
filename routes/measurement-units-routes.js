const express = require('express');
const { check } = require('express-validator');

const measurementUnitsController = require('../controllers/measurement-units-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.get('/', measurementUnitsController.getMeasurementUnits);

router.use(checkAuth);

router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('displayName').not().isEmpty(),
        check('perName').not().isEmpty()
    ],
    measurementUnitsController.createMeasurementUnit
);

router.patch(
    '/:muid',
    [
        check('name').not().isEmpty(),
        check('displayName').not().isEmpty(),
        check('perName').not().isEmpty()
    ],
    measurementUnitsController.updateMeasurementUnit
);

router.delete('/:muid', measurementUnitsController.deleteMeasurementUnit);

module.exports = router;