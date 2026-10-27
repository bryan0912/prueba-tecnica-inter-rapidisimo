import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatSnackBarModule, MatIconModule],
  template: `
    <div class="dashboard-background">
      <div class="dashboard-container">
        
        <header class="app-header">
          <div class="logo">
            <mat-icon>local_shipping</mat-icon>
            <h1>Inter Rapidísimo</h1>
          </div>
          <div class="user-actions">
            <span class="welcome-text">Bienvenido, {{ nombreEstudiante }}</span>
            <button mat-stroked-button color="primary" routerLink="/companeros">
              <mat-icon>group</mat-icon> Ver Compañeros
            </button>
            <button mat-stroked-button color="warn" (click)="logout()">
              <mat-icon>exit_to_app</mat-icon> Salir
            </button>
          </div>
        </header>

        <div class="main-content">
          <!-- PANEL IZQUIERDO: MIS MATERIAS ACTUALES -->
          <mat-card class="mis-materias-card" *ngIf="misMaterias.length > 0">
            <mat-card-header>
              <mat-card-title>Mis Materias Inscritas</mat-card-title>
              <mat-card-subtitle>Tienes {{ misMaterias.length }} de 3 materias</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <ul class="lista-inscritas">
                <li *ngFor="let m of misMaterias">
                  <span>{{ m.nombre }}</span>
                  <button mat-icon-button color="warn" (click)="cancelarMateria(m.materiaId)" title="Cancelar materia">
                    <mat-icon>delete</mat-icon>
                  </button>
                </li>
              </ul>
            </mat-card-content>
          </mat-card>

          <!-- PANEL DERECHO: INSCRIPCIÓN -->
          <mat-card class="materias-card" [class.full-width]="misMaterias.length === 0">
            <mat-card-header>
              <mat-card-title>Inscripción de Materias</mat-card-title>
              <mat-card-subtitle>Selecciona exactamente 3 materias (no puedes repetir profesor)</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              
              <p *ngIf="materias.length === 0" class="loading-text">Cargando materias...</p>

              <div class="materias-grid" *ngIf="materias.length > 0">
                <div *ngFor="let materia of materias" 
                     class="materia-item" 
                     [class.selected]="isSelected(materia.id)"
                     [class.disabled]="yaInscrita(materia.id) || (!isSelected(materia.id) && seleccionadas.length >= 3)">
                  <label>
                    <input 
                      type="checkbox" 
                      [checked]="isSelected(materia.id) || yaInscrita(materia.id)"
                      (change)="toggleMateria(materia.id, $any($event.target).checked)"
                      [disabled]="yaInscrita(materia.id) || (!isSelected(materia.id) && seleccionadas.length >= 3)">
                    <div class="materia-info">
                      <span class="materia-nombre">{{ materia.nombre }} <span *ngIf="yaInscrita(materia.id)" class="tag-inscrita">(Ya inscrita)</span></span>
                      <span class="materia-detalles">{{ materia.profesor }} | {{ materia.creditos }} créditos</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div class="action-footer">
                <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="seleccionadas.length !== 3 || (misMaterias.length + seleccionadas.length) > 3" class="btn-submit">
                  Inscribir Materias ({{ seleccionadas.length }}/3)
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-background { background-color: #f4f6f8; min-height: 100vh; padding: 20px 0; }
    .dashboard-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; font-family: 'Roboto', sans-serif; }
    .app-header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px; }
    .logo { display: flex; align-items: center; gap: 10px; color: #d32f2f; }
    .logo h1 { margin: 0; font-size: 24px; font-weight: bold; }
    .user-actions { display: flex; align-items: center; gap: 15px; }
    .welcome-text { font-weight: 500; color: #555; }
    
    .main-content { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
    @media (max-width: 768px) { .main-content { grid-template-columns: 1fr; } .full-width { grid-column: 1; } }

    .materias-card, .mis-materias-card { border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
    .full-width { grid-column: 1 / -1; }
    
    .lista-inscritas { list-style: none; padding: 0; margin: 0; }
    .lista-inscritas li { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
    .lista-inscritas li:last-child { border-bottom: none; }

    .materias-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin-top: 20px; margin-bottom: 30px; }
    .materia-item { border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; transition: all 0.2s ease; background: #fafafa; }
    .materia-item:hover { border-color: #bdbdbd; background: #f5f5f5; }
    .materia-item.selected { border-color: #3f51b5; background: #e8eaf6; }
    .materia-item.disabled { opacity: 0.5; background: #e0e0e0; cursor: not-allowed; }
    .materia-item label { display: flex; align-items: flex-start; gap: 15px; cursor: pointer; width: 100%; }
    .materia-item input[type="checkbox"] { width: 20px; height: 20px; margin-top: 2px; cursor: pointer; }
    .materia-info { display: flex; flex-direction: column; }
    .materia-nombre { font-weight: bold; font-size: 16px; color: #333; }
    .tag-inscrita { color: #3f51b5; font-size: 12px; font-weight: normal; }
    .materia-detalles { font-size: 13px; color: #777; margin-top: 4px; }
    
    .action-footer { display: flex; justify-content: flex-end; }
    .btn-submit { padding: 8px 24px; font-size: 16px; }
    .loading-text { text-align: center; color: #777; padding: 20px; }
  `]
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl = 'http://localhost:5177/api'; 
  private estudianteId = Number(localStorage.getItem('id') || 1);

  nombreEstudiante = localStorage.getItem('nombre') || 'Estudiante';
  materias: any[] = [];
  misMaterias: any[] = [];
  seleccionadas: number[] = [];

  ngOnInit() {
    this.cargarTodo();
  }

  cargarTodo() {
    // 1. Cargar todas las materias disponibles
    this.http.get<any[]>(`${this.apiUrl}/materias`).subscribe(data => {
      this.materias = data;
      this.cdr.detectChanges();
    });

    // 2. Cargar las materias que el estudiante YA tiene
    this.http.get<any[]>(`${this.apiUrl}/materias/mis-materias/${this.estudianteId}`).subscribe(data => {
      this.misMaterias = data;
      this.cdr.detectChanges();
    });
  }

  yaInscrita(materiaId: number): boolean {
    return this.misMaterias.some(m => m.materiaId === materiaId);
  }

  isSelected(id: number): boolean {
    return this.seleccionadas.includes(id);
  }

  toggleMateria(id: number, checked: boolean) {
    if (checked) {
      if (this.seleccionadas.length < 3) this.seleccionadas.push(id);
    } else {
      this.seleccionadas = this.seleccionadas.filter(m => m !== id);
    }
    this.cdr.detectChanges(); 
  }

  cancelarMateria(materiaId: number) {
    if(confirm('¿Estás seguro de cancelar esta materia? Liberarás el cupo.')) {
      this.http.delete(`${this.apiUrl}/materias/cancelar/${this.estudianteId}/${materiaId}`).subscribe({
        next: () => {
          this.snackBar.open('Materia cancelada', 'Cerrar', { duration: 3000 });
          this.misMaterias = this.misMaterias.filter(m => m.materiaId !== materiaId);
          this.cdr.detectChanges();
        },
        error: () => this.snackBar.open('Error al cancelar', 'Cerrar', { duration: 3000 })
      });
    }
  }

  onSubmit() {
    if (this.seleccionadas.length !== 3) return;
    
    const body = { estudianteId: this.estudianteId, materiaIds: this.seleccionadas };
    
    this.http.post(`${this.apiUrl}/materias/inscribir`, body).subscribe({
      next: () => {
        this.snackBar.open('¡Inscripción exitosa!', 'Cerrar', { duration: 3000 });
        this.seleccionadas = [];
        this.cargarTodo(); // Recargamos para ver las materias inscritas
      },
      error: (err) => {
        this.snackBar.open(err.error.message || 'Error al inscribir', 'Cerrar', { duration: 5000 });
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}