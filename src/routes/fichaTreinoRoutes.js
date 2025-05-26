const express = require("express");
const router = express.Router();
const fichaTreinoController = require("../controllers/fichaTreinoController");

// Rotas CRUD básicas para Ficha de Treino
router.post("/", fichaTreinoController.create);          // Criar nova ficha
router.get("/", fichaTreinoController.getAll);            // Obter todas as fichas
router.get("/:id", fichaTreinoController.getById);        // Obter ficha por ID
router.put("/:id", fichaTreinoController.update);        // Atualizar ficha por ID
router.delete("/:id", fichaTreinoController.delete);      // Deletar ficha por ID

// Rotas adicionais (exemplo: buscar por aluno ou professor)
router.get("/aluno/:alunoId", fichaTreinoController.getByAlunoId); // Buscar fichas por ID do Aluno
router.get("/professor/:professorId", fichaTreinoController.getByProfessorId); // Buscar fichas por ID do Professor

module.exports = router;

