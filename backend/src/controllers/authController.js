// backend/src/controllers/authController.js
const authService = require("../services/authService");

async function register(req, res) {
  try {
    const { nome, email, cpf, telefone, senha } = req.body;

    if (!nome || !email || !cpf || !telefone || !senha) {
      return res.status(400).json({
        status: "erro",
        mensagem: "Todos os campos são obrigatórios"
      });
    }

    const resultado = await authService.register(nome, email, cpf, telefone, senha);

    return res.status(201).json({
      status: "sucesso",
      mensagem: "Usuário registrado com sucesso",
      usuario: {
        id: resultado.id,
        nome: resultado.nome,
        email: resultado.email
      },
      token: resultado.token
    });
  } catch (error) {
    console.error("Erro no registro:", error.message);
    return res.status(400).json({
      status: "erro",
      mensagem: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        status: "erro",
        mensagem: "Email e senha são obrigatórios"
      });
    }

    const resultado = await authService.login(email, senha);

    return res.status(200).json({
      status: "sucesso",
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: resultado.id,
        nome: resultado.nome,
        email: resultado.email
      },
      token: resultado.token
    });
  } catch (error) {
    console.error("Erro no login:", error.message);
    return res.status(401).json({
      status: "erro",
      mensagem: error.message
    });
  }
}

async function logout(req, res) {
  try {
    // Com JWT, logout é apenas no frontend (limpar token)
    return res.status(200).json({
      status: "sucesso",
      mensagem: "Logout realizado com sucesso"
    });
  } catch (error) {
    console.error("Erro no logout:", error.message);
    return res.status(500).json({
      status: "erro",
      mensagem: error.message
    });
  }
}

async function me(req, res) {
  try {
    return res.status(200).json({
      status: "sucesso",
      usuario: req.usuario
    });
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error.message);
    return res.status(500).json({
      status: "erro",
      mensagem: error.message
    });
  }
}

async function changePassword(req, res) {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        status: "erro",
        mensagem: "Senha atual e nova senha são obrigatórias"
      });
    }

    const resultado = await authService.changePassword(
      req.usuario.id,
      senhaAtual,
      novaSenha
    );

    return res.status(200).json({
      status: "sucesso",
      mensagem: resultado.mensagem
    });
  } catch (error) {
    console.error("Erro ao alterar senha:", error.message);
    return res.status(400).json({
      status: "erro",
      mensagem: error.message
    });
  }
}

async function check(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(200).json({
        status: "sucesso",
        autenticado: false
      });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(200).json({
        status: "sucesso",
        autenticado: false
      });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sua-chave-secreta");

    const usuario = await authService.getUserData(decoded.id);

    return res.status(200).json({
      status: "sucesso",
      autenticado: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    return res.status(200).json({
      status: "sucesso",
      autenticado: false
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
  changePassword,
  check
};