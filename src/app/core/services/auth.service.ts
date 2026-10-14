import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RespuestaApi } from '../models/respuesta.model';
import {
  Credenciales,
  NuevoPaciente,
  Perfil,
  RespuestaLogin,
  Rol,
} from '../models/usuario.model';

const CLAVE_TOKEN = 'clinica.token';
const CLAVE_PERFIL = 'clinica.perfil';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/auth`;

  // La sesión se restaura desde el navegador al arrancar, para que sobreviva a una recarga.
  private readonly perfilActual = signal<Perfil | null>(this.leerPerfilGuardado());

  readonly perfil = this.perfilActual.asReadonly();
  readonly estaLogueado = computed(() => this.perfilActual() !== null);
  readonly rol = computed<Rol | null>(() => this.perfilActual()?.rol ?? null);
  readonly nombreCompleto = computed(() => {
    const perfil = this.perfilActual();
    return perfil ? `${perfil.nombre} ${perfil.apellido}` : '';
  });

  obtenerToken(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  /**
   * Inicia sesión y, con el token ya guardado, trae el perfil completo:
   * el login solo devuelve id, rol e id_sede, y el layout necesita el nombre.
   */
  login(credenciales: Credenciales): Observable<Perfil> {
    return this.http
      .post<RespuestaApi<RespuestaLogin>>(`${this.url}/login`, credenciales)
      .pipe(
        tap((respuesta) => localStorage.setItem(CLAVE_TOKEN, respuesta.datos.token)),
        switchMap(() => this.cargarPerfil()),
      );
  }

  registro(paciente: NuevoPaciente): Observable<RespuestaApi<Perfil>> {
    return this.http.post<RespuestaApi<Perfil>>(`${this.url}/registro`, paciente);
  }

  cargarPerfil(): Observable<Perfil> {
    return this.http.get<RespuestaApi<Perfil>>(`${this.url}/perfil`).pipe(
      switchMap((respuesta) => {
        this.guardarPerfil(respuesta.datos);
        return [respuesta.datos];
      }),
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_PERFIL);
    this.perfilActual.set(null);
  }

  /** Ruta principal de la sección correspondiente al rol del usuario logueado. */
  inicioSegunRol(): string {
    const rol = this.rol();
    return rol ? `/${rol}` : '/';
  }

  private guardarPerfil(perfil: Perfil): void {
    localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
    this.perfilActual.set(perfil);
  }

  private leerPerfilGuardado(): Perfil | null {
    const token = localStorage.getItem(CLAVE_TOKEN);
    const guardado = localStorage.getItem(CLAVE_PERFIL);

    if (!token || !guardado) {
      return null;
    }

    try {
      return JSON.parse(guardado) as Perfil;
    } catch {
      // Si lo guardado quedó corrupto, se descarta la sesión en lugar de romper el arranque.
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_PERFIL);
      return null;
    }
  }
}
