import productsData from './products.json';

export interface Product {
  id: string;
  name: string;
  category: 'human-nutrition' | 'animal-nutrition' | 'consumer-products';
  price: number;
  image: string;
  description: string;
  rating: number;
  stock?: number;
  expiryDate?: string;
}

// Helper to get products from localStorage or fallback to JSON
export const getProducts = (): Product[] => {
  const saved = localStorage.getItem('intercorp_products');
  if (saved) return JSON.parse(saved);
  
  // Initialize localStorage if empty
  localStorage.setItem('intercorp_products', JSON.stringify(productsData));
  return productsData as Product[];
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  let updated;
  if (existingIndex > -1) {
    updated = [...products];
    updated[existingIndex] = product;
  } else {
    updated = [...products, product];
  }
  
  localStorage.setItem('intercorp_products', JSON.stringify(updated));
  window.dispatchEvent(new Event('products_updated'));
};

export const deleteProduct = (productId: string) => {
  const products = getProducts();
  const updated = products.filter(p => p.id !== productId);
  localStorage.setItem('intercorp_products', JSON.stringify(updated));
  window.dispatchEvent(new Event('products_updated'));
};

export const products = getProducts();

export const productsByCategory = {
  'human-nutrition': products.filter((p) => p.category === 'human-nutrition'),
  'animal-nutrition': products.filter((p) => p.category === 'animal-nutrition'),
  'consumer-products': products.filter((p) => p.category === 'consumer-products'),
};

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  discount?: number;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export const getOrders = (): Order[] => {
  const saved = localStorage.getItem('intercorp_orders');
  if (saved) return JSON.parse(saved);
  return [];
};

export const saveOrder = (order: Order) => {
  const orders = getOrders();
  const existingIndex = orders.findIndex(o => o.id === order.id);
  
  if (existingIndex > -1) {
    return; // Prevent duplicate
  }
  
  const updated = [order, ...orders];
  localStorage.setItem('intercorp_orders', JSON.stringify(updated));
  window.dispatchEvent(new Event('orders_updated'));
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem('intercorp_orders', JSON.stringify(updated));
  window.dispatchEvent(new Event('orders_updated'));
};

// Loyalty Coupon Helpers
export const checkLoyaltyStatus = (email: string) => {
  const orders = getOrders();
  const userOrders = orders.filter(o => o.email === email && (o.status === 'Delivered' || o.status === 'Pending' || o.status === 'Shipped' || o.status === 'Processing'));
  const count = userOrders.length;
  
  const couponKey = `loyalty_coupon_${email.replace(/[@.]/g, '_')}`;
  
  // Every 2 purchases gives a coupon
  if (count > 0 && count % 2 === 0) {
    // Check if a coupon was already issued for this specific count milestone
    const milestoneKey = `loyalty_milestone_${email.replace(/[@.]/g, '_')}_${count}`;
    if (!localStorage.getItem(milestoneKey)) {
      localStorage.setItem(couponKey, 'LOYALTY15');
      localStorage.setItem(milestoneKey, 'true');
      return true;
    }
  }
  return false;
};

export const useLoyaltyCoupon = (email: string) => {
  const couponKey = `loyalty_coupon_${email.replace(/[@.]/g, '_')}`;
  localStorage.removeItem(couponKey);
};

export const hasActiveCoupon = (email: string) => {
  const couponKey = `loyalty_coupon_${email.replace(/[@.]/g, '_')}`;
  return !!localStorage.getItem(couponKey);
};
