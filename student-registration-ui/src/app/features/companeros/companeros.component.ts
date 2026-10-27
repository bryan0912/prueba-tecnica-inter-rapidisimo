import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-companeros',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="companeros-background">
      <div class="companeros-container">
        
        <header class="app-header">
          <button mat-button color="primary" routerLink="/dashboard">
            <mat-icon>arrow_back</mat-icon> Volver al Dashboard
          </button>
          <h2>Mis Compañeros de Clase</h2>
        </header>
        
        <p *ngIf="cargando" class="loading-text">Cargando información...</p>

        <div *ngIf="!cargando && companerosPorMateria.length === 0" class="empty-state">
          <mat-icon>info</mat-icon>
          <p>No tienes materias inscritas o no hay otros compañeros en tus clases.</p>
        </div>

        <div class="materias-grid">
          <mat-card *ngFor="let materia of companerosPorMateria" class="materia-card">
            <mat-card-header>
              <mat-card-title>{{ materia.materia }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-list>
                <mat-list-item *ngFor="let companero of materia.companeros">
                  <mat-icon matListItemIcon>person</mat-icon>
                  <span matListItemTitle>{{ companero }}</span>
                </mat-list-item>
                <mat-list-item *ngIf="materia.companeros.length === 0">
                  <mat-icon matListItemIcon style="color: gray;">person_off</mat-icon>
                  <span matListItemTitle style="color: gray; font-style: italic;">Estás solo en esta materia</span>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .companeros-background { background-color: #f4f6f8; min-height: 100vh; padding: 20px 0; }
    .companeros-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; font-family: 'Roboto', sans-serif; }
    .app-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
    .app-header h2 { margin: 0; color: #333; }
    .materias-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .materia-card { border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important; }
    .loading-text { text-align: center; color: #777; padding: 20px; }
    .empty-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: white; padding: 40px; border-radius: 12px; color: #777;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 10px; color: #ccc; }
  `]
})
export class CompanerosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost:5177/api'; 
  
  companerosPorMateria: any[] = [];
  cargando: boolean = true;

  ngOnInit() {
    const estudianteId = localStorage.getItem('id') || '1';
    
    this.http.get<any[]>(`${this.apiUrl}/materias/companeros/${estudianteId}`).subscribe({
      next: (data) => {
        this.companerosPorMateria = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.cdr.detectChanges();
        alert('Error al cargar compañeros.');
      }
    });
  }
}
