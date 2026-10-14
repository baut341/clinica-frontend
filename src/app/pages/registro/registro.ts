import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { Cobertura } from '../../core/models/cobertura.model';
import { AuthService } from '../../core/services/auth.service';
import { CoberturaService } from '../../core/services/cobertura.service';
import { mensajeDeError } from '../../core/services/errores';

@Component({
  selector: 'app-registro',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly coberturas = inject(CoberturaService);
  private readonly router = inject(Router);
  private readonly aviso = inject(MatSnackBar);

  readonly listaCoberturas = signal<Cobertura[]>([]);
  readonly errorCoberturas = signal('');
  readonly errorBackend = signal('');
  readonly enviando = signal(false);
  readonly ocultarPassword = signal(true);

  /** No se admiten fechas de nacimiento futuras. */
  readonly fechaMaxima = new Date();

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(30)]],
    apellido: ['', [Validators.required, Validators.maxLength(30)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
    telefono: ['', [Validators.pattern(/^\d{6,10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fecha_nacimiento: [null as Date | null, [Validators.required]],
    id_cobertura: [null as number | null, [Validators.required]],
  });

  constructor() {
    this.cargarCoberturas();
  }

  cargarCoberturas(): void {
    this.errorCoberturas.set('');
    this.coberturas.listar().subscribe({
      next: (coberturas) => this.listaCoberturas.set(coberturas),
      error: (error) => this.errorCoberturas.set(mensajeDeError(error)),
    });
  }

  enviar(): void {
    this.errorBackend.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    this.enviando.set(true);

    this.auth
      .registro({
        nombre: valores.nombre,
        apellido: valores.apellido,
        dni: valores.dni,
        email: valores.email,
        password: valores.password,
        fecha_nacimiento: this.aFechaIso(valores.fecha_nacimiento!),
        id_cobertura: valores.id_cobertura!,
        ...(valores.telefono ? { telefono: valores.telefono } : {}),
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.aviso.open(
            'Tu cuenta fue creada. Ya podés iniciar sesión con tu DNI.',
            'Cerrar',
            { duration: 6000 },
          );
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.enviando.set(false);
          this.errorBackend.set(mensajeDeError(error));
        },
      });
  }

  /** El backend espera AAAA-MM-DD; se arma con la fecha local para no correr el día. */
  private aFechaIso(fecha: Date): string {
    const mes = `${fecha.getMonth() + 1}`.padStart(2, '0');
    const dia = `${fecha.getDate()}`.padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}
