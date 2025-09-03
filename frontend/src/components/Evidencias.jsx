import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./Evidencias.module.css";

const EvidenciasFormato = () => {
  const componentRef = useRef();

  // 🔹 Datos de la tabla y campos
  const [datos, setDatos] = useState({
    prog: { eneAbr: "", mayAgo: "", sepDic: "", total: "", porcentaje: "" },
    alc: { eneAbr: "", mayAgo: "", sepDic: "", total: "", porcentaje: "" },
    justificacion: "",
    descripcion: "",
    evidencias: [""],
    titular: { nombre: "", puesto: "" },
    enlace: { nombre: "", puesto: "" },
  });

  // 🔹 Encabezado y título editable
  const [encabezado, setEncabezado] = useState({
    clavePP: "E030",
    nombrePP: "EDUCACIÓN SUPERIOR EN UNIVERSIDADES TECNOLÓGICAS",
    unidad: "DA2F",
    universidad: "UNIVERSIDAD TECNOLÓGICA DE PUEBLA",
    tituloActividad: "",
  });

  // 🔹 Exportar a PDF
  const exportarPDF = () => {
    const input = componentRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("Evidencias.pdf");
    });
  };

  // 🔹 Actualizar valores de tabla
  const handleChange = (tipo, campo, valor) => {
    setDatos({
      ...datos,
      [tipo]: { ...datos[tipo], [campo]: valor },
    });
  };

  return (
     <div className={styles.contenedor}>
      <h2 className={styles.tituloPrincipal}>Captura de Evidencias</h2>

      <h3 className={styles.subtitulo}>Encabezado Editable</h3>
      <div className={styles.gridEncabezado}>
        {["clavePP", "nombrePP", "unidad", "universidad", "tituloActividad"].map((campo) => (
          <div
            key={campo}
            className={`${styles.columnaEncabezado} ${
              campo === "tituloActividad" ? styles.columnaCompleta : ""
            }`}
          >
            <label>
              {campo === "clavePP"
                ? "Clave del PP"
                : campo === "nombrePP"
                ? "Nombre del PP"
                : campo === "unidad"
                ? "Unidad Responsable"
                : campo === "universidad"
                ? "Universidad"
                : "Título de la actividad"}:
            </label>
            <input
              value={encabezado[campo]}
              onChange={(e) =>
                setEncabezado({ ...encabezado, [campo]: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      {/* 🔹 TABLA DE CAPTURA */}
      <h3 className={styles.subtitulo}>Metas Programadas y Alcanzadas</h3>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Cuatrimestre</th>
            <th>Enero - Abril</th>
            <th>Mayo - Agosto</th>
            <th>Septiembre - Diciembre</th>
            <th>Total</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {["prog", "alc"].map((tipo) => (
            <tr key={tipo}>
              <td className={styles.filaTitulo}>
                {tipo === "prog" ? "Meta Programada" : "Meta Alcanzada"}
              </td>
              {["eneAbr", "mayAgo", "sepDic", "total", "porcentaje"].map((campo) => (
                <td key={campo}>
                  <input
                    value={datos[tipo][campo]}
                    onChange={(e) => handleChange(tipo, campo, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Otros campos */}
      <h3 className={styles.subtitulo}>Otros campos</h3>
      <div className={styles.campo}>
        <label>Justificación: </label>
        <textarea
          value={datos.justificacion}
          onChange={(e) => setDatos({ ...datos, justificacion: e.target.value })}
        />
      </div>
      <div className={styles.campo}>
        <label>Descripción: </label>
        <textarea
          value={datos.descripcion}
          onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
        />
      </div>
      <div className={styles.campo}>
        <label>Evidencias (una por línea): </label>
        <textarea
          value={datos.evidencias.join("\n")}
          onChange={(e) =>
            setDatos({ ...datos, evidencias: e.target.value.split("\n") })
          }
        />
      </div>

      <h3 className={styles.subtitulo}>Titular y Enlace</h3>
      <div className={styles.filaDoble}>
        <div className={styles.columna}>
          <label>Nombre del Titular:</label>
          <input
            value={datos.titular.nombre}
            onChange={(e) =>
              setDatos({ ...datos, titular: { ...datos.titular, nombre: e.target.value } })
            }
          />
          <label>Puesto del Titular:</label>
          <input
            value={datos.titular.puesto}
            onChange={(e) =>
              setDatos({ ...datos, titular: { ...datos.titular, puesto: e.target.value } })
            }
          />
        </div>

        <div className={styles.columna}>
          <label>Nombre del Enlace:</label>
          <input
            value={datos.enlace.nombre}
            onChange={(e) =>
              setDatos({ ...datos, enlace: { ...datos.enlace, nombre: e.target.value } })
            }
          />
          <label>Puesto del Enlace:</label>
          <input
            value={datos.enlace.puesto}
            onChange={(e) =>
              setDatos({ ...datos, enlace: { ...datos.enlace, puesto: e.target.value } })
            }
          />
        </div>
      </div>

      <button className={styles.botonExportar} onClick={exportarPDF}>
        Exportar PDF
      </button>

      {/* 🔹 Documento generado */}
      <div ref={componentRef} className={styles.documento}>
        {/* 🔹 Membrete */}
        <div className={styles.membrete}>
          <img
            src="/Membrete_UTP.jpg"
            alt="Membrete"
            className={styles.membreteImg}
          />
          {/* 🔹 Texto centrado editable con etiquetas reflejadas */}
          <div className={styles.textoCentrado}>
            <div>Clave y Nombre del PP: {encabezado.clavePP} {encabezado.nombrePP}</div>
            <div>Unidad Responsable: {encabezado.unidad} {encabezado.universidad}</div>
          </div>
        </div>

        <h3 className={styles.textoCentrado}>Título de la actividad: {encabezado.tituloActividad}</h3>

        {/* 🔹 Tabla reflejada en PDF */}
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Cuatrimestre</th>
              <th>enero - abril</th>
              <th>mayo-agosto</th>
              <th>septiembre-diciembre</th>
              <th>Total</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.filaTitulo}>Meta Programada</td>
              <td>{datos.prog.eneAbr}</td>
              <td>{datos.prog.mayAgo}</td>
              <td>{datos.prog.sepDic}</td>
              <td>{datos.prog.total}</td>
              <td>{datos.prog.porcentaje}%</td>
            </tr>
            <tr>
              <td className={styles.filaTitulo}>Meta Alcanzada</td>
              <td>{datos.alc.eneAbr}</td>
              <td>{datos.alc.mayAgo}</td>
              <td>{datos.alc.sepDic}</td>
              <td>{datos.alc.total}</td>
              <td>{datos.alc.porcentaje}%</td>
            </tr>
          </tbody>
        </table>

        {/* Justificación */}
        <h4 className={styles.filaTitulo}>Justificación</h4>
        <p className={styles.seccionTexto}>{datos.justificacion}</p>

        {/* Descripción */}
        <h4 className={styles.filaTitulo}>Descripción del beneficio institucional</h4>
        <ul className={styles.seccionTexto}>
          {datos.descripcion.split("\n").map((linea, i) => (
            <li key={i}>{linea}</li>
          ))}
        </ul>

        {/* Evidencias */}
        <h4 className={styles.filaTitulo}>Evidencias</h4>
        <ol className={styles.seccionTexto}>
          {datos.evidencias.map((ev, i) => (
            <li key={i}>{ev}</li>
          ))}
        </ol>

        {/* Firmas */}
        <table  className={styles.tabla}>
          <tbody>
            <tr>
              <td>
                <p>{datos.titular.nombre}</p>
                <p>{datos.titular.puesto}</p>
                <p>Firma</p>
              </td>
              <td>Sello</td>
              <td>
                <p>{datos.enlace.nombre}</p>
                <p>{datos.enlace.puesto}</p>
                <p>Firma</p>
              </td>
              <td>Sello</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvidenciasFormato;
