import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Grafico.module.css'; // Asegúrate que la ruta sea correcta según tu proyecto

const Grafico = () => {
  const [datos, setDatos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroSubtipo, setFiltroSubtipo] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchDatos();
  }, []);

  const filtrados = datos.filter(dato => {
    if (filtroTipo && dato.tipo !== filtroTipo) return false;
    if (filtroSubtipo && dato.subtipo !== filtroSubtipo) return false;
    return true;
  });

  const datosGrafico = filtrados.map(dato => {
    const totalProgramado = dato.periodos.reduce((sum, p) => sum + (Number(p.programado) || 0), 0);
    const totalRealizado = dato.periodos.reduce((sum, p) => sum + (Number(p.realizado) || 0), 0);

    return {
      nombre: dato.subtipo || dato.tipo,
      Programado: totalProgramado,
      Realizado: totalRealizado
    };
  });

  const exportarPDF = () => {
    const input = document.getElementById('grafico');

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('grafico.pdf');
    });
  };

  return (
    <div>
      <h3>Filtros</h3>
      <div className="filtros">
        <select value={filtroTipo} onChange={(e) => { setFiltroTipo(e.target.value); setFiltroSubtipo(''); }}>
          <option value="">Todos</option>
          <option value="fin">Fin</option>
          <option value="proposito">Propósito</option>
          <option value="componente">Componente</option>
          <option value="actividad">Actividad</option>
        </select>

        {filtroTipo === 'componente' && (
          <select value={filtroSubtipo} onChange={(e) => setFiltroSubtipo(e.target.value)}>
            <option value="">Todos</option>
            <option value="Componente 1">Componente 1</option>
            <option value="Componente 2">Componente 2</option>
            <option value="Componente 3">Componente 3</option>
            <option value="Componente 4">Componente 4</option>
            <option value="Componente 5">Componente 5</option>
          </select>
        )}

        {filtroTipo === 'actividad' && (
          <select value={filtroSubtipo} onChange={(e) => setFiltroSubtipo(e.target.value)}>
            <option value="">Todos</option>
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
        )}
      </div>

      <div id="grafico" className="contenedor-grafico">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Programado" fill="#660404">
              <LabelList dataKey="Programado" position="top" />
            </Bar>
            <Bar dataKey="Realizado" fill="#636161">
              <LabelList dataKey="Realizado" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button onClick={exportarPDF} className="btn-exportar">Exportar como PDF</button>
    </div>
  );
};

export default Grafico;
