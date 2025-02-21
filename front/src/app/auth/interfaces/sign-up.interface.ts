import { CreateUser } from "../../users/interfaces/user-data.interface";

export type SignUp = Omit<CreateUser, 'role'>;