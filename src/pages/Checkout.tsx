import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Landmark, Wallet, CheckCircle2, Smartphone, Tag } from 'lucide-react';
import { saveOrder, Order, hasActiveCoupon, useLoyaltyCoupon, checkLoyaltyStatus } from '../data/products';

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discount, setDiscount] = useState(0);
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    if (userEmail && hasActiveCoupon(userEmail)) {
      const total = getTotalPrice();
      setDiscount(total * 0.15);
    }
  }, [userEmail, getTotalPrice]);
  
  // Local form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    house: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Funnel tracking: Checkout Started
    const stats = JSON.parse(localStorage.getItem('intercorp_funnel_stats') || '{"views": 0, "carts": 0, "checkouts": 0}');
    stats.checkouts += 1;
    localStorage.setItem('intercorp_funnel_stats', JSON.stringify(stats));
    
    // Check for items
    if (items.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      navigate('/shop');
      return;
    }

    if (paymentMethod !== 'cod') {
      alert('Only Cash on Delivery is currently supported for now.');
      return;
    }

    setIsPlacingOrder(true);
    
    setTimeout(() => {
      const orderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      const finalTotal = getTotalPrice() - discount;
      
      const order: Order = {
        id: orderId,
        customerName: shippingInfo.fullName,
        email: userEmail || 'customer@example.com',
        phone: shippingInfo.phone,
        address: `${shippingInfo.house}, ${shippingInfo.area}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`,
        pincode: shippingInfo.pincode,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        total: finalTotal,
        discount: discount,
        paymentMethod: 'Cash on Delivery',
        status: 'Pending',
        date: new Date().toISOString()
      };

      // Save to source of truth only
      saveOrder(order);
      
      if (discount > 0) {
        useLoyaltyCoupon(userEmail);
      } else {
        // Check for loyalty status after placing order
        checkLoyaltyStatus(userEmail);
      }
      
      clearCart();
      setIsPlacingOrder(false);
      navigate('/order-success', { state: { orderId } });
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck className="text-blue-600" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    required 
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    required 
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="+91 98765 43210" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">House / Flat No.</label>
                  <input 
                    required 
                    name="house"
                    value={shippingInfo.house}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area / Street</label>
                  <input 
                    required 
                    name="area"
                    value={shippingInfo.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    required 
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input 
                    required 
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input 
                    required 
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input 
                    required 
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-600" /> Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery', icon: Wallet, desc: 'Pay when you receive the order', disabled: false },
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Secure payment via gateway', disabled: true },
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone, desc: 'Instant payment via Apps', disabled: true },
                  { id: 'net', label: 'Net Banking', icon: Landmark, desc: 'All major banks supported', disabled: true },
                ].map((m) => (
                  <label 
                    key={m.id} 
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      paymentMethod === m.id ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'
                    } ${m.disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value={m.id} 
                      disabled={m.disabled}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      className="hidden"
                    />
                    <m.icon className={`w-6 h-6 mr-4 ${paymentMethod === m.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <p className="font-bold">{m.label}</p>
                      <p className="text-xs text-gray-500">{m.desc}</p>
                    </div>
                    {paymentMethod === m.id && <CheckCircle2 className="ml-auto w-5 h-5 text-blue-600" />}
                    {m.disabled && <span className="text-[10px] font-bold bg-gray-200 px-2 py-0.5 rounded ml-2">Coming Soon</span>}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} x {item.quantity}</span>
                      <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No items in order</p>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-bold border-t pt-2">
                    <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> Loyalty Discount (15%)</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total Payable</span>
                  <span className="text-blue-600">₹{(getTotalPrice() - discount).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button 
                type="submit"
                disabled={isPlacingOrder}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
