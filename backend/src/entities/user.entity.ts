/**
 * UserEntity - Representa um usuário no sistema
 * Encapsula dados de usuário do banco em um objeto de domínio
 */

interface IUserDatabaseRow {
  id?: string | number;
  nome?: string;
  name?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  phone?: string;
  email_verificado?: boolean | number;
  emailVerificado?: boolean | number;
  senha_hash?: string;
  passwordHash?: string;
  [key: string]: any;
}

class UserEntity {
  id: string | number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  emailVerificado: boolean | number;
  passwordHash: string;

  constructor(
    id: string | number,
    name: string,
    email: string,
    cpf: string,
    phone: string,
    emailVerificado: boolean | number,
    passwordHash: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.phone = phone;
    this.emailVerificado = emailVerificado;
    this.passwordHash = passwordHash;
  }

  /**
   * Factory method: criar entity a partir de dados do banco
   * Mapeia snake_case do BD para camelCase da entity
   */
  static fromDatabase(dbRow: IUserDatabaseRow | null | undefined): UserEntity | null {
    if (!dbRow) return null;

    return new UserEntity(
      dbRow.id ?? "",
      dbRow.nome ?? dbRow.name ?? "",
      dbRow.email ?? "",
      dbRow.cpf ?? "",
      dbRow.telefone ?? dbRow.phone ?? "",
      dbRow.email_verificado ?? dbRow.emailVerificado ?? false,
      dbRow.senha_hash ?? dbRow.passwordHash ?? ""
    );
  }

  /**
   * Retornar dados públicos (sem senha) para serialização
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      phone: this.phone,
      emailVerificado: this.emailVerificado
    };
  }

  /**
   * Checagem rápida se email foi verificado
   */
  isEmailVerified(): boolean {
    return this.emailVerificado === true || this.emailVerificado === 1;
  }
}

export default UserEntity;
export type { IUserDatabaseRow };
