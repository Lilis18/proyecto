const mongoose = require('mongoose');

const SubtipoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  nombre: { type: String, required: true }
});

module.exports = mongoose.model('Subtipo', SubtipoSchema);
