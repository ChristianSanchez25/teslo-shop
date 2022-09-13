import * as bcrypt from 'bcrypt'
import { IEncrypt } from '../ports/IEncrypt';

export class BcryptAdapter implements IEncrypt {

  encrypt(value: string, salt: number): string {
    return bcrypt.hashSync(value, salt);
  }

  compare(value: string, hash: string): boolean {
    return bcrypt.compareSync(value, hash);
  }
}
