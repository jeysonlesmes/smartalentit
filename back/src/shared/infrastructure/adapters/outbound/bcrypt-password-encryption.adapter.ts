
import { PasswordEncryption } from '@shared/application/ports/outbound/password-encryption.port';
import { compareSync, hashSync } from 'bcrypt';

export class BcryptPasswordEncryption extends PasswordEncryption {
  encrypt(password: string): string {
    const SALT_ROUNDS = 10;

    return hashSync(password, SALT_ROUNDS);
  }

  compare(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }
}