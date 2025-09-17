const mongoose = require('mongoose');

const periodoSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true }, // 0 = Ene-Abr, 1 = May-Ago, 2 = Sep-Dic
  nombre: { type: String, required: true },
  habilitado: { type: Boolean, default: false }
});

module.exports = mongoose.model('Periodo', periodoSchema);
