import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    createLeaveRequest,
    getMyRequests,
    updateLeaveRequest,
    cancelLeaveRequest
} from '../controllers/leaveController.js';

const router = express.Router();

// protect all routes
router.use(authMiddleware);

router.post('/', createLeaveRequest);
router.get('/', getMyRequests);
router.put('/:id', updateLeaveRequest);
router.put('/:id/cancel', cancelLeaveRequest);

export default router;
