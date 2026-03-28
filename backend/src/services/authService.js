// backend/src/services/authService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");

const SALT_ROUNDS = 10;

/**
 * Registra novo usuário
 */
async function register(nome, email, cpf, telefone, senha) {
  try {
    // Validações básicas
    if (!nome || !email || !cpf || !telefone || !senha) {
      throw new Error("Todos os campos são obrigatórios");
    }

    if (nome.trim().length < 3) {
      throw new Error("Nome deve ter no mínimo 3 caracteres");
    }

    if (!/^\d{11}$/.test(cpf.replace(/[^\d]/g, ""))) {
      throw new Error("CPF deve ter 11 dígitos");
    }

    if (senha.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    // Verifica se email, cpf ou telefone já existem
    const emailExists = await authRepository.emailExists(email);
    if (emailExists) {
      throw new Error("Email já registrado");
    }

    const cpfExists = await authRepository.cpfExists(cpf);
    if (cpfExists) {
      throw new Error("CPF já registrado");
    }

    const phoneExists = await authRepository.phoneExists(telefone);
    if (phoneExists) {
      throw new Error("Telefone já registrado");
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    // Cria usuário
    const usuario = await authRepository.create({
      nome: nome.trim(),
      email: email.toLowerCase(),
      cpf: cpf.replace(/[^\d]/g, ""),
      telefone: telefone.replace(/[^\d]/g, ""),
      senhaHash
    });

    // Gera token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
      },
      process.env.JWT_SECRET || "sua-chave-secreta",
      { expiresIn: "7d" }
    );

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      token
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Faz login do usuário
 */
async function login(email, senha) {
  try {
    if (!email || !senha) {
      throw new Error("Email e senha são obrigatórios");
    }

    const usuario = await authRepository.findByEmail(email.toLowerCase());
    if (!usuario) {
      throw new Error("Email ou senha incorretos");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      throw new Error("Email ou senha incorretos");
    }

    // Gera token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
      },
      process.env.JWT_SECRET || "sua-chave-secreta",
      { expiresIn: "7d" }
    );

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      token
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Busca dados do usuário autenticado
 */
async function getUserData(userId) {
  try {
    const usuario = await authRepository.findById(userId);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }
    return usuario;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Altera senha do usuário
 */
async function changePassword(userId, senhaAtual, novaSenha) {
  try {
    if (!senhaAtual || !novaSenha) {
      throw new Error("Senha atual e nova senha são obrigatórias");
    }

    if (novaSenha.length < 6) {
      throw new Error("Nova senha deve ter no mínimo 6 caracteres");
    }

    const usuario = await authRepository.findById(userId);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica se a senha atual está correta
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha_hash);
    if (!senhaValida) {
      throw new Error("Senha atual incorreta");
    }

    // Hash da nova senha
    const novaSehaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    const atualizada = await authRepository.updatePassword(userId, novaSehaHash);
    if (!atualizada) {
      throw new Error("Erro ao atualizar senha");
    }

    return { mensagem: "Senha alterada com sucesso" };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  register,
  login,
  getUserData,
  changePassword
};