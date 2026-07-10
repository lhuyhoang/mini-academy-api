const logger = (req, res, next) => {
    const timestamp = new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    console.log(`[${req.method}] ${req.originalUrl} - ${timestamp}`);
    next();
};

module.exports = logger;

