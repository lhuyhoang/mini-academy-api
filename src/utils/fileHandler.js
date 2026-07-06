const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, '..', 'courses.json');

//fs.promises (fs/promises) cho phép dùng await thay vì callback lồng nhau
const readCoursesFromFile = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`File ${DATA_FILE} không tồn tại.`);
        }
        throw new Error(`Lỗi khi đọc file ${DATA_FILE}: ${error.message}`);
    }
};

const writeCourses = async (courses) => {
    try {
        const jsonData = JSON.stringify(courses, null, 2);
        await fs.writeFile(DATA_FILE, jsonData, 'utf-8');
    } catch (error) {
        throw new Error(`Lỗi khi ghi file ${DATA_FILE}: ${error.message}`);
    }
};

module.exports = {
    readCoursesFromFile,
    writeCourses
};
