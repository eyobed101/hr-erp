import { getAllPendingLeaveRequests, createLeaveRequest, getMyRequests, getEmployeesBalance } from '../controllers/leaveController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();
router.use(authMiddleware);

router.post('/', createLeaveRequest);
router.get('/api/leave/getAllPending', getAllPendingLeaveRequests);
router.get('/api/leave/getEmployeesBalance', getEmployeesBalance);

//router.get('/my', getMyRequests);
//router.get('/', getAllPendingLeaveRequests); // Mapping root GET to pending for now to match current usage
// router.post('/', createLeaveRequest);
// router.get('/', getMyRequests);
// router.put('/:id', updateLeaveRequest);
// router.put('/:id/cancel', cancelLeaveRequest);
// router.put("/getAllPending", getAllPendingLeaveRequests)
// router.put("/", (req, res)=>{ return "Hello There!"; })
export default router;
