/**
 * UserResponseDTO - Data Transfer Object para resposta de dados de usuário
 * Transporta informações públicas do usuário para o cliente
 * Filtra campos sensíveis como passwordHash, emailVerificado, etc
 */

interface IUserObject {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: any;
}

class UserResponseDTO {
  id: string | number;
  name: string;
  email: string;

  constructor(id: string | number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  /**
   * Factory method: criar a partir de um objeto de usuário (entity ou raw)
   * Filtra automaticamente campos sensíveis
   * @param user - Objeto de usuário do banco/entity
   * @returns UserResponseDTO ou null se usuário vazio
   */
  static fromUser(user: IUserObject | null | undefined): UserResponseDTO | null {
    if (!user) return null;

    return new UserResponseDTO(
      user.id ?? "",
      user.name ?? "",
      user.email ?? ""
    );
  }

  /**
   * Retornar dados para serialização JSON
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    };
  }
}

export default UserResponseDTO;
export type { IUserObject };
