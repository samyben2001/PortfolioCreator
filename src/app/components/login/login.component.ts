import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, UserLogin } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule,CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formBuilder = inject(FormBuilder)
  userService = inject(UserService)
  authService = inject(AuthService)
  router = inject(Router)

  group: FormGroup


  constructor() {

    this.group = this.formBuilder.group(
      {
        email: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(8)]]
      }
    )
  }

  submit() {
    if (this.group.valid) {
      let user: UserLogin = {
        email: this.group.value.email,
        password: this.group.value.password
      }

      this.userService.login(user).subscribe({
        next: (token: string) => {
          const u: any = jwtDecode(token)

          this.authService.setToken(token)
          this.router.navigate(['/portfolios/', u.UserId])
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
}
