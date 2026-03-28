const perfilFinanceiroRepository = require("../repositories/perfilFinanceiroRepository");
const authRepository = require("../repositories/authRepository");

class PerfilFinanceiroService {
  /**
   * Cria perfil financeiro do usuário
   */
  async createPerfil(usuarioId, perfilData) {
    try {
      // Valida dados básicos
      if (!usuarioId) {
        throw new Error("ID do usuário é obrigatório");
      }

      const {
        renda_mensal,
        saldo_inicial,
        objetivo_financeiro,
        perfil_comportamento
      } = perfilData;

      if (renda_mensal === undefined || renda_mensal < 0) {
        throw new Error("Renda mensal inválida");
      }

      if (saldo_inicial === undefined || saldo_inicial < 0) {
        throw new Error("Saldo inicial inválido");
      }

      if (!objetivo_financeiro || objetivo_financeiro.trim().length === 0) {
        throw new Error("Objetivo financeiro é obrigatório");
      }

      if (!["conservador", "moderado", "gastador"].includes(perfil_comportamento)) {
        throw new Error("Perfil de comportamento inválido");
      }

      // Verifica se usuário existe
      const usuario = await authRepository.findById(usuarioId);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }

      // Verifica se já tem perfil
      const perfilExistente = await perfilFinanceiroRepository.findByUsuarioId(usuarioId);
      if (perfilExistente) {
        // Atualiza ao invés de criar
        const atualizado = await perfilFinanceiroRepository.update(usuarioId, perfilData);
        if (!atualizado) {
          throw new Error("Erro ao atualizar perfil");
        }
        return {
          id: perfilExistente.id,
          usuario_id: usuarioId,
          ...perfilData
        };
      }

      // Cria novo perfil
      const perfil = await perfilFinanceiroRepository.create(usuarioId, perfilData);
      return perfil;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Busca perfil financeiro do usuário
   */
  async getPerfil(usuarioId) {
    try {
      const perfil = await perfilFinanceiroRepository.findByUsuarioId(usuarioId);
      if (!perfil) {
        throw new Error("Perfil financeiro não encontrado");
      }
      return perfil;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new PerfilFinanceiroService();
