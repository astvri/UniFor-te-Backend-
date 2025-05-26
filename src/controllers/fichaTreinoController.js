const fichaTreinoService = require("../services/fichaTreinoService");

class FichaTreinoController {

    async create(req, res) {
        try {
            const fichaData = req.body; // Assume que os dados vêm no corpo da requisição
            // Validação básica dos dados recebidos (pode ser expandida)
            if (!fichaData.titulo || !fichaData.descricao || !fichaData.exercicios) {
                return res.status(400).json({ message: "Título, descrição e exercícios são obrigatórios." });
            }

            const novaFicha = await fichaTreinoService.createFichaTreino(fichaData);
            if (novaFicha) {
                res.status(201).json(novaFicha);
            } else {
                res.status(500).json({ message: "Erro ao criar ficha de treino." });
            }
        } catch (error) {
            console.error("Erro no controller ao criar ficha: ", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async getAll(req, res) {
        try {
            const fichas = await fichaTreinoService.getAllFichasTreino();
            res.status(200).json(fichas);
        } catch (error) {
            console.error("Erro no controller ao buscar todas as fichas: ", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async getById(req, res) {
        try {
            const id = req.params.id;
            const ficha = await fichaTreinoService.getFichaTreinoById(id);
            if (ficha) {
                res.status(200).json(ficha);
            } else {
                res.status(404).json({ message: "Ficha de treino não encontrada." });
            }
        } catch (error) {
            console.error("Erro no controller ao buscar ficha por ID: ", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            const updateData = req.body;
            const fichaAtualizada = await fichaTreinoService.updateFichaTreino(id, updateData);
            if (fichaAtualizada) {
                res.status(200).json(fichaAtualizada);
            } else {
                // Pode ser 404 (não encontrado) ou 500 (erro ao atualizar)
                // O serviço retorna null em ambos os casos, idealmente o serviço diferenciaria
                const existe = await fichaTreinoService.getFichaTreinoById(id); // Verifica se existe
                if (!existe) {
                    return res.status(404).json({ message: "Ficha de treino não encontrada para atualização." });
                }
                res.status(500).json({ message: "Erro ao atualizar ficha de treino." });
            }
        } catch (error) {
            console.error("Erro no controller ao atualizar ficha: ", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            // Opcional: Verificar se a ficha existe antes de tentar deletar
            const fichaExiste = await fichaTreinoService.getFichaTreinoById(id);
            if (!fichaExiste) {
                return res.status(404).json({ message: "Ficha de treino não encontrada para exclusão." });
            }

            const sucesso = await fichaTreinoService.deleteFichaTreino(id);
            if (sucesso) {
                res.status(204).send(); // 204 No Content para sucesso na exclusão
            } else {
                res.status(500).json({ message: "Erro ao deletar ficha de treino." });
            }
        } catch (error) {
            console.error("Erro no controller ao deletar ficha: ", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    // --- Métodos para rotas adicionais (se necessário) ---

    async getByAlunoId(req, res) {
        try {
            const alunoId = req.params.alunoId;
            const fichas = await fichaTreinoService.getFichasTreinoByAlunoId(alunoId);
            res.status(200).json(fichas);
        } catch (error) {
            console.error("Erro no controller ao buscar fichas por Aluno ID: ", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async getByProfessorId(req, res) {
        try {
            const professorId = req.params.professorId;
            const fichas = await fichaTreinoService.getFichasTreinoByProfessorId(professorId);
            res.status(200).json(fichas);
        } catch (error) {
            console.error("Erro no controller ao buscar fichas por Professor ID: ", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}

module.exports = new FichaTreinoController();

