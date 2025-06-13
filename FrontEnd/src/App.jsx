import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "@styles/app.css";
import { Signin, Signup } from '@pages/User';
import { Home } from '@pages/Home';
import { AdminDashboard } from '@pages/Admin';
import { Store } from '@pages/Store';
import { FreeBooks } from '@pages/FreeBooks';
import CategoryBooks from '@pages/FreeBooks/CategoryBooks';
import { Cart } from '@pages/Cart';
import { Checkout } from '@pages/Checkout/Index';
import { Feedback } from '@pages/Feedback';
import Profile from './pages/Profile';
import ForgotPassword from './pages/User/ForgotPassword';
import ResetPassword from './pages/User/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import LoginPrompt from './components/LoginPrompt';
import { useEffect } from 'react';
import { initServerStatusCheck } from './utils/serverStatus';

function App() {
  useEffect(() => {
    // Initialize server status checking
    initServerStatusCheck();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Signin />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/store" element={<Store />} />
            <Route path="/books" element={<FreeBooks />} />
            <Route path="/books/category/:category" element={<CategoryBooks />} />
            <Route path="/books/category/:category/:subcategory" element={<CategoryBooks />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Checkout" element={<Checkout />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <LoginPrompt />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

