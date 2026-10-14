import { Routes } from '@angular/router';

import { rolGuard } from './core/guards/rol.guard';
import { sesionGuard } from './core/guards/sesion.guard';
import { EnConstruccion } from './pages/en-construccion/en-construccion';

/** Pantalla provisoria para las funciones que se implementan en próximas entregas. */
const enConstruccion = (ruta: string, titulo: string) => ({
  path: ruta,
  component: EnConstruccion,
  data: { titulo },
});

export const routes: Routes = [
  {
    path: '',
    title: 'Clínica Virtual',
    loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'login',
    title: 'Iniciar sesión — Clínica Virtual',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Crear cuenta — Clínica Virtual',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'perfil',
    title: 'Mi perfil — Clínica Virtual',
    canActivate: [sesionGuard],
    loadComponent: () => import('./pages/perfil/perfil').then((m) => m.Perfil),
  },

  // Cada rol tiene su propia sección, protegida por sesión y por rol.
  {
    path: 'paciente',
    canActivate: [sesionGuard, rolGuard],
    data: { roles: ['paciente'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'turnos' },
      enConstruccion('turnos', 'Mis turnos'),
      enConstruccion('solicitar-turno', 'Solicitar turno'),
      enConstruccion('historial', 'Mi historial clínico'),
    ],
  },
  {
    path: 'medico',
    canActivate: [sesionGuard, rolGuard],
    data: { roles: ['medico'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'agenda' },
      enConstruccion('agenda', 'Mi agenda'),
      enConstruccion('turnos', 'Turnos programados'),
      enConstruccion('historial', 'Historial clínico'),
    ],
  },
  {
    path: 'operador',
    canActivate: [sesionGuard, rolGuard],
    data: { roles: ['operador'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'agenda' },
      enConstruccion('agenda', 'Agenda médica'),
      enConstruccion('turnos', 'Turnos de la sede'),
      enConstruccion('solicitar-turno', 'Solicitar turno'),
    ],
  },
  {
    path: 'admin',
    canActivate: [sesionGuard, rolGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sedes' },
      enConstruccion('sedes', 'Sedes'),
      enConstruccion('especialidades', 'Especialidades'),
      enConstruccion('coberturas', 'Coberturas'),
      enConstruccion('auditoria', 'Auditoría'),
      enConstruccion('reportes', 'Reportes'),
    ],
  },

  {
    path: 'acceso-denegado',
    title: 'Acceso denegado — Clínica Virtual',
    loadComponent: () =>
      import('./pages/acceso-denegado/acceso-denegado').then((m) => m.AccesoDenegado),
  },
  {
    path: '**',
    title: 'Página no encontrada — Clínica Virtual',
    loadComponent: () =>
      import('./pages/no-encontrada/no-encontrada').then((m) => m.NoEncontrada),
  },
];
