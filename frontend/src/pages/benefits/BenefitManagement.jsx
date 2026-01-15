import { useState, useEffect } from 'react';
import {
    Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, CircularProgress,
    Alert, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { benefitsAPI } from '../../services/api';

const BenefitManagement = () => {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    // State for Modal Control
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Updated Form Data for Benefits logic
    const [formData, setFormData] = useState({
        benefitName: '',
        benefitType: 'Health',
        amount: '',
        employeeId: '',
        isPermanent: false
    });

    const benefitTypes = ['Health', 'Gym', 'Pension', 'Wellness'];

    useEffect(() => {
        fetchBenefits();
    }, []);

    const fetchBenefits = async () => {
        try {
            setLoading(true);
            const response = await benefitsAPI.getBenefits();
            setBenefits(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch benefits data.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (benefit = null) => {
        if (benefit) {
            setIsEdit(true);
            setSelectedId(benefit.id);
            setFormData({
                benefitName: benefit.benefitName || '',
                benefitType: benefit.benefitType || 'Health',
                amount: benefit.amount || '',
                employeeId: benefit.employeeId || '',
                isPermanent: benefit.isPermanentEmployee || false
            });
        } else {
            setIsEdit(false);
            setSelectedId(null);
            setFormData({
                benefitName: '',
                benefitType: 'Health',
                amount: '',
                employeeId: '',
                isPermanent: false
            });
        }
        setOpenModal(true);
        setError('');
        setSuccess('');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this benefit record?')) {
            try {
                await benefitsAPI.deleteBenefit(id);
                fetchBenefits();
            } catch (err) {
                setError('Failed to delete benefit.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isEdit) {
                await benefitsAPI.updateBenefit(selectedId, formData);
                setSuccess('Benefit updated successfully!');
            } else {
                // This triggers the Rules Engine on the backend
                await benefitsAPI.createBenefit(formData);
                setSuccess('Benefit enrolled successfully!');
            }

            setTimeout(() => {
                handleCloseModal();
                fetchBenefits();
            }, 1200);
        } catch (err) {
            // Displays Rules Engine errors (e.g., Pension eligibility)
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredBenefits = benefits.filter(b =>
        b.benefitName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.employeeId?.toString().includes(searchQuery)
    );

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Perks & Benefits</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Manage employee enrollment and wellness plans</p>
                </div>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                    sx={{
                        background: 'linear-gradient(to right, #10b981, #3b82f6)',
                        px: 3, borderRadius: 2
                    }}
                >
                    Enroll Employee
                </Button>
            </div>

            <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, mb: 2, p: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by benefit name or employee ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Paper>

            <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Benefit Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Employee ID</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}><CircularProgress /></TableCell></TableRow>
                            ) : filteredBenefits.length === 0 ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}>No benefits found.</TableCell></TableRow>
                            ) : (
                                filteredBenefits
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((benefit) => (
                                        <TableRow key={benefit.id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{benefit.benefitName}</TableCell>
                                            <TableCell>{benefit.benefitType}</TableCell>
                                            <TableCell>${benefit.amount}</TableCell>
                                            <TableCell>ID: {benefit.employeeId}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" color="primary" onClick={() => handleOpenModal(benefit)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(benefit.id)}>
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
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredBenefits.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {isEdit ? 'Update Enrollment' : 'New Benefit Enrollment'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                fullWidth
                                label="Benefit Name"
                                value={formData.benefitName}
                                onChange={(e) => setFormData({ ...formData, benefitName: e.target.value })}
                                required
                            />
                            <TextField
                                select
                                fullWidth
                                label="Benefit Type"
                                value={formData.benefitType}
                                onChange={(e) => setFormData({ ...formData, benefitType: e.target.value })}
                                required
                            >
                                {benefitTypes.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                type="number"
                                label="Monthly Amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Employee ID"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                required
                                disabled={isEdit}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isPermanent}
                                        onChange={(e) => setFormData({ ...formData, isPermanent: e.target.checked })}
                                    />
                                }
                                label="Permanent Employee (Required for Pension)"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleCloseModal} color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(to right, #10b981, #3b82f6)' }}>
                            {isEdit ? 'Update' : 'Enroll'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default BenefitManagement;