/**
 * MediPharm GPP - Storage & Local State Management
 */

const STORAGE_KEYS = {
  CART: 'medipharm_cart_v1',
  ORDERS: 'medipharm_orders_v1',
  PRESCRIPTIONS: 'medipharm_prescriptions_v1',
  VOUCHER: 'medipharm_voucher_v1',
  USERS: 'medipharm_users_v1',
  CURRENT_USER: 'medipharm_current_user_v1'
};

// Available Vouchers
const VALID_VOUCHERS = {
  'TUTHOC50': { discount: 50000, minOrder: 200000, desc: 'Giảm 50.000₫ cho tủ thuốc gia đình từ 200k' },
  'FREESHIP': { isFreeShip: true, minOrder: 150000, desc: 'Miễn phí vận chuyển hỏa tốc' },
  'MEDIPHARM10': { percent: 10, maxDiscount: 100000, minOrder: 300000, desc: 'Giảm 10% (tối đa 100.000₫) cho đơn từ 300k' }
};

class StorageManager {
  static getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading cart', e);
      return [];
    }
  }

  static saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }

  static getOrders() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SAMPLE_INITIAL_ORDERS));
        return SAMPLE_INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading orders', e);
      return SAMPLE_INITIAL_ORDERS;
    }
  }

  static saveOrder(newOrder) {
    try {
      const orders = this.getOrders();
      orders.unshift(newOrder);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders;
    } catch (e) {
      console.error('Error saving order', e);
      return [];
    }
  }

  static updateOrderStatus(orderId, newStatus) {
    try {
      const orders = this.getOrders();
      const updated = orders.map(ord => {
        if (ord.orderId === orderId) {
          return { ...ord, status: newStatus };
        }
        return ord;
      });
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error updating order status', e);
      return [];
    }
  }

  static getPrescriptions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(SAMPLE_PRESCRIPTIONS));
        return SAMPLE_PRESCRIPTIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading prescriptions', e);
      return SAMPLE_PRESCRIPTIONS;
    }
  }

  static savePrescription(newRx) {
    try {
      const rxs = this.getPrescriptions();
      rxs.unshift(newRx);
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(rxs));
      return rxs;
    } catch (e) {
      console.error('Error saving prescription', e);
      return [];
    }
  }
}

/**
 * Authentication & User Session Manager
 */
class AuthManager {
  static getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        const initial = (typeof SAMPLE_USERS !== 'undefined') ? SAMPLE_USERS : [];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading users', e);
      return (typeof SAMPLE_USERS !== 'undefined') ? SAMPLE_USERS : [];
    }
  }

  static saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users', e);
    }
  }

  static getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading current user', e);
      return null;
    }
  }

  static setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      // Dispatch custom event for cross-component awareness
      window.dispatchEvent(new CustomEvent('medipharm:authChange', { detail: { user } }));
    } catch (e) {
      console.error('Error setting current user', e);
    }
  }

  static login(phoneOrEmail, password) {
    const term = (phoneOrEmail || '').trim().toLowerCase();
    const pass = (password || '').trim();

    if (!term || !pass) {
      return { success: false, message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.' };
    }

    const users = this.getUsers();
    const user = users.find(u => 
      (u.phone === term || (u.email && u.email.toLowerCase() === term)) &&
      u.password === pass
    );

    if (user) {
      this.setCurrentUser(user);
      return { success: true, user, message: `Chào mừng ${user.fullName} quay trở lại!` };
    }

    return { 
      success: false, 
      message: 'Số điện thoại/Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.' 
    };
  }

  static register({ fullName, phone, email, password, address }) {
    const name = (fullName || '').trim();
    const rawPhone = (phone || '').trim().replace(/[\s.-]/g, '');
    const mail = (email || '').trim().toLowerCase();
    const pass = (password || '').trim();
    const addr = (address || '').trim();

    if (!name) {
      return { success: false, message: 'Vui lòng nhập họ và tên của bạn.' };
    }

    // Validate VN Phone
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(rawPhone)) {
      return { success: false, message: 'Số điện thoại không hợp lệ. Vui lòng nhập số di động 10 chữ số (VD: 0912345678).' };
    }

    if (mail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mail)) {
        return { success: false, message: 'Địa chỉ email không đúng định dạng.' };
      }
    }

    if (!pass || pass.length < 6) {
      return { success: false, message: 'Mật khẩu phải có tối thiểu 6 ký tự.' };
    }

    const users = this.getUsers();

    // Check duplicate phone
    if (users.some(u => u.phone === rawPhone)) {
      return { success: false, message: 'Số điện thoại này đã được đăng ký tài khoản tại MediPharm.' };
    }

    // Check duplicate email
    if (mail && users.some(u => u.email && u.email.toLowerCase() === mail)) {
      return { success: false, message: 'Email này đã gắn với một tài khoản khác.' };
    }

    const newUser = {
      id: `USER-${Date.now().toString().slice(-6)}`,
      fullName: name,
      phone: rawPhone,
      email: mail || `${rawPhone}@medipharm.customer`,
      password: pass,
      address: addr || 'TP. Hồ Chí Minh',
      createdAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&size=128`
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    return { 
      success: true, 
      user: newUser, 
      message: 'Chúc mừng bạn đã đăng ký tài khoản MediPharm thành công!' 
    };
  }

  static logout() {
    this.setCurrentUser(null);
  }

  static updateProfile(updatedData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'Bạn chưa đăng nhập.' };

    const users = this.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);

    if (index === -1) return { success: false, message: 'Không tìm thấy thông tin tài khoản.' };

    const updatedUser = { ...users[index], ...updatedData };
    users[index] = updatedUser;

    this.saveUsers(users);
    this.setCurrentUser(updatedUser);

    return { success: true, user: updatedUser, message: 'Cập nhật thông tin tài khoản thành công!' };
  }

  static getInitials(name) {
    if (!name) return 'MP';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}

// Global Sound Effect Trigger (Using Web Audio API Synthesizer with audio file fallback)
function playInteractionSound(type = 'add') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'add') {
        // High pleasant ding
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'success') {
        // Double triumphant chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'delete') {
        // Low soft thud
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }
    }
  } catch (err) {
    // Fallback: try playing audio element
    try {
      const audio = new Audio('Sounds/chime.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch (e) {}
  }
}
