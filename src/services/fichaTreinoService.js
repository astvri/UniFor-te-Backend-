const supabase = require('../supabase/supabaseClient');
const FichaTreino = require('../entities/FichaTreino');

// Nome da tabela no Supabase
const TABLE_NAME = 'fichas_treino';

class FichaTreinoService {

    /**
     * Cria uma nova ficha de treino no banco de dados.
     * @param {object} fichaData - Dados da ficha de treino (titulo, descricao, exercicios, alunoId, professorId).
     * @returns {Promise<FichaTreino|null>} A ficha de treino criada ou null em caso de erro.
     */
    async createFichaTreino(fichaData) {
        const { titulo, descricao, exercicios, alunoId, professorId } = fichaData;
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([
                { 
                    titulo,
                    descricao,
                    exercicios, // Supabase suporta arrays diretamente
                    aluno_id: alunoId, 
                    professor_id: professorId
                }
            ])
            .select()
            .single(); // Retorna o objeto inserido

        if (error) {
            console.error('Erro ao criar ficha de treino:', error.message);
            return null;
        }

        if (data) {
            return new FichaTreino(data.id, data.titulo, data.descricao, data.exercicios, data.aluno_id, data.professor_id, data.created_at);
        }
        return null;
    }

    /**
     * Busca todas as fichas de treino.
     * @returns {Promise<FichaTreino[]>} Uma lista de todas as fichas de treino.
     */
    async getAllFichasTreino() {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) {
            console.error('Erro ao buscar fichas de treino:', error.message);
            return [];
        }

        return data.map(ficha => new FichaTreino(ficha.id, ficha.titulo, ficha.descricao, ficha.exercicios, ficha.aluno_id, ficha.professor_id, ficha.created_at));
    }

    /**
     * Busca uma ficha de treino pelo ID.
     * @param {number|string} id - O ID da ficha de treino.
     * @returns {Promise<FichaTreino|null>} A ficha de treino encontrada ou null se não existir ou em caso de erro.
     */
    async getFichaTreinoById(id) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single(); // Espera um único resultado

        if (error) {
            if (error.code === 'PGRST116') { // Código para 'Not Found'
                return null;
            }
            console.error('Erro ao buscar ficha de treino por ID:', error.message);
            return null;
        }

        if (data) {
            return new FichaTreino(data.id, data.titulo, data.descricao, data.exercicios, data.aluno_id, data.professor_id, data.created_at);
        }
        return null;
    }

    /**
     * Atualiza uma ficha de treino existente.
     * @param {number|string} id - O ID da ficha de treino a ser atualizada.
     * @param {object} updateData - Os dados a serem atualizados.
     * @returns {Promise<FichaTreino|null>} A ficha de treino atualizada ou null em caso de erro ou se não encontrada.
     */
    async updateFichaTreino(id, updateData) {
        // Mapeia os campos para os nomes das colunas do Supabase, se necessário
        const updatePayload = {};
        if (updateData.titulo !== undefined) updatePayload.titulo = updateData.titulo;
        if (updateData.descricao !== undefined) updatePayload.descricao = updateData.descricao;
        if (updateData.exercicios !== undefined) updatePayload.exercicios = updateData.exercicios;
        if (updateData.alunoId !== undefined) updatePayload.aluno_id = updateData.alunoId;
        if (updateData.professorId !== undefined) updatePayload.professor_id = updateData.professorId;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar ficha de treino:', error.message);
            return null;
        }

        if (data) {
            return new FichaTreino(data.id, data.titulo, data.descricao, data.exercicios, data.aluno_id, data.professor_id, data.created_at);
        }
        return null; // Pode acontecer se o ID não for encontrado
    }

    /**
     * Deleta uma ficha de treino pelo ID.
     * @param {number|string} id - O ID da ficha de treino a ser deletada.
     * @returns {Promise<boolean>} True se a deleção foi bem-sucedida, false caso contrário.
     */
    async deleteFichaTreino(id) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao deletar ficha de treino:', error.message);
            return false;
        }

        // A deleção no Supabase não retorna os dados deletados por padrão,
        // A ausência de erro geralmente indica sucesso.
        // Poderia adicionar uma verificação se 'count' > 0 se a API retornar isso.
        return true;
    }

    // --- Métodos Adicionais (Exemplos) ---

    /**
     * Busca fichas de treino por ID do Aluno.
     * @param {number|string} alunoId - O ID do aluno.
     * @returns {Promise<FichaTreino[]>} Uma lista de fichas de treino do aluno.
     */
    async getFichasTreinoByAlunoId(alunoId) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('aluno_id', alunoId);

        if (error) {
            console.error('Erro ao buscar fichas de treino por aluno ID:', error.message);
            return [];
        }

        return data.map(ficha => new FichaTreino(ficha.id, ficha.titulo, ficha.descricao, ficha.exercicios, ficha.aluno_id, ficha.professor_id, ficha.created_at));
    }

     /**
     * Busca fichas de treino por ID do Professor.
     * @param {number|string} professorId - O ID do professor.
     * @returns {Promise<FichaTreino[]>} Uma lista de fichas de treino criadas pelo professor.
     */
    async getFichasTreinoByProfessorId(professorId) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('professor_id', professorId);

        if (error) {
            console.error('Erro ao buscar fichas de treino por professor ID:', error.message);
            return [];
        }

        return data.map(ficha => new FichaTreino(ficha.id, ficha.titulo, ficha.descricao, ficha.exercicios, ficha.aluno_id, ficha.professor_id, ficha.created_at));
    }
}

module.exports = new FichaTreinoService();