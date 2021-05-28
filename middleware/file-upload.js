const multer = require('multer');
const { v4: uuid } = require('uuid');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const fileUpload = multer({         // ovo je middleware koji exsportujemo i mozemo da ga koristimo svuda
    limits: 500000,         // ogranicavamo na 500KB
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');     // pravimo ovaj folder u backend folderu kako bi u njemu cuvali fajlove
        },
        filename: (req, file, cb) => {
            console.log(file);
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + '.' + ext);               // dajemo ima fajlu sa generisanim id-jem + ekstenzija
        }
    }),
    fileFilter: (req, file, cb) => {        // dodajemo filter da bi prihvatali samo slike. Mora validacija na backendu jer front moze da se izmeni iz devtools
        const isValid = !!MIME_TYPE_MAP[file.mimetype];     // sa !! pretvaramo u true/false iz undefined..
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
});

module.exports = fileUpload;