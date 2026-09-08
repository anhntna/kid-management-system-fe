# 🌱 KidTimeline — Dòng Thời Gian Kỷ Niệm Của Bé

Ứng dụng web giúp ba mẹ lưu giữ, sắp xếp và ôn lại những khoảnh khắc đáng nhớ trong hành trình lớn lên của con yêu. Từ lần đầu tiên bé biết đi, những chuyến dã ngoại, sinh nhật, đến các cột mốc phát triển — tất cả được ghi lại trên một dòng thời gian trực quan và đẹp mắt.

---

## ✨ Tính năng nổi bật

- 👶 **Quản lý hồ sơ bé**: Tạo và quản lý nhiều hồ sơ bé (tên, ngày sinh, giới tính, ảnh đại diện)
- 📅 **Dòng thời gian**: Xem kỷ niệm được nhóm tự động theo Năm → Tháng
- 📝 **Ghi chép kỷ niệm**: Tiêu đề, nội dung mô tả, ngày diễn ra, cảm xúc, danh mục
- 🖼️ **Đa phương tiện**: Upload và đính kèm nhiều ảnh vào mỗi khoảnh khắc
- 🔍 **Tìm kiếm & Lọc**: Lọc theo danh mục, cảm xúc, từ khóa, yêu thích
- ❤️ **Đánh dấu yêu thích**: Ghim các khoảnh khắc đặc biệt
- 🔭 **Lightbox xem ảnh**: Xem ảnh toàn màn hình, duyệt qua lại trong bộ ảnh
- ✏️ **Sửa / Xóa**: Chỉnh sửa hoặc xóa kỷ niệm và hồ sơ bé

### 📂 Danh mục kỷ niệm

| Danh mục | Mô tả |
|----------|-------|
| `DAILY` | Đời thường |
| `FIRST_TIME` | Lần đầu tiên ✨ |
| `BIRTHDAY` | Sinh nhật 🎂 |
| `TRIP` | Dã ngoại / Du lịch ⛺ |
| `HEALTH` | Sức khỏe / Khám định kỳ 🏥 |
| `SCHOOL` | Đi học / Mầm non 🎒 |
| `MILESTONE` | Cột mốc phát triển 🏆 |

### 😄 Cảm xúc hỗ trợ

`HAPPY` · `PROUD` · `FUNNY` · `LOVING` · `AMAZED` · `PEACEFUL`

---

## 🏗️ Kiến trúc dự án

```
Child/
├── frontend/          # React + Vite (SPA)
└── backend/           # Spring Boot 3 (REST API, DDD Architecture)
```

### Backend — Domain-Driven Design (DDD)

```
backend/src/main/java/com/kidtimeline/
├── domain/
│   ├── model/
│   │   ├── child/         # Child, ChildAge, Gender
│   │   ├── moment/        # Moment, MomentCategory, Emotion
│   │   └── timeline/      # TimelineResult, YearGroup, MonthGroup
│   ├── repository/        # ChildRepository, MomentRepository, FileStoragePort (interfaces)
│   ├── service/           # TimelineDomainService
│   └── exception/         # Domain exceptions
├── application/
│   ├── service/           # ChildApplicationService, MomentApplicationService, TimelineApplicationService
│   └── dto/               # Request / Response DTOs
├── infrastructure/
│   ├── persistence/       # JPA Entities, Adapters, Mappers, Spring Data Repos
│   ├── storage/           # LocalFileStorageAdapter
│   └── config/            # WebConfig (CORS), DataInitializer
└── web/
    ├── controller/        # ChildController, MomentController, TimelineController, MediaController
    └── advice/            # GlobalExceptionHandler
```

### Frontend — React Components

```
frontend/src/
├── components/
│   ├── Navbar.jsx             # Thanh điều hướng
│   ├── ChildSelector.jsx      # Chọn hồ sơ bé
│   ├── ProfileBanner.jsx      # Banner thống kê hồ sơ bé
│   ├── FilterBar.jsx          # Thanh tìm kiếm & lọc
│   ├── Timeline.jsx           # Dòng thời gian chính
│   ├── MomentCard.jsx         # Card hiển thị kỷ niệm
│   ├── AddMomentModal.jsx     # Modal thêm / sửa kỷ niệm
│   ├── AddChildModal.jsx      # Modal thêm / sửa hồ sơ bé
│   └── ImageViewerModal.jsx   # Lightbox xem ảnh
├── services/
│   └── api.js                 # Tất cả API calls đến backend
├── App.jsx                    # Root component, state management
├── main.jsx                   # Entry point
└── index.css                  # Global styles
```

---

## 🚀 Hướng dẫn chạy local

### Yêu cầu

- **Java 17+**
- **Node.js 18+**
- **Maven** (hoặc dùng `mvnw` đã có sẵn)

### 1. Chạy Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend khởi động tại: `http://localhost:8080`

> **H2 Console** (xem database): `http://localhost:8080/h2-console`
> - JDBC URL: `jdbc:h2:file:./data/kidtimeline`
> - Username: `sa` | Password: _(để trống)_

### 2. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend khởi động tại: `http://localhost:5173`

> Vite tự động proxy `/api` và `/uploads` sang `http://localhost:8080` — không cần cấu hình gì thêm khi dev local.

---

## 🌐 API Endpoints

### Children — `/api/children`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/children` | Lấy danh sách tất cả bé |
| `GET` | `/api/children/{id}` | Lấy thông tin một bé |
| `POST` | `/api/children` | Tạo hồ sơ bé mới |
| `PUT` | `/api/children/{id}` | Cập nhật hồ sơ bé |
| `DELETE` | `/api/children/{id}` | Xóa hồ sơ bé (kèm toàn bộ kỷ niệm) |

### Moments — `/api/moments`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/moments` | Lấy danh sách kỷ niệm (hỗ trợ filter) |
| `GET` | `/api/moments/{id}` | Lấy chi tiết một kỷ niệm |
| `POST` | `/api/moments` | Tạo kỷ niệm mới |
| `PUT` | `/api/moments/{id}` | Cập nhật kỷ niệm |
| `PATCH` | `/api/moments/{id}/favorite` | Toggle yêu thích |
| `DELETE` | `/api/moments/{id}` | Xóa kỷ niệm |

**Query params cho `GET /api/moments`:**
- `childId` — lọc theo bé
- `category` — lọc theo danh mục
- `favorite` — `true` để chỉ lấy yêu thích
- `search` — tìm kiếm theo từ khóa

### Timeline — `/api/timeline`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/timeline` | Timeline của tất cả bé |
| `GET` | `/api/timeline/{childId}` | Timeline của một bé cụ thể |

### Media — `/api/media`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/media/upload` | Upload một ảnh (max 50MB) |
| `POST` | `/api/media/upload-multiple` | Upload nhiều ảnh cùng lúc |

---

## ⚙️ Cấu hình môi trường

### Frontend — `.env`

Tạo file `.env` trong thư mục `frontend/`:

```env
# URL backend API (chỉ cần khi deploy production)
VITE_API_BASE_URL=https://your-backend-url.com/api
```

> Khi dev local không cần đặt biến này — Vite proxy sẽ tự xử lý.

### Backend — `application.properties`

| Thuộc tính | Giá trị mặc định | Mô tả |
|-----------|-----------------|-------|
| `server.port` | `8080` | Cổng backend |
| `app.upload.dir` | `./uploads` | Thư mục lưu ảnh upload |
| `spring.servlet.multipart.max-file-size` | `50MB` | Giới hạn kích thước file |

---

## 🛠️ Tech Stack

### Frontend

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| React | 18.3 | UI Framework |
| Vite | 5.4 | Build tool & Dev server |
| Lucide React | 1.16 | Icon library |
| Vanilla CSS | — | Styling |

### Backend

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| Spring Boot | 3.3.3 | Application Framework |
| Spring Data JPA | — | ORM |
| H2 Database | — | Embedded database (file-based) |
| Spring Validation | — | Request validation |
| Java | 17 | Language |

---

## 📦 Build production

### Frontend

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Backend

```bash
cd backend
./mvnw clean package -DskipTests
# Output: backend/target/kidtimeline-backend-0.0.1-SNAPSHOT.jar
```

---

## 📄 License

Dự án cá nhân — lưu giữ kỷ niệm của bé yêu 💕