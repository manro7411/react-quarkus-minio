## API Design

ระบบแบ่ง API ออกเป็น 2 กลุ่มหลัก:

1. **Public API** สำหรับ `user-portal`
2. **Admin API** สำหรับ `admin-portal`

---

## Public API สำหรับ User Portal

Public API ใช้สำหรับหน้าเว็บผู้ใช้ เช่น `panpan.n9ne.cc` เพื่อดึงข้อมูลที่จะแสดงบนหน้าเว็บ

Base URL ตัวอย่าง:

```text
http://api.n9ne.cc
Endpoints
Method	Endpoint	Description
GET	/public/site/panpan	ดึงข้อมูลรวมของ site เช่น title, subtitle, status
GET	/public/site/panpan/hero	ดึงข้อมูล Hero section
GET	/public/site/panpan/countdown	ดึงข้อมูล Countdown
GET	/public/site/panpan/memories	ดึงรายการ Memories
GET	/public/site/panpan/gallery	ดึงรายการรูปภาพ Gallery
GET	/public/site/panpan/love-letter	ดึงข้อมูล Love Letter
GET	/public/site/panpan/final-surprise	ดึงข้อมูล Final Surprise
Example Request
curl -i http://api.n9ne.cc/public/site/panpan
curl -i http://api.n9ne.cc/public/site/panpan/gallery
Admin API สำหรับ Admin Portal

Admin API ใช้สำหรับระบบหลังบ้าน เช่น admin.n9ne.cc เพื่อจัดการข้อมูลของ user portal

Base URL ตัวอย่าง:

http://api.n9ne.cc
Authentication
Method	Endpoint	Description
POST	/admin/auth/login	Login เข้าระบบ admin
Example Request
curl -i -X POST http://api.n9ne.cc/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@n9ne.cc",
    "password": "your-password"
  }'
Dashboard
Method	Endpoint	Description
GET	/admin/dashboard/stats	ดึงข้อมูลสถิติสำหรับ Dashboard
Gallery Management
Method	Endpoint	Description
GET	/admin/gallery/photos	ดึงรายการรูปภาพทั้งหมด
POST	/admin/gallery/photos	สร้างข้อมูลรูปภาพใหม่
PUT	/admin/gallery/photos/{id}	แก้ไขข้อมูลรูปภาพ
DELETE	/admin/gallery/photos/{id}	ลบรูปภาพ
Example Request
curl -i http://api.n9ne.cc/admin/gallery/photos
curl -i -X POST http://api.n9ne.cc/admin/gallery/photos \
  -H "Content-Type: application/json" \
  -d '{
    "caption": "Sunset by the beach",
    "photoDate": "2026-05-09",
    "favorite": true,
    "hidden": false,
    "sortOrder": 1,
    "mediaObjectId": "uuid-media-object-id"
  }'
Media Upload
Method	Endpoint	Description
POST	/admin/media/upload	Upload file ไปยัง MinIO และบันทึก metadata
Example Request
curl -i -X POST http://api.n9ne.cc/admin/media/upload \
  -F "file=@/path/to/photo.jpg" \
  -F "folder=user-portal/gallery"
Media Upload Flow
Admin Portal
  → POST /admin/media/upload
  → Backend uploads file to MinIO
  → Backend saves metadata to PostgreSQL
  → Backend returns mediaObjectId and imageUrl
Hero Section Management
Method	Endpoint	Description
GET	/admin/hero	ดึงข้อมูล Hero section
PUT	/admin/hero	แก้ไขข้อมูล Hero section
Countdown Management
Method	Endpoint	Description
GET	/admin/countdown	ดึงข้อมูล Countdown
PUT	/admin/countdown	แก้ไขข้อมูล Countdown
Love Letter Management
Method	Endpoint	Description
GET	/admin/love-letter	ดึงข้อมูล Love Letter
PUT	/admin/love-letter	แก้ไขข้อมูล Love Letter
Final Surprise Management
Method	Endpoint	Description
GET	/admin/final-surprise	ดึงข้อมูล Final Surprise
PUT	/admin/final-surprise	แก้ไขข้อมูล Final Surprise
API + MinIO Concept

ระบบนี้ใช้ PostgreSQL และ MinIO ร่วมกัน:

PostgreSQL:
- เก็บ metadata
- เก็บ caption
- เก็บวันที่
- เก็บ object_key
- เก็บ relationship ของข้อมูล

MinIO:
- เก็บไฟล์รูปจริง
- เก็บ hero image
- เก็บ gallery photos
- เก็บ surprise image

ตัวอย่างข้อมูลที่ backend อาจส่งกลับให้ frontend:

{
  "id": "photo-id",
  "caption": "Sunset by the beach",
  "photoDate": "2026-05-09",
  "favorite": true,
  "hidden": false,
  "imageUrl": "http://api.n9ne.cc/media/presigned-url-or-public-url"
}
Suggested API Structure
/public/site/{siteKey}
├─ /hero
├─ /countdown
├─ /memories
├─ /gallery
├─ /love-letter
└─ /final-surprise

/admin
├─ /auth/login
├─ /dashboard/stats
├─ /gallery/photos
├─ /media/upload
├─ /hero
├─ /countdown
├─ /love-letter
└─ /final-surprise