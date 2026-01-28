const multer = require('multer');
const path = require('path');
const { Code500 } = require('../utils/statusCode');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/gameLogos/');
    },
    filename: (req, file, cb) => {
        const gameName = req.body.gameName ? req.body.gameName.replace(/\s+/g, '_').toLowerCase() : Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `${gameName}${extension}`);
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
        return cb(new Error('Csak kép fájlokat lehet feltölteni! (jpeg, jpg, png)'));
    }
}

const uploadGameLogo = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

module.exports = (req, res, next) => {
    uploadGameLogo.single('gameLogo')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: "A feltöltött fájl túl nagy! Kérlek válassz kisebb képet." });
            }
            if (err.message === 'Csak kép fájlokat lehet feltölteni! (jpeg, jpg, png)') {
                return res.status(400).json({ message: err.message });
            }
            return Code500(err, req, res, next);
        }
        next();
    });
};