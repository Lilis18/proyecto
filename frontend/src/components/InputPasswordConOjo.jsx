import React, { useState } from 'react';
import styles from './InputPasswordConOjo.module.css';

const InputPasswordConOjo = ({ placeholder, value, onChange, required = true }) => {
  const [mostrar, setMostrar] = useState(false);

  const toggleMostrar = () => setMostrar(prev => !prev);

  return (
    <div className={styles.contenedor}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`${styles.input} ${!mostrar ? styles.inputOculto : ''}`}
      />

      <button
        type="button"
        onClick={toggleMostrar}
        className={styles.ojo}
        aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {mostrar ? '🙈' : '👁️'}
      </button>
    </div>
  );
};

export default InputPasswordConOjo;
