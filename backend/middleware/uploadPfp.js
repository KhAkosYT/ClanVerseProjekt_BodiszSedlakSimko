const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }
    else{
        return cb('Csak kép fájlokat lehet feltölteni! (jpeg, jpg, png)');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, //1MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

module.exports = upload;