# 🧪 RetzPost Mockup & Simulation Registry (สมุดบันทึกรายการ Mock Data)

เอกสารฉบับนี้จัดทำขึ้นตามข้อกำหนดของผู้บริหาร เพื่อ **รวบรวมและระบุพิกัดข้อมูลจำลอง (Mock Data / Simulations)** ทั้งหมดในระบบ `RetzPost` ไว้อย่างชัดเจน เพื่อให้ทีมงานสามารถตรวจสอบ, เคลียร์ข้อมูลทดสอบ (Clear Test Data), หรือสลับไปต่อกับ Production API / Database จริงได้อย่างรวดเร็วและไม่สับสน

---

## 📋 สรุปรายการ Mock Data ทั้งหมดในระบบ

| # | ชื่อระบบ Mockup | ไฟล์ที่จัดเก็บโค้ด | สถานะใน UI | วิธีการสลับไปใช้ Production จริง |
|---|---|---|---|---|
| **1** | **ระบบวัดผล KPI พนักงาน (Employee KPI Engine)** | [`src/modules/analytics/kpi-engine.ts`](file:///c:/Users/Nopparat/Desktop/RetzPost/src/modules/analytics/kpi-engine.ts) | มีป้าย `[🧪 MOCK DATA]` กำกับ | ดึงยอดจริงจากตาราง `post_dispatches` (นับจำนวนโพสต์สำเร็จ, เวลาที่ยิงเทียบกับ Schedule) ใน PostgreSQL / Supabase |
| **2** | **ระบบวิเคราะห์ความปัง AI (Post Attribution & Playbook)** | [`src/modules/analytics/ai-insights.ts`](file:///c:/Users/Nopparat/Desktop/RetzPost/src/modules/analytics/ai-insights.ts) | มีป้าย `[🧪 AI MOCK ENGINE]` กำกับ | ยิง Prompt ส่งข้อมูลสถิติจริงเข้า Google Gemini 1.5 Pro / OpenAI GPT-4o API เพื่อวิเคราะห์แบบไดนามิก |
| **3** | **สถิติวัดผล Engagement & ลิงก์สตอรี่ (Telemetry Tab)** | [`src/app/page.tsx`](file:///c:/Users/Nopparat/Desktop/RetzPost/src/app/page.tsx) (`SAMPLE_POST_PERFORMANCE`) | มีป้าย `[🧪 MOCK DATA]` กำกับ | เชื่อมต่อ Meta Graph Insights API, Instagram Graph API, TikTok Business API Webhook |
| **4** | **คลังงานเผยแพร่จำลอง (Sample Batches & Queue)** | [`src/app/page.tsx`](file:///c:/Users/Nopparat/Desktop/RetzPost/src/app/page.tsx) (`SAMPLE_BATCHES`) | มีป้าย `[🧪 DEMO DATA]` กำกับ | ดึงจาก REST API `/api/dispatches` หรือฐานข้อมูลจริง |
| **5** | **ปฏิทินงานจำลอง (Sample Calendar Events)** | [`src/app/calendar/page.tsx`](file:///c:/Users/Nopparat/Desktop/RetzPost/src/app/calendar/page.tsx) (`SAMPLE_EVENTS`) | มีป้าย `[🧪 DEMO EVENTS]` กำกับ | ดึงจาก Query ตามช่วงวันที่ในฐานข้อมูล |
| **6** | **คลังรูปภาพ AI จำลอง (AI Media Library Hub)** | [`src/app/create/page.tsx`](file:///c:/Users/Nopparat/Desktop/RetzPost/src/app/create/page.tsx) (`AI_MEDIA_LIBRARY_ASSETS`) | มีป้าย `[AI Asset Mock]` กำกับ | ต่อกับ Cloudflare R2 / AWS S3 Bucket หรือ Midjourney/DALL-E Asset Generation API |

---

## 🔍 รายละเอียดของแต่ละส่วน & แผนการย้ายสู่ Production

### 1. ระบบวัดผล KPI พนักงาน (`kpi-engine.ts`)
* **ข้อมูลที่จำลองไว้:**
  - เป้าหมายโพสต์ต่อเดือน (`targetPosts`), จำนวนที่ทำได้จริง (`actualPosts`), อัตราทำสำเร็จ (`postsCompletionRate`)
  - อัตราการยิงโพสต์ตรงเวลา (`onTimePublishingRate`), อัตราผ่านอนุมัติรอบแรก (`firstPassApprovalRate`)
  - คะแนนรวม (`overallKpiScore`), เกรด (`grade: A+, A, B+, C`), ข้อแนะนำโค้ชชิ่ง (`coachingNotesTh`)
* **วิธีเคลียร์และต่อ API จริง:**
  ```typescript
  // ใน production ให้เปลี่ยนฟังก์ชัน getEmployeeKPIs() ใน kpi-engine.ts เป็น:
  export async function getEmployeeKPIsFromDB(workspaceId: string) {
    const res = await db.query(`
      SELECT 
        u.id, u.name, u.role,
        COUNT(p.id) as actual_posts,
        AVG(CASE WHEN p.published_at <= p.scheduled_at THEN 100 ELSE 0 END) as on_time_rate
      FROM users u
      LEFT JOIN dispatches p ON p.created_by = u.id
      GROUP BY u.id
    `);
    return res.rows;
  }
  ```

---

### 2. ระบบวิเคราะห์ความปังโพสต์ด้วย AI (`ai-insights.ts`)
* **ข้อมูลที่จำลองไว้:**
  - ทำไมถึงได้ยอด (`attributionDrivers`): ปัจจัยเวลาทอง, ภาพ Thumb-stop Dwell Time, แคปชันกระตุ้นแชร์, และตำแหน่งวาง Story Link Sticker
  - แนวทางต่อยอด (`actionablePlaybook`): การนำไปตัดต่อเป็น 9:16 Shorts/Reels, การสร้าง Custom Audience
* **วิธีเคลียร์และต่อ API จริง:**
  ```typescript
  // ส่ง Prompt เข้า Google Gemini API พร้อมข้อมูลสถิติของโพสต์:
  const prompt = `วิเคราะห์โพสต์ "${post.title}" ที่มียอดวิว ${post.views} ครั้ง และ engagement rate ${post.engagementRate} 
  ระบุปัจจัยความสำเร็จ 3-4 ข้อ และแนวทางต่อยอด (Actionable Playbook) ในรูปแบบ JSON`;
  const response = await geminiModel.generateContent(prompt);
  ```

---

### 3. ตัวกรอง Mock Data ในหน้าจอ UI
ในโค้ดฝั่งหน้าบ้าน (`src/app/page.tsx`) เราได้ใส่ป้ายกำกับและตัวแปร `isMockData: true` ไว้ทุกจุด เพื่อให้ทีมงานสังเกตเห็นป้าย:
`[🧪 MOCK DATA / SIMULATION]` อย่างชัดเจน เมื่อระบบต่อ API จริงแล้ว เพียงแค่เปลี่ยน Flag หรือสลับ Data Provider ป้ายและข้อมูลเหล่านี้จะถูกแทนที่ด้วยข้อมูลจริงทันทีโดยไม่ต้องรื้อ UI!
