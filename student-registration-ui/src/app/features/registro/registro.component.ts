import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="registro-container">
      <mat-card class="registro-card">
        <mat-card-header>
          <mat-card-title>Crear Cuenta</mat-card-title>
          <mat-card-subtitle>Regístrate para inscribir tus materias</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registroForm" (ngSubmit)="onSubmit()" style="margin-top: 20px;">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre Completo</mat-label>
              <input matInput formControlName="nombre" type="text">
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password">
            </mat-form-field>
            
            <button mat-raised-button color="primary" class="full-width" [disabled]="registroForm.invalid" style="padding: 20px 0; font-size: 16px;">
              Registrarme
            </button>
          </form>
          <div style="text-align: center; margin-top: 20px;">
            <a routerLink="/login" style="color: #3f51b5; text-decoration: none;">¿Ya tienes cuenta? Inicia sesión</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .registro-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
    .registro-card { width: 400px; padding: 30px; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
    mat-card-title { font-size: 24px; font-weight: bold; color: #d32f2f; }
    mat-card-subtitle { font-size: 16px; margin-bottom: 20px; }
    .full-width { width: 100%; margin-bottom: 16px; }
  `]
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  private apiUrl = 'http://localhost:5177/api'; 

  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registroForm.valid) {
      this.http.post(`${this.apiUrl}/estudiantes/registro`, this.registroForm.value).subscribe({
        next: () => {
          this.snackBar.open('¡Registro exitoso! Ahora puedes iniciar sesión.', 'Cerrar', { duration: 5000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const mensaje = err.error?.message || 'Error al registrar usuario.';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}