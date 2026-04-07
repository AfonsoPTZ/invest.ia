/**
 * AuthResponseDTO - Data Transfer Object para resposta de autenticação
 * Transporta dados de usuário autenticado + token
 */
class AuthResponseDTO {
  constructor(id, name, email, token) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.token = token;
  }

  /**
   * Factory method: criar a partir de dados de usuário e token
   */
  static fromUser(user, token) {
    return new AuthResponseDTO(user.id, user.name, user.email, token);
  }

  /**
   * Retornar dados para serialização
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      token: this.token
    };
  }
}

export default AuthResponseDTO;
