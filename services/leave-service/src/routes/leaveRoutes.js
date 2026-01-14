import express from 'express';
import { getAllPendingLeaveRequests } from '../controllers/leaveController.js';
//import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getAllPending', getAllPendingLeaveRequests);

// router.post('/', createLeaveRequest);
// router.get('/', getMyRequests);
// router.put('/:id', updateLeaveRequest);
// router.put('/:id/cancel', cancelLeaveRequest);
// router.put("/getAllPending", getAllPendingLeaveRequests)
// router.put("/", (req, res)=>{ return "Hello There!"; })
export default router;
