/**
 * AuthResponseDTO - Data Transfer Object para resposta de autenticação
 * Transporta dados de usuário autenticado + token
 */

interface IAuthUser {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: any;
}

class AuthResponseDTO {
  id: string | number;
  name: string;
  email: string;
  token: string;

  constructor(id: string | number, name: string, email: string, token: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.token = token;
  }

  /**
   * Factory method: criar a partir de dados de usuário e token
   */
  static fromUser(user: IAuthUser, token: string): AuthResponseDTO {
    return new AuthResponseDTO(
      user.id ?? "",
      user.name ?? "",
      user.email ?? "",
      token
    );
  }

  /**
   * Retornar dados para serialização
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      token: this.token
    };
  }
}

export default AuthResponseDTO;
export type { IAuthUser };
