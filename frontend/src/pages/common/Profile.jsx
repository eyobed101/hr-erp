import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Divider,
    Alert,
    CircularProgress,
    MenuItem,
    IconButton,
    Snackbar
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Home as HomeIcon,
    Work as WorkIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    Cancel as CancelIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { profileAPI } from '../../services/api';

const Profile = () => {
    const user = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [profileExists, setProfileExists] = useState(false);

    const [formData, setFormData] = useState({
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        profile_picture_url: '',
        bio: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await profileAPI.getProfile();
            const profileData = response.data;
            if (profileData) {
                setFormData({
                    date_of_birth: profileData.date_of_birth || '',
                    gender: profileData.gender || '',
                    address: profileData.address || '',
                    city: profileData.city || '',
                    state: profileData.state || '',
                    country: profileData.country || '',
                    postal_code: profileData.postal_code || '',
                    emergency_contact_name: profileData.emergency_contact_name || '',
                    emergency_contact_phone: profileData.emergency_contact_phone || '',
                    emergency_contact_relationship: profileData.emergency_contact_relationship || '',
                    profile_picture_url: profileData.profile_picture_url || '',
                    bio: profileData.bio || ''
                });
                setProfileExists(true);
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching profile:", err);
            if (err.response?.status === 404) {
                setProfileExists(false);
            } else {
                setError("Failed to load profile data.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (profileExists) {
                await profileAPI.updateProfile(formData);
            } else {
                await profileAPI.createProfile(formData);
                setProfileExists(true);
            }
            setSuccess(true);
            setEditMode(false);
            setError(null);
        } catch (err) {
            console.error("Error saving profile:", err);
            setError("Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                {/* Header/Cover Area */}
                <Box sx={{
                    height: 160,
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    position: 'relative'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        bottom: -50,
                        left: 40,
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 2
                    }}>
                        <Avatar
                            src={formData.profile_picture_url}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid white',
                                boxShadow: 3,
                                bgcolor: 'primary.main',
                                fontSize: '3rem'
                            }}
                        >
                            {user?.first_name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="h4" fontWeight="bold" color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                {user?.first_name} {user?.last_name}
                            </Typography>
                            <Typography variant="subtitle1" color="rgba(255,255,255,0.8)">
                                {user?.role?.toUpperCase()}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: 10, right: 20 }}>
                        {!editMode ? (
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() => setEditMode(true)}
                                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                    setEditMode(false);
                                    fetchProfile();
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </Box>
                </Box>

                <Box sx={{ mt: 8, p: 4 }}>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            {/* Basic Information */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                                    <PersonIcon color="primary" /> Basic Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            value={user?.email || ''}
                                            disabled
                                            InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Date of Birth"
                                            name="date_of_birth"
                                            type="date"
                                            value={formData.date_of_birth}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            placeholder="Tell us a little about yourself..."
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Contact Information */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                                    <HomeIcon color="primary" /> Contact Details
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="State"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            fullWidth
                                            label="Postal Code"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Emergency Contact */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                                    <SecurityIcon color="primary" /> Emergency Contact
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            fullWidth
                                            label="Contact Name"
                                            name="emergency_contact_name"
                                            value={formData.emergency_contact_name}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="emergency_contact_phone"
                                            value={formData.emergency_contact_phone}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Relationship"
                                            name="emergency_contact_relationship"
                                            value={formData.emergency_contact_relationship}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {editMode && (
                                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={saving}
                                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
                                        }}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Box>
            </Paper>

            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Profile updated successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;
