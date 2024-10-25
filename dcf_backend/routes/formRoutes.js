import express from 'express';
import { submitForm, getAllSubmissions } from '../controllers/formController.js';
import upload from '../middleware/multerMiddleware.js';

const router = express.Router();

router.post('/submit-form', upload.fields ([
    {
        name: 'question_1', maxCount: 1
    },
    {
        name: 'question_2', maxCount: 1
    },
    {
        name: 'question_3', maxCount: 1
    },
    {
        name: 'question_4', maxCount: 1
    },
    {
        name: 'question_5', maxCount: 1
    },
    {
        name: 'question_6', maxCount: 1
    },
    {
        name: 'question_7', maxCount: 1
    },
    {
        name: 'question_8', maxCount: 1
    },
    {
        name: 'question_9', maxCount: 1
    },
    {
        name: 'question_10', maxCount: 1
    },
    {
        name: 'question_11', maxCount: 1
    },
]), submitForm);
router.get('/submissions', getAllSubmissions);

export default router;
