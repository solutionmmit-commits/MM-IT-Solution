# 🚀 MM IT Solution — Full-Stack Visual CMS & Node.js Backend

এটি **MM IT Solution** পঞ্চগড়-এর জন্য একটি সম্পূর্ণ ফুল-স্ট্যাক ওয়েবসাইট প্রজেক্ট, যাতে **Node.js Express Backend** এবং **Elementor-Style Visual Editor** যুক্ত করা হয়েছে।

---

## 🌟 বৈশিষ্ট্যসমূহ (Features)

1. **Elementor-style Live Visual Editor**:
   - ব্রাউজারে ওয়েবসাইটের যেকোনো লেখা সরাসরি ক্লিক করে লাইভ পরিবর্তন করা যায়।
   - ওয়েবসাইট থেকে সরাসরি এডিট মোড (Edit Mode) অন/অফ করা যায়।

2. **সহজ ছবি আপলোড ম্যানেজার (Image Uploader)**:
   - গ্যালারির যেকোনো ছবি বক্সে ক্লিক করে কম্পিউটার থেকে ছবি ফাইল সিলেক্ট করে অথবা ড্র্যাগ এন্ড ড্রপ করে আপলোড করা যায়।
   - আপলোড করা ছবি ব্যাকএন্ডের `uploads/` ফোল্ডারে সেভ হয়ে ওয়েবসাইটে লাইভ যুক্ত হয়।

3. **ডাইনামিক কন্টেট ও রিভিউ সেশন**:
   - এক ক্লিকে নতুন গ্যালারি ছবি বা কাস্টমার রিভিউ যোগ করা যায়।
   - অপ্রয়োজনীয় ছবি বা রিভিউ রিভুম করা যায়।

4. **Node.js Express REST API Backend**:
   - `server.js` ফাইলে ব্যাকএন্ড সার্ভার কোড লেখা আছে।
   - তথ্যগুলো `data/site-content.json` ডাটাবেসে স্থায়ীভাবে সেভ হয়।
   - ব্রাউজার `LocalStorage`-এর সাথে অটোমেটিক ব্যাকআপ ও সিঙ্ক থাকে।

5. **অ্যাডমিন সিকিউরিটি**:
   - সুরক্ষিত পাসওয়ার্ড দিয়ে এডিট মোড লক করা থাকে।

---

## 🔑 অ্যাডমিন লগইন তথ্য (Default Credentials)

- **অ্যাডমিন ইউজারনেম (Username):** `admin`
- **অ্যাডমিন পাসওয়ার্ড (Password):** `77520200Kmm`

---

## 🛠️ সার্ভার চালু করার নিয়ম (Quick Start Guide)

১. টার্মিনাল বা কমান্ড প্রম্পট (CMD / PowerShell) ওপেন করুন:
```bash
cd "e:\VS Code Program\Program 1"
```

২. প্রয়োজনীয় প্যাকেজ ইন্সটল করুন (প্রথমবার):
```bash
npm install
```

৩. ব্যাকএন্ড সার্ভার রান করুন:
```bash
npm start
```

৪. যেকোনো ব্রাউজারে ঢুকে সাইট দেখুন:
```text
http://localhost:3000
```

---

## 📝 কীভাবে তথ্য ও ছবি পরিবর্তন করবেন (Elementor Guide)

১. `http://localhost:3000` এ যান।
২. হেডার বারের ডানপাশে **"🔑 অ্যাডমিন লগইন"** বাটনে ক্লিক করুন।
৩. ইউজারনেম: `admin` এবং পাসওয়ার্ড: `admin123` দিয়ে **"লগইন করুন"** চাপুন।
৪. লগইন করার পর উপরে লাল বাটন দেখাবে **"✏️ এডিট মোড অন করুন"**। এটি চাপলেই সম্পূর্ণ ওয়েবসাইট লাইভ এডিটেবল হয়ে যাবে!
৫. **লেখা পরিবর্তন করতে:** যেকোনো লেখার উপর ক্লিক করে কিবোর্ড দিয়ে নতুন লেখা টাইপ করুন।
৬. **ছবি পরিবর্তন করতে:** গ্যালারির বক্সে **"📷 পরিবর্তন"** বা **"📷 আপলোড"** চাপুন। আপলোড উইন্ডো আসবে, সেখানে আপনার পছন্দের ছবি ফাইল দিয়ে **"সরাসরি সেট করুন"** চাপুন।
৭. **পরিবর্তন সেভ করতে:** উপরে সবুজ **"💾 পরিবর্তন সেভ করুন"** বাটনে চাপুন। আপনার সকল পরিবর্তন ব্যাকএন্ড ফাইলেই স্থায়ীভাবে সেভ হয়ে যাবে!

---

## 📁 ফাইল স্ট্রাকচার

- `server.js` — Node.js Express Backend & Image Upload Server
- `package.json` — Node Package Configuration
- `cms.js` — Client-side Elementor Visual Engine & API Connector
- `style.css` — Website Design & Admin Bar/Modal Styles
- `index.html` — Homepage with CMS Live Attributes
- `offline-services.html` — Offline Services Page
- `online-services.html` — Online Services Page
- `data/site-content.json` — Site Database File
- `uploads/` — Uploaded Images Directory
