import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/login');
      } else {
        setError(data.msg || 'Error al registrarse');
      }
    } catch (error) {
      console.error(error);
      setError('Error de conexión');
    }
  };

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Registro</h2>
      <form onSubmit={handleRegister} className={styles.formulario}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.boton}>Registrar</button>
      </form>
      <p className={styles.texto}>
        ¿Ya tienes cuenta? <Link to="/login" className={styles.link}>Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;