/**
 * LoginDTO - Data Transfer Object para autenticação
 * Transporta email e senha de forma tipada
 */
class LoginDTO {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  /**
   * Factory method: criar DTO a partir do request body
   */
  static fromRequest(body) {
    const { email, password } = body;
    return new LoginDTO(email, password);
  }

  /**
   * Retornar dados para serialização/log (sem password)
   */
  toJSON() {
    return {
      email: this.email
    };
  }
}

export default LoginDTO;
