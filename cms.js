/**
 * MM IT Solution - Elementor-Style Live Visual Editor & CMS
 * Supports Node.js Express Backend & LocalStorage Sync
 */

(function () {
  'use me strict';

  // Global State
  let siteData = {
    shop: {
      name: "MM IT Solution",
      logoText: "MM",
      logoImg: "",
      kicker: "পঞ্চগড় সদর, পঞ্চগড়",
      heroTitle: "আপনার সকল <span>অনলাইন ও অফলাইন</span> তথ্যপ্রযুক্তি সেবার ঠিকানা",
      heroLead: "ফটোকপি, প্রিন্টিং, কম্পোজিং থেকে শুরু করে ওয়েবসাইট, ডিজিটাল মার্কেটিং ও আইটি সাপোর্ট — এক ছাদের নিচে দ্রুত ও নির্ভরযোগ্য সেবা।",
      address: "পঞ্চগড় সদর (চৌরঙ্গী মোড় সংলগ্ন), পঞ্চগড়",
      phone: "+৮৮০ ১৭০০-০০০০০০",
      email: "info@mmitsolution.com",
      hours: "সকাল ৯টা – রাত ৯টা (সবসময় খোলা)",
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
      { id: "on_g2", title: "ফেসবুক অ্যাডস ও মার্কেটিং ব্যানার", img: "", placeholder: "মার্কেটিং ব্যানার বসান" },
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

  let isAdmin = false;
  let isEditMode = false;
  let currentTargetImageId = null;

  // Current page identifier
  const pageKey = window.location.pathname.split('/').pop() || 'index.html';

  function getActiveGalleryKey() {
    if (pageKey === 'offline-services.html') return 'offlineGallery';
    if (pageKey === 'online-services.html') return 'onlineGallery';
    return 'homeGallery';
  }

  // Initialize CMS on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
    loadContentFromBackend();
    injectAdminUI();
    bindGlobalEvents();
    checkSecretLoginTriggers();
  });

  // Check Session
  function checkAdminSession() {
    if (localStorage.getItem('mm_admin_token')) {
      isAdmin = true;
    }
  }

  // Load Content from Node Backend API or LocalStorage
  async function loadContentFromBackend() {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data && data.shop) {
          siteData = Object.assign({}, siteData, data);
          localStorage.setItem('mm_site_content', JSON.stringify(siteData));
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (e) {
      console.warn('Backend API not reached. Loading from LocalStorage fallback.', e);
      const local = localStorage.getItem('mm_site_content');
      if (local) {
        try { siteData = Object.assign({}, siteData, JSON.parse(local)); } catch (err) {}
      }
    }
    renderSiteData();
  }

  // Secret Admin Login Triggers (URL, Keyboard, Footer Triple-Click)
  function checkSecretLoginTriggers() {
    // 1. URL trigger: e.g. index.html?admin or index.html?login or #admin
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (search.includes('admin') || search.includes('login') || hash === '#admin' || hash === '#login') {
      if (!isAdmin) {
        setTimeout(() => {
          const loginModal = document.getElementById('cms-login-modal');
          if (loginModal) loginModal.style.display = 'flex';
        }, 300);
      }
    }

    // 2. Keyboard shortcut: Ctrl + Shift + A or Alt + L
    document.addEventListener('keydown', (e) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if ((isCmdOrCtrl && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'L' || e.key === 'l'))) {
        e.preventDefault();
        const loginModal = document.getElementById('cms-login-modal');
        if (loginModal) {
          loginModal.style.display = (loginModal.style.display === 'none' || !loginModal.style.display) ? 'flex' : 'none';
        }
      }
    });

    // 3. Secret Triple-Click on Footer
    let clickCount = 0;
    let clickTimer = null;
    document.addEventListener('click', (e) => {
      if (e.target.closest('footer') || e.target.closest('.site-footer') || e.target.closest('.copyright') || e.target.closest('.footer-bottom')) {
        clickCount++;
        if (clickCount >= 3) {
          clickCount = 0;
          clearTimeout(clickTimer);
          const loginModal = document.getElementById('cms-login-modal');
          if (loginModal && !isAdmin) loginModal.style.display = 'flex';
        } else {
          clearTimeout(clickTimer);
          clickTimer = setTimeout(() => { clickCount = 0; }, 1200);
        }
      }
    });
  }

  // Inject Top Admin Bar and Modals
  function injectAdminUI() {
    // 1. Admin Top Bar (Hidden for public visitors)
    const adminBarHtml = `
      <div id="cms-admin-bar" class="cms-bar" style="${isAdmin ? 'display:flex;' : 'display:none;'}">
        <div class="cms-bar-brand">
          <span class="cms-logo-icon">⚡</span> 
          <span>MM IT Solution <strong>Visual Editor (Elementor Mode)</strong></span>
          <span id="cms-status-tag" class="cms-badge ${isEditMode ? 'active' : ''}">${isEditMode ? '🟢 Edit Mode ON' : '👁️ Public View'}</span>
        </div>
        <div class="cms-bar-actions">
          <button id="cms-toggle-edit" class="cms-btn ${isEditMode ? 'cms-btn-active' : 'cms-btn-secondary'}">
            ${isEditMode ? '✖️ এডিট বন্ধ করুন' : '✏️ এডিট মোড অন করুন'}
          </button>
          <button id="cms-add-gallery-btn" class="cms-btn cms-btn-outline" style="${isEditMode ? '' : 'display:none;'}">📷 + ছবি যোগ</button>
          <button id="cms-add-review-btn" class="cms-btn cms-btn-outline" style="${(isEditMode && (pageKey === 'index.html' || pageKey === '')) ? '' : 'display:none;'}">💬 + রিভিউ যোগ</button>
          <button id="cms-save-btn" class="cms-btn cms-btn-save" style="${isEditMode ? '' : 'display:none;'}">💾 পরিবর্তন সেভ করুন</button>
          <button id="cms-logout-btn" class="cms-btn cms-btn-danger">🚪 লগআউট</button>
        </div>
      </div>
    `;

    // 2. Login Modal
    const loginModalHtml = `
      <div id="cms-login-modal" class="cms-modal-overlay" style="display:none;">
        <div class="cms-modal">
          <div class="cms-modal-header">
            <h3>🔐 অ্যাডমিন লগইন</h3>
            <button class="cms-modal-close" id="cms-close-login">&times;</button>
          </div>
          <div class="cms-modal-body">
            <p class="cms-hint">ওয়েবসাইট এডিট ও ছবি আপলোড করতে লগইন করুন।</p>
            <div class="cms-form-group">
              <label>ইউজারনেম (Username)</label>
              <input type="text" id="cms-user-input" value="admin" placeholder="admin">
            </div>
            <div class="cms-form-group">
              <label>পাসওয়ার্ড (Password)</label>
              <input type="password" id="cms-pass-input" value="" placeholder="আপনার পাসওয়ার্ড দিন">
            </div>
            <div id="cms-login-err" class="cms-err-msg"></div>
          </div>
          <div class="cms-modal-footer">
            <button id="cms-do-login" class="cms-btn cms-btn-save" style="width:100%;">লগইন করুন</button>
          </div>
        </div>
      </div>
    `;

    // 3. Image Upload Modal
    const uploadModalHtml = `
      <div id="cms-upload-modal" class="cms-modal-overlay" style="display:none;">
        <div class="cms-modal">
          <div class="cms-modal-header">
            <h3>📷 ছবি আপলোড ও পরিবর্তন (Elementor Uploader)</h3>
            <button class="cms-modal-close" id="cms-close-upload">&times;</button>
          </div>
          <div class="cms-modal-body">
            <div id="cms-dropzone" class="cms-dropzone">
              <div class="cms-dropzone-icon">📁</div>
              <p>কম্পিউটার থেকে ছবি ড্র্যাগ করুন অথবা <strong>ফাইল ব্রাউজ</strong> করুন</p>
              <input type="file" id="cms-file-input" accept="image/*" style="display:none;">
              <button id="cms-browse-btn" class="cms-btn cms-btn-secondary">ছবি সিলেক্ট করুন</button>
            </div>
            <div class="cms-divider"><span>অথবা ছবির URL দিন</span></div>
            <div class="cms-form-group">
              <input type="text" id="cms-url-input" placeholder="https://example.com/photo.jpg">
            </div>
            <div id="cms-img-preview-box" class="cms-preview-box" style="display:none;">
              <span>প্রিভিউ:</span>
              <img id="cms-img-preview" src="" alt="Preview">
            </div>
          </div>
          <div class="cms-modal-footer">
            <button id="cms-remove-img-btn" class="cms-btn cms-btn-danger" style="margin-right:auto;">🗑 ছবি মুছুন</button>
            <button id="cms-apply-img-btn" class="cms-btn cms-btn-save">সরাসরি সেট করুন</button>
          </div>
        </div>
      </div>
    `;

    // 4. Toast Container
    const toastHtml = `<div id="cms-toast-container"></div>`;

    document.body.insertAdjacentHTML('afterbegin', adminBarHtml);
    document.body.insertAdjacentHTML('beforeend', loginModalHtml);
    document.body.insertAdjacentHTML('beforeend', uploadModalHtml);
    document.body.insertAdjacentHTML('beforeend', toastHtml);
  }

  // Bind UI Events
  function bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'cms-login-btn') {
        document.getElementById('cms-login-modal').style.display = 'flex';
      }
      if (e.target.id === 'cms-close-login') {
        document.getElementById('cms-login-modal').style.display = 'none';
      }
      if (e.target.id === 'cms-do-login') {
        handleLogin();
      }
      if (e.target.id === 'cms-logout-btn') {
        handleLogout();
      }
      if (e.target.id === 'cms-toggle-edit') {
        toggleEditMode();
      }
      if (e.target.id === 'cms-save-btn') {
        saveChangesToBackend();
      }
      if (e.target.id === 'cms-add-gallery-btn') {
        addGalleryItem();
      }
      if (e.target.id === 'cms-add-review-btn') {
        addReviewItem();
      }
      if (e.target.id === 'cms-close-upload') {
        document.getElementById('cms-upload-modal').style.display = 'none';
      }

      // Logo click handler in edit mode
      if (isEditMode && e.target.closest('#cms-logo-box')) {
        openImagePicker('shop.logoImg');
      }
    });

    const passInput = document.getElementById('cms-pass-input');
    if (passInput) {
      passInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleLogin();
      });
    }

    const browseBtn = document.getElementById('cms-browse-btn');
    const fileInput = document.getElementById('cms-file-input');
    const dropzone = document.getElementById('cms-dropzone');
    const applyImgBtn = document.getElementById('cms-apply-img-btn');
    const removeImgBtn = document.getElementById('cms-remove-img-btn');

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          uploadFileToNodeServer(e.target.files[0]);
        }
      });
    }

    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('hover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('hover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('hover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          uploadFileToNodeServer(e.dataTransfer.files[0]);
        }
      });
    }

    if (applyImgBtn) {
      applyImgBtn.addEventListener('click', () => {
        const url = document.getElementById('cms-url-input').value.trim();
        applyImageToTarget(url);
        document.getElementById('cms-upload-modal').style.display = 'none';
      });
    }

    if (removeImgBtn) {
      removeImgBtn.addEventListener('click', () => {
        applyImageToTarget('');
        document.getElementById('cms-upload-modal').style.display = 'none';
      });
    }
  }

  // Handle Admin Login
  async function handleLogin() {
    const username = document.getElementById('cms-user-input').value.trim();
    const password = document.getElementById('cms-pass-input').value.trim();
    const errBox = document.getElementById('cms-login-err');
    errBox.innerText = '';

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('mm_admin_token', data.token);
        isAdmin = true;
        isEditMode = true;
        document.getElementById('cms-login-modal').style.display = 'none';
        updateAdminBarUI();
        renderSiteData();
        showToast('🎉 সফলভাবে লগইন করেছেন! এডিট মোড চালু করা হয়েছে।', 'success');
      } else {
        errBox.innerText = data.error || 'লগইন ব্যর্থ হয়েছে';
      }
    } catch (e) {
      if (username === 'admin' && password === '77520200Kmm') {
        localStorage.setItem('mm_admin_token', 'local-token');
        isAdmin = true;
        isEditMode = true;
        document.getElementById('cms-login-modal').style.display = 'none';
        updateAdminBarUI();
        renderSiteData();
        showToast('🎉 লগইন সফল (অফলাইন মোড)!', 'success');
      } else {
        errBox.innerText = 'ভুল ইউজারনেম বা পাসওয়ার্ড!';
      }
    }
  }

  // Handle Logout
  function handleLogout() {
    localStorage.removeItem('mm_admin_token');
    isAdmin = false;
    isEditMode = false;
    updateAdminBarUI();
    renderSiteData();
    showToast('👋 আপনি লগআউট করেছেন।', 'info');
  }

  // Toggle Edit Mode
  function toggleEditMode() {
    isEditMode = !isEditMode;
    updateAdminBarUI();
    renderSiteData();
    showToast(isEditMode ? '✏️ এডিট মোড চালু হয়েছে! যেকোনো টেক্সটে বা লোগোতে ক্লিক করে পরিবর্তন করুন।' : '👁️ পাবলিক প্রিভিউ মোড চালু হয়েছে।', 'info');
  }

  // Update Top Bar UI state
  function updateAdminBarUI() {
    const adminBar = document.getElementById('cms-admin-bar');
    if (!adminBar) return;
    
    adminBar.style.display = isAdmin ? 'flex' : 'none';
    if (!isAdmin) return;

    const actions = adminBar.querySelector('.cms-bar-actions');
    const statusTag = document.getElementById('cms-status-tag');
    
    if (statusTag) {
      statusTag.className = `cms-badge ${isEditMode ? 'active' : ''}`;
      statusTag.innerText = isEditMode ? '🟢 Edit Mode ON' : '👁️ Public View';
    }

    if (actions) {
      actions.innerHTML = `
        <button id="cms-toggle-edit" class="cms-btn ${isEditMode ? 'cms-btn-active' : 'cms-btn-secondary'}">
          ${isEditMode ? '✖️ এডিট বন্ধ করুন' : '✏️ এডিট মোড অন করুন'}
        </button>
        <button id="cms-add-gallery-btn" class="cms-btn cms-btn-outline" style="${isEditMode ? '' : 'display:none;'}">📷 + ছবি যোগ</button>
        <button id="cms-add-review-btn" class="cms-btn cms-btn-outline" style="${(isEditMode && (pageKey === 'index.html' || pageKey === '')) ? '' : 'display:none;'}">💬 + রিভিউ যোগ</button>
        <button id="cms-save-btn" class="cms-btn cms-btn-save" style="${isEditMode ? '' : 'display:none;'}">💾 পরিবর্তন সেভ করুন</button>
        <button id="cms-logout-btn" class="cms-btn cms-btn-danger">🚪 লগআউট</button>
      `;
    }

    if (isEditMode) {
      document.body.classList.add('cms-edit-active');
    } else {
      document.body.classList.remove('cms-edit-active');
    }
  }

  // Render Content onto DOM
  function renderSiteData() {
    // 0. Render Site Logo
    const logoBox = document.getElementById('cms-logo-box');
    if (logoBox) {
      if (siteData.shop && siteData.shop.logoImg) {
        logoBox.innerHTML = `<img src="${siteData.shop.logoImg}" class="site-logo-img" alt="Logo">`;
      } else {
        const logoText = (siteData.shop && siteData.shop.logoText) ? siteData.shop.logoText : 'MM';
        logoBox.innerHTML = `<span class="dot" data-cms-key="shop.logoText">${logoText}</span>`;
      }
    }

    // 1. Explicit data-cms-key elements
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const key = el.getAttribute('data-cms-key');
      const val = getValueByPath(siteData, key);
      if (val !== undefined && val !== null && val !== '') {
        if (el.tagName === 'A' && el.href.startsWith('tel:')) {
          el.href = 'tel:' + val;
          el.innerText = val.startsWith('☎') ? val : '☎ ' + val;
        } else {
          el.innerHTML = val;
        }
      }

      if (isEditMode) {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('cms-editable');
        el.onblur = () => {
          setValueByPath(siteData, key, el.innerHTML);
          saveChangesToBackendSilently();
        };
      } else {
        el.removeAttribute('contenteditable');
        el.classList.remove('cms-editable');
        el.onblur = null;
      }
    });

    // 2. Universal Elementor Fallback Selector for ALL headings, paragraphs, lists, cards across all subpages
    const editableSelectors = 'h1, h2, h3, h4, .kicker, p, .svc-card h3, .svc-card p, .pkg-card h3, .pkg-sub, .pkg-price, .pkg-list li, .step-card h3, .step-card p, .why-card h3, .why-card p, .info-line span';
    let elemIndex = 0;

    document.querySelectorAll(editableSelectors).forEach(el => {
      if (el.closest('#cms-admin-bar') || el.closest('.cms-modal') || el.closest('#cms-toast-container')) return;

      const idxKey = pageKey + '_elem_' + elemIndex++;
      
      if (!el.hasAttribute('data-cms-key') && siteData.customTexts && siteData.customTexts[idxKey]) {
        el.innerHTML = siteData.customTexts[idxKey];
      }

      if (isEditMode) {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('cms-editable');
        el.onblur = () => {
          if (el.hasAttribute('data-cms-key')) {
            const k = el.getAttribute('data-cms-key');
            setValueByPath(siteData, k, el.innerHTML);
          } else {
            if (!siteData.customTexts) siteData.customTexts = {};
            siteData.customTexts[idxKey] = el.innerHTML;
          }
          saveChangesToBackendSilently();
        };
      } else {
        if (!el.hasAttribute('data-cms-key')) {
          el.removeAttribute('contenteditable');
          el.classList.remove('cms-editable');
        }
      }
    });

    // 3. Page-Specific Gallery Container Render
    const galleryGrid = document.querySelector('.gallery-grid') || document.getElementById('cms-gallery-container');
    const galleryKey = getActiveGalleryKey();
    const activeGallery = siteData[galleryKey] || [];

    if (galleryGrid) {
      galleryGrid.id = 'cms-gallery-container';
      galleryGrid.innerHTML = '';

      activeGallery.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'gallery-item' + (item.img ? ' has-image' : '');
        itemEl.dataset.id = item.id;

        if (item.img) {
          itemEl.style.backgroundImage = `url('${item.img}')`;
          itemEl.style.backgroundSize = 'cover';
          itemEl.style.backgroundPosition = 'center';
          itemEl.innerHTML = `
            <div class="gallery-caption">${item.title}</div>
            ${isEditMode ? `
              <div class="cms-overlay-controls">
                <button class="cms-icon-btn cms-edit-img-btn" data-id="${item.id}">📷 পরিবর্তন</button>
                <button class="cms-icon-btn cms-del-item-btn" data-type="gallery" data-id="${item.id}">🗑</button>
              </div>
            ` : ''}
          `;
        } else {
          itemEl.style.backgroundImage = 'none';
          itemEl.innerHTML = `
            <span class="plus">+</span>${item.placeholder || item.title}
            ${isEditMode ? `
              <div class="cms-overlay-controls">
                <button class="cms-icon-btn cms-edit-img-btn" data-id="${item.id}">📷 আপলোড</button>
                <button class="cms-icon-btn cms-del-item-btn" data-type="gallery" data-id="${item.id}">🗑</button>
              </div>
            ` : ''}
          `;
        }

        if (isEditMode) {
          itemEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('cms-edit-img-btn') || e.target.classList.contains('plus') || !item.img) {
              openImagePicker(item.id);
            }
          });
        }

        galleryGrid.appendChild(itemEl);
      });
    }

    // 4. Reviews Container Render (if present on page)
    const reviewsGrid = document.querySelector('.test-grid') || document.getElementById('cms-reviews-container');
    if (reviewsGrid && siteData.reviews) {
      reviewsGrid.id = 'cms-reviews-container';
      reviewsGrid.innerHTML = '';

      siteData.reviews.forEach((rev, idx) => {
        const revEl = document.createElement('div');
        revEl.className = 'test-card';
        revEl.innerHTML = `
          <div class="stars" ${isEditMode ? 'contenteditable="true"' : ''} data-rev-field="stars">${rev.stars}</div>
          <p ${isEditMode ? 'contenteditable="true"' : ''} data-rev-field="comment">"${rev.comment.replace(/^"|"$/g, '')}"</p>
          <div class="test-name" ${isEditMode ? 'contenteditable="true"' : ''} data-rev-field="author">— ${rev.author}</div>
          ${isEditMode ? `
            <button class="cms-btn-del-rev cms-del-item-btn" data-type="review" data-id="${rev.id}">🗑 রিমুভ</button>
          ` : ''}
        `;

        if (isEditMode) {
          revEl.querySelectorAll('[data-rev-field]').forEach(f => {
            f.onblur = () => {
              const field = f.getAttribute('data-rev-field');
              siteData.reviews[idx][field] = f.innerText.replace(/^—\s*/, '').trim();
              saveChangesToBackendSilently();
            };
          });
        }

        reviewsGrid.appendChild(revEl);
      });
    }

    // Bind delete item buttons
    if (isEditMode) {
      document.querySelectorAll('.cms-del-item-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const type = btn.getAttribute('data-type');
          const id = btn.getAttribute('data-id');
          if (type === 'gallery') {
            const gKey = getActiveGalleryKey();
            siteData[gKey] = siteData[gKey].filter(g => g.id !== id);
          } else if (type === 'review') {
            siteData.reviews = siteData.reviews.filter(r => r.id !== id);
          }
          renderSiteData();
          saveChangesToBackendSilently();
          showToast('আইটেম রিমুভ করা হয়েছে', 'info');
        };
      });
    }
  }

  // Find target gallery item by ID across active gallery or all galleries
  function findGalleryItem(targetId) {
    const gKey = getActiveGalleryKey();
    if (siteData[gKey]) {
      const found = siteData[gKey].find(g => g.id === targetId);
      if (found) return found;
    }
    for (let key of ['homeGallery', 'offlineGallery', 'onlineGallery']) {
      if (siteData[key]) {
        const found = siteData[key].find(g => g.id === targetId);
        if (found) return found;
      }
    }
    return null;
  }

  // Open Image Upload Modal for target item or logo
  function openImagePicker(targetId) {
    currentTargetImageId = targetId;
    const modal = document.getElementById('cms-upload-modal');
    const previewBox = document.getElementById('cms-img-preview-box');
    const previewImg = document.getElementById('cms-img-preview');
    const urlInput = document.getElementById('cms-url-input');

    if (targetId === 'shop.logoImg') {
      const logoUrl = siteData.shop ? siteData.shop.logoImg : '';
      if (logoUrl) {
        previewImg.src = logoUrl;
        previewBox.style.display = 'block';
        urlInput.value = logoUrl;
      } else {
        previewBox.style.display = 'none';
        urlInput.value = '';
      }
    } else {
      const item = findGalleryItem(targetId);
      if (item && item.img) {
        previewImg.src = item.img;
        previewBox.style.display = 'block';
        urlInput.value = item.img;
      } else {
        previewBox.style.display = 'none';
        urlInput.value = '';
      }
    }

    modal.style.display = 'flex';
  }

  // Upload file via Node.js Express API
  async function uploadFileToNodeServer(file) {
    const formData = new FormData();
    formData.append('image', file);

    showToast('⏳ ছবি আপলোড হচ্ছে, অপেক্ষা করুন...', 'info');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        document.getElementById('cms-url-input').value = data.url;
        document.getElementById('cms-img-preview').src = data.url;
        document.getElementById('cms-img-preview-box').style.display = 'block';
        applyImageToTarget(data.url);
        document.getElementById('cms-upload-modal').style.display = 'none';
        showToast('🎉 ছবি আপলোড হয়ে স্থায়ীভাবে সেভ হয়েছে!', 'success');
      } else {
        throw new Error(data.error || 'আপলোড ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.warn('Node Upload failed, using FileReader Base64 fallback', err);
      const reader = new FileReader();
      reader.onload = function (evt) {
        const dataUrl = evt.target.result;
        document.getElementById('cms-url-input').value = dataUrl;
        document.getElementById('cms-img-preview').src = dataUrl;
        document.getElementById('cms-img-preview-box').style.display = 'block';
        applyImageToTarget(dataUrl);
        document.getElementById('cms-upload-modal').style.display = 'none';
        showToast('🎉 ছবি সেট করা হয়েছে (অফলাইন মোড)!', 'success');
      };
      reader.readAsDataURL(file);
    }
  }

  // Apply selected image URL to state and DOM + AUTOMATIC AUTO-SAVE TO BACKEND
  function applyImageToTarget(imageUrl) {
    if (!currentTargetImageId) return;

    if (currentTargetImageId === 'shop.logoImg') {
      if (!siteData.shop) siteData.shop = {};
      siteData.shop.logoImg = imageUrl;
    } else {
      const item = findGalleryItem(currentTargetImageId);
      if (item) {
        item.img = imageUrl;
      }
    }

    renderSiteData();
    // AUTOMATIC AUTO-SAVE TO BACKEND & LOCALSTORAGE
    saveChangesToBackendSilently();
  }

  // Add New Gallery Item to CURRENT active page gallery
  function addGalleryItem() {
    const newId = 'g_' + Date.now();
    const gKey = getActiveGalleryKey();
    if (!siteData[gKey]) siteData[gKey] = [];
    siteData[gKey].push({
      id: newId,
      title: 'নতুন কাজের নমুনা',
      img: '',
      placeholder: 'নতুন ছবি আপলোড করুন'
    });
    renderSiteData();
    openImagePicker(newId);
    showToast('নতুন কাজের নমুনা বক্সে যোগ হয়েছে!', 'success');
  }

  // Add New Review Item
  function addReviewItem() {
    const newId = 'r' + Date.now();
    if (!siteData.reviews) siteData.reviews = [];
    siteData.reviews.push({
      id: newId,
      stars: '★★★★★',
      comment: 'এখানে গ্রাহকের নতুন মতামত ও মন্তব্য লিখুন...',
      author: 'গ্রাহকের নাম'
    });
    renderSiteData();
    showToast('নতুন রিভিও বক্স যোগ হয়েছে! লেখা সম্পাদনা করুন।', 'success');
  }

  // Silent Auto-Save to Backend API & LocalStorage
  async function saveChangesToBackendSilently() {
    localStorage.setItem('mm_site_content', JSON.stringify(siteData));

    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
    } catch (e) {
      console.warn('Silent save fallback to localStorage');
    }
  }

  // Explicit Save button trigger with toast
  async function saveChangesToBackend() {
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const key = el.getAttribute('data-cms-key');
      let val = el.innerHTML;
      if (el.tagName === 'A' && el.href.startsWith('tel:')) {
        val = el.innerText.replace('☎', '').trim();
      }
      setValueByPath(siteData, key, val);
    });

    const editableSelectors = 'h1, h2, h3, h4, .kicker, p, .svc-card h3, .svc-card p, .pkg-card h3, .pkg-sub, .pkg-price, .pkg-list li, .step-card h3, .step-card p, .why-card h3, .why-card p, .info-line span';
    let elemIndex = 0;
    document.querySelectorAll(editableSelectors).forEach(el => {
      if (el.closest('#cms-admin-bar') || el.closest('.cms-modal') || el.closest('#cms-toast-container')) return;
      const idxKey = pageKey + '_elem_' + elemIndex++;
      if (!el.hasAttribute('data-cms-key')) {
        if (!siteData.customTexts) siteData.customTexts = {};
        siteData.customTexts[idxKey] = el.innerHTML;
      }
    });

    showToast('💾 ব্যাকএন্ডে সেভ করা হচ্ছে...', 'info');

    localStorage.setItem('mm_site_content', JSON.stringify(siteData));

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('🎉 সকল পরিবর্তন ব্যাকএন্ড ডাটাবেসে সফলভাবে সেভ করা হয়েছে!', 'success');
      } else {
        throw new Error('Save error');
      }
    } catch (e) {
      showToast('🎉 পরিবর্তনগুলো ব্রাউজারে সফলভাবে সেভ হয়েছে!', 'success');
    }
  }

  // Utility: Toast messages
  function showToast(msg, type = 'info') {
    const container = document.getElementById('cms-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `cms-toast cms-toast-${type}`;
    toast.innerHTML = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Utility: Nested object path getter/setter
  function getValueByPath(obj, pathStr) {
    return pathStr.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
  }

  function setValueByPath(obj, pathStr, value) {
    const parts = pathStr.split('.');
    let curr = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!curr[parts[i]]) curr[parts[i]] = {};
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
  }

})();
