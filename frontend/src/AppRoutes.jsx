import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UsuariosAdmin from "./pages/UsuariosAdmin";
import CambiarContrasena from './pages/CambiarContrasena';
import EvidenciasFormato from "./components/Evidencias";   // 🔹 IMPORTANTE

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

        {/* ---------- RUTAS PROTEGIDAS ---------- */}

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

        {/* 🔥 ESTA ES LA RUTA QUE TE FALTABA */}
        <Route
          path="/evidencias/:id"
          element={
            isAuthenticated ? <EvidenciasFormato /> : <Navigate to="/login" replace />
          }
        />

      </Routes>
    </div>
  );
}

export default AppRoutes;
