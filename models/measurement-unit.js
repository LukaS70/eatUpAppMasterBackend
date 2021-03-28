const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const measurementUnitSchema = new Schema({
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    perName: { type: String, required: true },
});

measurementUnitSchema.plugin(uniqueValidator);

module.exports = mongoose.model('MeasurementUnit', measurementUnitSchema);