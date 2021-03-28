const HttpError = require('../models/http-error');
const MeasurementUnit = require('../models/measurement-unit');

const getMeasurementUnits = async (req, res, next) => {
    let units;
    try {
        units = await MeasurementUnit.find();
    } catch (err) {
        const error = new HttpError('Fetching measurement units faild, please try again later', 500);
        return next(error);
    }
    res.status(201).json({ measurementUnits: units.map(unit => unit.toObject({ getters: true })) });
}

exports.getMeasurementUnits = getMeasurementUnits;