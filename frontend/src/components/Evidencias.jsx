import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import styles from "./Evidencias.module.css";

export default function Evidencias() {
  /* -----------------------------------------------------------
   * REFERENCIAS Y ESTADOS
   * ----------------------------------------------------------- */
  const componentRef = useRef();

  const [archivosPDF, setArchivosPDF] = useState([]);

  const [encabezado, setEncabezado] = useState({
    clavePP: "E030",
    nombrePP: "EDUCACIÓN SUPERIOR EN UNIVERSIDADES TECNOLÓGICAS",
    unidad: "DA2F",
    universidad: "UNIVERSIDAD TECNOLÓGICA DE PUEBLA",
    tituloActividad: "",
  });

  const [datos, setDatos] = useState({
    prog: { eneAbr: "", mayAgo: "", sepDic: "", total: "", porcentaje: "" },
    alc: { eneAbr: "", mayAgo: "", sepDic: "", total: "", porcentaje: "" },
    justificacion: "",
    descripcion: "",
    evidencias: [""],
    titular: { nombre: "", puesto: "" },
    enlace: { nombre: "", puesto: "" },
  });

  const [firmas, setFirmas] = useState({
    titular: "",
    enlace: "",
  });

  const [pdfFinalURL, setPdfFinalURL] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  /* -----------------------------------------------------------
   * UTILIDADES
   * ----------------------------------------------------------- */

  // Convertir archivo a Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // Convertir archivo a ArrayBuffer (PDF)
  const fileToArrayBuffer = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsArrayBuffer(file);
    });

  // Convertir DataURL a ArrayBuffer
  const dataURLtoArrayBuffer = (dataURL) =>
    Uint8Array.from(
      atob(dataURL.split(",")[1]),
      (c) => c.charCodeAt(0)
    );

  /* -----------------------------------------------------------
   * GENERAR PDF PRINCIPAL DESDE EL DOM
   * ----------------------------------------------------------- */
  const generarPDFPrincipal = async () => {
    const input = componentRef.current;

    // Capturar sección como imagen
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Crear PDF con jsPDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    return pdf.output("datauristring");
  };

  /* -----------------------------------------------------------
   * SUBIR ARCHIVOS PDF
   * ----------------------------------------------------------- */
  const subirPDF = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setArchivosPDF((prev) => [...prev, ...files]);

    Swal.fire("Listo", "PDF(s) cargado(s) correctamente.", "success");
  };

  /* -----------------------------------------------------------
   * UNIR PDFs (principal + adicionales)
   * ----------------------------------------------------------- */
  const exportarPDF = async () => {
    try {
      Swal.fire({
        title: "Generando PDF...",
        text: "Por favor espera.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // 1) PDF generado del DOM
      const pdfPrincipal = await generarPDFPrincipal();
      const pdfPrincipalAB = dataURLtoArrayBuffer(pdfPrincipal);

      const pdfFinal = await PDFDocument.create();
      const pdfPrincipalDoc = await PDFDocument.load(pdfPrincipalAB);

      // Copiar páginas del PDF principal
      const paginas = await pdfFinal.copyPages(
        pdfPrincipalDoc,
        pdfPrincipalDoc.getPageIndices()
      );
      paginas.forEach((p) => pdfFinal.addPage(p));

      // 2) Unir los PDFs cargados por el usuario
      for (const file of archivosPDF) {
        const buffer = await fileToArrayBuffer(file);
        const pdfUser = await PDFDocument.load(buffer);

        const paginasUser = await pdfFinal.copyPages(
          pdfUser,
          pdfUser.getPageIndices()
        );

        paginasUser.forEach((p) => pdfFinal.addPage(p));
      }

      // 3) Guardar PDF final
      const pdfBytes = await pdfFinal.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPdfFinalURL(url);
      setPdfPreview(url);

      // Descargar automáticamente
      const a = document.createElement("a");
      a.href = url;
      a.download = "Evidencia_Unificada.pdf";
      a.click();

      Swal.close();
      Swal.fire("Listo", "PDF final generado y descargado.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo generar el PDF unificado.", "error");
    }
  };

  /* -----------------------------------------------------------
   * DESCARGAR / VER PDF
   * ----------------------------------------------------------- */
  const verPDF = () => {
    if (!pdfFinalURL)
      return Swal.fire("Aviso", "No se ha generado un PDF aún.", "info");

    setPdfPreview(pdfFinalURL);
  };

  const descargarPDF = () => {
    if (!pdfFinalURL)
      return Swal.fire("Aviso", "No hay PDF para descargar.", "info");

    const a = document.createElement("a");
    a.href = pdfFinalURL;
    a.download = "Evidencia_Unificada.pdf";
    a.click();
  };

  /* -----------------------------------------------------------
   * RENDER DEL COMPONENTE
   * ----------------------------------------------------------- */
  return (
    <div className={styles.contenedor}>
      <h2 className={styles.tituloPrincipal}>Captura de Evidencias</h2>

      {/* ------------------ ENCABEZADO ------------------ */}
      <h3 className={styles.subtitulo}>Encabezado Editable</h3>

      <div className={styles.gridEncabezado}>
        {["clavePP", "nombrePP", "unidad", "universidad", "tituloActividad"].map(
          (campo) => (
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
                  : "Título de la Actividad"}
                :
              </label>

              <input
                value={encabezado[campo]}
                onChange={(e) =>
                  setEncabezado({
                    ...encabezado,
                    [campo]: e.target.value,
                  })
                }
              />
            </div>
          )
        )}
      </div>

      {/* ------------------ TABLAS ------------------ */}
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

              {["eneAbr", "mayAgo", "sepDic", "total", "porcentaje"].map(
                (campo) => (
                  <td key={campo}>
                    <input
                      value={datos[tipo][campo]}
                      onChange={(e) =>
                        setDatos((prev) => ({
                          ...prev,
                          [tipo]: {
                            ...prev[tipo],
                            [campo]: e.target.value,
                          },
                        }))
                      }
                    />
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ------------------ TEXTOS ------------------ */}
      <div className={styles.campo}>
        <label>Justificación:</label>
        <textarea
          value={datos.justificacion}
          onChange={(e) =>
            setDatos({ ...datos, justificacion: e.target.value })
          }
        />
      </div>

      <div className={styles.campo}>
        <label>Descripción:</label>
        <textarea
          value={datos.descripcion}
          onChange={(e) =>
            setDatos({ ...datos, descripcion: e.target.value })
          }
        />
      </div>

      <div className={styles.campo}>
        <label>Evidencias (una por línea):</label>
        <textarea
          value={datos.evidencias.join("\n")}
          onChange={(e) =>
            setDatos({ ...datos, evidencias: e.target.value.split("\n") })
          }
        />
      </div>

      {/* ------------------ TITULAR / ENLACE ------------------ */}
      <h3 className={styles.subtitulo}>Titular y Enlace</h3>

      <div className={styles.filaDoble}>
        {/* Titular */}
        <div className={styles.columna}>
          <label>Nombre del Titular:</label>
          <input
            value={datos.titular.nombre}
            onChange={(e) =>
              setDatos({
                ...datos,
                titular: { ...datos.titular, nombre: e.target.value },
              })
            }
          />

          <label>Puesto del Titular:</label>
          <input
            value={datos.titular.puesto}
            onChange={(e) =>
              setDatos({
                ...datos,
                titular: { ...datos.titular, puesto: e.target.value },
              })
            }
          />

          <label>Firma del Titular:</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const b64 = await toBase64(file);
              setFirmas({
                ...firmas,
                titular: b64.split(",")[1],
              });
            }}
          />
        </div>

        {/* Enlace */}
        <div className={styles.columna}>
          <label>Nombre del Enlace:</label>
          <input
            value={datos.enlace.nombre}
            onChange={(e) =>
              setDatos({
                ...datos,
                enlace: { ...datos.enlace, nombre: e.target.value },
              })
            }
          />

          <label>Puesto del Enlace:</label>
          <input
            value={datos.enlace.puesto}
            onChange={(e) =>
              setDatos({
                ...datos,
                enlace: { ...datos.enlace, puesto: e.target.value },
              })
            }
          />

          <label>Firma del Enlace:</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const b64 = await toBase64(file);
              setFirmas({
                ...firmas,
                enlace: b64.split(",")[1],
              });
            }}
          />
        </div>
      </div>

      {/* ------------------ SUBIR PDFs ------------------ */}
      <div className={styles.campo}>
        <label>Subir documentos PDF:</label>
        <input type="file" accept="application/pdf" multiple onChange={subirPDF} />
      </div>

      {/* ------------------ BOTÓN PRINCIPAL ------------------ */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button className={styles.botonExportar} onClick={exportarPDF}>
          Generar y Unir PDF
        </button>
      </div>

      {/* ------------------ DOCUMENTO PARA GENERAR EL PDF ------------------ */}
      <div
        ref={componentRef}
        className={styles.documento}
        style={{ marginTop: 18 }}
      >
        {/* Membrete */}
        <div className={styles.membrete}>
          <img
            src="/Membrete_UTP.jpg"
            className={styles.membreteImg}
            alt="membrete"
          />

          <div className={styles.textoCentrado}>
            <div>
              Clave y Nombre del PP: {encabezado.clavePP} {encabezado.nombrePP}
            </div>
            <div>
              Unidad Responsable: {encabezado.unidad} {encabezado.universidad}
            </div>
          </div>
        </div>

        <h3 className={styles.textoCentrado}>
          Título de la actividad: {encabezado.tituloActividad}
        </h3>

        {/* Tabla principal */}
        <table className={styles.tabla}>
          <tbody>
            {/* Justificación */}
            <tr>
              <td className={styles.filaTitulo}>Justificación</td>
            </tr>
            <tr>
              <td className={styles.celdaTexto}>{datos.justificacion}</td>
            </tr>

            {/* Descripción */}
            <tr>
              <td className={styles.filaTitulo}>
                Descripción del beneficio institucional
              </td>
            </tr>
            <tr>
              <td className={styles.celdaTexto}>
                <ul>
                  {datos.descripcion.split("\n").map((linea, i) => (
                    <li key={i}>{linea}</li>
                  ))}
                </ul>
              </td>
            </tr>

            {/* Evidencias */}
            <tr>
              <td className={styles.filaTitulo}>Evidencias</td>
            </tr>
            <tr>
              <td className={styles.celdaTexto}>
                <ol>
                  {datos.evidencias.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ol>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Firmas */}
        <table className={styles.tabla}>
          <tbody>
            <tr>
              {/* Titular */}
              <td>
                <p>Titular: {datos.titular.nombre}</p>
                <p>Puesto de Titular: {datos.titular.puesto}</p>

                {firmas.titular && (
                  <img
                    src={`data:image/png;base64,${firmas.titular}`}
                    alt="firma titular"
                    className={styles.firmaImg}
                  />
                )}
              </td>

              {/* Enlace */}
              <td>
                <p>Enlace: {datos.enlace.nombre}</p>
                <p>Puesto de Enlace: {datos.enlace.puesto}</p>

                {firmas.enlace && (
                  <img
                    src={`data:image/png;base64,${firmas.enlace}`}
                    alt="firma enlace"
                    className={styles.firmaImg}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ------------------ PREVISUALIZACIÓN DEL PDF ------------------ */}
      {pdfPreview && (
        <div style={{ marginTop: 12 }}>
          <h4>Previsualización</h4>

          <iframe
            src={pdfPreview}
            width="100%"
            height="600px"
            style={{ border: "1px solid #ccc" }}
            title="preview"
          />
        </div>
      )}
    </div>
  );
}
