import { User } from "../../users/interfaces/user.interface";
import { Credentials } from "./credentials.interface";

export interface Authentication {
  user: User;
  token: Credentials;
}