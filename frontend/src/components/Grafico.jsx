import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer, LabelList
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from '../components/Grafico.module.css';

const periodosOpciones = [
  'Enero - Abril',
  'Mayo - Agosto',
  'Septiembre - Diciembre',
];

const componentesOpciones = [
  'Componente 1',
  'Componente 2',
  'Componente 3',
  'Componente 4',
  'Componente 5',
];

const actividadesOpciones = [
  { group: 1, items: ['Actividad 1.1', 'Actividad 1.2', 'Actividad 1.3'] },
  { group: 2, items: ['Actividad 2.1', 'Actividad 2.2', 'Actividad 2.3'] },
  { group: 3, items: ['Actividad 3.1', 'Actividad 3.2', 'Actividad 3.3'] },
  { group: 4, items: ['Actividad 4.1', 'Actividad 4.2', 'Actividad 4.3'] },
  { group: 5, items: ['Actividad 5.1', 'Actividad 5.2', 'Actividad 5.3'] },
];

const Grafico = () => {
  const [datos, setDatos] = useState([]);

  // Estados para filtros
  const [periodoFin, setPeriodoFin] = useState('');
  const [periodoProposito, setPeriodoProposito] = useState('');
  const [periodoComponente, setPeriodoComponente] = useState('');
  const [periodoActividad, setPeriodoActividad] = useState('');
  const [componenteSeleccionado, setComponenteSeleccionado] = useState('');
  const [actividadSeleccionada, setActividadSeleccionada] = useState('');

  // Selección para exportar
  const [seleccionExportar, setSeleccionExportar] = useState({
    fin: true,
    proposito: true,
    componentes: true,
    actividades: true,
  });

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setDatos(data.map(d => ({ ...d, periodos: d.periodos || [] })));
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchDatos();
  }, []);

  const periodoEnRango = (nombrePeriodo, filtroPeriodo) =>
    !filtroPeriodo || nombrePeriodo === filtroPeriodo;

  const generarDatos = (tipo, filtroPeriodo, filtroSubtipo = '') =>
    datos
      .filter(d => d.tipo === tipo)
      .filter(d => !filtroSubtipo || d.subtipo === filtroSubtipo)
      .map(d => {
        const periodosFiltrados = d.periodos.filter(p => periodoEnRango(p.nombre, filtroPeriodo));
        if (periodosFiltrados.length === 0) return null;
        const totalProgramado = periodosFiltrados.reduce((s, p) => s + (Number(p.programado) || 0), 0);
        const totalRealizado = periodosFiltrados.reduce((s, p) => s + (Number(p.realizado) || 0), 0);
        return { nombre: d.subtipo || d.tipo, Programado: totalProgramado, Realizado: totalRealizado };
      })
      .filter(Boolean);

  const datosFin = generarDatos('fin', periodoFin);
  const datosProposito = generarDatos('proposito', periodoProposito);
  const datosComponentes = generarDatos('componente', periodoComponente, componenteSeleccionado);
  const datosActividades = generarDatos('actividad', periodoActividad, actividadSeleccionada);

  // === EXPORTAR PDF ===
  const exportarPDF = async () => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const fecha = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // === Logo y membrete ===
    const logoUrl = "public/Membrete_UTP.jpg"; // Ruta dentro de /public/images/
    //const membreteUrl = "public/Membrete_UTP.jpg"; // Ruta dentro de /public/images/

    // === Mapear IDs de gráficas ===
    const graficasDisponibles = [
      { id: "graficoFin", titulo: "Fin", key: "fin" },
      { id: "graficoProposito", titulo: "Propósito", key: "proposito" },
      { id: "graficoComponentes", titulo: "Componentes", key: "componentes" },
      { id: "graficoActividades", titulo: "Actividades", key: "actividades" },
    ];

    // Filtrar por checkboxes seleccionados
    const graficasSeleccionadas = graficasDisponibles.filter(
      ({ key }) => seleccionExportar[key]
    );

    if (graficasSeleccionadas.length === 0) {
      alert("Selecciona al menos una gráfica para exportar.");
      return;
    }

    let paginaActual = 1;
    const totalPaginas = graficasSeleccionadas.length;

    for (const { id, titulo } of graficasSeleccionadas) {
      const elemento = document.getElementById(id);
      if (!elemento) continue;

      // Cambiar temporalmente colores a negro
      const textos = elemento.querySelectorAll("text");
      const barras = elemento.querySelectorAll("rect");
      const coloresOriginales = [];

      textos.forEach((t) => {
        coloresOriginales.push({ el: t, color: t.getAttribute("fill") });
        t.setAttribute("fill", "#000000");
      });
      barras.forEach((b) => {
        coloresOriginales.push({ el: b, color: b.getAttribute("fill") });
        b.setAttribute("fill", "#000000");
      });

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Captura
      const canvas = await html2canvas(elemento, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      // Restaurar colores originales
      coloresOriginales.forEach(({ el, color }) => {
        if (color) el.setAttribute("fill", color);
      });

      if (paginaActual > 1) pdf.addPage();

      // === Membrete ===
      /*const membreteImg = await fetch(membreteUrl)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob));
      pdf.addImage(membreteImg, "PNG", 0, 0, pageWidth, 25);*/

      // === Logo ===
      const logoImg = await fetch(logoUrl)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob));
      pdf.addImage(logoImg, "PNG", 10, 5, 100, 20); // medidas originales

      // === Título ===
      pdf.setFontSize(16);
      pdf.text("Reporte de Gráficas", pageWidth / 2, 35, { align: "center" });

      pdf.setFontSize(12);
      pdf.text(`${titulo}`, pageWidth / 2, 45, { align: "center" });

      // === Imagen centrada ===
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgY = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, "PNG", 15, imgY, imgWidth, imgHeight);

      // === Pie ===
      pdf.setFontSize(10);
      pdf.text(
        `Generado el ${fecha}`,
        15,
        pageHeight - 10
      );
      pdf.text(
        `Página ${paginaActual} de ${totalPaginas}`,
        pageWidth - 40,
        pageHeight - 10
      );

      paginaActual++;
    }

    pdf.save("Reporte_Graficas_Filtradas.pdf");
  } catch (error) {
    console.error("❌ Error al exportar PDF:", error);
    alert("Ocurrió un error al generar el PDF.");
  }
};

  return (
    <div className={styles.graficosGrid}>
      <div className={styles.exportPanel}>
        <h3>Selecciona las gráficas a exportar</h3>
        {Object.keys(seleccionExportar).map(key => (
          <label key={key}>
            <input
              type="checkbox"
              checked={seleccionExportar[key]}
              onChange={() =>
                setSeleccionExportar({ ...seleccionExportar, [key]: !seleccionExportar[key] })
              }
            />{' '}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
        <button className={styles.btnExportar} onClick={exportarPDF}>
          Exportar PDF
        </button>
      </div>

      {/* === FIN === */}
      <section id="graficoFin">
        <h2>Fin</h2>
        <div>
          {periodosOpciones.map(p => (
            <button key={p} onClick={() => setPeriodoFin(p)}
              style={{
                marginRight: 8,
                backgroundColor: periodoFin === p ? '#660404' : '#ccc',
                color: periodoFin === p ? '#fff' : '#000',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
              }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPeriodoFin('')}
            style={{
              backgroundColor: !periodoFin ? '#660404' : '#ccc',
              color: !periodoFin ? '#fff' : '#000',
              border: 'none',
              padding: '6px 12px',
            }}>
            Todos
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosFin}>
            <XAxis dataKey="nombre" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Programado" fill="#660404"><LabelList dataKey="Programado" position="top" fill="#fff" /></Bar>
            <Bar dataKey="Realizado" fill="#636161"><LabelList dataKey="Realizado" position="top" fill="#fff" /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* === PROPÓSITO === */}
      <section id="graficoProposito">
        <h2>Propósito</h2>
        <div>
          {periodosOpciones.map(p => (
            <button key={p} onClick={() => setPeriodoProposito(p)}
              style={{
                marginRight: 8,
                backgroundColor: periodoProposito === p ? '#660404' : '#ccc',
                color: periodoProposito === p ? '#fff' : '#000',
                border: 'none',
                padding: '6px 12px',
              }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPeriodoProposito('')}
            style={{
              backgroundColor: !periodoProposito ? '#660404' : '#ccc',
              color: !periodoProposito ? '#fff' : '#000',
              border: 'none',
              padding: '6px 12px',
            }}>
            Todos
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosProposito}>
            <XAxis dataKey="nombre" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Programado" fill="#660404"><LabelList dataKey="Programado" position="top" fill="#fff" /></Bar>
            <Bar dataKey="Realizado" fill="#636161"><LabelList dataKey="Realizado" position="top" fill="#fff" /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* === COMPONENTES === */}
      <section id="graficoComponentes">
        <h2>Componentes</h2>
        <select value={componenteSeleccionado} onChange={e => setComponenteSeleccionado(e.target.value)}
          style={{ marginBottom: 10, padding: 6 }}>
          <option value="">Todos</option>
          {componentesOpciones.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div>
          {periodosOpciones.map(p => (
            <button key={p} onClick={() => setPeriodoComponente(p)}
              style={{
                marginRight: 8,
                backgroundColor: periodoComponente === p ? '#660404' : '#ccc',
                color: periodoComponente === p ? '#fff' : '#000',
                border: 'none',
                padding: '6px 12px',
              }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPeriodoComponente('')}
            style={{
              backgroundColor: !periodoComponente ? '#660404' : '#ccc',
              color: !periodoComponente ? '#fff' : '#000',
              border: 'none',
              padding: '6px 12px',
            }}>
            Todos
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosComponentes}>
            <XAxis dataKey="nombre" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Programado" fill="#660404"><LabelList dataKey="Programado" position="top" fill="#fff" /></Bar>
            <Bar dataKey="Realizado" fill="#636161"><LabelList dataKey="Realizado" position="top" fill="#fff" /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* === ACTIVIDADES === */}
      <section id="graficoActividades">
        <h2>Actividades</h2>
        <select value={actividadSeleccionada} onChange={e => setActividadSeleccionada(e.target.value)}
          style={{ marginBottom: 10, padding: 6 }}>
          <option value="">Todas</option>
          {actividadesOpciones.map(grupo => (
            <optgroup key={grupo.group} label={`Grupo ${grupo.group}`}>
              {grupo.items.map(item => <option key={item} value={item}>{item}</option>)}
            </optgroup>
          ))}
        </select>
        <div>
          {periodosOpciones.map(p => (
            <button key={p} onClick={() => setPeriodoActividad(p)}
              style={{
                marginRight: 8,
                backgroundColor: periodoActividad === p ? '#660404' : '#ccc',
                color: periodoActividad === p ? '#fff' : '#000',
                border: 'none',
                padding: '6px 12px',
              }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPeriodoActividad('')}
            style={{
              backgroundColor: !periodoActividad ? '#660404' : '#ccc',
              color: !periodoActividad ? '#fff' : '#000',
              border: 'none',
              padding: '6px 12px',
            }}>
            Todos
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosActividades}>
            <XAxis dataKey="nombre" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Programado" fill="#660404"><LabelList dataKey="Programado" position="top" fill="#fff" /></Bar>
            <Bar dataKey="Realizado" fill="#636161"><LabelList dataKey="Realizado" position="top" fill="#fff" /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Grafico;
