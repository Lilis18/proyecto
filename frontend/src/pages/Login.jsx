import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputPasswordConOjo from '../components/InputPasswordConOjo';
import styles from './Login.module.css';

const Login = ({ setIsAuthenticated }) => {
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('nombre', data.nombre);
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
            placeholder='Correo'
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
        {error && <p>{error}</p>}
        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className={styles.loginRegister}>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
};

export default Login;
