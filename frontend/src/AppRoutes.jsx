// AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UsuariosAdmin from "./pages/UsuariosAdmin";
import CambiarContrasena from './pages/CambiarContrasena';

function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={isAuthPage ? 'auth-background' : ''}>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />

        {/* 🔹 Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            isAuthenticated ? <UsuariosAdmin /> : <Navigate to="/login" replace />
          }
        />

      </Routes>
    </div>
  );
}

export default AppRoutes;
