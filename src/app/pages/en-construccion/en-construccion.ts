import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-en-construccion',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './en-construccion.html',
  styleUrl: './en-construccion.scss',
})
export class EnConstruccion {
  private readonly ruta = inject(ActivatedRoute);

  /** La ruta indica el nombre de la función, para que el aviso sea concreto. */
  readonly titulo = this.ruta.snapshot.data['titulo'] ?? 'Esta sección';
}
