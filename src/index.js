import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import professorRoutes from './routes/professorRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import fichaTreinoRoutes from './routes/fichaTreinoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import aulaRoutes from './routes/aulaRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/professores', professorRoutes)
app.use('/api/alunos', alunoRoutes);
app.use("/api/fichas", fichaTreinoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/aulas', aulaRoutes);



app.use((err, req, res, next) => {
  console.error('Erro capturado pelo middleware global:', err);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});




