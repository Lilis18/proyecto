import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputPasswordConOjo from '../components/InputPasswordConOjo';
import styles from './Login.module.css';
import { useAuth } from '../hooks/useAuth';

const Login = ({ setIsAuthenticated }) => {
  const { login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [showRegisterLink, setShowRegisterLink] = useState(false);

  const navigate = useNavigate();

  // 🔍 Verifica si existe el SUPER_ADMIN
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/super-admin-exists`);
        const data = await res.json();
        setShowRegisterLink(!data.exists);
      } catch (error) {
        console.error("Error verificando super admin:", error);
      }
    };

    checkSuperAdmin();
  }, []);

  // 🔐 Inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data); 
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(data.msg || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error(error);
      setError('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleLogin}>
        <h1>Iniciar Sesión</h1>

        <input 
          type="email" 
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={styles.input}
        />

        <InputPasswordConOjo
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles.loginInput}
        />

        {error && <p className={styles.loginError}>{error}</p>}

        <button type="submit" disabled={cargando} className={styles.loginButton}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        {/* 🔗 Solo mostrar la liga si NO existe el SUPER_ADMIN */}
        {showRegisterLink && (
          <Link to="/register" className={styles.registerLink}>
            Crear SUPER ADMIN
          </Link>
        )}
      </form>
    </div>
  );
};

export default Login;
