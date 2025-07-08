import React, { useState } from 'react';
import styles from './InputPasswordConOjo.module.css';

const InputPasswordConOjo = ({ placeholder, value, onChange }) => {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className={styles.contenedor}>
      <input
        type={mostrar ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        required
      />
      <span
        onClick={() => setMostrar(!mostrar)}
        className={styles.ojo}
        aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setMostrar(!mostrar); }}
      >
        {mostrar ? '🙈' : '👁️'}
      </span>
    </div>
  );
};

export default InputPasswordConOjo;
