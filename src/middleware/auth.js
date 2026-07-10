const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token) {
            throw new AppError("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Tìm user theo ID từ token
        const user = await User.findById(decoded.id).select("-password");
        // Nếu không tìm thấy user, trả về lỗi
        if(!user) {
            throw new AppError("Người dùng không tồn tại. Vui lòng đăng nhập lại.", 401);
        }

        req.user = user; // Gắn thông tin user vào req để sử dụng ở các middleware tiếp theo
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            next(new AppError("Token không hợp lệ. Vui lòng đăng nhập lại.", 401));
        } else if (error.name === "TokenExpiredError") {
            next(new AppError("Token đã hết hạn. Vui lòng đăng nhập lại.", 401));
        } else {
            next(error);
        }
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Bạn không có quyền thực hiện hành động này', 403));
        }
        next();
    };
};

module.exports = { protect, authorize };

