export abstract class PasswordEncryption {
  abstract encrypt(password: string): string;
  abstract compare(password: string, hashedPassword: string): boolean;
}