const Quiz = require('../models/quizModel');
const Question = require('../models/questionModel');
const QuizAttempt = require('../models/quizAttemptModel');
const Course = require('../models/courseModel');
const Certificate = require('../models/certificateModel');
const certificateGenerator = require('../utils/certificateGenerator');

exports.getQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;

        const quiz = await Quiz.findOne({
            where: { course_id: courseId },
            include: [{
                model: Question,
                as: 'questions',
                attributes: ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'points']
            }]
        });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found for this course' });
        }

        res.status(200).json({ quiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.submitQuizAttempt = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body;
        const user_id = req.user.id;

        const quiz = await Quiz.findByPk(quizId, {
            include: [
                { model: Question, as: 'questions' },
                { model: Course, as: 'course' }
            ]
        });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const previousAttempts = await QuizAttempt.count({
            where: { user_id, quiz_id: quizId }
        });

        if (previousAttempts >= quiz.max_attempts) {
            return res.status(400).json({ message: 'Maximum attempts reached' });
        }

        let correctAnswers = 0;
        const totalQuestions = quiz.questions.length;

        quiz.questions.forEach(question => {
            if (answers[question.id] === question.correct_answer) {
                correctAnswers++;
            }
        });

        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = score >= quiz.course.passing_score;

        const attempt = await QuizAttempt.create({
            user_id,
            quiz_id: quizId,
            score,
            total_questions: totalQuestions,
            correct_answers: correctAnswers,
            answers,
            passed
        });

        if (passed) {
            const existingCertificate = await Certificate.findOne({
                where: { user_id, course_id: quiz.course_id }
            });

            if (!existingCertificate) {
                const pdfData = await certificateGenerator.generateCertificate({
                    userName: `${req.user.first_name || 'User'} ${req.user.last_name || ''}`.trim(),
                    courseTitle: quiz.course.title,
                    score,
                    issueDate: new Date()
                });

                await Certificate.create({
                    certificate_id: pdfData.certificateId,
                    user_id,
                    course_id: quiz.course_id,
                    quiz_attempt_id: attempt.id,
                    user_name: `${req.user.first_name || 'User'} ${req.user.last_name || ''}`.trim(),
                    course_title: quiz.course.title,
                    score,
                    pdf_path: pdfData.filePath
                });
            }
        }

        res.status(201).json({
            message: passed ? 'Quiz passed! Certificate generated.' : 'Quiz completed.',
            attempt: {
                score,
                passed,
                correctAnswers,
                totalQuestions
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMyAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Quiz,
                as: 'quiz',
                include: [{ model: Course, as: 'course' }]
            }],
            order: [['attempted_at', 'DESC']]
        });

        res.status(200).json({ attempts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
