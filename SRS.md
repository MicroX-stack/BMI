# Software Requirements Specification (SRS) - BMI Web Application

## 1. บทนำ (Introduction)
### 1.1 จุดประสงค์ (Purpose)
เอกสารนี้ระบุข้อกำหนดความต้องการทางซอฟต์แวร์สำหรับการพัฒนาเว็บแอปพลิเคชันคำนวณและติดตามค่าดัชนีมวลกาย (BMI) ที่รองรับผู้ใช้งานหลายคน พร้อมระบบรายงานผลแบบ MIS

### 1.2 ขอบเขต (Scope)
ระบบช่วยให้ผู้ใช้งานสามารถบันทึกข้อมูลน้ำหนักและส่วนสูง คำนวณค่า BMI อัตโนมัติ และดูรายงานย้อนหลังเพื่อติดตามแนวโน้มสุขภาพได้

## 2. เทคโนโลยีที่ใช้ (Technology Stack)
- **Frontend/Backend**: Next.js (Latest Version)
- **Database**: SQLite
- **ORM**: Prisma (แนะนำสำหรับการจัดการ SQLite)
- **Styling**: Tailwind CSS

## 3. ความต้องการของระบบ (Functional Requirements)

### 3.1 ระบบจัดการผู้ใช้งาน (User Management)
- **Multi-user Support**: รองรับผู้ใช้งานได้หลายคนในระบบเดียว โดยข้อมูลของแต่ละคนจะถูกแยกออกจากกัน
- **Authentication**:
  - **Register**: สมัครสมาชิกด้วย Username และ Password
  - **Login**: เข้าสู่ระบบเพื่อเข้าถึงข้อมูลส่วนตัว
  - **Logout**: ออกจากระบบ
- **Profile Management**: ผู้ใช้สามารถแก้ไขข้อมูลพื้นฐานได้
- **Forget Password (Simple Reset)**:
  - ผู้ใช้งานสามารถทำการรีเซ็ตรหัสผ่านได้โดยการระบุ Username
  - ระบบจะทำการเปลี่ยนรหัสผ่านเป็น **Default Password** (เช่น `1234`) หรือรหัสผ่านใหม่ที่ผู้ใช้ระบุ (ตาม Logic ที่เลือกใช้) เพื่อให้ผู้ใช้สามารถ login เข้าไปเปลี่ยนรหัสผ่านใหม่ได้เองในภายหลัง

### 3.2 การจัดการข้อมูล BMI (BMI Management)
- **Data Entry**:
  - บันทึกน้ำหนัก (Weight) หน่วยกิโลกรัม (ทศนิยม 1-2 ตำแหน่ง)
  - บันทึกส่วนสูง (Height) หน่วยเซนติเมตร
  - ระบบบันทึกเวลาที่ป้อนข้อมูลอัตโนมัติ (Timestamp)
- **Calculation**: คำนวณค่า BMI อัตโนมัติทันทีเมื่อกรอกข้อมูล
- **Interpretation**: แสดงผลการแปลความหมายตามเกณฑ์มาตรฐาน WHO หรือ Asia criteria (สามารถเลือก config ได้)
  - ผอม (Underweight)
  - ปกติ (Normal)
  - น้ำหนักเกิน (Overweight)
  - อ้วน (Obese)

### 3.3 ระบบรายงาน MIS (MIS Reports)
ระบบมี Dashboard สำหรับดูรายงานย้อนหลังในรูปแบบ **กราฟเส้น (Line Chart)** และ **ตาราง (Table)**:
- **Daily Report**: แสดงรายการบันทึกทั้งหมดในแต่ละวัน ดูความเปลี่ยนแปลงละเอียด
- **Weekly Report**: กราฟแสดงแนวโน้มน้ำหนักและ BMI ในรอบ 7 วันล่าสุด
- **Monthly Report**: ค่าเฉลี่ย BMI และน้ำหนักในแต่ละเดือน เพื่อดูแนวโน้มระยะกลาง
- **Yearly Report**: สรุปภาพรวมรายปี กราฟแสดงค่าเฉลี่ยรายเดือนตลอดทั้งปี

## 4. กฎทางธุรกิจ (Business Rules)
### 4.1 สูตรคำนวณ BMI
$ BMI = \frac{Weight (kg)}{Height (m)^2} $
*หมายเหตุ: ต้องแปลงส่วนสูงจาก cm เป็น m ก่อนคำนวณ*

### 4.2 เกณฑ์การแปลผล (ตัวอย่างเกณฑ์เอเชีย)
| ช่วงค่า BMI | การแปลผล |
|------------|----------|
| < 18.5 | น้ำหนักน้อย / ผอม |
| 18.5 - 22.90 | ปกติ (สมส่วน) |
| 23 - 24.90 | น้ำหนักเกิน / ท้วม |
| 25 - 29.90 | อ้วนระดับ 1 |
| > 30 | อ้วนระดับ 2 |

## 5. โครงสร้างข้อมูล (Database Schema)

### 5.1 Table: User
| Field | Type | Attributes | Description |
|-------|------|------------|-------------|
| id | Int | PK, Auto Inc | User ID |
| username | String | Unique, Not Null | ชื่อผู้ใช้งาน |
| password | String | Not Null | รหัสผ่าน (Hashed) |
| display_name | String | Nullable | ชื่อที่แสดงในระบบ |
| created_at | DateTime | Default Now | วันที่สมัคร |

### 5.2 Table: BMIRecord
| Field | Type | Attributes | Description |
|-------|------|------------|-------------|
| id | Int | PK, Auto Inc | Record ID |
| user_id | Int | FK -> User.id | เจ้าของข้อมูล |
| weight | Float | Not Null | น้ำหนัก (kg) |
| height | Float | Not Null | ส่วนสูง (cm) |
| bmi | Float | Not Null | ค่า BMI ที่คำนวณได้ |
| recorded_at| DateTime | Default Now | วันที่บันทึก |
| note | String | Nullable | บันทึกเพิ่มเติม (ถ้ามี) |

## 6. ความต้องการที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements)
- **Security**:
  - รหัสผ่านต้องถูกเข้ารหัส (Hashing) ก่อนบันทึกลงฐานข้อมูล (เช่นใช้ bcrypt)
  - ข้อมูล BMI ของผู้ใช้แต่ละคนต้องเป็นความลับ ผู้ใช้อื่นไม่สามารถเข้าถึงได้
- **Performance**:
  - การคำนวณและแสดงผลกราฟต้องรวดเร็ว (Response time < 1s)
- **Usability**:
  - รองรับการใช้งานบนมือถือ (Responsive Design) เนื่องจากเป็น WebApp
  - ใช้งานง่าย ไม่ซับซ้อน (Minimalist UI)

## 7. ส่วนติดต่อผู้ใช้ (User Interface Flow)
1. **Login/Register Page**: หน้าแรกสำหรับยืนยันตัวตน
2. **Main Dashboard**:
   - Card แสดงค่า BMI ล่าสุด + สถานะ (สีเขียว/เหลือง/แดง ตามเกณฑ์)
   - ปุ่ม "บันทึกข้อมูลใหม่" เด่นชัด
   - กราฟย่อแสดงแนวโน้ม 7 วันล่าสุด
3. **Record Form**: Modal หรือหน้าแยกสำหรับกรอก น้ำหนัก/ส่วนสูง
4. **History/MIS Page**:
   - Filter เลือกช่วงเวลา (Daily, Weekly, Monthly, Yearly)
   - กราฟแสดงแนวโน้มตามช่วงเวลาที่เลือก
   - ตารางข้อมูลดิบด้านล่าง สามารถ Export ได้ (Option)