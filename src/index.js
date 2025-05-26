import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import professorRoutes from './routes/professorRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/professores', professorRoutes)
app.use('/alunos', alunoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
