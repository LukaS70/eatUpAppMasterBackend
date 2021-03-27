const getMeasurementUnits = async (req, res, next) => {
    console.log('getMeasurementUnits');
    res.json({ message: 'getMeasurementUnits' })
}

exports.getMeasurementUnits = getMeasurementUnits;