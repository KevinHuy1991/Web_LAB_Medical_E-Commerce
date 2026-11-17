/**
 * MediPharm GPP - Storage & Local State Management
 */

const STORAGE_KEYS = {
  CART: 'medipharm_cart_v1',
  ORDERS: 'medipharm_orders_v1',
  PRESCRIPTIONS: 'medipharm_prescriptions_v1',
  VOUCHER: 'medipharm_voucher_v1'
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
