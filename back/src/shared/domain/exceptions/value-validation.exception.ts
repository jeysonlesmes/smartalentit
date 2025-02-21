import { ValidationException } from "./validation.exception";

export class ValueNotDefinedException extends ValidationException {
  constructor() {
    super("Value must be defined.");
  }
}