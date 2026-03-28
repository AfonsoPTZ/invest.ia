const perfilFinanceiroService = require("../services/perfilFinanceiroService");

class PerfilFinanceiroController {
  /**
   * POST /perfil-financeiro
   * Cria perfil financeiro do usuário
   */
  async create(req, res) {
    try {
      const { usuario_id } = req.body;

      if (!usuario_id) {
        return res.status(400).json({
          status: "erro",
          mensagem: "ID do usuário é obrigatório"
        });
      }

      const perfil = await perfilFinanceiroService.createPerfil(usuario_id, req.body);

      return res.status(201).json({
        status: "sucesso",
        mensagem: "Perfil financeiro criado com sucesso",
        perfil
      });
    } catch (error) {
      console.error("Erro ao criar perfil:", error.message);
      return res.status(400).json({
        status: "erro",
        mensagem: error.message
      });
    }
  }

  /**
   * GET /perfil-financeiro/:usuarioId
   * Busca perfil financeiro do usuário
   */
  async get(req, res) {
    try {
      const { usuarioId } = req.params;

      if (!usuarioId) {
        return res.status(400).json({
          status: "erro",
          mensagem: "ID do usuário é obrigatório"
        });
      }

      const perfil = await perfilFinanceiroService.getPerfil(usuarioId);

      return res.status(200).json({
        status: "sucesso",
        perfil
      });
    } catch (error) {
      console.error("Erro ao buscar perfil:", error.message);
      return res.status(404).json({
        status: "erro",
        mensagem: error.message
      });
    }
  }
}

module.exports = new PerfilFinanceiroController();
