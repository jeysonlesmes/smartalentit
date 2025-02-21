import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedModule } from '../../shared/modules/shared.module';
import { matchValidator } from '../../shared/validators/match.validator';
import { passwordValidator } from '../../shared/validators/password.validator';
import { Role } from '../interfaces/role.interface';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { CreateUser, UpdateUser } from '../interfaces/user-data.interface';
import { getRoleName } from '../../shared/utils/role.utils';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Input() setRole: boolean = false;
  @Output() save: EventEmitter<User> = new EventEmitter();

  validateForm: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    passwordConfirmation: FormControl<string>;
    role: FormControl<string>;
  }>;
  roles: Role[] = [];
  getRoleName = getRoleName;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly userService: UserService,
    private readonly messageService: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      passwordConfirmation: ['', [Validators.required, matchValidator('password')]],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.updateFormState();
    }
  }

  submitForm(): void {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const userData = this.validateForm.value;

    if (this.user) {
      if (!userData.password?.length) {
        delete userData.password;
        delete userData.passwordConfirmation;
      }

      this.userService.updateUser({ ...userData, id: this.user.id } as UpdateUser).subscribe(user => {
        this.messageService.success('User updated successfully!');
        this.save.emit(user);
      });
    } else {
      this.userService.createUser(userData as CreateUser).subscribe(user => {
        this.messageService.success('User created successfully!');
        this.save.emit(user);
      });
    }
  }

  onPasswordChange(): void {
    const passwordControl = this.validateForm.get('password');
    const passwordConfirmationControl = this.validateForm.get('passwordConfirmation');

    if (passwordControl?.value) {
      passwordControl.setValidators([Validators.required, passwordValidator]);
      passwordConfirmationControl?.setValidators([Validators.required, matchValidator('password')]);
    } else {
      passwordControl?.clearValidators();
      passwordConfirmationControl?.clearValidators();

      passwordConfirmationControl?.setValue('');
    }

    passwordControl?.updateValueAndValidity();
    passwordConfirmationControl?.updateValueAndValidity();
  }

  private updateFormState(): void {
    if (this.user) {
      this.validateForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        password: '',
        passwordConfirmation: '',
        role: this.user.role.code
      });

      this.validateForm.get('password')?.clearValidators();
      this.validateForm.get('passwordConfirmation')?.clearValidators();
    } else {
      this.validateForm.get('password')?.setValidators([Validators.required, passwordValidator]);
      this.validateForm.get('passwordConfirmation')?.setValidators([Validators.required, matchValidator('password')]);
    }

    this.validateForm.get('password')?.updateValueAndValidity();
    this.validateForm.get('passwordConfirmation')?.updateValueAndValidity();
  }

  private loadData(): void {
    this.userService.getRoles().subscribe(roles => {
      this.roles = roles;
    })
  }
}