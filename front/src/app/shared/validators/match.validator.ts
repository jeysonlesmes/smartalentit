import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const matchingControl = control.root.get(controlName);

    if (!matchingControl) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      return { mismatch: true };
    }

    return null;
  };
}