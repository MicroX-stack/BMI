# Project Tasks: BMI Web Application

## Phase 1: Environment & Setup
- [x] **Project Initialization**: สร้างโปรเจกต์ Next.js ล่าสุด
- [x] **Styling Setup**: ติดตั้งและตั้งค่า Tailwind CSS
- [x] **Database Setup**: ติดตั้ง Prisma และกำหนดค่า SQLite
- [x] **Version Control**: เริ่มต้น Git repository

## Phase 2: Database & API
- [ ] **Schema Design**: สร้าง Prisma schema สำหรับ User และ BMIRecord
- [ ] **Migration**: รัน migration เพื่อสร้างตารางใน SQLite
- [ ] **API Structure**: วางโครงสร้าง API Routes สำหรับ Users และ Records

## Phase 3: Authentication (User Management)
- [ ] **Register API**: สร้าง API สำหรับสมัครสมาชิก (Hash password)
- [ ] **Login API**: สร้าง API สำหรับเข้าสู่ระบบ (Session/JWT)
- [ ] **Auth Pages**: สร้างหน้า Login และ Register
- [ ] **Protected Routes**: ตั้งค่า Middleware ป้องกันหน้าภายใน
- [ ] **Forget Password**: สร้างฟังก์ชัน Reset Password (User -> Default Password)
- [ ] **Profile API**: API แก้ไขข้อมูลส่วนตัว

## Phase 4: BMI Core Features
- [ ] **BMI Logic**: สร้าง Utility function คำนวณ BMI และแปลผล
- [ ] **Record API**: สร้าง CRUD API สำหรับ BMI Records
- [ ] **Input Form**: สร้างหน้า/Modal สำหรับกรอก น้ำหนัก/ส่วนสูง
- [ ] **Validation**: ตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก

## Phase 5: MIS Reports & Dashboard
- [ ] **Dashboard Layout**: ออกแบบโครงสร้างหน้า Dashboard
- [ ] **Latest Stat**: แสดงค่า BMI ล่าสุดและสถานะ (สีตามเกณฑ์)
- [ ] **Chart Component**: ติดตั้ง Library กราฟ (เช่น Recharts หรือ Chart.js)
- [ ] **Daily Report**: แสดงรายการบันทึกรายวัน (Table)
- [ ] **Weekly Report**: กราฟแสดงแนวโน้ม 7 วัน
- [ ] **Monthly Report**: คำนวณและแสดงค่าเฉลี่ยรายเดือน
- [ ] **Yearly Report**: คำนวณและแสดงค่าเฉลี่ยรายปี

## Phase 6: Refinement & Polish
- [ ] **UI/UX Improvements**: ปรับแต่งความสวยงามและการแสดงผลบนมือถือ (Responsive)
- [ ] **Error Handling**: จัดการ Error ต่างๆ และ Loading state
- [ ] **Security Check**: ตรวจสอบความปลอดภัยข้อมูลส่วนตัว
- [ ] **Final Testing**: ทดสอบการใช้งานรวม (End-to-End)