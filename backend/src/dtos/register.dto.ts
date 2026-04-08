/**
 * RegisterDTO - Data Transfer Object para registro de novo usuário
 * Transporta dados de entrada de forma tipada e validada
 */

interface IRegisterRequest {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  password?: string;
}

class RegisterDTO {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;

  constructor(name: string, email: string, cpf: string, phone: string, password: string) {
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.phone = phone;
    this.password = password;
  }

  /**
   * Factory method: criar DTO a partir do request body
   */
  static fromRequest(body: IRegisterRequest): RegisterDTO {
    const { name = "", email = "", cpf = "", phone = "", password = "" } = body;
    return new RegisterDTO(name, email, cpf, phone, password);
  }

  /**
   * Retornar dados para serialização/log
   */
  toJSON(): object {
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
export type { IRegisterRequest };
