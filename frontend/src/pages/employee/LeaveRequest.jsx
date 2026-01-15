import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Common leave types (you can fetch these from backend later if needed)
const leaveTypes = [
  { value: 'Annual Leave', label: 'Annual Leave' },
  { value: 'Sick Leave', label: 'Sick Leave' },
  { value: 'Maternity Leave', label: 'Maternity Leave' },
  { value: 'Paternity Leave', label: 'Paternity Leave' },
  { value: 'Unpaid Leave', label: 'Unpaid Leave' },
  { value: 'Compassionate Leave', label: 'Compassionate Leave' },
];

function LeaveRequestForm() {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Basic validation
    if (!formData.leaveType || !formData.startDate || !formData.endDate) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }

    if (dayjs(formData.startDate).isAfter(dayjs(formData.endDate))) {
      setError('End date must be after start date.');
      setLoading(false);
      return;
    }

    // Simulate API call (replace with real axios.post to your leave-service)
    try {
      // Example: await axios.post('/api/leave-requests', {
      //   leave_type: formData.leaveType,
      //   start_date: formData.startDate.format('YYYY-MM-DD'),
      //   end_date: formData.endDate.format('YYYY-MM-DD'),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake delay

      setSuccess(true);
      setFormData({
        leaveType: '',
        startDate: null,
        endDate: null,
      });
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Submit Leave Request
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Leave request submitted successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            select
            fullWidth
            label="Leave Type"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
          >
            {leaveTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mt: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(newValue) => handleDateChange('startDate', newValue)}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    margin: 'normal',
                  },
                }}
              />

              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newValue) => handleDateChange('endDate', newValue)}
                minDate={formData.startDate || dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    margin: 'normal',
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 4, py: 1.5 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LeaveRequestForm;
