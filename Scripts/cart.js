/**
 * MediPharm GPP - Shopping Cart Logic & Drawer
 */

const Cart = {
  items: [],
  appliedVoucher: null,

  init() {
    this.items = StorageManager.getCart();
    this.render();
    this.renderCartPage();
    this.renderCheckoutSummary();
  },

  addItem(productId, selectedUnitName, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const unitObj = product.units.find(u => u.unit === selectedUnitName) || product.units[0];
    const unitPrice = unitObj.price;

    // Item identifier based on productId + selectedUnit
    const existingIndex = this.items.findIndex(
      item => item.productId === productId && item.selectedUnit === selectedUnitName
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        classification: product.classification,
        strength: product.strength,
        selectedUnit: selectedUnitName,
        unitPrice: unitPrice,
        originalUnitPrice: unitObj.originalPrice,
        quantity: quantity,
        allUnits: product.units
      });
    }

    StorageManager.saveCart(this.items);
    this.render();
    this.renderCartPage();
    this.renderCheckoutSummary();
    playInteractionSound('add');
    showToast('Đã thêm vào giỏ hàng!', `${product.name} (${selectedUnitName})`, 'success');
  },

  updateQuantity(productId, selectedUnitName, delta) {
    const index = this.items.findIndex(
      item => item.productId === productId && item.selectedUnit === selectedUnitName
    );
    if (index === -1) return;

    this.items[index].quantity += delta;
    if (this.items[index].quantity <= 0) {
      this.items.splice(index, 1);
      playInteractionSound('delete');
      showToast('Đã xóa sản phẩm', 'Sản phẩm đã được loại khỏi giỏ hàng', 'info');
    } else {
      playInteractionSound('add');
    }

    StorageManager.saveCart(this.items);
    this.render();
    this.renderCartPage();
    this.renderCheckoutSummary();
  },

  changeUnit(productId, oldUnitName, newUnitName) {
    const item = this.items.find(
      i => i.productId === productId && i.selectedUnit === oldUnitName
    );
    if (!item) return;

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const targetUnitObj = product.units.find(u => u.unit === newUnitName);
    if (!targetUnitObj) return;

    // Check if new unit already exists in cart, merge if so
    const existingTargetIndex = this.items.findIndex(
      i => i.productId === productId && i.selectedUnit === newUnitName
    );

    if (existingTargetIndex > -1 && existingTargetIndex !== this.items.indexOf(item)) {
      this.items[existingTargetIndex].quantity += item.quantity;
      const oldIndex = this.items.indexOf(item);
      this.items.splice(oldIndex, 1);
    } else {
      item.selectedUnit = newUnitName;
      item.unitPrice = targetUnitObj.price;
      item.originalUnitPrice = targetUnitObj.originalPrice;
    }

    StorageManager.saveCart(this.items);
    this.render();
    this.renderCartPage();
    this.renderCheckoutSummary();
    showToast('Đã đổi đơn vị tính', `${product.name} chuyển sang ${newUnitName}`, 'info');
  },

  removeItem(productId, selectedUnitName) {
    this.items = this.items.filter(
      item => !(item.productId === productId && item.selectedUnit === selectedUnitName)
    );
    StorageManager.saveCart(this.items);
    this.render();
    this.renderCartPage();
    this.renderCheckoutSummary();
    playInteractionSound('delete');
    showToast('Đã xóa khỏi giỏ', 'Sản phẩm đã được xóa khỏi giỏ hàng', 'info');
  },

  clear() {
    this.items = [];
    this.appliedVoucher = null;
    StorageManager.saveCart(this.items);
    this.render();
    this.renderCartPage();
    this.renderCheckoutSummary();
  },

  hasRxItems() {
    return this.items.some(item => item.classification === 'rx');
  },

  getTotals() {
    let subtotal = 0;
    let totalItems = 0;

    this.items.forEach(item => {
      subtotal += item.unitPrice * item.quantity;
      totalItems += item.quantity;
    });

    let discount = 0;
    let shippingFee = subtotal >= 300000 || subtotal === 0 ? 0 : 25000;

    if (this.appliedVoucher) {
      const v = VALID_VOUCHERS[this.appliedVoucher];
      if (v) {
        if (v.discount && subtotal >= v.minOrder) {
          discount = v.discount;
        } else if (v.percent && subtotal >= v.minOrder) {
          discount = Math.min((subtotal * v.percent) / 100, v.maxDiscount);
        }
        if (v.isFreeShip && subtotal >= v.minOrder) {
          shippingFee = 0;
        }
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);

    return {
      subtotal,
      discount,
      shippingFee,
      total,
      totalItems
    };
  },

  applyVoucher(code) {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Vui lòng nhập mã giảm giá' };

    const voucher = VALID_VOUCHERS[cleanCode];
    if (!voucher) {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' };
    }

    const totals = this.getTotals();
    if (totals.subtotal < voucher.minOrder) {
      return {
        success: false,
        message: `Đơn hàng tối thiểu ${formatVND(voucher.minOrder)} để áp dụng mã này`
      };
    }

    this.appliedVoucher = cleanCode;
    this.render();
    this.renderCartPage();
    this.renderCheckoutSummary();
    playInteractionSound('success');
    return {
      success: true,
      message: `Đã áp dụng mã ${cleanCode}: ${voucher.desc}`
    };
  },

  removeVoucher() {
    this.appliedVoucher = null;
    this.render();
    this.renderCartPage();
    this.renderCheckoutSummary();
    showToast('Đã gỡ mã giảm giá', '', 'info');
  },

  // Render Cart Drawer
  render() {
    const totals = this.getTotals();
    const cartBadge = document.getElementById('cart-badge');
    const mobileCartBadge = document.getElementById('mobile-cart-badge');
    const cartTotalPreview = document.getElementById('cart-total-preview');

    if (cartBadge) {
      cartBadge.textContent = totals.totalItems;
      cartBadge.style.display = totals.totalItems > 0 ? 'flex' : 'none';
    }
    if (mobileCartBadge) {
      mobileCartBadge.textContent = totals.totalItems;
      mobileCartBadge.style.display = totals.totalItems > 0 ? 'flex' : 'none';
    }
    if (cartTotalPreview) {
      cartTotalPreview.textContent = formatVND(totals.subtotal);
    }

    const drawerBody = document.getElementById('cart-drawer-items');
    const drawerFooter = document.getElementById('cart-drawer-footer');
    const drawerEmpty = document.getElementById('cart-drawer-empty');
    const rxAlert = document.getElementById('cart-rx-alert');

    if (!drawerBody) return;

    if (this.items.length === 0) {
      drawerBody.innerHTML = '';
      if (drawerEmpty) drawerEmpty.style.display = 'flex';
      if (drawerFooter) drawerFooter.style.display = 'none';
      if (rxAlert) rxAlert.style.display = 'none';
      return;
    }

    if (drawerEmpty) drawerEmpty.style.display = 'none';
    if (drawerFooter) drawerFooter.style.display = 'block';

    if (rxAlert) {
      rxAlert.style.display = this.hasRxItems() ? 'flex' : 'none';
    }

    drawerBody.innerHTML = this.items.map(item => {
      const isRx = item.classification === 'rx';
      const badgeClass = isRx ? 'badge-rx' : item.classification === 'device' ? 'badge-device' : 'badge-otc';
      const badgeText = isRx ? 'Thuốc Rx' : item.classification === 'device' ? 'Thiết bị' : 'OTC';

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <div class="cart-item-head">
              <span class="badge ${badgeClass}">${badgeText}</span>
              <button class="cart-item-del" onclick="Cart.removeItem('${item.productId}', '${item.selectedUnit}')" title="Xóa">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <h4 class="cart-item-title"><a href="product-detail.html?id=${item.productId}">${item.name}</a></h4>
            <p class="cart-item-sub">${item.strength}</p>
            
            <div class="cart-item-controls">
              <div class="cart-item-unit">
                <label>ĐVT:</label>
                <select onchange="Cart.changeUnit('${item.productId}', '${item.selectedUnit}', this.value)">
                  ${item.allUnits.map(u => `
                    <option value="${u.unit}" ${u.unit === item.selectedUnit ? 'selected' : ''}>
                      ${u.unit} (${formatVND(u.price)})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="qty-control">
                <button onclick="Cart.updateQuantity('${item.productId}', '${item.selectedUnit}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="Cart.updateQuantity('${item.productId}', '${item.selectedUnit}', 1)">+</button>
              </div>
            </div>

            <div class="cart-item-price-row">
              <span class="cart-item-price">${formatVND(item.unitPrice * item.quantity)}</span>
              ${item.quantity > 1 ? `<span class="cart-item-unit-note">(${formatVND(item.unitPrice)}/${item.selectedUnit})</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = formatVND(totals.subtotal);

    const shippingEl = document.getElementById('cart-shipping');
    if (shippingEl) shippingEl.textContent = totals.shippingFee === 0 ? 'Miễn phí' : formatVND(totals.shippingFee);
    
    const discountRow = document.getElementById('cart-discount-row');
    if (discountRow) {
      if (totals.discount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('cart-discount').textContent = `-${formatVND(totals.discount)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    const grandTotalEl = document.getElementById('cart-grand-total');
    if (grandTotalEl) grandTotalEl.textContent = formatVND(totals.total);

    const freeShipProgress = document.getElementById('free-shipping-progress');
    const freeShipText = document.getElementById('free-shipping-text');
    if (freeShipProgress && freeShipText) {
      if (totals.subtotal >= 300000) {
        freeShipProgress.style.width = '100%';
        freeShipProgress.classList.add('bg-success');
        freeShipText.innerHTML = '<i class="fa-solid fa-circle-check text-success"></i> Đơn hàng đã được <strong>Miễn phí giao hàng</strong>!';
      } else {
        const remaining = 300000 - totals.subtotal;
        const percent = Math.min(100, Math.round((totals.subtotal / 300000) * 100));
        freeShipProgress.style.width = `${percent}%`;
        freeShipProgress.classList.remove('bg-success');
        freeShipText.innerHTML = `Mua thêm <strong>${formatVND(remaining)}</strong> để được <strong>FREESHIP 2H</strong>`;
      }
    }
  },

  // Dedicated cart.html Page Renderer
  renderCartPage() {
    const tableBody = document.getElementById('cart-page-table-body');
    const emptyState = document.getElementById('cart-page-empty');
    const contentLayout = document.getElementById('cart-page-content');
    const pageRxAlert = document.getElementById('cart-page-rx-alert');
    if (!tableBody) return;

    if (this.items.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (contentLayout) contentLayout.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (contentLayout) contentLayout.style.display = 'grid';

    if (pageRxAlert) {
      pageRxAlert.style.display = this.hasRxItems() ? 'flex' : 'none';
    }

    tableBody.innerHTML = this.items.map(item => {
      const isRx = item.classification === 'rx';
      const badgeClass = isRx ? 'badge-rx' : item.classification === 'device' ? 'badge-device' : 'badge-otc';
      const badgeText = isRx ? 'Thuốc kê đơn (Rx)' : item.classification === 'device' ? 'Thiết bị y tế' : 'Thuốc OTC';

      return `
        <tr>
          <td>
            <div class="cart-product-cell">
              <img src="${item.image}" alt="${item.name}" class="cart-table-img">
              <div>
                <span class="badge ${badgeClass}" style="margin-bottom: 4px; display: inline-block;">${badgeText}</span>
                <h4 style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 2px;">
                  <a href="product-detail.html?id=${item.productId}">${item.name}</a>
                </h4>
                <p style="font-size: 12px; color: var(--text-muted);">${item.strength}</p>
              </div>
            </div>
          </td>
          <td>
            <select class="form-control" style="width: auto; padding: 4px 8px; font-size: 12px;" onchange="Cart.changeUnit('${item.productId}', '${item.selectedUnit}', this.value)">
              ${item.allUnits.map(u => `
                <option value="${u.unit}" ${u.unit === item.selectedUnit ? 'selected' : ''}>
                  ${u.unit} (${formatVND(u.price)})
                </option>
              `).join('')}
            </select>
          </td>
          <td>
            <span style="font-weight: 700; color: #334155;">${formatVND(item.unitPrice)}</span>
          </td>
          <td>
            <div class="qty-control" style="width: 100px;">
              <button onclick="Cart.updateQuantity('${item.productId}', '${item.selectedUnit}', -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="Cart.updateQuantity('${item.productId}', '${item.selectedUnit}', 1)">+</button>
            </div>
          </td>
          <td>
            <span style="font-size: 15px; font-weight: 800; color: var(--primary);">
              ${formatVND(item.unitPrice * item.quantity)}
            </span>
          </td>
          <td>
            <button class="cart-item-del" onclick="Cart.removeItem('${item.productId}', '${item.selectedUnit}')" title="Xóa khỏi giỏ">
              <i class="fa-solid fa-trash-can" style="font-size: 16px;"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    const totals = this.getTotals();
    const pageSubtotal = document.getElementById('cart-page-subtotal');
    if (pageSubtotal) pageSubtotal.textContent = formatVND(totals.subtotal);

    const pageDiscount = document.getElementById('cart-page-discount');
    if (pageDiscount) pageDiscount.textContent = totals.discount > 0 ? `-${formatVND(totals.discount)}` : '0 ₫';

    const pageShipping = document.getElementById('cart-page-shipping');
    if (pageShipping) pageShipping.textContent = totals.shippingFee === 0 ? 'Miễn phí' : formatVND(totals.shippingFee);

    const pageGrandTotal = document.getElementById('cart-page-grand-total');
    if (pageGrandTotal) pageGrandTotal.textContent = formatVND(totals.total);
  },

  // Dedicated checkout.html Summary Renderer
  renderCheckoutSummary() {
    const listContainer = document.getElementById('checkout-items-list');
    if (!listContainer) return;

    const totals = this.getTotals();
    if (this.items.length === 0) {
      listContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">Chưa có sản phẩm nào trong giỏ hàng.</p>';
      return;
    }

    listContainer.innerHTML = this.items.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed var(--border-color); font-size: 13px;">
        <div>
          <span style="font-weight: 700; color: #0F172A;">${item.name}</span><br>
          <span style="font-size: 11px; color: var(--text-muted);">ĐVT: ${item.selectedUnit} x ${item.quantity}</span>
        </div>
        <span style="font-weight: 700; color: var(--primary);">${formatVND(item.unitPrice * item.quantity)}</span>
      </div>
    `).join('');

    const sub = document.getElementById('checkout-subtotal');
    if (sub) sub.textContent = formatVND(totals.subtotal);

    const disc = document.getElementById('checkout-discount');
    if (disc) disc.textContent = totals.discount > 0 ? `-${formatVND(totals.discount)}` : '0 ₫';

    const ship = document.getElementById('checkout-shipping');
    if (ship) ship.textContent = totals.shippingFee === 0 ? 'Miễn phí' : formatVND(totals.shippingFee);

    const tot = document.getElementById('checkout-total');
    if (tot) tot.textContent = formatVND(totals.total);

    const qramt = document.getElementById('vietqr-amount');
    if (qramt) qramt.textContent = formatVND(totals.total);

    const rxAlert = document.getElementById('checkout-rx-alert');
    if (rxAlert) rxAlert.style.display = this.hasRxItems() ? 'block' : 'none';
  }
};
