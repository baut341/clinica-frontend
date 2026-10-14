import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cobertura } from '../models/cobertura.model';
import { RespuestaApi } from '../models/respuesta.model';

@Injectable({ providedIn: 'root' })
export class CoberturaService {
  private readonly http = inject(HttpClient);

  /** Listado público reutilizado desde el formulario de registro de pacientes. */
  listar(): Observable<Cobertura[]> {
    return this.http
      .get<RespuestaApi<Cobertura[]>>(`${environment.apiUrl}/coberturas`)
      .pipe(map((respuesta) => respuesta.datos));
  }
}
