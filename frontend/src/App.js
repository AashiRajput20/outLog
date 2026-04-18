import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import WardenDashboard from './pages/warden/WardenDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SecurityDashboard from './pages/security/SecurityDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' />;
  if (!allowedRoles.includes(user.role)) return <Navigate to='/login' />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/student' element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path='/warden' element={
          <ProtectedRoute allowedRoles={['warden']}>
            <WardenDashboard />
          </ProtectedRoute>
        } />
        <Route path='/admin' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path='/security' element={
          <ProtectedRoute allowedRoles={['security']}>
            <SecurityDashboard />
          </ProtectedRoute>
        } />
        <Route path='/' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;