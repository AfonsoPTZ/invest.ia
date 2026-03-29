/**
 * TokenEntity - Representa um token de autenticação
 * Encapsula dados de token para transferência entre services
 */
class TokenEntity {
  constructor(userId, email, token) {
    this.userId = userId;
    this.email = email;
    this.token = token;
  }

  /**
   * Factory method: criar token entity
   */
  static create(userId, email, token) {
    return new TokenEntity(userId, email, token);
  }

  /**
   * Retornar dados para serialização
   */
  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      token: this.token
    };
  }
}

module.exports = TokenEntity;
