import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              
              <Route path="/report-lost" element={
                <PrivateRoute>
                  <ReportLost />
                </PrivateRoute>
              } />
              
              <Route path="/report-found" element={
                <PrivateRoute>
                  <ReportFound />
                </PrivateRoute>
              } />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="/admin" element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
