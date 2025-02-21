import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from '../../shared/modules/shared.module';
import { matchValidator } from '../../shared/validators/match.validator';
import { passwordValidator } from '../../shared/validators/password.validator';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  validateForm: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    passwordConfirmation: FormControl<string>;
  }>;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      passwordConfirmation: ['', [Validators.required, matchValidator('password')]]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.signUp();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private signUp(): void {
    this.authService.signUp({
      name: this.validateForm.value.name!,
      email: this.validateForm.value.email!,
      password: this.validateForm.value.password!,
      passwordConfirmation: this.validateForm.value.passwordConfirmation!
    }).subscribe(user => {
      this.messageService.success(`Hello ${user.name}, welcome!`);
    });
  }
}
