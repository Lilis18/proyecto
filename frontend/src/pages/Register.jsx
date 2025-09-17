import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';
import InputPasswordConOjo from '../components/InputPasswordConOjo';

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
          className={styles.inputRegister}
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={styles.inputRegister}
        />
        <InputPasswordConOjo
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles.loginInput}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.boton}>Registrar</button>
      </form>
      <button type="button" className={styles.botonSecundario} onClick={() => navigate('/dashboard')}>
        Regresar
      </button>
    </div>
  );
};

export default Register;