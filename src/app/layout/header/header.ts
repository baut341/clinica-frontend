import { Component, inject, output } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';

import { ETIQUETAS_ROL } from '../../core/models/usuario.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** El contenedor de la aplicación escucha esto para abrir o cerrar el menú lateral. */
  readonly alternarMenu = output<void>();

  readonly estaLogueado = this.auth.estaLogueado;
  readonly nombreCompleto = this.auth.nombreCompleto;
  readonly rol = this.auth.rol;

  etiquetaRol(): string {
    const rol = this.rol();
    return rol ? ETIQUETAS_ROL[rol] : '';
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
