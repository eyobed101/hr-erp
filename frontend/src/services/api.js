import axios from 'axios';

const SERVICE_PORTS = {
    auth: 3000,
    employee: 3001,
    recruitment: 3002,
    leave: 3004,
    attendance: 3005,
    organization: 3006,
    training: 3007,
    benefits: 3008,
};

const createServiceInstance = (serviceName) => {
    const instance = axios.create({
        baseURL: `http://localhost:${SERVICE_PORTS[serviceName]}/api/`,
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
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
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
    login: (credentials) => authService.post('auth/login', credentials),
    register: (userData) => authService.post('auth/register', userData),
    validateToken: () => authService.post('auth/validate'),
};

export const profileAPI = {
    getProfile: (userId) => authService.get(userId ? `profile/${userId}` : 'profile/me'),
    createProfile: (profileData) => authService.post('profile', profileData),
    updateProfile: (profileData) => authService.put('profile', profileData),
    deleteProfile: () => authService.delete('profile'),
};

export const employeeAPI = {
    getEmployees: (params) => employeeService.get('employees', { params }),
    getEmployee: (id) => employeeService.get(`employees/${id}`),
    createEmployee: (data) => employeeService.post('employees', data),
    updateEmployee: (id, data) => employeeService.put(`employees/${id}`, data),
    deleteEmployee: (id) => employeeService.delete(`employees/${id}`),
};

export const recruitmentAPI = {
    // Jobs
    getJobs: (params) => recruitmentService.get('recruitment/jobs', { params }),
    getJob: (id) => recruitmentService.get(`recruitment/jobs/${id}`),
    createJob: (data) => recruitmentService.post('recruitment/jobs', data),
    updateJob: (id, data) => recruitmentService.put(`recruitment/jobs/${id}`, data),
    deleteJob: (id) => recruitmentService.delete(`recruitment/jobs/${id}`),

    // Applications
    getApplications: (params) => recruitmentService.get('recruitment/applications', { params }),
    getApplication: (id) => recruitmentService.get(`recruitment/applications/${id}`),
    createApplication: (data) => recruitmentService.post('recruitment/applications', data),
    updateApplicationStage: (id, data) => recruitmentService.patch(`recruitment/applications/${id}/stage`, data),
};

export const leaveAPI = {
    getLeaves: (params) => leaveService.get('leaves', { params }),
    getLeave: (id) => leaveService.get(`leaves/${id}`),
    createLeave: (data) => leaveService.post('leaves', data),
    approveLeave: (id) => leaveService.put(`leaves/${id}/approve`),
    rejectLeave: (id) => leaveService.put(`leaves/${id}/reject`),
};

export const attendanceAPI = {
    getAttendance: (params) => attendanceService.get('attendance', { params }),
    clockIn: (data) => attendanceService.post('attendance/clock-in', data),
    clockOut: (data) => attendanceService.post('attendance/clock-out', data),
};

export const organizationAPI = {
    getStructure: () => organizationService.get('structure'),
    getDepartments: () => organizationService.get('departments'),
    createDepartment: (data) => organizationService.post('departments', data),
    updateDepartment: (id, data) => organizationService.put(`departments/${id}`, data),
};

export const trainingAPI = {
    getTrainings: (params) => trainingService.get('trainings', { params }),
    getTraining: (id) => trainingService.get(`trainings/${id}`),
    enrollTraining: (id) => trainingService.post(`trainings/${id}/enroll`),
};

export const benefitsAPI = {
    getBenefits: () => benefitsService.get('benefits'),
    getBenefit: (id) => benefitsService.get(`benefits/${id}`),
    enrollBenefit: (id, data) => benefitsService.post(`benefits/${id}/enroll`, data),
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
