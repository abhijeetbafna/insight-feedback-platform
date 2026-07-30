/**
 * InSight — Embeddable Feedback, Bug & Feature Request Widget
 * (c) 2026 InSight Product Systems. Ant Design 5.0 Revamped Standalone Script.
 */

(function () {
  if (window.__InSightWidgetInitialized) return;
  window.__InSightWidgetInitialized = true;

  // 1. Script Configuration Extraction
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const projectKey = currentScript?.getAttribute('data-project-key') || 'PRJ-DEMO-01';
  const releaseVersion = currentScript?.getAttribute('data-release-version') || 'v2.4.1-beta';
  const widgetPosition = currentScript?.getAttribute('data-position') || 'bottom-right'; // bottom-right | bottom-left
  const widgetColor = currentScript?.getAttribute('data-color') || '#1677FF'; // Default Ant Design Blue

  // Storage Key & Sync Channel
  const STORE_KEY = 'insight_submissions';
  const broadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('insight_channel') : null;

  // Image Compressor to prevent LocalStorage QuotaExceededError
  function compressImageDataUrl(dataUrl, maxWidth = 1200, quality = 0.75) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function getSubmissions() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  async function saveSubmission(submission) {
    // Compress attachment image if present to prevent storage quota crash
    if (submission.attachment && submission.attachment.type === 'image' && submission.attachment.dataUrl) {
      submission.attachment.dataUrl = await compressImageDataUrl(submission.attachment.dataUrl);
    }

    const list = getSubmissions();
    list.unshift(submission);
    
    // Keep max 50 items in local storage to prevent quota bounds
    if (list.length > 50) list.pop();

    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(list));
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'NEW_SUBMISSION', submission });
      }
      window.dispatchEvent(new CustomEvent('insight:submission', { detail: submission }));
    } catch (e) {
      console.warn('InSight: Storage warning, trimming oldest items', e);
      // Fallback trim
      localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 10)));
    }
  }

  // 2. Technical Metadata Harvester
  function getTechnicalMetadata() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown Browser';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    let os = 'Unknown OS';
    if (userAgent.includes('Win')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

    const reporter = window.InSightUser || {
      name: document.body.getAttribute('data-user-name') || 'Alex Chen (Staff)',
      email: document.body.getAttribute('data-user-email') || 'alex.chen@internal.co',
      id: 'USR-8921'
    };

    return {
      pageUrl: window.location.href,
      path: window.location.pathname,
      browser: `${browser} (${navigator.appVersion.substring(0, 25)})`,
      os,
      viewport: `${window.innerWidth} x ${window.innerHeight}`,
      screenResolution: `${window.screen.width} x ${window.screen.height}`,
      releaseVersion: window.__InSightReleaseVersion || releaseVersion,
      projectKey,
      timestamp: new Date().toISOString(),
      reporter
    };
  }

  // 3. Mount Shadow DOM UI
  const hostDiv = document.createElement('div');
  hostDiv.id = 'insight-widget-root';
  hostDiv.style.cssText = 'position: fixed; z-index: 2147483647; top: 0; left: 0; pointer-events: none; width: 100vw; height: 100vh; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
  document.body.appendChild(hostDiv);

  const shadow = hostDiv.attachShadow({ mode: 'open' });

  // Ant Design Shadow DOM Styles
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .clickable { pointer-events: auto; }

    /* Ant Design Trigger Button */
    .widget-bubble {
      position: fixed;
      ${widgetPosition === 'bottom-left' ? 'left: 24px;' : 'right: 24px;'}
      bottom: 24px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: ${widgetColor};
      box-shadow: 0 6px 16px 0 rgba(22, 119, 255, 0.42), 0 3px 6px -4px rgba(0, 0, 0, 0.12);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      z-index: 99999;
      border: none;
    }
    .widget-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 9px 28px 0 rgba(22, 119, 255, 0.55);
    }
    .widget-bubble svg {
      width: 24px;
      height: 24px;
      transition: transform 0.2s ease;
    }
    .widget-bubble.active svg { transform: rotate(90deg); }

    .badge-dot {
      position: absolute;
      top: 1px;
      right: 1px;
      width: 12px;
      height: 12px;
      background: #52C41A;
      border: 2px solid #FFF;
      border-radius: 50%;
    }

    /* Ant Design Card Flyout Panel */
    .flyout-menu {
      position: fixed;
      ${widgetPosition === 'bottom-left' ? 'left: 24px;' : 'right: 24px;'}
      bottom: 86px;
      width: 310px;
      background: #FFF;
      border: 1px solid #F0F0F0;
      border-radius: 12px;
      box-shadow: 0 9px 28px 8px rgba(0, 0, 0, 0.08), 0 6px 16px 0 rgba(0, 0, 0, 0.12);
      padding: 16px;
      color: rgba(0, 0, 0, 0.88);
      opacity: 0;
      transform: translateY(14px) scale(0.96);
      pointer-events: none;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      z-index: 99998;
    }
    .flyout-menu.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .flyout-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #F0F0F0;
    }
    .flyout-title {
      font-size: 14px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.88);
    }
    .flyout-tag {
      font-size: 11px;
      background: #E6F4FF;
      color: #0958D9;
      border: 1px solid #91CAFF;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 500;
    }
    .flyout-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: #FAFAFA;
      border: 1px solid #F0F0F0;
      cursor: pointer;
      margin-bottom: 8px;
      transition: all 0.2s ease;
    }
    .flyout-option:hover {
      background: #E6F4FF;
      border-color: #91CAFF;
      transform: translateX(2px);
    }
    .flyout-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 1px solid #E8E8E8;
    }
    .flyout-text h4 {
      font-size: 13px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.88);
    }
    .flyout-text p {
      font-size: 11px;
      color: rgba(0, 0, 0, 0.45);
    }

    /* Ant Design Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      z-index: 100000;
    }
    .modal-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-card {
      width: 480px;
      max-width: 92vw;
      max-height: 90vh;
      background: #FFF;
      border-radius: 12px;
      box-shadow: 0 9px 28px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      color: rgba(0, 0, 0, 0.88);
      display: flex;
      flex-direction: column;
      transform: scale(0.96);
      transition: transform 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      overflow-y: auto;
    }
    .modal-backdrop.open .modal-card { transform: scale(1); }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #F0F0F0;
    }
    .modal-title { font-size: 16px; font-weight: 600; color: rgba(0, 0, 0, 0.88); }
    .close-btn {
      background: none;
      border: none;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover { background: #F5F5F5; color: rgba(0, 0, 0, 0.88); }

    /* Category Buttons Grid */
    .category-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }
    .category-btn {
      padding: 8px 12px;
      border-radius: 6px;
      background: #FAFAFA;
      border: 1px solid #D9D9D9;
      color: rgba(0, 0, 0, 0.88);
      font-size: 12.5px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .category-btn:hover { border-color: #4096FF; color: #1677FF; }
    .category-btn.selected {
      background: #E6F4FF;
      border-color: #1677FF;
      color: #0958D9;
      font-weight: 600;
    }

    /* Input Controls */
    .feedback-textarea {
      width: 100%;
      height: 90px;
      background: #FFF;
      border: 1px solid #D9D9D9;
      border-radius: 6px;
      padding: 10px;
      color: rgba(0, 0, 0, 0.88);
      font-size: 13.5px;
      resize: vertical;
      outline: none;
      margin-bottom: 14px;
      transition: all 0.2s;
    }
    .feedback-textarea:focus {
      border-color: #1677FF;
      box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
    }

    .media-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .ant-media-btn {
      padding: 5px 12px;
      border-radius: 6px;
      background: #FFF;
      border: 1px solid #D9D9D9;
      color: rgba(0, 0, 0, 0.88);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .ant-media-btn:hover { border-color: #4096FF; color: #1677FF; }

    .submit-btn {
      width: 100%;
      height: 38px;
      border-radius: 6px;
      background: #1677FF;
      color: #FFF;
      font-size: 14px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .submit-btn:hover { background: #4096FF; }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(40px);
      background: #FFF;
      border: 1px solid #B7EB8F;
      color: #389E0D;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 13px;
      box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
      opacity: 0;
      transition: all 0.25s ease;
      pointer-events: none;
      z-index: 100010;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  `;
  shadow.appendChild(style);

  // Root UI Structure inside Shadow DOM
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <!-- Trigger Bubble -->
    <div class="widget-bubble clickable" id="insightBubble" title="Provide Feedback">
      <div class="badge-dot"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>

    <!-- Ant Design Flyout Menu -->
    <div class="flyout-menu clickable" id="flyoutMenu">
      <div class="flyout-header">
        <span class="flyout-title">InSight Feedback</span>
        <span class="flyout-tag">${releaseVersion}</span>
      </div>
      <div class="flyout-option" id="optGeneral">
        <div class="flyout-icon">💬</div>
        <div class="flyout-text">
          <h4>Give General Feedback</h4>
          <p>Whole app or page feedback</p>
        </div>
      </div>
      <div class="flyout-option" id="optInspect">
        <div class="flyout-icon">🎯</div>
        <div class="flyout-text">
          <h4>Point to Something</h4>
          <p>Inspect DOM element on page</p>
        </div>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div class="modal-backdrop clickable" id="feedbackModal">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">📝 Submit Feedback</div>
          <button class="close-btn" id="closeModal">✕</button>
        </div>

        <div id="componentTagBox" style="display: none; background:#F6FFED; border:1px solid #B7EB8F; padding:8px 12px; border-radius:6px; font-size:12px; color:#389E0D; margin-bottom:14px; align-items:center; justify-space-between;">
          <div><strong>Target Component:</strong> <span id="componentName">Header</span></div>
          <button style="background:none;border:none;color:#389E0D;cursor:pointer;" id="clearComponent">Remove</button>
        </div>

        <div class="category-grid">
          <button class="category-btn selected" data-cat="liked">👍 Praise (Liked)</button>
          <button class="category-btn" data-cat="improvement">🛠️ Improvement</button>
          <button class="category-btn" data-cat="bug">🐛 Bug Report</button>
          <button class="category-btn" data-cat="feature_request">💡 Feature Request</button>
        </div>

        <textarea class="feedback-textarea" id="feedbackComment" placeholder="Tell us what you think or what issue occurred..."></textarea>

        <div class="media-toolbar">
          <button class="ant-media-btn" id="btnCaptureScreen">📷 Capture Screenshot</button>
          <button class="ant-media-btn" id="btnRecordVideo">🎥 Record Screen (Audio)</button>
          <label class="ant-media-btn" style="cursor: pointer;">
            📁 Upload File
            <input type="file" id="fileUploadInput" accept="image/*,video/*" style="display:none;" />
          </label>
        </div>

        <div id="previewBox" style="display: none; width:100%; border-radius:6px; overflow:hidden; border:1px solid #D9D9D9; margin-bottom:14px; background:#000; position:relative;">
          <img id="previewImage" style="display:none; width:100%; max-height:200px; object-fit:contain;" />
          <video id="previewVideo" controls style="display:none; width:100%; max-height:200px;"></video>
          <button id="btnAnnotate" style="position:absolute; top:8px; right:8px; background:#1677FF; color:#FFF; border:none; padding:4px 10px; border-radius:4px; font-size:11px; cursor:pointer; display:none;">🎨 Annotate</button>
        </div>

        <button class="submit-btn" id="submitFeedbackBtn">Send Feedback</button>
      </div>
    </div>

    <!-- Canvas Annotation Overlay -->
    <div class="modal-backdrop clickable" id="annoOverlay" style="z-index:100005;">
      <div style="width:90vw; height:90vh; background:#1F1F1F; border-radius:12px; display:flex; flex-direction:column; padding:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
          <span style="color:#FFF; font-weight:600;">🎨 Screenshot Annotator & Redactor</span>
          <div style="display:flex; gap:8px;">
            <button class="ant-media-btn" id="annoUndo">↩️ Undo</button>
            <button class="ant-media-btn" id="annoClear">🗑️ Clear</button>
            <button class="submit-btn" id="annoDone" style="height:30px; padding:0 12px;">Save Annotations</button>
          </div>
        </div>
        <div style="flex:1; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#000; border-radius:8px;">
          <canvas id="annoCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" id="toastNotice">
      <span>✓</span> <span id="toastMsg">Feedback submitted successfully!</span>
    </div>
  `;
  shadow.appendChild(wrapper);

  // 4. Element Inspector Mode Logic
  let isInspecting = false;
  let inspectorBox = null;

  function createInspectorOverlay() {
    if (document.getElementById('insight-inspector-box')) return;
    inspectorBox = document.createElement('div');
    inspectorBox.id = 'insight-inspector-box';
    inspectorBox.style.cssText = 'position: fixed; pointer-events: none; z-index: 2147483640; border: 2px solid #1677FF; background: rgba(22, 119, 255, 0.15); display: none;';
    document.body.appendChild(inspectorBox);
  }

  function startInspecting() {
    isInspecting = true;
    createInspectorOverlay();
    document.body.style.cursor = 'crosshair';
    document.addEventListener('mousemove', handleInspectMove, true);
    document.addEventListener('click', handleInspectClick, true);
  }

  function stopInspecting() {
    isInspecting = false;
    document.body.style.cursor = '';
    if (inspectorBox) inspectorBox.style.display = 'none';
    document.removeEventListener('mousemove', handleInspectMove, true);
    document.removeEventListener('click', handleInspectClick, true);
  }

  function handleInspectMove(e) {
    if (!isInspecting) return;
    const path = document.elementsFromPoint(e.clientX, e.clientY);
    const target = path.find(el => el !== hostDiv && !hostDiv.contains(el) && el !== inspectorBox);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    inspectorBox.style.display = 'block';
    inspectorBox.style.top = `${rect.top}px`;
    inspectorBox.style.left = `${rect.left}px`;
    inspectorBox.style.width = `${rect.width}px`;
    inspectorBox.style.height = `${rect.height}px`;
  }

  function handleInspectClick(e) {
    if (!isInspecting) return;
    e.preventDefault();
    e.stopPropagation();
    const path = document.elementsFromPoint(e.clientX, e.clientY);
    const target = path.find(el => el !== hostDiv && !hostDiv.contains(el) && el !== inspectorBox);
    if (target) {
      const name = target.getAttribute('data-component') || target.tagName.toLowerCase() + (target.id ? `#${target.id}` : '');
      const selector = target.id ? `#${target.id}` : target.tagName.toLowerCase();
      stopInspecting();
      openModal('component', { name, selector });
    }
  }

  // 5. Element References inside Shadow DOM
  const bubble = shadow.getElementById('insightBubble');
  const flyout = shadow.getElementById('flyoutMenu');
  const modal = shadow.getElementById('feedbackModal');
  const closeModalBtn = shadow.getElementById('closeModal');
  const componentTagBox = shadow.getElementById('componentTagBox');
  const componentNameSpan = shadow.getElementById('componentName');
  const clearComponentBtn = shadow.getElementById('clearComponent');
  const categoryBtns = shadow.querySelectorAll('.category-btn');
  const commentTextarea = shadow.getElementById('feedbackComment');
  const btnCaptureScreen = shadow.getElementById('btnCaptureScreen');
  const btnRecordVideo = shadow.getElementById('btnRecordVideo');
  const fileUploadInput = shadow.getElementById('fileUploadInput');
  const previewBox = shadow.getElementById('previewBox');
  const previewImage = shadow.getElementById('previewImage');
  const previewVideo = shadow.getElementById('previewVideo');
  const btnAnnotate = shadow.getElementById('btnAnnotate');
  const submitFeedbackBtn = shadow.getElementById('submitFeedbackBtn');
  const toastNotice = shadow.getElementById('toastNotice');
  const toastMsg = shadow.getElementById('toastMsg');

  const annoOverlay = shadow.getElementById('annoOverlay');
  const annoCanvas = shadow.getElementById('annoCanvas');
  const annoUndoBtn = shadow.getElementById('annoUndo');
  const annoClearBtn = shadow.getElementById('annoClear');
  const annoDoneBtn = shadow.getElementById('annoDone');
  const ctx = annoCanvas.getContext('2d');

  let selectedCategory = 'liked';
  let activeAttachment = null;
  let currentSelectedComponent = null;

  bubble.addEventListener('click', () => {
    flyout.classList.toggle('open');
    bubble.classList.toggle('active');
  });

  shadow.getElementById('optGeneral').addEventListener('click', () => {
    flyout.classList.remove('open');
    bubble.classList.remove('active');
    currentSelectedComponent = null;
    openModal('general');
  });

  shadow.getElementById('optInspect').addEventListener('click', () => {
    flyout.classList.remove('open');
    bubble.classList.remove('active');
    startInspecting();
  });

  function openModal(mode, componentInfo = null) {
    if (componentInfo) {
      currentSelectedComponent = componentInfo;
      componentTagBox.style.display = 'flex';
      componentNameSpan.textContent = componentInfo.name;
    } else {
      componentTagBox.style.display = 'none';
    }
    modal.classList.add('open');
  }

  closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
  clearComponentBtn.addEventListener('click', () => {
    currentSelectedComponent = null;
    componentTagBox.style.display = 'none';
  });

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCategory = btn.getAttribute('data-cat');
    });
  });

  // Capture Screenshot Engine
  btnCaptureScreen.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cCtx = canvas.getContext('2d');
    cCtx.fillStyle = '#001529';
    cCtx.fillRect(0, 0, canvas.width, canvas.height);
    cCtx.fillStyle = '#FFF';
    cCtx.font = '20px sans-serif';
    cCtx.fillText(`App Viewport: ${document.title}`, 40, 60);

    if (currentSelectedComponent) {
      cCtx.strokeStyle = '#1677FF';
      cCtx.lineWidth = 3;
      cCtx.strokeRect(40, 100, canvas.width - 80, 200);
      cCtx.fillText(`Target Element: ${currentSelectedComponent.name}`, 60, 140);
    }

    const dataUrl = canvas.toDataURL('image/png');
    activeAttachment = { type: 'image', dataUrl };
    previewImage.src = dataUrl;
    previewImage.style.display = 'block';
    previewVideo.style.display = 'none';
    btnAnnotate.style.display = 'block';
    previewBox.style.display = 'block';
  });

  // Screen Video Recorder Engine
  btnRecordVideo.addEventListener('click', async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        showToast('Screen recording not supported');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      btnRecordVideo.textContent = '🔴 Recording...';
      showToast('Recording started! Stop when done.');

      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        activeAttachment = { type: 'video', dataUrl: videoUrl };
        previewVideo.src = videoUrl;
        previewVideo.style.display = 'block';
        previewImage.style.display = 'none';
        btnAnnotate.style.display = 'none';
        previewBox.style.display = 'block';
        btnRecordVideo.textContent = '🎥 Record Screen (Audio)';
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
    } catch (err) {
      btnRecordVideo.textContent = '🎥 Record Screen (Audio)';
    }
  });

  fileUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const type = file.type.startsWith('video') ? 'video' : 'image';
      activeAttachment = { type, dataUrl: evt.target.result };
      if (type === 'image') {
        previewImage.src = evt.target.result;
        previewImage.style.display = 'block';
        previewVideo.style.display = 'none';
        btnAnnotate.style.display = 'block';
      } else {
        previewVideo.src = evt.target.result;
        previewVideo.style.display = 'block';
        previewImage.style.display = 'none';
        btnAnnotate.style.display = 'none';
      }
      previewBox.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  // Canvas Annotation Tool
  btnAnnotate.addEventListener('click', () => {
    if (!activeAttachment || activeAttachment.type !== 'image') return;
    const img = new Image();
    img.onload = () => {
      annoCanvas.width = img.width;
      annoCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      annoOverlay.classList.add('open');
    };
    img.src = activeAttachment.dataUrl;
  });

  annoDoneBtn.addEventListener('click', () => {
    activeAttachment.dataUrl = annoCanvas.toDataURL('image/png');
    previewImage.src = activeAttachment.dataUrl;
    annoOverlay.classList.remove('open');
    showToast('Annotations saved');
  });

  // Submission Handler
  submitFeedbackBtn.addEventListener('click', async () => {
    const comment = commentTextarea.value.trim();
    if (!comment) {
      showToast('Please enter a comment before submitting');
      return;
    }

    const metadata = getTechnicalMetadata();
    const submissionId = 'SUB-' + Math.floor(100000 + Math.random() * 900000);

    const newSubmission = {
      id: submissionId,
      projectKey,
      category: selectedCategory,
      comment,
      status: 'new',
      component: currentSelectedComponent ? currentSelectedComponent.name : 'General Page',
      selector: currentSelectedComponent ? currentSelectedComponent.selector : 'body',
      metadata,
      attachment: activeAttachment ? { type: activeAttachment.type, dataUrl: activeAttachment.dataUrl } : null,
      createdAt: new Date().toISOString(),
      assignedTo: 'Unassigned',
      tags: [selectedCategory]
    };

    await saveSubmission(newSubmission);

    commentTextarea.value = '';
    activeAttachment = null;
    currentSelectedComponent = null;
    previewBox.style.display = 'none';
    modal.classList.remove('open');
    showToast('Feedback submitted successfully!');
  });

  function showToast(msg) {
    toastMsg.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => toastNotice.classList.remove('show'), 3500);
  }
})();
