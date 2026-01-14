const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { auth } = require('../middleware/authMiddleware');

router.get('/course/:courseId', auth, quizController.getQuiz);
router.post('/:quizId/attempt', auth, quizController.submitQuizAttempt);
router.get('/attempts/my', auth, quizController.getMyAttempts);

module.exports = router;
