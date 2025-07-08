const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: { type: String, required: true },
  subtipo: { type: String },
  resumen: { type: String },
  indicador: { type: String },
  periodos: [
    {
      nombre: String,
      programado: Number,
      realizado: Number
    }
  ]
});

module.exports = mongoose.model('Data', dataSchema);
