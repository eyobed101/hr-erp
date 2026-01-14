const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthUser = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const { email, password, role, first_name, last_name, phone } = req.body;
        const requestingUserRole = req.user.role;

        const allowedRoles = {
            admin: ['admin', 'hr', 'manager', 'employee'],
            hr: ['manager', 'employee'],
            manager: ['employee'],
            employee: []
        };

        if (!allowedRoles[requestingUserRole].includes(role)) {
            return res.status(403).json({ message: 'Access denied: Insufficient privileges to create this role.' });
        }

        const existingUser = await AuthUser.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await AuthUser.create({
            email,
            password_hash,
            role,
            first_name,
            last_name,
            phone
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser.id
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await AuthUser.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        await user.update({ last_login: new Date() });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
