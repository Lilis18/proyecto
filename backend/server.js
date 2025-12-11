const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dataRoutes = require('./routes/data');
const authRoutes = require('./routes/auth.routes');
const subtiposRoutes = require('./routes/subtipos');
const periodosRoutes = require('./routes/periodosRoutes')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(err));

// Rutas
app.use('/api/data', dataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subtipos', subtiposRoutes);
app.use('/api/periods', periodosRoutes);

// Error 404 para rutas no encontradas
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en puerto ${PORT} :)`));
