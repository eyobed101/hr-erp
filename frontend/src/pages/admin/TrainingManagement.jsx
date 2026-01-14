import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { trainingAPI } from '../../services/api';

const TrainingManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCourses, setTotalCourses] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration_hours: 1,
        difficulty_level: 'beginner',
        passing_score: 70,
    });

    useEffect(() => {
        fetchCourses();
    }, [page, rowsPerPage, searchQuery, difficultyFilter]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await trainingAPI.getCourses({
                page: page + 1,
                limit: rowsPerPage,
                search: searchQuery,
                difficulty: difficultyFilter,
            });
            setCourses(response.data.courses);
            setTotalCourses(response.data.pagination.total);
        } catch (err) {
            setError('Failed to fetch courses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
        setError('');
        setSuccess('');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({
            title: '',
            description: '',
            duration_hours: 1,
            difficulty_level: 'beginner',
            passing_score: 70,
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await trainingAPI.createCourse(formData);
            setSuccess('Course created successfully!');
            setTimeout(() => {
                handleCloseModal();
                fetchCourses();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        }
    };

    const getDifficultyColor = (level) => {
        const colors = {
            beginner: 'success',
            intermediate: 'warning',
            advanced: 'error',
        };
        return colors[level] || 'default';
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Training Management</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Manage courses, quizzes, and certifications</p>
                </div>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    fullWidth
                    sx={{
                        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                        '&:hover': {
                            background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                        },
                        '@media (min-width: 640px)': {
                            width: 'auto',
                        },
                    }}
                >
                    Create Course
                </Button>
            </div>

            <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, mb: 2, p: { xs: 1.5, md: 2 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'stretch' }}>
                    <TextField
                        size="small"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(0);
                        }}
                        sx={{ flexGrow: 1 }}
                        InputProps={{
                            startAdornment: (
                                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Box>
                            ),
                        }}
                    />
                    <TextField
                        select
                        size="small"
                        label="Difficulty"
                        value={difficultyFilter}
                        onChange={(e) => {
                            setDifficultyFilter(e.target.value);
                            setPage(0);
                        }}
                        sx={{ minWidth: { xs: '100%', md: 150 } }}
                    >
                        <MenuItem value="">All Levels</MenuItem>
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                    </TextField>
                </Box>
            </Paper>

            <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: { xs: 650, md: 'auto' } }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Duration (hrs)</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Passing Score</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <p className="text-gray-500">No courses found. Create your first course!</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                courses.map((course) => (
                                    <TableRow key={course.id} hover>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{course.title}</p>
                                                <p className="text-xs text-gray-500">{course.description?.substring(0, 50)}...</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={course.difficulty_level}
                                                color={getDifficultyColor(course.difficulty_level)}
                                                size="small"
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell>{course.duration_hours}</TableCell>
                                        <TableCell>{course.passing_score}%</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={course.is_active ? 'Active' : 'Inactive'}
                                                color={course.is_active ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" color="primary">
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="primary">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCourses}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    <span className="text-2xl font-bold">Create New Course</span>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Course Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={3}
                                required
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Duration (hours)"
                                    name="duration_hours"
                                    type="number"
                                    value={formData.duration_hours}
                                    onChange={handleInputChange}
                                    required
                                    inputProps={{ min: 1 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Passing Score (%)"
                                    name="passing_score"
                                    type="number"
                                    value={formData.passing_score}
                                    onChange={handleInputChange}
                                    required
                                    inputProps={{ min: 0, max: 100 }}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                select
                                label="Difficulty Level"
                                name="difficulty_level"
                                value={formData.difficulty_level}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="beginner">Beginner</MenuItem>
                                <MenuItem value="intermediate">Intermediate</MenuItem>
                                <MenuItem value="advanced">Advanced</MenuItem>
                            </TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleCloseModal} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                                '&:hover': {
                                    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                                },
                            }}
                        >
                            Create Course
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default TrainingManagement;
