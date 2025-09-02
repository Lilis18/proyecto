import React, { useEffect, useState } from 'react';
import styles from './GestionDatos.module.css';

const GestionDatos = () => {
  const [datos, setDatos] = useState([]);
  const [datoEditar, setDatoEditar] = useState(null);
  const [tipo, setTipo] = useState('');
  const [subtipo, setSubtipo] = useState('');
  const [resumen, setResumen] = useState('');
  const [indicador, setIndicador] = useState('');
  const [periodos, setPeriodos] = useState([]);

  const token = localStorage.getItem('token');

  const tiposDisponibles = ['componente', 'actividad', 'fin', 'proposito'];

  const subtiposPorTipo = {
    componente: ['Componente 1', 'Componente 2', 'Componente 3', 'Componente 4', 'Componente 5'],
    actividad: [
      'Actividad 1.1', 'Actividad 1.2', 'Actividad 1.3',
      'Actividad 2.1', 'Actividad 2.2', 'Actividad 2.3',
      'Actividad 3.1', 'Actividad 3.2', 'Actividad 3.3',
      'Actividad 4.1', 'Actividad 4.2', 'Actividad 4.3',
      'Actividad 5.1', 'Actividad 5.2', 'Actividad 5.3',
    ],
    fin: [],
    proposito: []
  };

  const obtenerDatos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDatos(data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const eliminarDato = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este registro?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          alert('Registro eliminado');
          obtenerDatos();
        } else {
          alert('Error al eliminar');
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const editarDato = (dato) => {
    setDatoEditar(dato);
    setTipo(dato.tipo);
    setSubtipo(dato.subtipo);
    setResumen(dato.resumen);
    setIndicador(dato.indicador);
    setPeriodos(dato.periodos || []);
  };

  const handlePeriodoChange = (index, campo, valor) => {
    const nuevosPeriodos = [...periodos];
    nuevosPeriodos[index][campo] = valor;
    setPeriodos(nuevosPeriodos);
  };

  const esPeriodoHabilitado = (mesFin) => {
    const mesActual = new Date().getMonth() + 1;
    return mesActual <= mesFin;
  };

  const extraerMesFinDeNombre = (nombre) => {
    const meses = {
      Enero: 1, Febrero: 2, Marzo: 3, Abril: 4,
      Mayo: 5, Junio: 6, Julio: 7, Agosto: 8,
      Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12
    };
    const partes = nombre.split(' - ');
    if (partes.length === 2) {
      return meses[partes[1]] || 12;
    }
    return 12;
  };

  const actualizarDato = async () => {
    if (!tipo) {
      alert('Seleccione un tipo');
      return;
    }

    if ((tipo === 'componente' || tipo === 'actividad') && !subtipo) {
      alert('Seleccione un subtipo válido');
      return;
    }

    if (!resumen || !indicador) {
      alert('Por favor, complete resumen e indicador');
      return;
    }

    const periodosActualizados = periodos.map(p => ({
      ...p,
      habilitado: esPeriodoHabilitado(extraerMesFinDeNombre(p.nombre))
    }));

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/${datoEditar._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo,
          subtipo,
          resumen,
          indicador,
          periodos: periodosActualizados
        })
      });

      if (response.ok) {
        alert('Registro actualizado');
        setDatoEditar(null);
        obtenerDatos();
      } else {
        alert('Error al actualizar');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const subtiposDisponibles = subtiposPorTipo[tipo] || [];

  return (
    <div className={styles.gestionContainer}>
      <h3>Gestión de Datos</h3>

      {/* === TABLA PRINCIPAL === */}
      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Subtipo</th>
              <th>Resumen</th>
              <th>Indicador</th>
              <th>Periodos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map(dato => (
              <tr key={dato._id}>
                <td data-label="Tipo">{dato.tipo}</td>
                <td data-label="Subtipo">{dato.subtipo}</td>
                <td data-label="Resumen">{dato.resumen}</td>
                <td data-label="Indicador">{dato.indicador}</td>
                <td data-label="Periodos">
                  {dato.periodos && dato.periodos.length > 0 ? (
                    <ul className={styles.periodosLista}>
                      {dato.periodos.map((p, i) => (
                        <li key={i}>
                          <strong>{p.nombre}:</strong>  
                          <span data-label="Programado">{p.programado ?? 0}</span> / 
                          <span data-label="Realizado">{p.realizado ?? 0}</span>
                        </li>
                      ))}
                    </ul>
                  ) : 'No hay periodos'}
                </td>
                <td className={styles.acciones}>
                  <button onClick={() => eliminarDato(dato._id)}>Eliminar</button>
                  <button onClick={() => editarDato(dato)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === FORMULARIO DE EDICIÓN === */}
      {datoEditar && (
        <div className={styles.formEdicion}>
          <h4>Editando Registro</h4>

          <label>
            Tipo:
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                setSubtipo('');
              }}
            >
              <option value="">Seleccione</option>
              {tiposDisponibles.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          {(tipo === 'componente' || tipo === 'actividad') && (
            <label>
              Subtipo:
              <select
                value={subtipo}
                onChange={(e) => setSubtipo(e.target.value)}
              >
                <option value="">Seleccione</option>
                {subtiposDisponibles.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          )}

          <label>
            Resumen:
            <input type="text" value={resumen} onChange={(e) => setResumen(e.target.value)} />
          </label>

          <label>
            Indicador:
            <input type="text" value={indicador} onChange={(e) => setIndicador(e.target.value)} />
          </label>

          <h5>Periodos</h5>
          <div className={styles.tablaWrapper}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Programado</th>
                  <th>Realizado</th>
                </tr>
              </thead>
              <tbody>
                {periodos.map((periodo, index) => {
                  const habilitado = esPeriodoHabilitado(extraerMesFinDeNombre(periodo.nombre));
                  return (
                    <tr key={index}>
                      <td>{periodo.nombre}</td>
                      <td data-label="Programado">
                        <input
                          type="number"
                          value={periodo.programado}
                          onChange={(e) => handlePeriodoChange(index, 'programado', e.target.value)}
                          disabled={!habilitado}
                        />
                      </td>
                      <td data-label="Realizado">
                        <input
                          type="number"
                          value={periodo.realizado}
                          onChange={(e) => handlePeriodoChange(index, 'realizado', e.target.value)}
                          disabled={!habilitado}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button onClick={actualizarDato}>Guardar Cambios</button>
          <button
            className={styles.cancelar}
            onClick={() => setDatoEditar(null)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default GestionDatos;