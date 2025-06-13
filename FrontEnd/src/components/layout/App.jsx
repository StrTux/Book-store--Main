import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "@styles/app.css";
import { Signin, Signup } from '@pages/User';
import { Home } from '@pages/Home';
import { AdminDashboard } from '@pages/Admin';
import { Button } from '@components/common';
import { MainLayout } from '@components/layout';
import { apiService } from '@services/api';
import { authService } from '@services/auth';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Signin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

