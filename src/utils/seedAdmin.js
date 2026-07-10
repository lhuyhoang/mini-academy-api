const User = require('../models/User');

const seedAdmin = async () => {
    try{
        const adminExists = await User.findOne({ role: 'admin' });

        if(!adminExists) {
            const admin = await User.create({
                name: 'Admin',
                email: 'admin@academy.com',
                password: 'Admin@123123',
                role: 'admin'
            });

            console.log('- Tài khoản Admin đã được tạo thành công!');
            console.log(`- Email: ${admin.email}`);
            console.log(`- Password: Admin@123123`);
            console.log(`- Name: ${admin.name}`);
            console.log(`- Role: ${admin.role}`);
            console.log('- Hãy thay đổi mật khẩu ngay sau khi đăng nhập lần đầu tiên để bảo mật!');
        } else {
            console.log('- Tài khoản Admin đã tồn tại. Không cần tạo lại.');
            console.log(`- Email: ${adminExists.email}`);
        }
    } catch (error) {
        console.error('Tạo tài khoản Admin thất bại:', error);
    }
};

module.exports = seedAdmin;