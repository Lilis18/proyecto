import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grafico from '../components/Grafico';
import GestionDatos from '../components/GestionDatos';
import styles from './Dashboard.module.css';

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
          <div>
            <h2>Carga de Datos</h2>
            <p>¿Qué datos desea cargar?</p>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedSubType('');
              }}
            >
              <option value="">Seleccione</option>
              <option value="componente">Componente</option>
              <option value="actividad">Actividad</option>
              <option value="fin">Fin</option>
              <option value="proposito">Propósito</option>
            </select>

            {selectedType === 'componente' && (
              <>
                <p>¿Qué componente?</p>
                <select value={selectedSubType} onChange={(e) => setSelectedSubType(e.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="Componente 1">Componente 1</option>
                  <option value="Componente 2">Componente 2</option>
                  <option value="Componente 3">Componente 3</option>
                  <option value="Componente 4">Componente 4</option>
                  <option value="Componente 5">Componente 5</option>
                </select>
              </>
            )}

            {selectedType === 'actividad' && (
              <>
                <p>¿Qué actividad?</p>
                <select value={selectedSubType} onChange={(e) => setSelectedSubType(e.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="Actividad 1.1">Actividad 1.1</option>
                  <option value="Actividad 1.2">Actividad 1.2</option>
                  <option value="Actividad 1.3">Actividad 1.3</option>
                  <option value="Actividad 2.1">Actividad 2.1</option>
                  <option value="Actividad 2.2">Actividad 2.2</option>
                  <option value="Actividad 2.3">Actividad 2.3</option>
                  <option value="Actividad 3.1">Actividad 3.1</option>
                  <option value="Actividad 3.2">Actividad 3.2</option>
                  <option value="Actividad 3.3">Actividad 3.3</option>
                  <option value="Actividad 4.1">Actividad 4.1</option>
                  <option value="Actividad 4.2">Actividad 4.2</option>
                  <option value="Actividad 4.3">Actividad 4.3</option>
                  <option value="Actividad 5.1">Actividad 5.1</option>
                  <option value="Actividad 5.2">Actividad 5.2</option>
                  <option value="Actividad 5.3">Actividad 5.3</option>
                </select>
              </>
            )}

            {(selectedType && (selectedType !== 'componente' || selectedSubType) && (selectedType !== 'actividad' || selectedSubType)) && (
              <div style={{ marginTop: '20px' }}>
                <p>Resumen Narrativo:</p>
                <input
                  type="text"
                  value={resumen}
                  onChange={(e) => setResumen(e.target.value)}
                  className={styles.inputResumen}
                />

                <p>Indicador:</p>
                <input
                  type="text"
                  value={indicador}
                  onChange={(e) => setIndicador(e.target.value)}
                  className={styles.inputIndicador}
                />

                <h3>Registro de Datos</h3>
                <table className={styles.tablaPeriodos}>
                  <thead>
                    <tr>
                      <th>Periodo</th>
                      <th>Programado</th>
                      <th>Realizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {periodos.map((periodo, index) => (
                      <tr key={index}>
                        <td>{periodo.nombre}</td>
                        <td>
                          <input
                            type="number"
                            value={periodo.programado}
                            onChange={(e) => handlePeriodoChange(index, 'programado', e.target.value)}
                            disabled={!periodo.habilitado}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={periodo.realizado}
                            onChange={(e) => handlePeriodoChange(index, 'realizado', e.target.value)}
                            disabled={!periodo.habilitado}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button onClick={handleGuardar} style={{ marginTop: '20px' }}>Guardar Datos</button>
              </div>
            )}
          </div>
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