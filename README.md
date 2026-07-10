# Mini Academy API

RESTful API quản lý khóa học e-learning, xây dựng từ cơ bản đến nâng cao với Node.js + Express + MongoDB.

## Công nghệ sử dụng

- **Node.js** + **Express** (framework)
- **MongoDB** + **Mongoose** (database)
- **JWT** (xác thực)
- **Multer** (upload file)
- **Jest** + **Supertest** + **MongoMemoryServer** (testing)

## Cài đặt

```bash
git clone https://github.com/lhuyhoang/mini-academy-api.git
cd mini-academy-api
npm install
```

Tạo file `.env` từ `.env.example` và cập nhật thông tin:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/mini-academy
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## Chạy project

```bash
# Development (có nodemon)
npm run dev

# Production
npm start
```

## Chạy test

```bash
npm test
```

## Tài khoản Admin mặc định

Tự động tạo khi server chạy lần đầu:

- Email: `admin@academy.com`
- Password: `Admin@123123`

## Danh sách API

### Auth

| Method | Endpoint | Mô tả | Xác thực |
|--------|----------|-------|----------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập, trả về JWT token | ❌ |

**Request body register:**
```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "User@123"
}
```

**Request body login:**
```json
{
  "email": "admin@academy.com",
  "password": "Admin@123123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": { "user": { ... } }
}
```

### Courses

| Method | Endpoint | Mô tả | Xác thực |
|--------|----------|-------|----------|
| GET | `/api/courses` | Lấy danh sách khóa học | ❌ |
| GET | `/api/courses/:id` | Lấy chi tiết khóa học | ❌ |
| POST | `/api/courses` | Tạo khóa học mới | ✅ Admin |
| PUT | `/api/courses/:id` | Cập nhật khóa học | ✅ Admin |
| DELETE | `/api/courses/:id` | Xóa khóa học | ✅ Admin |

**Request body POST/PUT:**
```json
{
  "title": "Node.js co ban",
  "description": "Khoa hoc Node.js cho nguoi moi bat dau",
  "price": 29.99,
  "instructor": "Nguyen Van A"
}
```

### Query params cho GET /api/courses

| Param | Ví dụ | Mô tả |
|-------|-------|-------|
| `search` | `?search=node` | Tìm kiếm theo title/description |
| `price[gte]` | `?price[gte]=20` | Lọc price >= 20 |
| `price[lte]` | `?price[lte]=50` | Lọc price <= 50 |
| `instructor` | `?instructor=Nguyen` | Lọc theo instructor |
| `sort` | `?sort=price` hoặc `?sort=-price` | Sắp xếp tăng/giảm dần |
| `page` | `?page=1` | Số trang |
| `limit` | `?limit=10` | Số kết quả mỗi trang |

Ví dụ: `GET /api/courses?search=node&price[gte]=20&page=1&limit=5&sort=-price`

### Upload thumbnail

Gửi request dạng `multipart/form-data` đến POST/PUT `/api/courses` với field `thumbnail` chọn file ảnh (hỗ trợ jpeg, png, gif, webp, tối đa 5MB).

## Cấu trúc thư mục

```
mini-academy-api/
├── __tests__/
│   └── course.test.js
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── courseController.js
├── middleware/
│   ├── auth.js
│   ├── logger.js
│   ├── upload.js
│   └── validate.js
├── models/
│   ├── Course.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── courseRoutes.js
├── utils/
│   ├── AppError.js
│   ├── fileHandler.js
│   └── seedAdmin.js
├── .env
├── package.json
├── Procfile
├── server.js
└── README.md
```

## Deploy

API đang chạy tại: [https://mini-academy-api-h5w9.onrender.com](https://mini-academy-api-h5w9.onrender.com)

