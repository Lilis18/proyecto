import React from "react";

import styles from "./CargaDeDatos.module.css";

const CargaDeDatos = ({
  selectedType,
  setSelectedType,
  selectedSubType,
  setSelectedSubType,
  resumen,
  setResumen,
  indicador,
  setIndicador,
  periodos,
  handlePeriodoChange,
  handleGuardar
}) => {
  return (
    <div>
      <h2>Carga de Datos</h2>
      <p>¿Qué datos desea cargar?</p>
      <select
        value={selectedType}
        onChange={(e) => {
          setSelectedType(e.target.value);
          setSelectedSubType("");
        }}
      >
        <option value="">Seleccione</option>
        <option value="componente">Componente</option>
        <option value="actividad">Actividad</option>
        <option value="fin">Fin</option>
        <option value="proposito">Propósito</option>
      </select>

      {selectedType === "componente" && (
        <>
          <p>¿Qué componente?</p>
          <select
            value={selectedSubType}
            onChange={(e) => setSelectedSubType(e.target.value)}
          >
            <option value="">Seleccione</option>
            <option value="Componente 1">Componente 1</option>
            <option value="Componente 2">Componente 2</option>
            <option value="Componente 3">Componente 3</option>
            <option value="Componente 4">Componente 4</option>
            <option value="Componente 5">Componente 5</option>
          </select>
        </>
      )}

      {selectedType === "actividad" && (
        <>
          <p>¿Qué actividad?</p>
          <select
            value={selectedSubType}
            onChange={(e) => setSelectedSubType(e.target.value)}
          >
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

      {(selectedType &&
        (selectedType !== "componente" || selectedSubType) &&
        (selectedType !== "actividad" || selectedSubType)) && (
        <div style={{ marginTop: "20px" }}>
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
                  <td data-label="Periodo">{periodo.nombre}</td>
                  <td data-label="Programado">
                    <input
                      type="number"
                      value={periodo.programado}
                      onChange={(e) =>
                        handlePeriodoChange(index, "programado", e.target.value)
                      }
                      disabled={!periodo.habilitado}
                    />
                  </td>
                  <td data-label="Realizado">
                    <input
                      type="number"
                      value={periodo.realizado}
                      onChange={(e) =>
                        handlePeriodoChange(index, "realizado", e.target.value)
                      }
                      disabled={!periodo.habilitado}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleGuardar} className={styles.botonGuardar} style={{ marginTop: "20px" }}>
            Guardar Datos
          </button>
        </div>
      )}
    </div>
  );
};

export default CargaDeDatos;
