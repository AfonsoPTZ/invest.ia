/**
 * RegisterDTO - Data Transfer Object para registro de novo usuário
 * Transporta dados de entrada de forma tipada e validada
 */
class RegisterDTO {
  constructor(name, email, cpf, phone, password) {
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.phone = phone;
    this.password = password;
  }

  /**
   * Factory method: criar DTO a partir do request body
   */
  static fromRequest(body) {
    const { name, email, cpf, phone, password } = body;
    return new RegisterDTO(name, email, cpf, phone, password);
  }

  /**
   * Retornar dados para serialização/log
   */
  toJSON() {
    return {
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      phone: this.phone
      // Nunca incluir password em JSON
    };
  }
}

export default RegisterDTO;
