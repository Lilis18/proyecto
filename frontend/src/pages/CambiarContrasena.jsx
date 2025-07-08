import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputPasswordConOjo from '../components/InputPasswordConOjo';
import styles from './CambiarContrasena.module.css';

const CambiarContrasena = () => {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContrasena !== confirmarContrasena) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/cambiar-contrasena`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contrasenaActual,
          nuevaContrasena
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Contraseña actualizada correctamente, por favor inicie sesión de nuevo.');
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        navigate('/login');
      } else {
        setMensaje(data.msg || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <InputPasswordConOjo
          placeholder="Contraseña actual"
          value={contrasenaActual}
          onChange={e => setContrasenaActual(e.target.value)}
        />
        <InputPasswordConOjo
          placeholder="Nueva contraseña"
          value={nuevaContrasena}
          onChange={e => setNuevaContrasena(e.target.value)}
        />
        <InputPasswordConOjo
          placeholder="Confirmar nueva contraseña"
          value={confirmarContrasena}
          onChange={e => setConfirmarContrasena(e.target.value)}
        />
        {mensaje && <p className={styles.error}>{mensaje}</p>}
        <button type="submit" className={styles.boton}>Actualizar Contraseña</button>
        <button type="button" className={styles.botonSecundario} onClick={() => navigate('/dashboard')}>
          Regresar
        </button>
      </form>
    </div>
  );
};

export default CambiarContrasena;
