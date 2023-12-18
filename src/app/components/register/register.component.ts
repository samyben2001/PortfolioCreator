import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { User, UserRegister } from '../../models/user.model';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule,CardModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder)
  userService = inject(UserService)
  router = inject(Router)

  group: FormGroup

  user!: User

  constructor() {

    this.group = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        checkPassword: [null, [Validators.required, Validators.minLength(8)]],
      }
    )

  }

  submit() {

    if (this.group.valid) {
      let user: UserRegister = {
        email: this.group.value.email,
        password: this.group.value.password,
        checkPassword: this.group.value.checkPassword
      }

      this.userService.register(user).subscribe({
        next: (u: User) => {
          this.user = u
          this.router.navigate(['/portfolios/', this.user.id])
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

}
