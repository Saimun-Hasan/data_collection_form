import asyncHandler from 'express-async-handler';
import formModel from '../models/formModal.js';
import googleDriveService from '../utils/googleDriveService.js';
import Queue from 'better-queue'; // You'll need to install this package

// Create a queue for processing uploads
const uploadQueue = new Queue(async function (task, cb) {
  try {
    const { file, folderId, customName } = task;
    const result = await googleDriveService.uploadFile(file, folderId, customName);
    await formModel.updateFileLink(task.submissionId, task.questionField, result.webViewLink);
    cb(null, result);
  } catch (error) {
    console.error('Error in background upload:', error);
    cb(error);
  }
}, { concurrent: 2 });

// @desc    Register a new user with audio submission
// @route   POST /api/forms/submit-form
// @access  Public
/* const submitForm = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const existingUserByEmail = await formModel.findByEmail(email);
  if (existingUserByEmail) {
    return res.status(400).json({ message: 'Email already Submitted.' });
  }

  try {
    const userFolderId = await googleDriveService.createFolder(name);

    // Function to handle uploading files to Google Drive
    const uploadQuestionFile = async (fieldName, customName) => {
      if (req.files[fieldName] && req.files[fieldName][0]) {
        const { webViewLink } = await googleDriveService.uploadFile(req.files[fieldName][0], userFolderId, customName);
        return webViewLink;
      }
      return null;
    };

    // Upload files for each question
    const question_1_fileLink = await uploadQuestionFile('question_1', 'random_number.mp3');
    const question_2_fileLink = await uploadQuestionFile('question_2', '0.mp3');
    const question_3_fileLink = await uploadQuestionFile('question_3', '1.mp3');
    const question_4_fileLink = await uploadQuestionFile('question_4', '2.mp3');
    const question_5_fileLink = await uploadQuestionFile('question_5', '3.mp3');
    const question_6_fileLink = await uploadQuestionFile('question_6', '4.mp3');
    const question_7_fileLink = await uploadQuestionFile('question_7', '5.mp3');
    const question_8_fileLink = await uploadQuestionFile('question_8', '6.mp3');
    const question_9_fileLink = await uploadQuestionFile('question_9', '7.mp3');
    const question_10_fileLink = await uploadQuestionFile('question_10', '8.mp3');
    const question_11_fileLink = await uploadQuestionFile('question_11', '9.mp3');

    // Save the form submission with file links in the database
    const submission = await formModel.create(
      name, email, question_1_fileLink,
      question_2_fileLink, question_3_fileLink, question_4_fileLink,
      question_5_fileLink, question_6_fileLink, question_7_fileLink,
      question_8_fileLink, question_9_fileLink, question_10_fileLink,
      question_11_fileLink
    );

    if (submission) {
      res.status(201).json({
        id: submission.id,
        name: submission.name,
        email: submission.email,
        fileLinks: {
          question_1: question_1_fileLink,
          question_2: question_2_fileLink,
          question_3: question_3_fileLink,
          question_4: question_4_fileLink,
          question_5: question_5_fileLink,
          question_6: question_6_fileLink,
          question_7: question_7_fileLink,
          question_8: question_8_fileLink,
          question_9: question_9_fileLink,
          question_10: question_10_fileLink,
          question_11: question_11_fileLink,
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid Submission Data' });
    }

  } catch (error) {
    console.error('Error in form submission:', error);
    res.status(500).json({
      message: 'Error uploading file to Google Drive',
      error: error.message
    });
  }
}); */

const submitForm = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const existingUserByEmail = await formModel.findByEmail(email);
  if (existingUserByEmail) {
    return res.status(400).json({ message: 'Email already Submitted.' });
  }

  try {
    // Create user folder
    const userFolderId = await googleDriveService.createFolder(name);

    // Create initial submission record with pending status
    const submission = await formModel.create(
      name,
      email,
      null, null, null, null, null,
      null, null, null, null, null, null
    );

    // Queue up file uploads
    const questionFields = Array.from({ length: 11 }, (_, i) => `question_${i + 1}`);
    const customNames = ['random_number.mp3', '0.mp3', '1.mp3', '2.mp3', '3.mp3',
      '4.mp3', '5.mp3', '6.mp3', '7.mp3', '8.mp3', '9.mp3'];

    questionFields.forEach((fieldName, index) => {
      if (req.files[fieldName] && req.files[fieldName][0]) {
        uploadQueue.push({
          file: req.files[fieldName][0],
          folderId: userFolderId,
          customName: customNames[index],
          submissionId: submission.id,
          questionField: fieldName
        });
      }
    });

    // Immediately return success response
    res.status(201).json({
      id: submission.id,
      name: submission.name,
      email: submission.email,
      message: 'Form submitted successfully. Files are being processed in the background.',
      status: 'processing'
    });

  } catch (error) {
    console.error('Error in form submission:', error);
    res.status(500).json({
      message: 'Error processing submission',
      error: error.message
    });
  }
});

// @desc    Get all form submissions
// @route   GET /api/forms/submissions
// @access  Public
const getAllSubmissions = asyncHandler(async (req, res) => {
  const submissions = await formModel.getAllSubmissions();

  if (submissions.length === 0) {
    return res.status(404).json({ message: 'No form submissions found.' });
  }

  res.status(200).json(submissions);
});

export { submitForm, getAllSubmissions };
