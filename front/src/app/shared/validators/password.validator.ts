import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null;
  }

  let errors: string[] = [];

  if (value.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(value)) {
    errors.push('Password must include at least one uppercase letter');
  }

  if (!/\d/.test(value)) {
    errors.push('Password must include at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    errors.push('Password must include at least one special character');
  }

  return errors.length ? { invalidPassword: { message: errors.at(0) } } : null;
};