/**
 * LoginDTO - Data Transfer Object para autenticação
 * Transporta email e senha de forma tipada
 */

interface ILoginRequest {
  email?: string;
  password?: string;
}

class LoginDTO {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  /**
   * Factory method: criar DTO a partir do request body
   */
  static fromRequest(body: ILoginRequest): LoginDTO {
    const { email = "", password = "" } = body;
    return new LoginDTO(email, password);
  }

  /**
   * Retornar dados para serialização/log (sem password)
   */
  toJSON(): object {
    return {
      email: this.email
    };
  }
}

export default LoginDTO;
export type { ILoginRequest };
