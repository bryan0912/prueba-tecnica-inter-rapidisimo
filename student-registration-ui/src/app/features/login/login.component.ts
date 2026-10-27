import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Inter Rapidísimo</mat-card-title>
          <mat-card-subtitle>Portal de Estudiantes</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" style="margin-top: 20px;">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password">
            </mat-form-field>
            <button mat-raised-button color="primary" class="full-width" [disabled]="loginForm.invalid" style="padding: 20px 0; font-size: 16px;">
              Ingresar
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
    }
    .login-card { 
      width: 400px; 
      padding: 30px; 
      border-radius: 12px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    mat-card-title { font-size: 24px; font-weight: bold; color: #d32f2f; }
    mat-card-subtitle { font-size: 16px; margin-bottom: 20px; }
    .full-width { width: 100%; margin-bottom: 16px; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => alert('Credenciales inválidas o error de conexión.')
      });
    }
  }
}

 