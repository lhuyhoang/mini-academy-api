const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const signToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('Email đã được sử dụng', 400);
        }

        // Tạo user mới
        const newUser = await User.create({
            name,
            email,
            password
        });

        // Tạo token
        const token = signToken(newUser._id);

        // Remove password từ response
        newUser.password = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email và password
        if (!email || !password) {
            throw new AppError('Vui lòng nhập email và mật khẩu', 400);
        }

        // Tìm user và lấy cả password (vì select: false)
        const user = await User.findOne({ email }).select('+password');

        // Kiểm tra user tồn tại
        if (!user) {
            throw new AppError('Email hoặc mật khẩu không đúng', 401);
        }

        // Kiểm tra password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new AppError('Email hoặc mật khẩu không đúng', 401);
        }

        const token = signToken(user._id);
        // Remove password từ response
        user.password = undefined;

        res.json({
            status: 'success',
            token,
            data: {
                user: user
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };