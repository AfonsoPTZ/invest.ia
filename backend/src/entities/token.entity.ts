/**
 * TokenEntity - Representa um token de autenticação
 * Encapsula dados de token para transferência entre services
 */

class TokenEntity {
  userId: string | number;
  email: string;
  token: string;

  constructor(userId: string | number, email: string, token: string) {
    this.userId = userId;
    this.email = email;
    this.token = token;
  }

  /**
   * Factory method: criar token entity
   */
  static create(userId: string | number, email: string, token: string): TokenEntity {
    return new TokenEntity(userId, email, token);
  }

  /**
   * Retornar dados para serialização
   */
  toJSON(): object {
    return {
      userId: this.userId,
      email: this.email,
      token: this.token
    };
  }
}

export default TokenEntity;
