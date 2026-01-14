import axios from 'axios';

const API_BASE_URL = 'http://localhost';

const createServiceInstance = (serviceName) => {
    const ports = {
        auth: 3000,
        employee: 3002,
        recruitment: 3003,
        leave: 3004,
        attendance: 3005,
        organization: 3006,
        training: 3007,
        benefits: 3008,
    };

    const instance = axios.create({
        baseURL: `${API_BASE_URL}:${ports[serviceName]}/api`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

const authService = createServiceInstance('auth');
const employeeService = createServiceInstance('employee');
const recruitmentService = createServiceInstance('recruitment');
const leaveService = createServiceInstance('leave');
const attendanceService = createServiceInstance('attendance');
const organizationService = createServiceInstance('organization');
const trainingService = createServiceInstance('training');
const benefitsService = createServiceInstance('benefits');

export const authAPI = {
    login: (credentials) => authService.post('/auth/login', credentials),
    register: (userData) => authService.post('/auth/register', userData),
    validateToken: () => authService.post('/auth/validate'),
    getUsers: (params) => authService.get('/auth/users', { params }),
};

export const profileAPI = {
    getProfile: (userId) => authService.get(userId ? `/profile/${userId}` : '/profile/me'),
    createProfile: (profileData) => authService.post('/profile', profileData),
    updateProfile: (userId, profileData) => authService.put(`/profile/${userId}`, profileData),
    deleteProfile: (userId) => authService.delete(`/profile/${userId}`),
};

export const employeeAPI = {
    getEmployees: () => employeeService.get('/employees'),
    getEmployee: (id) => employeeService.get(`/employees/${id}`),
    createEmployee: (data) => employeeService.post('/employees', data),
    updateEmployee: (id, data) => employeeService.put(`/employees/${id}`, data),
    deleteEmployee: (id) => employeeService.delete(`/employees/${id}`),
};

export const recruitmentAPI = {
    getJobs: () => recruitmentService.get('/jobs'),
    getJob: (id) => recruitmentService.get(`/jobs/${id}`),
    applyJob: (id, data) => recruitmentService.post(`/jobs/${id}/apply`, data),
};

export const leaveAPI = {
    getLeaves: () => leaveService.get('/leaves'),
    getLeave: (id) => leaveService.get(`/leaves/${id}`),
    createLeave: (data) => leaveService.post('/leaves', data),
    updateLeave: (id, data) => leaveService.put(`/leaves/${id}`, data),
    approveLeave: (id) => leaveService.post(`/leaves/${id}/approve`),
    rejectLeave: (id) => leaveService.post(`/leaves/${id}/reject`),
};

export const attendanceAPI = {
    getAttendance: () => attendanceService.get('/attendance'),
    checkIn: () => attendanceService.post('/attendance/checkin'),
    checkOut: () => attendanceService.post('/attendance/checkout'),
};

export const organizationAPI = {
    getDepartments: () => organizationService.get('/departments'),
    getDepartment: (id) => organizationService.get(`/departments/${id}`),
    createDepartment: (data) => organizationService.post('/departments', data),
};

export const trainingAPI = {
    getCourses: (params) => trainingService.get('/courses', { params }),
    getCourse: (id) => trainingService.get(`/courses/${id}`),
    createCourse: (data) => trainingService.post('/courses', data),
    updateCourse: (id, data) => trainingService.put(`/courses/${id}`, data),
    deleteCourse: (id) => trainingService.delete(`/courses/${id}`),

    enrollCourse: (data) => trainingService.post('/enrollments', data),
    getMyEnrollments: () => trainingService.get('/enrollments/my'),
    getCourseProgress: (courseId) => trainingService.get(`/enrollments/${courseId}/progress`),

    getQuiz: (courseId) => trainingService.get(`/quizzes/course/${courseId}`),
    getAllQuizzes: () => trainingService.get('/quizzes'),
    createQuiz: (data) => trainingService.post('/quizzes', data),
    updateQuiz: (id, data) => trainingService.put(`/quizzes/${id}`, data),
    deleteQuiz: (id) => trainingService.delete(`/quizzes/${id}`),
    addQuestion: (quizId, data) => trainingService.post(`/quizzes/${quizId}/questions`, data),
    updateQuestion: (questionId, data) => trainingService.put(`/quizzes/actions/update-question/${questionId}`, data),
    deleteQuestion: (questionId) => trainingService.delete(`/quizzes/actions/delete-question/${questionId}`),

    submitQuiz: (quizId, data) => trainingService.post(`/quizzes/${quizId}/attempt`, data),



    getMyCertificates: () => trainingService.get('/certificates/my'),
    getAllCertificates: (params) => trainingService.get('/certificates', { params }),
    downloadCertificate: (id) => trainingService.get(`/certificates/${id}/download`, { responseType: 'blob' }),


    getSkills: () => trainingService.get('/skills'),
    getMySkillGaps: () => trainingService.get('/skills/gaps/my'),
    getRecommendedCourses: () => trainingService.get('/skills/recommendations'),
};

export const benefitsAPI = {
    getBenefits: () => benefitsService.get('/benefits'),
    getBenefit: (id) => benefitsService.get(`/benefits/${id}`),
    enrollBenefit: (id, data) => benefitsService.post(`/benefits/${id}/enroll`, data),
};

export default {
    auth: authService,
    employee: employeeService,
    recruitment: recruitmentService,
    leave: leaveService,
    attendance: attendanceService,
    organization: organizationService,
    training: trainingService,
    benefits: benefitsService,
};
