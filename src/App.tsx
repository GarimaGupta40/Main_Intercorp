import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import HumanNutrition from './pages/HumanNutrition';
import AnimalNutrition from './pages/AnimalNutrition';
import Poultry from './pages/Poultry';
import Livestock from './pages/Livestock';
import Aquaculture from './pages/Aquaculture';
import ConsumerProducts from './pages/ConsumerProducts';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  
  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Admin Routes - No Navbar/Footer */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />

            {/* Public Routes with Navbar/Footer */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/human-nutrition" element={<HumanNutrition />} />
                    <Route path="/animal-nutrition" element={<AnimalNutrition />} />
                    <Route path="/animal-nutrition/poultry" element={<Poultry />} />
                    <Route path="/animal-nutrition/livestock" element={<Livestock />} />
                    <Route path="/animal-nutrition/aquaculture" element={<Aquaculture />} />
                    <Route path="/consumer-products" element={<ConsumerProducts />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/account" element={<Account />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
