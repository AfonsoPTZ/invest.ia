/**
 * UserResponseDTO - Data Transfer Object para resposta de dados de usuário
 * Transporta informações públicas do usuário para o cliente
 * Filtra campos sensíveis como passwordHash, emailVerificado, etc
 */
class UserResponseDTO {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  /**
   * Factory method: criar a partir de um objeto de usuário (entity ou raw)
   * Filtra automaticamente campos sensíveis
   * @param {object} user - Objeto de usuário do banco/entity
   * @returns {UserResponseDTO}
   */
  static fromUser(user) {
    if (!user) return null;

    return new UserResponseDTO(
      user.id,
      user.name,
      user.email
    );
  }

  /**
   * Retornar dados para serialização JSON
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    };
  }
}

export default UserResponseDTO;
