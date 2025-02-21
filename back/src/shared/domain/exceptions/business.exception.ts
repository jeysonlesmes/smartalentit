export class BusinessException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}