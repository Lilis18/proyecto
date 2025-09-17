// Simula los periodos habilitados globalmente
let forcedPeriods = [0, 2];

const getPeriodos = (req, res) => {
  res.json({ forcedPeriods });
};

const togglePeriodo = (req, res) => {
  const { index, habilitado } = req.body;

  if (typeof index !== 'number' || typeof habilitado !== 'boolean') {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  if (habilitado && !forcedPeriods.includes(index)) forcedPeriods.push(index);
  if (!habilitado && forcedPeriods.includes(index)) forcedPeriods = forcedPeriods.filter(i => i !== index);

  res.json({ message: `Periodo ${index} actualizado a ${habilitado}`, forcedPeriods });
};

module.exports = { getPeriodos, togglePeriodo };
