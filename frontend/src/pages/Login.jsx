import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputPasswordConOjo from '../components/InputPasswordConOjo';
import styles from './Login.module.css';
import { useAuth } from '../hooks/useAuth';

const Login = ({ setIsAuthenticated }) => {
  const { login } = useAuth(); // 👈 Hook de autenticación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

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
        login(data); // 👈 usamos el hook (guarda token, nombre, role en localStorage + estado)
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
      </form>
    </div>
  );
};

export default Login;
