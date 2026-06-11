require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database/init');

const setoresRoutes = require('./routes/setores.routes');
const agrupadoresRoutes = require('./routes/agrupadores.routes');
const avaliacoesRoutes = require('./routes/avaliacoes.routes');

const { timestamp } = require('rxjs');
initDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['content-type']
}));

app.use(express.json());

// Rota de Saúde
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.use('/setores', setoresRoutes);
app.use('/agrupadores', agrupadoresRoutes);
app.use('/avaliacoes', avaliacoesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Teste: http://localhost:${PORT}/health`);
})
