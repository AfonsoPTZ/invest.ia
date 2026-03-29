/**
 * UserEntity - Representa um usuário no sistema
 * Encapsula dados de usuário do banco em um objeto de domínio
 */
class UserEntity {
  constructor(id, name, email, cpf, phone, emailVerificado, passwordHash) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.phone = phone;
    this.emailVerificado = emailVerificado;
    this.passwordHash = passwordHash;
  }

  /**
   * Factory method: criar entity a partir de dados do banco
   * Mapeia snake_case do BD para camelCase da entity
   */
  static fromDatabase(dbRow) {
    if (!dbRow) return null;

    return new UserEntity(
      dbRow.id,
      dbRow.nome || dbRow.name,
      dbRow.email,
      dbRow.cpf,
      dbRow.telefone || dbRow.phone,
      dbRow.email_verificado || dbRow.emailVerificado,
      dbRow.senha_hash || dbRow.passwordHash
    );
  }

  /**
   * Retornar dados públicos (sem senha) para serialização
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      phone: this.phone,
      emailVerificado: this.emailVerificado
    };
  }

  /**
   * Checagem rápida se email foi verificado
   */
  isEmailVerified() {
    return this.emailVerificado === true || this.emailVerificado === 1;
  }
}

module.exports = UserEntity;
