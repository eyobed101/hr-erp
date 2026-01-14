import express from 'express';

const router = express.Router();

router.post('/leave', authController.login);
router.post('/leave_status', authController.register);

module.exports = router;
