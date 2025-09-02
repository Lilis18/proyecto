import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grafico from '../components/Grafico';
import GestionDatos from '../components/GestionDatos';
import styles from './Dashboard.module.css';
import CargaDeDatos from '../components/CargaDeDatos';
import Evidencias from '../components/Evidencias';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [resumen, setResumen] = useState('');
  const [indicador, setIndicador] = useState('');
  const [periodos, setPeriodos] = useState([
    { nombre: 'Enero - Abril', programado: '', realizado: '', habilitado: esPeriodoHabilitado(4) },
    { nombre: 'Mayo - Agosto', programado: '', realizado: '', habilitado: esPeriodoHabilitado(8) },
    { nombre: 'Septiembre - Diciembre', programado: '', realizado: '', habilitado: esPeriodoHabilitado(12) }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMenuVisible(false); // Oculta el menú en móviles
  };

  const handlePeriodoChange = (index, campo, valor) => {
    const nuevosPeriodos = [...periodos];
    nuevosPeriodos[index][campo] = valor;
    setPeriodos(nuevosPeriodos);
  };

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/guardar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo: selectedType,
          subtipo: selectedSubType,
          resumen,
          indicador,
          periodos
        })
      });

      if (response.ok) {
        alert('Datos guardados correctamente');
        setSelectedType('');
        setSelectedSubType('');
        setResumen('');
        setIndicador('');
        setPeriodos([
          { nombre: 'Enero - Abril', programado: '', realizado: '', habilitado: esPeriodoHabilitado(4) },
          { nombre: 'Mayo - Agosto', programado: '', realizado: '', habilitado: esPeriodoHabilitado(8) },
          { nombre: 'Septiembre - Diciembre', programado: '', realizado: '', habilitado: esPeriodoHabilitado(12) }
        ]);
      } else {
        const errorData = await response.json();
        console.error('Error detallado: ', errorData);
        alert('Error al guardar los datos');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  const renderContent = () => {
    const nombre = localStorage.getItem('nombre');

    switch (activeTab) {
      case 'perfil':
        return (
          <div>
            <h2>Perfil</h2>
            <p>Nombre: {nombre}</p>
            <button onClick={() => navigate('/cambiar-contrasena')} className={styles.botonSecundario}>Cambiar Contraseña</button>
            <button 
              className={`${styles.botonMenu} ${styles.botonSalir}`} 
              onClick={handleLogout}>
                Cerrar sesión
            </button>
          </div>
        );

      case 'cargar':
        return (
          <CargaDeDatos
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedSubType={selectedSubType}
            setSelectedSubType={setSelectedSubType}
            resumen={resumen}
            setResumen={setResumen}
            indicador={indicador}
            setIndicador={setIndicador}
            periodos={periodos}
            handlePeriodoChange={handlePeriodoChange}
            handleGuardar={handleGuardar}
          />
        );

      case 'evidencias':
        return (
          <Evidencias/>
        );

      case 'graficos':
        return (
          <div>
            <h2>Visualizador de Gráficos</h2>
            <Grafico tipoFiltro={selectedType} subtipoFiltro={selectedSubType} />
          </div>
        );

      case 'edicion':
        return (
          <div>
            <h2>Editar Datos</h2>
            <GestionDatos />
          </div>
        );

      default:
        return <p>Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div className={styles.contenedorDashboard}>
      {/* Hamburguesa */}
      <div className={styles.hamburguesa} onClick={() => setMenuVisible(!menuVisible)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menú */}
      <div className={`${styles.menuLateral} ${menuVisible ? styles.mostrar : ''}`}>
        <button className={`${styles.botonMenu} ${activeTab === 'perfil' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('perfil')}>
          Perfil
        </button>
        <button className={`${styles.botonMenu} ${activeTab === 'cargar' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('cargar')}>
          Cargar Datos
        </button>
        <button className={`${styles.botonMenu} ${activeTab === 'evidencias' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('evidencias')}>
          Cargar Evidencias
        </button>
        <button className={`${styles.botonMenu} ${activeTab === 'graficos' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('graficos')}>
          Visualizador de Gráficos
        </button>
        <button className={`${styles.botonMenu} ${activeTab === 'edicion' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('edicion')}>
          Gestión de Datos
        </button>
      </div>

      <div className={styles.contenidoPrincipal}>
        {renderContent()}
      </div>
    </div>
  );
};

const esPeriodoHabilitado = (mesFin) => {
  const mesActual = new Date().getMonth() + 1;
  return mesActual <= mesFin;
};

export default Dashboard;