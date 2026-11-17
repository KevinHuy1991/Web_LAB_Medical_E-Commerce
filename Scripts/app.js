/**
 * MediPharm GPP - Main Application Controller
 */

// Global Filter State
const AppState = {
  currentCategory: 'all',
  currentClassification: 'all', // all | otc | rx | device | supply
  currentSymptom: 'all',
  priceRange: 'all', // all | under-50 | 50-200 | 200-500 | over-500
  targetAudience: 'all',
  origin: 'all',
  searchKeyword: '',
  sortBy: 'popular', // popular | price-asc | price-desc | discount
  cardUnitSelections: {}, // productId -> selectedUnit
  currentDetailProductId: null
};

// Currency Formatter
function formatVND(amount) {
  if (isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount).replace('VND', '₫');
}

// Toast Notification Manager
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '<i class="fa-solid fa-circle-check"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-circle-xmark"></i>';
  if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
  if (type === 'info') icon = '<i class="fa-solid fa-circle-info"></i>';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Cart
  Cart.init();

  // Initialize Product Units map
  PRODUCTS.forEach(p => {
    AppState.cardUnitSelections[p.id] = p.defaultUnit || p.units[0].unit;
  });

  // Render initial views
  renderCategoryMegaBar();
  renderSymptomChips();
  renderProducts();

  // Bind Events
  setupSearchAutocomplete();
  setupFilterEvents();
});

// 1. Render Category Mega Bar
function renderCategoryMegaBar() {
  const container = document.getElementById('category-mega-bar');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <button 
      class="cat-nav-item ${AppState.currentCategory === cat.id ? 'active' : ''}" 
      onclick="selectCategory('${cat.id}')"
    >
      <i class="fa-solid ${cat.icon}"></i>
      <span>${cat.name}</span>
    </button>
  `).join('');
}

// 2. Render Symptom Quick Filter Chips
function renderSymptomChips() {
  const container = document.getElementById('symptom-chips');
  if (!container) return;

  container.innerHTML = `
    <button class="symptom-chip ${AppState.currentSymptom === 'all' ? 'active' : ''}" onclick="selectSymptom('all')">
      <i class="fa-solid fa-list-check"></i> Tất cả triệu chứng
    </button>
    ${SYMPTOM_TAGS.map(sym => `
      <button 
        class="symptom-chip ${AppState.currentSymptom === sym.id ? 'active' : ''}" 
        onclick="selectSymptom('${sym.id}')"
      >
        ${sym.label}
      </button>
    `).join('')}
  `;
}

// 3. Render Product Cards Grid
function renderProducts() {
  const container = document.getElementById('product-grid');
  const countDisplay = document.getElementById('product-count-display');
  const activeFiltersDisplay = document.getElementById('active-filters-tags');
  if (!container) return;

  // Filter products based on AppState
  let filtered = PRODUCTS.filter(p => {
    // Search keyword
    if (AppState.searchKeyword) {
      const q = AppState.searchKeyword.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchIngredient = p.activeIngredient.toLowerCase().includes(q);
      const matchReg = p.regNumber.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchIngredient && !matchReg && !matchDesc) return false;
    }

    // Category
    if (AppState.currentCategory !== 'all' && p.category !== AppState.currentCategory) {
      return false;
    }

    // Classification (OTC, Rx, Device, Supply)
    if (AppState.currentClassification !== 'all' && p.classification !== AppState.currentClassification) {
      return false;
    }

    // Symptom
    if (AppState.currentSymptom !== 'all' && !p.symptoms.includes(AppState.currentSymptom)) {
      return false;
    }

    // Target audience
    if (AppState.targetAudience !== 'all' && p.targetAudience !== AppState.targetAudience) {
      return false;
    }

    // Origin
    if (AppState.origin !== 'all' && !p.origin.toLowerCase().includes(AppState.origin.toLowerCase())) {
      return false;
    }

    // Price range (checked against the default unit price)
    const basePrice = p.units[0].price;
    if (AppState.priceRange === 'under-50' && basePrice >= 50000) return false;
    if (AppState.priceRange === '50-200' && (basePrice < 50000 || basePrice > 200000)) return false;
    if (AppState.priceRange === '200-500' && (basePrice < 200000 || basePrice > 500000)) return false;
    if (AppState.priceRange === 'over-500' && basePrice < 500000) return false;

    return true;
  });

  // Sort
  if (AppState.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.units[0].price - b.units[0].price);
  } else if (AppState.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.units[0].price - a.units[0].price);
  } else if (AppState.sortBy === 'discount') {
    filtered.sort((a, b) => {
      const discA = (a.units[0].originalPrice || 0) - a.units[0].price;
      const discB = (b.units[0].originalPrice || 0) - b.units[0].price;
      return discB - discA;
    });
  } else {
    // popular
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Update Count
  if (countDisplay) {
    countDisplay.textContent = `${filtered.length} sản phẩm phù hợp`;
  }

  // Render Active Filter Tags
  if (activeFiltersDisplay) {
    const tags = [];
    if (AppState.searchKeyword) tags.push(`Tìm kiếm: "${AppState.searchKeyword}"`);
    if (AppState.currentCategory !== 'all') {
      const cat = CATEGORIES.find(c => c.id === AppState.currentCategory);
      if (cat) tags.push(cat.name);
    }
    if (AppState.currentClassification !== 'all') {
      const text = AppState.currentClassification === 'otc' ? 'Thuốc không kê đơn (OTC)' : AppState.currentClassification === 'rx' ? 'Thuốc kê đơn (Rx)' : 'Thiết bị & Vật tư';
      tags.push(text);
    }
    if (AppState.currentSymptom !== 'all') {
      const sym = SYMPTOM_TAGS.find(s => s.id === AppState.currentSymptom);
      if (sym) tags.push(`Triệu chứng: ${sym.label}`);
    }
    if (AppState.targetAudience !== 'all') tags.push(`Đối tượng: ${AppState.targetAudience}`);
    if (AppState.origin !== 'all') tags.push(`Xuất xứ: ${AppState.origin}`);

    activeFiltersDisplay.innerHTML = tags.map(t => `
      <span class="active-filter-tag">
        ${t}
        <i class="fa-solid fa-xmark" onclick="clearSpecificFilter('${t}')"></i>
      </span>
    `).join('');
  }

  // Render HTML Cards
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-prescription-bottle-medical"></i>
        <h3>Không tìm thấy sản phẩm nào phù hợp</h3>
        <p>Vui lòng thử điều chỉnh lại bộ lọc hoặc tìm kiếm theo hoạt chất, tên thuốc khác.</p>
        <button class="btn btn-primary" onclick="resetAllFilters()">Đặt lại tất cả bộ lọc</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const selectedUnitName = AppState.cardUnitSelections[product.id] || product.defaultUnit;
    const currentUnitObj = product.units.find(u => u.unit === selectedUnitName) || product.units[0];
    const isRx = product.classification === 'rx';

    // Classification badge
    let badgeClass = 'badge-otc';
    let badgeText = 'Thuốc OTC';
    let actionBtnText = '<i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ';
    let actionBtnClass = 'btn-add-cart';

    if (isRx) {
      badgeClass = 'badge-rx';
      badgeText = 'Thuốc kê đơn (Rx)';
      actionBtnText = '<i class="fa-solid fa-file-prescription"></i> Mua theo toa';
      actionBtnClass = 'btn-rx-action';
    } else if (product.classification === 'device') {
      badgeClass = 'badge-device';
      badgeText = 'Thiết bị y tế';
    } else if (product.classification === 'supply') {
      badgeClass = 'badge-supply';
      badgeText = 'Vật tư y tế';
    }

    return `
      <div class="product-card" id="card-${product.id}">
        <!-- Top Badge -->
        <div class="card-badges">
          <span class="badge ${badgeClass}">${badgeText}</span>
          ${currentUnitObj.originalPrice > currentUnitObj.price ? `
            <span class="badge badge-sale">
              -${Math.round(((currentUnitObj.originalPrice - currentUnitObj.price) / currentUnitObj.originalPrice) * 100)}%
            </span>
          ` : ''}
        </div>

        <!-- Product Image & Quick View -->
        <div class="product-img-wrap" onclick="openProductDetail('${product.id}')">
          <img src="${product.image}" alt="${product.name}" loading="lazy" class="product-img" />
          <button class="quick-view-btn" title="Xem chi tiết dược lý">
            <i class="fa-solid fa-eye"></i> Xem dược lý
          </button>
        </div>

        <!-- Product Details -->
        <div class="product-body">
          <div class="product-meta">
            <span class="product-origin">${product.origin.split('(')[0]}</span>
            <span class="product-reg">SĐK: ${product.regNumber}</span>
          </div>

          <h3 class="product-title" onclick="openProductDetail('${product.id}')" title="${product.name}">
            ${product.name}
          </h3>

          <div class="product-ingredient" title="${product.activeIngredient}">
            <i class="fa-solid fa-atom"></i> ${product.activeIngredient}
          </div>

          <div class="product-spec">
            <i class="fa-solid fa-box-archive"></i> ${product.packageSpec}
          </div>

          <!-- Multi-Unit Dynamic Selector (Rất quan trọng) -->
          <div class="unit-selector-wrap">
            <span class="unit-label">Đơn vị tính:</span>
            <div class="unit-buttons">
              ${product.units.map(u => `
                <button 
                  type="button" 
                  class="unit-btn ${u.unit === selectedUnitName ? 'active' : ''}" 
                  onclick="selectCardUnit('${product.id}', '${u.unit}')"
                >
                  ${u.unit}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Dynamic Price Display -->
          <div class="price-row">
            <div>
              <span class="current-price" id="price-${product.id}">${formatVND(currentUnitObj.price)}</span>
              <span class="price-unit">/${selectedUnitName}</span>
            </div>
            ${currentUnitObj.originalPrice > currentUnitObj.price ? `
              <span class="original-price" id="orig-price-${product.id}">
                ${formatVND(currentUnitObj.originalPrice)}
              </span>
            ` : ''}
          </div>

          <!-- Actions -->
          <div class="card-actions">
            ${isRx ? `
              <button 
                class="btn ${actionBtnClass}" 
                onclick="handleRxCardClick('${product.id}')"
              >
                ${actionBtnText}
              </button>
            ` : `
              <button 
                class="btn ${actionBtnClass}" 
                onclick="Cart.addItem('${product.id}', AppState.cardUnitSelections['${product.id}'])"
              >
                ${actionBtnText}
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Change unit on specific card dynamically
function selectCardUnit(productId, newUnitName) {
  AppState.cardUnitSelections[productId] = newUnitName;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const targetUnit = product.units.find(u => u.unit === newUnitName);
  if (!targetUnit) return;

  // Update card DOM directly without full re-render for speed
  const card = document.getElementById(`card-${productId}`);
  if (card) {
    const unitBtns = card.querySelectorAll('.unit-btn');
    unitBtns.forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === newUnitName);
    });

    const priceEl = card.querySelector(`#price-${productId}`);
    if (priceEl) priceEl.textContent = formatVND(targetUnit.price);

    const priceUnitEl = card.querySelector('.price-unit');
    if (priceUnitEl) priceUnitEl.textContent = `/${newUnitName}`;

    const origPriceEl = card.querySelector(`#orig-price-${productId}`);
    if (origPriceEl && targetUnit.originalPrice > targetUnit.price) {
      origPriceEl.textContent = formatVND(targetUnit.originalPrice);
      origPriceEl.style.display = 'inline';
    } else if (origPriceEl) {
      origPriceEl.style.display = 'none';
    }
  }
}

// Handle Rx drug card click
function handleRxCardClick(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Prompt patient: Rx medicine requires prescription, open Upload Rx or add to cart with prompt
  const confirmAdd = confirm(
    `[THUỐC KÊ ĐƠN (Rx)]\n"${product.name}" là thuốc thuộc danh mục BẮT BUỘC có đơn thuốc của bác sĩ.\n\n` +
    `• Bấm OK để Tải lên đơn thuốc bác sĩ ngay bây giờ.\n` +
    `• Bấm Cancel để thêm vào giỏ hàng và bổ sung đơn thuốc lúc thanh toán.`
  );

  if (confirmAdd) {
    openPrescriptionModal();
  } else {
    Cart.addItem(productId, AppState.cardUnitSelections[productId]);
    showToast('Cảnh báo an toàn thuốc', 'Thuốc kê đơn đã thêm vào giỏ. Dược sĩ sẽ liên hệ xác nhận toa trước khi gửi.', 'warning');
  }
}

// 5. Open Product Detail Modal
function openProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  AppState.currentDetailProductId = productId;
  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  const selectedUnitName = AppState.cardUnitSelections[productId] || product.defaultUnit;
  const currentUnitObj = product.units.find(u => u.unit === selectedUnitName) || product.units[0];
  const isRx = product.classification === 'rx';

  // Populate data
  document.getElementById('modal-product-img').src = product.image;
  document.getElementById('modal-product-img').alt = product.name;
  document.getElementById('modal-product-title').textContent = product.name;
  document.getElementById('modal-product-ingredient').textContent = product.activeIngredient;
  document.getElementById('modal-product-reg').textContent = product.regNumber;
  document.getElementById('modal-product-brand').textContent = product.origin;
  document.getElementById('modal-product-manufacturer').textContent = product.manufacturer;
  document.getElementById('modal-product-spec').textContent = product.packageSpec;
  document.getElementById('modal-product-stock').textContent = `${product.inStock} ${selectedUnitName}`;

  // Classification Badge
  const badgeEl = document.getElementById('modal-product-badge');
  badgeEl.className = `badge ${isRx ? 'badge-rx' : product.classification === 'device' ? 'badge-device' : 'badge-otc'}`;
  badgeEl.textContent = isRx ? 'Thuốc kê đơn (Rx - Cần tư vấn)' : product.classification === 'device' ? 'Thiết bị y tế' : 'Thuốc không kê đơn (OTC)';

  // Prices
  document.getElementById('modal-price').textContent = formatVND(currentUnitObj.price);
  document.getElementById('modal-unit-label').textContent = `/${selectedUnitName}`;

  // Unit buttons inside modal
  const modalUnitContainer = document.getElementById('modal-unit-options');
  modalUnitContainer.innerHTML = product.units.map(u => `
    <button 
      class="unit-btn ${u.unit === selectedUnitName ? 'active' : ''}" 
      onclick="selectModalUnit('${u.unit}')"
    >
      ${u.unit} (${formatVND(u.price)})
    </button>
  `).join('');

  // Quantity input
  document.getElementById('modal-qty-input').value = 1;

  // Pharmacology tabs
  document.getElementById('tab-indication').textContent = product.pharmacology.indication;
  document.getElementById('tab-dosage').textContent = product.pharmacology.dosage;
  document.getElementById('tab-contraindication').textContent = product.pharmacology.contraindication;
  document.getElementById('tab-warning').textContent = product.pharmacology.warning;
  document.getElementById('tab-storage').textContent = product.pharmacology.storage;

  // Set default tab to Indication
  switchDetailTab('indication');

  // Open modal
  modal.classList.add('show');
}

function selectModalUnit(unitName) {
  const product = PRODUCTS.find(p => p.id === AppState.currentDetailProductId);
  if (!product) return;

  AppState.cardUnitSelections[product.id] = unitName;
  const unitObj = product.units.find(u => u.unit === unitName);
  if (!unitObj) return;

  document.getElementById('modal-price').textContent = formatVND(unitObj.price);
  document.getElementById('modal-unit-label').textContent = `/${unitName}`;
  document.getElementById('modal-product-stock').textContent = `${product.inStock} ${unitName}`;

  // update active unit buttons
  const btns = document.querySelectorAll('#modal-unit-options .unit-btn');
  btns.forEach(b => b.classList.toggle('active', b.textContent.includes(unitName)));

  // also sync card
  selectCardUnit(product.id, unitName);
}

function updateModalQty(delta) {
  const input = document.getElementById('modal-qty-input');
  let val = parseInt(input.value) || 1;
  val = Math.max(1, val + delta);
  input.value = val;
}

function addModalItemToCart() {
  const product = PRODUCTS.find(p => p.id === AppState.currentDetailProductId);
  if (!product) return;

  const qty = parseInt(document.getElementById('modal-qty-input').value) || 1;
  const unitName = AppState.cardUnitSelections[product.id] || product.defaultUnit;

  if (product.classification === 'rx') {
    handleRxCardClick(product.id);
  } else {
    Cart.addItem(product.id, unitName, qty);
  }

  closeModal('product-detail-modal');
}

function switchDetailTab(tabId) {
  const tabBtns = document.querySelectorAll('.detail-tab-btn');
  const tabContents = document.querySelectorAll('.detail-tab-pane');

  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  tabContents.forEach(pane => {
    pane.classList.toggle('active', pane.id === `pane-${tabId}`);
  });
}

// 6. Prescription Upload Modal & Submission (Rx Flow)
function openPrescriptionModal() {
  const modal = document.getElementById('prescription-modal');
  if (modal) modal.classList.add('show');
}

function selectSamplePrescription(type) {
  const nameInput = document.getElementById('rx-patient-name');
  const phoneInput = document.getElementById('rx-patient-phone');
  const noteInput = document.getElementById('rx-patient-note');
  const previewImg = document.getElementById('rx-image-preview');

  if (type === 'sample1') {
    nameInput.value = 'Nguyễn Thị Thu Hằng';
    phoneInput.value = '0912888999';
    noteInput.value = 'Toa thuốc khám viêm xoang BV Tai Mũi Họng. Nhờ Dược sĩ lấy liều 7 ngày.';
    previewImg.src = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400';
    previewImg.style.display = 'block';
  } else {
    nameInput.value = 'Trần Minh Quang (Bé 8 tuổi)';
    phoneInput.value = '0988776655';
    noteInput.value = 'Đơn thuốc viêm tiểu phế quản BV Nhi Đồng. Ưu tiên siro dễ uống cho bé.';
    previewImg.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400';
    previewImg.style.display = 'block';
  }
}

function handlePrescriptionFileChange(event) {
  const file = event.target.files[0];
  const previewImg = document.getElementById('rx-image-preview');
  if (file && previewImg) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function submitPrescriptionForm(event) {
  event.preventDefault();
  const name = document.getElementById('rx-patient-name').value.trim();
  const phone = document.getElementById('rx-patient-phone').value.trim();
  const note = document.getElementById('rx-patient-note').value.trim();
  const callback = document.getElementById('rx-callback-checkbox').checked;
  const previewImg = document.getElementById('rx-image-preview');

  if (!name || !phone) {
    showToast('Thiếu thông tin', 'Vui lòng nhập Họ tên và Số điện thoại liên hệ.', 'error');
    return;
  }

  // Validate VN Phone
  const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;
  if (!vnPhoneRegex.test(phone.replace(/\D/g, ''))) {
    showToast('Số điện thoại không hợp lệ', 'Vui lòng nhập số điện thoại Việt Nam 10 chữ số (03/05/07/08/09...)', 'error');
    return;
  }

  const rxCode = `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRx = {
    code: rxCode,
    createdAt: new Date().toISOString(),
    patientName: name,
    phone: phone,
    prescriptionImageUrl: previewImg.src || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
    note: note,
    requestCallback: callback,
    status: 'pending',
    pharmacistNotes: 'Dược sĩ trực đang kiểm tra đơn thuốc...'
  };

  StorageManager.savePrescription(newRx);
  playInteractionSound('success');

  // Close modal and display success
  closeModal('prescription-modal');

  // Show Success Alert
  alert(
    `✅ GỬI ĐƠN THUỐC THÀNH CÔNG!\n\n` +
    `• Mã phiếu tư vấn: ${rxCode}\n` +
    `• Bệnh nhân: ${name} (${phone})\n` +
    `• Thời gian xử lý: Dược sĩ chuyên môn GPP sẽ liên hệ kiểm tra toa và báo giá trong vòng 15 phút.\n\n` +
    `Quý khách có thể bấm "Tra cứu đơn hàng" trên menu để theo dõi trạng thái phiếu tư vấn này.`
  );

  showToast('Đã tiếp nhận toa thuốc', `Mã phiếu: ${rxCode}`, 'success');
}

// 7. Checkout Flow
function openCheckoutModal() {
  if (Cart.items.length === 0) {
    showToast('Giỏ hàng trống', 'Vui lòng chọn mua sản phẩm trước khi thanh toán.', 'warning');
    return;
  }

  // Close cart drawer
  toggleCartDrawer(false);

  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  const totals = Cart.getTotals();
  document.getElementById('checkout-subtotal').textContent = formatVND(totals.subtotal);
  document.getElementById('checkout-shipping').textContent = totals.shippingFee === 0 ? 'Miễn phí' : formatVND(totals.shippingFee);
  document.getElementById('checkout-discount').textContent = totals.discount > 0 ? `-${formatVND(totals.discount)}` : '0 ₫';
  document.getElementById('checkout-total').textContent = formatVND(totals.total);

  // Rx warning inside checkout
  const checkoutRxAlert = document.getElementById('checkout-rx-alert');
  if (checkoutRxAlert) {
    checkoutRxAlert.style.display = Cart.hasRxItems() ? 'block' : 'none';
  }

  modal.classList.add('show');
}

function handlePaymentMethodChange(method) {
  const vietQrBox = document.getElementById('vietqr-box');
  if (vietQrBox) {
    if (method === 'vietqr') {
      vietQrBox.style.display = 'block';
      // Generate QR text
      const totals = Cart.getTotals();
      const demoOrderCode = `DH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      document.getElementById('vietqr-content-syntax').textContent = `MEDIPHARM ${demoOrderCode}`;
      document.getElementById('vietqr-amount').textContent = formatVND(totals.total);
    } else {
      vietQrBox.style.display = 'none';
    }
  }
}

function toggleVatFields(checked) {
  const vatBox = document.getElementById('vat-fields');
  if (vatBox) {
    vatBox.style.display = checked ? 'block' : 'none';
  }
}

function submitCheckoutOrder(event) {
  event.preventDefault();
  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  const notes = document.getElementById('checkout-notes').value.trim();

  if (!name || !phone || !address) {
    showToast('Thiếu thông tin', 'Vui lòng điền đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.', 'error');
    return;
  }

  // Validate VN Phone
  const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;
  if (!vnPhoneRegex.test(phone.replace(/\D/g, ''))) {
    showToast('Số điện thoại không hợp lệ', 'Vui lòng kiểm tra lại số điện thoại (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09)', 'error');
    return;
  }

  const totals = Cart.getTotals();
  const orderId = `DH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const hasRx = Cart.hasRxItems();

  const newOrder = {
    orderId: orderId,
    createdAt: new Date().toISOString(),
    customerName: name,
    customerPhone: phone,
    deliveryAddress: address,
    deliveryMethod: deliveryMethod,
    paymentMethod: paymentMethod,
    paymentStatus: paymentMethod === 'vietqr' ? 'paid' : 'unpaid',
    status: hasRx ? 'pending_rx' : 'packing',
    hasRxMedicine: hasRx,
    prescriptionCode: hasRx ? 'Kèm theo đơn khi giao' : null,
    items: Cart.items.map(item => ({
      productId: item.productId,
      productName: item.name,
      selectedUnit: item.selectedUnit,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.unitPrice * item.quantity
    })),
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingFee: totals.shippingFee,
    total: totals.total,
    voucherCode: Cart.appliedVoucher,
    estimatedDeliveryTime: deliveryMethod === 'express' ? 'Giao hỏa tốc trong 2 giờ' : 'Giao tiêu chuẩn trong ngày',
    notes: notes
  };

  StorageManager.saveOrder(newOrder);
  Cart.clear();
  playInteractionSound('success');

  // Close Checkout Modal
  closeModal('checkout-modal');

  // Open Order Confirmation E-Invoice Modal
  openOrderSuccessModal(newOrder);
}

function openOrderSuccessModal(order) {
  const modal = document.getElementById('order-success-modal');
  if (!modal) return;

  document.getElementById('success-order-id').textContent = order.orderId;
  document.getElementById('success-customer-name').textContent = order.customerName;
  document.getElementById('success-customer-phone').textContent = order.customerPhone;
  document.getElementById('success-delivery-address').textContent = order.deliveryAddress;
  document.getElementById('success-delivery-time').textContent = order.estimatedDeliveryTime;
  document.getElementById('success-total').textContent = formatVND(order.total);
  document.getElementById('success-payment-method').textContent = order.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận thuốc (COD)' : order.paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR 24/7' : 'Ví điện tử';

  // Items table
  const itemsContainer = document.getElementById('success-order-items');
  itemsContainer.innerHTML = order.items.map(it => `
    <div class="invoice-item-row">
      <span class="invoice-item-name">${it.productName} (ĐVT: ${it.selectedUnit}) x ${it.quantity}</span>
      <span class="invoice-item-price">${formatVND(it.totalPrice)}</span>
    </div>
  `).join('');

  modal.classList.add('show');
}

// 8. Order Tracking Modal
function openOrderTrackingModal() {
  const modal = document.getElementById('order-tracking-modal');
  if (!modal) return;

  renderOrderTrackingList();
  modal.classList.add('show');
}

function renderOrderTrackingList(query = '') {
  const container = document.getElementById('tracking-results-container');
  if (!container) return;

  const orders = StorageManager.getOrders();
  const rxs = StorageManager.getPrescriptions();

  const q = query.trim().toLowerCase();
  const filteredOrders = orders.filter(ord => {
    if (!q) return true;
    return ord.orderId.toLowerCase().includes(q) || ord.customerPhone.includes(q) || ord.customerName.toLowerCase().includes(q);
  });

  if (filteredOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <h3>Không tìm thấy đơn hàng nào</h3>
        <p>Vui lòng kiểm tra lại Số điện thoại hoặc Mã đơn hàng (VD: DH-2026-8492).</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredOrders.map(ord => {
    let statusBadge = '<span class="badge badge-warning"><i class="fa-solid fa-user-doctor"></i> Chờ Dược sĩ duyệt đơn</span>';
    if (ord.status === 'packing') {
      statusBadge = '<span class="badge badge-info"><i class="fa-solid fa-box"></i> Đang đóng gói chuẩn GPP</span>';
    } else if (ord.status === 'delivering') {
      statusBadge = '<span class="badge badge-primary"><i class="fa-solid fa-motorcycle"></i> Đang giao hỏa tốc</span>';
    } else if (ord.status === 'completed') {
      statusBadge = '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Giao thành công</span>';
    } else if (ord.status === 'cancelled') {
      statusBadge = '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Đã hủy đơn</span>';
    }

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div>
            <span class="order-id">${ord.orderId}</span>
            <span class="order-date">(${new Date(ord.createdAt).toLocaleDateString('vi-VN')})</span>
          </div>
          <div>${statusBadge}</div>
        </div>

        <div class="order-card-body">
          <p><strong>Người nhận:</strong> ${ord.customerName} - <strong>ĐT:</strong> ${ord.customerPhone}</p>
          <p><strong>Địa chỉ:</strong> ${ord.deliveryAddress}</p>
          <p><strong>Thời gian dự kiến:</strong> ${ord.estimatedDeliveryTime}</p>
          
          <div class="order-items-mini">
            ${ord.items.map(it => `
              <div class="order-mini-item">
                <span>• ${it.productName} [${it.selectedUnit}] x ${it.quantity}</span>
                <span>${formatVND(it.totalPrice)}</span>
              </div>
            `).join('')}
          </div>

          <div class="order-card-footer">
            <span class="order-total-label">Tổng thanh toán: <strong>${formatVND(ord.total)}</strong></span>
            
            <div class="order-actions">
              ${ord.status !== 'cancelled' && ord.status !== 'completed' ? `
                <button class="btn btn-sm btn-outline-danger" onclick="cancelOrderPrompt('${ord.orderId}')">
                  Hủy đơn
                </button>
              ` : ''}
              <button class="btn btn-sm btn-primary" onclick="reorderItems('${ord.orderId}')">
                <i class="fa-solid fa-rotate-right"></i> Mua lại đơn này
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function searchTrackingOrders() {
  const query = document.getElementById('tracking-search-input').value;
  renderOrderTrackingList(query);
}

function cancelOrderPrompt(orderId) {
  const reason = prompt('Vui lòng cho biết lý do hủy đơn (VD: Bận đột xuất, Mua nhầm sản phẩm, Thay đổi địa chỉ):');
  if (reason !== null) {
    StorageManager.updateOrderStatus(orderId, 'cancelled');
    renderOrderTrackingList(document.getElementById('tracking-search-input').value);
    showToast('Đã hủy đơn hàng', `Đơn hàng ${orderId} đã được hủy thành công.`, 'info');
  }
}

function reorderItems(orderId) {
  const orders = StorageManager.getOrders();
  const ord = orders.find(o => o.orderId === orderId);
  if (!ord) return;

  ord.items.forEach(it => {
    Cart.addItem(it.productId, it.selectedUnit, it.quantity);
  });

  closeModal('order-tracking-modal');
  toggleCartDrawer(true);
  showToast('Đã nạp lại giỏ hàng', 'Các sản phẩm từ đơn cũ đã được thêm vào giỏ.', 'success');
}

// 9. BMI Calculator & Advisory Modal
function openBmiModal() {
  const modal = document.getElementById('bmi-modal');
  if (modal) modal.classList.add('show');
}

function calculateBmi(event) {
  event.preventDefault();
  const heightCm = parseFloat(document.getElementById('bmi-height').value);
  const weightKg = parseFloat(document.getElementById('bmi-weight').value);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    showToast('Lỗi nhập liệu', 'Vui lòng nhập chiều cao và cân nặng hợp lệ.', 'error');
    return;
  }

  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  const resultContainer = document.getElementById('bmi-result-box');
  const bmiValueEl = document.getElementById('bmi-value');
  const bmiCategoryEl = document.getElementById('bmi-category');
  const bmiAdviceEl = document.getElementById('bmi-advice');

  bmiValueEl.textContent = bmi;

  let category = '';
  let advice = '';
  let color = '#10B981';

  if (bmi < 18.5) {
    category = 'Thiếu cân (Gầy)';
    color = '#F59E0B';
    advice = 'Khuyên dùng: Bổ sung Men vi sinh Enterogermina tăng hấp thu dinh dưỡng và Viên sủi bổ sung năng lượng Berocca.';
  } else if (bmi < 24.9) {
    category = 'Thể trạng Cân đối (Chuẩn y khoa)';
    color = '#10B981';
    advice = 'Chúc mừng bạn! Hãy duy trì lối sống lành mạnh, bổ sung Dầu cá Omega-3 định kỳ để bảo vệ tim mạch và thị lực.';
  } else if (bmi < 29.9) {
    category = 'Thừa cân';
    color = '#F97316';
    advice = 'Khuyên dùng: Hạn chế tinh bột xấu, tăng cường vận động và theo dõi huyết áp định kỳ bằng Máy đo huyết áp Omron.';
  } else {
    category = 'Béo phì';
    color = '#EF4444';
    advice = 'Cảnh báo nguy cơ cao về tim mạch và mỡ máu. Nên đo huyết áp mỗi ngày và tham khảo tư vấn của Dược sĩ chuyên môn.';
  }

  bmiCategoryEl.textContent = category;
  bmiCategoryEl.style.color = color;
  bmiAdviceEl.textContent = advice;

  resultContainer.style.display = 'block';
  playInteractionSound('success');
}

// 10. Drawer & Modal Common Handlers
function toggleCartDrawer(open) {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    if (open) {
      drawer.classList.add('open');
      overlay.classList.add('show');
    } else {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

// Close modals on ESC or clicking outside
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
    toggleCartDrawer(false);
  }
});

// 11. Search Autocomplete & Filter Bindings
function setupSearchAutocomplete() {
  const input = document.getElementById('main-search-input');
  const suggestionsBox = document.getElementById('search-suggestions');
  if (!input || !suggestionsBox) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    AppState.searchKeyword = q;
    renderProducts();

    if (!q) {
      suggestionsBox.style.display = 'none';
      return;
    }

    const matches = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.activeIngredient.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 5);

    if (matches.length > 0) {
      suggestionsBox.innerHTML = matches.map(p => `
        <div class="search-sugg-item" onclick="selectSuggestion('${p.name.replace(/'/g, "\\'")}')">
          <img src="${p.image}" alt="${p.name}" class="sugg-thumb" />
          <div>
            <div class="sugg-name">${p.name}</div>
            <div class="sugg-sub">${p.activeIngredient} • ${formatVND(p.units[0].price)}/${p.units[0].unit}</div>
          </div>
        </div>
      `).join('');
      suggestionsBox.style.display = 'block';
    } else {
      suggestionsBox.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = 'none';
    }
  });
}

function selectSuggestion(name) {
  const input = document.getElementById('main-search-input');
  if (input) input.value = name;
  AppState.searchKeyword = name;
  document.getElementById('search-suggestions').style.display = 'none';
  renderProducts();
}

function setupFilterEvents() {
  // Sort By
  const sortSelect = document.getElementById('sort-by-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Sidebar Filter by Classification
  const classRadios = document.querySelectorAll('input[name="filter-class"]');
  classRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.currentClassification = e.target.value;
      renderProducts();
    });
  });

  // Sidebar Filter by Price Range
  const priceRadios = document.querySelectorAll('input[name="filter-price"]');
  priceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.priceRange = e.target.value;
      renderProducts();
    });
  });

  // Target audience
  const audienceRadios = document.querySelectorAll('input[name="filter-audience"]');
  audienceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.targetAudience = e.target.value;
      renderProducts();
    });
  });

  // Origin
  const originRadios = document.querySelectorAll('input[name="filter-origin"]');
  originRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.origin = e.target.value;
      renderProducts();
    });
  });
}

function selectCategory(catId) {
  AppState.currentCategory = catId;
  renderCategoryMegaBar();
  renderProducts();
  
  // Smooth scroll to product catalog
  const section = document.getElementById('catalog-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function selectSymptom(symptomId) {
  AppState.currentSymptom = symptomId;
  renderSymptomChips();
  renderProducts();
}

function resetAllFilters() {
  AppState.currentCategory = 'all';
  AppState.currentClassification = 'all';
  AppState.currentSymptom = 'all';
  AppState.priceRange = 'all';
  AppState.targetAudience = 'all';
  AppState.origin = 'all';
  AppState.searchKeyword = '';

  const searchInput = document.getElementById('main-search-input');
  if (searchInput) searchInput.value = '';

  // reset all radio inputs
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    if (r.value === 'all') r.checked = true;
  });

  renderCategoryMegaBar();
  renderSymptomChips();
  renderProducts();
  showToast('Đã đặt lại bộ lọc', 'Hiển thị toàn bộ danh mục sản phẩm', 'info');
}

function clearSpecificFilter(tagText) {
  if (tagText.startsWith('Tìm kiếm:')) {
    AppState.searchKeyword = '';
    const input = document.getElementById('main-search-input');
    if (input) input.value = '';
  } else if (tagText.startsWith('Triệu chứng:')) {
    AppState.currentSymptom = 'all';
    renderSymptomChips();
  } else {
    AppState.currentCategory = 'all';
    AppState.currentClassification = 'all';
    AppState.targetAudience = 'all';
    AppState.origin = 'all';
    renderCategoryMegaBar();
  }
  renderProducts();
}

function applyVoucherFromDrawer() {
  const input = document.getElementById('drawer-voucher-input');
  if (!input) return;

  const res = Cart.applyVoucher(input.value);
  if (res.success) {
    showToast('Áp mã thành công!', res.message, 'success');
  } else {
    showToast('Lỗi áp mã', res.message, 'error');
  }
}
