import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

console.log(`[index.js] Tentando carregar .env de: ${envPath}`);
const dotenvResult = dotenv.config({ path: envPath });


async function initializeApp() {

  const professorRoutes = (await import('./routes/professorRoutes.js')).default;
  const alunoRoutes = (await import('./routes/alunoRoutes.js')).default;
  const fichaTreinoRoutes = (await import('./routes/fichaTreinoRoutes.js')).default;
  const usuarioRoutes = (await import('./routes/usuarioRoutes.js')).default;
  const aulaRoutes = (await import('./routes/aulaRoutes.js')).default;
  const agendamentoAulaRoutes = (await import('./routes/agendamentoAulaRoutes.js')).default;
  const exercicioFichaRoutes = (await import('./routes/exercicioFichaRoutes.js')).default;


  const app = express();

  app.use(cors());
  app.use(express.json());

// Rotas da API
app.use('/api/professores', professorRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/fichas', fichaTreinoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/agendamentos', agendamentoAulaRoutes);
app.use('/api/exercicios-ficha', exercicioFichaRoutes);


  // Middleware de erro global
  app.use((err, req, res, next) => {
    console.error('[index.js] Erro capturado pelo middleware global:', err);
    res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[index.js] Servidor rodando na porta ${PORT}`);
  });
}

initializeApp().catch(error => {
  console.error("[index.js] Falha ao inicializar a aplicação:", error);
  process.exit(1);
});