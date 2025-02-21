
export interface UserData {
  name: string;
  email: string;
  role: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface UpdateUser extends UserData {
  id: string;
}

export type CreateUser = Required<UserData>;