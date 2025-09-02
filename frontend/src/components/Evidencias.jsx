import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
    tituloActividad: "Actividad 2.3 Promoción de acciones de igualdad",
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
    <div>
      <h2>Captura de Evidencias</h2>

      {/* 🔹 Encabezado editable con etiquetas */}
      <h3>Encabezado Editable</h3>
      <div>
        <label>Clave del PP: </label>
        <input
          value={encabezado.clavePP}
          onChange={(e) =>
            setEncabezado({ ...encabezado, clavePP: e.target.value })
          }
        />
      </div>
      <div>
        <label>Nombre del PP: </label>
        <input
          value={encabezado.nombrePP}
          onChange={(e) =>
            setEncabezado({ ...encabezado, nombrePP: e.target.value })
          }
        />
      </div>
      <div>
        <label>Unidad Responsable: </label>
        <input
          value={encabezado.unidad}
          onChange={(e) =>
            setEncabezado({ ...encabezado, unidad: e.target.value })
          }
        />
      </div>
      <div>
        <label>Universidad: </label>
        <input
          value={encabezado.universidad}
          onChange={(e) =>
            setEncabezado({ ...encabezado, universidad: e.target.value })
          }
        />
      </div>

      <h3>Título de la actividad</h3>
      <div>
        <label>Título: </label>
        <input
          value={encabezado.tituloActividad}
          onChange={(e) =>
            setEncabezado({ ...encabezado, tituloActividad: e.target.value })
          }
        />
      </div>

      {/* 🔹 TABLA DE CAPTURA */}
      <h3>Metas Programadas y Alcanzadas</h3>
      <table
        border="1"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#e2e2e2" }}>
            <th>Cuatrimestre</th>
            <th>Enero - Abril</th>
            <th>Mayo - Agosto</th>
            <th>Septiembre - Diciembre</th>
            <th>Total</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ backgroundColor: "#a10e0e", color: "#fff" }}>Meta Programada</td>
            <td>
              <input
                value={datos.prog.eneAbr}
                onChange={(e) => handleChange("prog", "eneAbr", e.target.value)}
              />
            </td>
            <td>
              <input
                value={datos.prog.mayAgo}
                onChange={(e) => handleChange("prog", "mayAgo", e.target.value)}
              />
            </td>
            <td>
              <input
                value={datos.prog.sepDic}
                onChange={(e) => handleChange("prog", "sepDic", e.target.value)}
              />
            </td>
            <td>
              <input
                value={datos.prog.total}
                onChange={(e) => handleChange("prog", "total", e.target.value)}
              />
            </td>
            <td>
              <input
                value={datos.prog.porcentaje}
                onChange={(e) => handleChange("prog", "porcentaje", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td style={{ backgroundColor: "#a10e0e", color: "#fff" }}>Meta Alcanzada</td>
            <td>
              <input
                value={datos.alc.eneAbr}
                onChange={(e) => handleChange("alc", "eneAbr", e.target.value)}
              />
            </td>
            <td>
              <input
                value={datos.alc.mayAgo}
                onChange={(e) => handleChange("alc", "mayAgo", e.target.value)}
              />
            </td>
            <td>
              <input
                value={datos.alc.sepDic}
                onChange={(e) => handleChange("alc", "sepDic", e.target.value)}
              />
            </td>
            <td>
              <input
                value={datos.alc.total}
                onChange={(e) => handleChange("alc", "total", e.target.value)}
              />
            </td>
            <td>
              <input
                value={datos.alc.porcentaje}
                onChange={(e) => handleChange("alc", "porcentaje", e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* 🔹 Otros campos */}
      <h3>Otros campos</h3>
      <div>
        <label>Justificación: </label>
        <textarea
          value={datos.justificacion}
          onChange={(e) => setDatos({ ...datos, justificacion: e.target.value })}
        />
      </div>
      <div>
        <label>Descripción: </label>
        <textarea
          value={datos.descripcion}
          onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
        />
      </div>
      <div>
        <label>Evidencias (una por línea): </label>
        <textarea
          value={datos.evidencias.join("\n")}
          onChange={(e) =>
            setDatos({ ...datos, evidencias: e.target.value.split("\n") })
          }
        />
      </div>

      <h3>Titular</h3>
      <div>
        <label>Nombre: </label>
        <input
          value={datos.titular.nombre}
          onChange={(e) =>
            setDatos({ ...datos, titular: { ...datos.titular, nombre: e.target.value } })
          }
        />
        <label>Puesto: </label>
        <input
          value={datos.titular.puesto}
          onChange={(e) =>
            setDatos({ ...datos, titular: { ...datos.titular, puesto: e.target.value } })
          }
        />
      </div>

      <h3>Enlace</h3>
      <div>
        <label>Nombre: </label>
        <input
          value={datos.enlace.nombre}
          onChange={(e) =>
            setDatos({ ...datos, enlace: { ...datos.enlace, nombre: e.target.value } })
          }
        />
        <label>Puesto: </label>
        <input
          value={datos.enlace.puesto}
          onChange={(e) =>
            setDatos({ ...datos, enlace: { ...datos.enlace, puesto: e.target.value } })
          }
        />
      </div>

      <button onClick={exportarPDF}>Exportar PDF</button>

      {/* 🔹 Documento generado */}
      <div
        ref={componentRef}
        style={{
          fontFamily: "Arial",
          padding: "20px",
          backgroundColor: "#fff",
          color: "#000",
          width: "60%",
        }}
      >
        {/* 🔹 Membrete */}
        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <img
            src="/Membrete_UTP.jpg"
            alt="Membrete"
            style={{ width: "250px", height: "auto" }}
          />
          {/* 🔹 Texto centrado editable con etiquetas reflejadas */}
          <div style={{ textAlign: "center", marginTop: "10px", fontSize: "14px", lineHeight: "1.4" }}>
            <div>Clave y Nombre del PP: {encabezado.clavePP} {encabezado.nombrePP}</div>
            <div>Unidad Responsable: {encabezado.unidad} {encabezado.universidad}</div>
          </div>
        </div>

        <h3 style={{ textAlign: "center" }}>Título de la actividad: {encabezado.tituloActividad}</h3>

        {/* 🔹 Tabla reflejada en PDF */}
        <table
          border="1"
          cellPadding="5"
          style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#e2e2e2" }}>
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
              <td style={{ backgroundColor: "#a10e0e", color: "#fff" }}>Meta Programada</td>
              <td>{datos.prog.eneAbr}</td>
              <td>{datos.prog.mayAgo}</td>
              <td>{datos.prog.sepDic}</td>
              <td>{datos.prog.total}</td>
              <td>{datos.prog.porcentaje}%</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#a10e0e", color: "#fff" }}>Meta Alcanzada</td>
              <td>{datos.alc.eneAbr}</td>
              <td>{datos.alc.mayAgo}</td>
              <td>{datos.alc.sepDic}</td>
              <td>{datos.alc.total}</td>
              <td>{datos.alc.porcentaje}%</td>
            </tr>
          </tbody>
        </table>

        {/* Justificación */}
        <h4 style={{ backgroundColor: "#a10e0e", color: "#fff", padding: "5px" }}>Justificación</h4>
        <p style={{ minHeight: "50px", border: "1px solid #ccc", padding: "5px" }}>{datos.justificacion}</p>

        {/* Descripción */}
        <h4 style={{ backgroundColor: "#a10e0e", color: "#fff", padding: "5px" }}>Descripción del beneficio institucional</h4>
        <ul style={{ minHeight: "50px", border: "1px solid #ccc", padding: "5px" }}>
          {datos.descripcion.split("\n").map((linea, i) => (
            <li key={i}>{linea}</li>
          ))}
        </ul>

        {/* Evidencias */}
        <h4 style={{ backgroundColor: "#a10e0e", color: "#fff", padding: "5px" }}>Evidencias</h4>
        <ol style={{ minHeight: "50px", border: "1px solid #ccc", padding: "5px" }}>
          {datos.evidencias.map((ev, i) => (
            <li key={i}>{ev}</li>
          ))}
        </ol>

        {/* Firmas */}
        <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
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
