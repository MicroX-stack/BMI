# แผนการทดสอบระบบ BMI Web Application (Testing Plan)

เอกสารนี้รวบรวมกลยุทธ์และแผนการทดสอบสำหรับ BMI Web Application เพื่อให้มั่นใจในคุณภาพ ความถูกต้อง และประสิทธิภาพของระบบ โดยครอบคลุมทั้ง Functional และ Non-Functional Testing

## 1. ขอบเขตการทดสอบ (Scope of Testing)

### 1.1 ฟีเจอร์หลัก (Core Features)
- **ระบบสมาชิก (Authentication)**: การสมัครสมาชิก (Register), การเข้าสู่ระบบ (Login), การจัดการ Session
- **การคำนวณและบันทึก BMI (BMI Tracking)**: การกรอกข้อมูลน้ำหนัก/ส่วนสูง, การคำนวณค่า BMI, การบันทึกลงฐานข้อมูล
- **การแสดงผล (Dashboard & History)**: การแสดงรายการประวัติ BMI, การแสดงกราฟแนวโน้ม, การแสดงข้อมูลสรุป
- **API Endpoints**: ความถูกต้องของการรับ-ส่งข้อมูล, Status Codes, Error Handling

### 1.2 ประเภทของการทดสอบ (Types of Testing)
1.  **Unit Testing**: ทดสอบฟังก์ชันย่อย การคำนวณ และ Component พื้นฐาน
2.  **Integration Testing**: ทดสอบการเชื่อมต่อระหว่าง API กับ Database และระหว่าง Frontend กับ Backend
3.  **End-to-End (E2E) Testing**: ทดสอบกระบวนการทำงานจริงตั้งแต่ต้นจนจบผ่านหน้าเว็บ
4.  **Performance Testing**: ทดสอบความเร็วและการรองรับโหลด (ในอนาคต)

---

## 2. เครื่องมือที่ใช้ (Tools & Frameworks)

- **Test Runner & Assertion**: [Playwright](https://playwright.dev/) (สำหรับ E2E และ Integration)
- **Framework**: Next.js Testing (รองรับ Jest/Vitest หากต้องการทำ Unit Test เชิงลึกในอนาคต)
- **CI/CD**: GitHub Actions (วางแผนสำหรับอนาคต)

---

## 3. แผนการทดสอบโดยละเอียด (Detailed Test Plan)

### 3.1 Unit & Integration Testing (API & Logic)
เน้นทดสอบ Logic สำคัญและการทำงานของ API Routes

| ID | Test Case | Description | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| UT-01 | Calculate BMI Logic | ทดสอบสูตรคำนวณ BMI (น้ำหนัก / ส่วนสูง^2) | ค่าทศนิยมถูกต้องตามหลักคณิตศาสตร์ | High |
| IT-01 | POST /api/auth/register | สมัครสมาชิกด้วยข้อมูลถูกต้อง | Status 201, User Created | High |
| IT-02 | POST /api/auth/register (Duplicate) | สมัครซ้ำด้วย Username เดิม | Status 400, Error Message | Medium |
| IT-03 | POST /api/auth/login | เข้าสู่ระบบถูกต้อง | Status 200, Return Token/Session | High |
| IT-04 | POST /api/records | บันทึกค่า BMI ใหม่ | Status 201, Record Saved | High |
| IT-05 | GET /api/records | ดึงประวัติ BMI ของ User | Status 200, Return Array of Records | High |

### 3.2 End-to-End (E2E) Testing (UI & User Flow)
เน้นทดสอบประสบการณ์ผู้ใช้งานจริงผ่าน Browser จำลอง

| ID | Test Case | Description | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| E2E-01 | Homepage Load | เข้าหน้าแรกของเว็บ | แสดง Title, ปุ่ม Login/Register ครบ | High |
| E2E-02 | Navigation Flow | คลิกเปลี่ยนหน้าไป-มา | URL เปลี่ยนถูกต้อง, เนื้อหาโหลดตามหน้า | Medium |
| E2E-03 | Register Flow | กรอกฟอร์มสมัครสมาชิก | สมัครสำเร็จ, Redirect ไปหน้า Login | High |
| E2E-04 | Login Flow | กรอกฟอร์มเข้าสู่ระบบ | เข้าสู่ระบบสำเร็จ, Redirect ไป Dashboard | High |
| E2E-05 | Login Failure | กรอกรหัสผิด | แสดง Error Message สีแดง | High |
| E2E-06 | Add BMI Record | กรอกน้ำหนัก/ส่วนสูงแล้วกดบันทึก | ค่า BMI แสดงถูกต้อง, รายการใหม่ปรากฏในตาราง | High |
| E2E-07 | View History | ดูประวัติย้อนหลัง | แสดงรายการประวัติเรียงตามวันที่ถูกต้อง | Medium |
| E2E-08 | Logout | กดปุ่มออกจากระบบ | Redirect กลับหน้า Login/Home, เข้า Dashboard ไม่ได้ | Medium |

---

## 4. การจัดการ Test Data (Test Data Management)

- **User Data**: ใช้การสุ่มชื่อ (Random Username) เช่น `user_{timestamp}` เพื่อป้องกันข้อมูลซ้ำในการรันแต่ละครั้ง
- **Cleanup**: (ในอนาคต) ควรมี Script สำหรับลบข้อมูลทดสอบออกจากฐานข้อมูล หรือใช้ Test Database แยกต่างหาก

---

## 5. วิธีการรันและตรวจสอบผล (Execution & Reporting)

### คำสั่งสำหรับรันสอบ
```bash
# รัน E2E Tests ทั้งหมด
npm run test:e2e

# รันแบบมี UI (Headless off) เพื่อดูการทำงาน
npx playwright test --ui

# ดูรายงานผลการทดสอบ
npx playwright show-report
```

### เกณฑ์การผ่าน (Pass Criteria)
- Test Cases ระดับ High Priority ต้องผ่าน 100%
- ไม่มี Critical Bugs ที่ทำให้ระบบล่มหรือข้อมูลสูญหาย
- UI แสดงผลถูกต้องบน Desktop (Chromium)

---

## 6. สิ่งที่ต้องปรับปรุงในอนาคต (Future Improvements)
- เพิ่ม **Visual Regression Testing** เพื่อตรวจสอบความผิดปกติของ UI Layout
- เพิ่ม **Mobile Viewport Testing** เพื่อทดสอบ Responsive Design
- แยก Environment สำหรับ Testing (`.env.test`) ให้ชัดเจน
- เพิ่ม Unit Test สำหรับ React Components โดยใช้ Jest + React Testing Library
