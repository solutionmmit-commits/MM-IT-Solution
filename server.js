const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Directories setup
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static static assets & uploaded images
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(__dirname));

// Multer storage config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error('শুধুমাত্র ছবি ফরম্যাট (JPG, PNG, WEBP, SVG, GIF) আপলোড করা যাবে!'));
  }
});

// Cloudinary Config (Required for Render Persistence)
const cloudinary = require('cloudinary').v2;
if (process.env.CLOUDINARY_URL) {
  const urlParts = process.env.CLOUDINARY_URL.split('://')[1].split(':');
  const apiKey = urlParts[0];
  const apiSecret = urlParts[1].split('@')[0];
  const cloudName = urlParts[1].split('@')[1];

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}

// Admin credentials (Default: admin / 77520200Kmm)
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || '77520200Kmm';

// Default site content if json is empty
const defaultData = {
  shop: {
    name: "MM IT Solution",
    logoText: "MM",
    logoImg: "",
    kicker: "ফুটকিবাড়ী, পঞ্চগড়",
    heroTitle: "আপনার সকল <span>অনলাইন ও অফলাইন</span> তথ্যপ্রযুক্তি সেবার ঠিকানা",
    heroLead: "ফটোকপি, প্রিন্টিং, কম্পোজিং থেকে শুরু করে ওয়েবসাইট, ডিজিটাল মার্কেটিং ও আইটি সাপোর্ট — এক ছাদের নিচে দ্রুত ও নির্ভরযোগ্য সেবা।",
    address: "ফুটকিবাড়ী বাজার, মাড়েয়া, বোদা, পঞ্চগড়",
    phone: "+880 1737 520 200",
    email: "solutionmmit@gmail.com",
    hours: "সকাল ১০টা – রাত ১০টা (সবসময় খোলা)",
    facebook: "fb.com/mmitsolution21",
    facebookUrl: "https://www.facebook.com/mmitsolution21"
  },
  homeGallery: [
    { id: "hg1", title: "দোকানের সামনের দৃশ্য", img: "", placeholder: "দোকানের ছবি বসান" },
    { id: "hg2", title: "ফটোকপি ও কম্পিউটার ল্যাব", img: "", placeholder: "স্টুডিওর ছবি বসান" },
    { id: "hg3", title: "গ্রাফিক ও সাইট ডিজাইন কাজ", img: "", placeholder: "কাজের নমুনা বসান" },
    { id: "hg4", title: "সন্তুষ্ট গ্রাহকদের সেবাদান", img: "", placeholder: "গ্রাহকের ছবি বসান" }
  ],
  offlineGallery: [
    { id: "off_g1", title: "স্টুডিও ফটো নমুনা (পাসপোর্ট/স্ট্যাম্প)", img: "", placeholder: "স্টুডিও ফটো নমুনা বসান" },
    { id: "off_g2", title: "প্রিন্টিং ও ফটোকপি কাজের নমুনা", img: "", placeholder: "প্রিন্ট ও ফটোকপি নমুনা বসান" },
    { id: "off_g3", title: "সিভি ও কম্পোজিং ডিজাইন নমুনা", img: "", placeholder: "কম্পোজিং ও সিভি নমুনা বসান" },
    { id: "off_g4", title: "অনলাইন আবেদন ডকুমেন্টের নমুনা", img: "", placeholder: "আবেদন সলিপের নমুনা বসান" }
  ],
  onlineGallery: [
    { id: "on_g1", title: "ই-কমার্স ও ওয়েবসাইট ডিজাইনের নমুনা", img: "", placeholder: "ওয়েবসাইট স্ক্রিনশট বসান" },
    { id: "on_g2", title: "ফেসবুক অ্যাডস ও মার্কেটিংব্য ব্যানার", img: "", placeholder: "মার্কেটিং ব্যানার বসান" },
    { id: "on_g3", title: "ব্র্যান্ড লোগো ও গ্রাফিক ডিজাইন নমুনা", img: "", placeholder: "লোগো ডিজাইন নমুনা বসান" },
    { id: "on_g4", title: "সফটওয়্যার ও আইটি সলিউশন প্রকল্প", img: "", placeholder: "আইটি প্রজেক্ট নমুনা বসান" }
  ],
  reviews: [
    { id: "r1", stars: "★★★★★", comment: "খুব দ্রুত ও সুন্দরভাবে আমার জন্মনিবন্ধন সংশোধনের কাজ করে দিয়েছে। ধন্যবাদ MM IT Solution।", author: "মোঃ রফিকুল ইসলাম" },
    { id: "r2", stars: "★★★★★", comment: "প্রিন্ট ও ফটোকপির মান খুবই ভালো, দামও হাতের নাগালে।", author: "মোছাঃ পারভীন আক্তার" },
    { id: "r3", stars: "★★★★★", comment: "চাকরির আবেদন ফরম পূরণে অনেক সাহায্য করেছে, খুব আন্তরিক ব্যবহার।", author: "সাকিব হাসান" }
  ],
  offlinePage: {},
  onlinePage: {},
  customTexts: {}
};

// API: Get Content
app.get('/api/content', (req, res) => {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const rawData = fs.readFileSync(CONTENT_FILE, 'utf8');
      return res.json(JSON.parse(rawData));
    } else {
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
      return res.json(defaultData);
    }
  } catch (err) {
    console.error('Error reading content file:', err);
    return res.status(500).json({ error: 'ডাটা রিড করতে সমস্যা হয়েছে' });
  }
});

// API: Save Content
app.post('/api/content', (req, res) => {
  try {
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ error: 'ভুল ডাটা ফরম্যাট' });
    }
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(newContent, null, 2), 'utf8');
    return res.json({ success: true, message: 'কনটেন্ট সফলভাবে সেভ করা হয়েছে!' });
  } catch (err) {
    console.error('Error saving content file:', err);
    return res.status(500).json({ error: 'ডাটা সেভ করতে সমস্যা হয়েছে' });
  }
});

// API: Image Upload
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message || 'ছবি আপলোড করতে সমস্যা হয়েছে' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'কোনো ছবি সিলেক্ট করা হয়নি!' });
    }

    try {
      if (process.env.CLOUDINARY_URL) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'mm_it_solution'
        });
        fs.unlinkSync(req.file.path);
        return res.json({
          success: true,
          message: 'ছবি ক্লাউডে সফলভাবে আপলোড হয়েছে!',
          url: result.secure_url
        });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      return res.json({
        success: true,
        message: 'ছবি লোকাল সার্ভারে আপলোড হয়েছে (সতর্কবার্তা: ডেপ্লয় করলে ডিলিট হতে পারে)',
        url: imageUrl
      });
    } catch (uploadErr) {
      console.error('Cloudinary upload error:', uploadErr);
      return res.status(500).json({ error: 'ক্লাউডে আপলোড করতে সমস্যা হয়েছে' });
    }
  });
});

// API: Admin Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({
      success: true,
      token: 'admin-authenticated-session-' + Date.now(),
      message: 'লগইন সফল হয়েছে!'
    });
  }
  return res.status(401).json({ error: 'ইউজারনেম অথবা পাসওয়ার্ড ভুল হয়েছে!' });
});

// Fallback route for single-page style navigation if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 MM IT Solution Server status: RUNNING`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🔐 Admin Default Credentials: Username: ${ADMIN_USER} | Password: ${ADMIN_PASS}`);
  console.log(`====================================================`);
});
