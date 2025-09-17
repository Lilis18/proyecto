// 🔹 Importaciones
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grafico from '../components/Grafico';
import GestionDatos from '../components/GestionDatos';
import CargaDeDatos from '../components/CargaDeDatos';
import Evidencias from '../components/Evidencias';
import styles from './Dashboard.module.css';
import { useAuth } from '../hooks/useAuth';

const periodNames = ['Enero - Abril', 'Mayo - Agosto', 'Septiembre - Diciembre'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [resumen, setResumen] = useState('');
  const [indicador, setIndicador] = useState('');
  const [periodos, setPeriodos] = useState([]);
  const [forcedPeriods, setForcedPeriods] = useState([]); // periodos habilitados manualmente

  // 🔹 Obtener periodos globales desde backend
  useEffect(() => {
    const fetchForcedPeriods = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/periods`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setForcedPeriods(data.forcedPeriods || []);
        } else {
          console.error('Error al cargar periodos', res.status);
        }
      } catch (error) {
        console.error('Error al cargar periodos:', error);
      }
    };
    fetchForcedPeriods();
  }, []);

  // 🔹 Construir periodos combinando habilitación por mes + forzado global
  useEffect(() => {
    setPeriodos(periodNames.map((nombre, idx) => ({
      nombre,
      programado: '',
      realizado: '',
      habilitado: esPeriodoHabilitado(idx) || forcedPeriods.includes(idx)
    })));
  }, [forcedPeriods]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleTabChange = (tab) => { setActiveTab(tab); setMenuVisible(false); };
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
        setPeriodos(periodNames.map((nombre, idx) => ({
          nombre,
          programado: '',
          realizado: '',
          habilitado: esPeriodoHabilitado(idx) || forcedPeriods.includes(idx)
        })));
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert('Error al guardar los datos');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  // 🔹 Habilitar o deshabilitar periodo global (SUPER_ADMIN)
  const togglePeriodoGlobal = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const actualmenteHabilitado = periodos[index].habilitado;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/periods`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ index, habilitado: !actualmenteHabilitado })
      });

      if (!response.ok) {
        let errorMsg = 'Error desconocido';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          errorMsg = response.statusText;
        }
        alert('Error al actualizar periodo: ' + errorMsg);
        return;
      }

      const data = await response.json();
      alert(data.message);

      const nuevosPeriodos = [...periodos];
      nuevosPeriodos[index].habilitado = !actualmenteHabilitado;
      setPeriodos(nuevosPeriodos);

    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error de conexión con el servidor');
    }
  };

  const renderContent = () => {
    const nombre = user?.nombre || 'Desconocido';
    const role = user?.role || 'USER';

    switch (activeTab) {
      case 'perfil':
        return (
          <div>
            <h2>Perfil</h2>
            <p>Nombre: {nombre}</p>
            <p>Rol: {role}</p>
            <button onClick={() => navigate('/cambiar-contrasena')} className={styles.botonSecundario}>
              Cambiar Contraseña
            </button>
            <button className={`${styles.botonMenu} ${styles.botonSalir}`} onClick={handleLogout}>
              Cerrar sesión
            </button>

            {role === "SUPER_ADMIN" && (
              <div className={styles.adminPanel}>
                <h3>Funciones de Super Admin</h3>
                <button onClick={() => navigate('/admin/usuarios')} className={styles.botonSecundario}>
                  Gestionar Usuarios
                </button>

                {periodos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => togglePeriodoGlobal(idx)}
                    className={styles.botonSecundario}
                  >
                    {p.habilitado ? `Deshabilitar ${p.nombre}` : `Habilitar ${p.nombre}`}
                  </button>
                ))}

                <button onClick={() => navigate('/register')} className={styles.botonSecundario}>
                  Registrar Nuevo Usuario
                </button>
              </div>
            )}
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

      case 'evidencias': return <Evidencias />;
      case 'graficos': return <Grafico tipoFiltro={selectedType} subtipoFiltro={selectedSubType} />;
      case 'edicion': return <GestionDatos />;
      default: return <p>Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div className={styles.contenedorDashboard}>
      <div className={styles.hamburguesa} onClick={() => setMenuVisible(!menuVisible)}>
        <span></span><span></span><span></span>
      </div>

      <div className={`${styles.menuLateral} ${menuVisible ? styles.mostrar : ''}`}>
        <button className={`${styles.botonMenu} ${activeTab === 'perfil' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('perfil')}>Perfil</button>
        <button className={`${styles.botonMenu} ${activeTab === 'cargar' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('cargar')}>Cargar Datos</button>
        <button className={`${styles.botonMenu} ${activeTab === 'evidencias' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('evidencias')}>Cargar Evidencias</button>
        <button className={`${styles.botonMenu} ${activeTab === 'graficos' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('graficos')}>Visualizador de Gráficos</button>
        <button className={`${styles.botonMenu} ${activeTab === 'edicion' ? styles.botonActivo : ''}`} onClick={() => handleTabChange('edicion')}>Gestión de Datos</button>
      </div>

      <div className={styles.contenidoPrincipal}>{renderContent()}</div>
    </div>
  );
};

// 🔹 Mantener la lógica original por mes
const esPeriodoHabilitado = (index) => {
  const mesActual = new Date().getMonth() + 1;
  if (index === 0) return mesActual >= 1 && mesActual <= 4; // Ene-Abr
  if (index === 1) return mesActual >=5 && mesActual <= 8; // May-Ago
  if (index === 2) return mesActual >=9 && mesActual <= 12; // Sep-Dic
  return false;
};

export default Dashboard;
