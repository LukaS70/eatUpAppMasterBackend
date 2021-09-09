const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

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

const createMeasurementUnit = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, displayName, perName } = req.body;

    const createdMeasurementUnit = new MeasurementUnit({
        name: name,
        displayName: displayName,
        perName: perName
    });

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to add measurement units.', 401);
        return next(error);
    }

    try {
        await createdMeasurementUnit.save();
    } catch (err) {
        const error = new HttpError('Creating measurement unit failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ measurementUnit: createdMeasurementUnit });
}

const updateMeasurementUnit = async (req, res, next) => {        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, displayName, perName } = req.body;
    const measurementUnitId = req.params.muid;

    let measurementUnit;
    try {
        measurementUnit = await MeasurementUnit.findById(measurementUnitId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update measurement unit.', 500);
        return next(error);
    }

    if (!measurementUnit) {
        const error = new HttpError('Could not find an measurement unit for the provided id.', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to edit this measurement unit.', 401);
        return next(error);
    }

    measurementUnit.name = name;
    measurementUnit.displayName = displayName;
    measurementUnit.perName = perName;
    
    try {
        await measurementUnit.save();
    } catch (err) {
        const error = new HttpError('Could not update measurement unit.', 500);
        return next(error);
    }

    res.status(200).json({ measurementUnit: measurementUnit.toObject({ getters: true }) });
}

const deleteMeasurementUnit = async (req, res, next) => {                                 
    const measurementUnitId = req.params.muid;

    let measurementUnit;
    try {
        measurementUnit = await MeasurementUnit.findById(measurementUnitId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete measurement unit.', 500);
        return next(error);
    }

    if (!measurementUnit) {
        const error = new HttpError('Could not find measurement unit for provided id', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to delete this measurement unit.', 401);
        return next(error);
    }

    try {
        await measurementUnit.remove();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete measurement unit.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Measurement unit deleted.' });
}

exports.getMeasurementUnits = getMeasurementUnits;
exports.createMeasurementUnit = createMeasurementUnit;
exports.updateMeasurementUnit = updateMeasurementUnit;
exports.deleteMeasurementUnit = deleteMeasurementUnit;