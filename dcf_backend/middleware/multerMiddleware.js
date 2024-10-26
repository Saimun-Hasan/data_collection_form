// multerMiddleware.js
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp3|wav)$/)) {
            return cb(new Error('Please upload an audio file (.mp3 or .wav)'));
        }
        cb(null, true);
    }
});

export default upload;
