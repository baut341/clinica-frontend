import { Rol } from '../../core/models/usuario.model';

export interface OpcionMenu {
  ruta: string;
  icono: string;
  texto: string;
}

/**
 * Opciones de navegación por rol. Las funciones que se implementan en semanas
 * siguientes quedan visibles y apuntan a la pantalla "En construcción".
 */
export const OPCIONES_POR_ROL: Record<Rol, OpcionMenu[]> = {
  paciente: [
    { ruta: '/paciente/turnos', icono: 'event', texto: 'Mis turnos' },
    { ruta: '/paciente/solicitar-turno', icono: 'event_available', texto: 'Solicitar turno' },
    { ruta: '/paciente/historial', icono: 'description', texto: 'Mi historial clínico' },
  ],
  medico: [
    { ruta: '/medico/agenda', icono: 'calendar_month', texto: 'Mi agenda' },
    { ruta: '/medico/turnos', icono: 'event', texto: 'Turnos programados' },
    { ruta: '/medico/historial', icono: 'description', texto: 'Historial clínico' },
  ],
  operador: [
    { ruta: '/operador/agenda', icono: 'calendar_month', texto: 'Agenda médica' },
    { ruta: '/operador/turnos', icono: 'event', texto: 'Turnos de la sede' },
    { ruta: '/operador/solicitar-turno', icono: 'event_available', texto: 'Solicitar turno' },
  ],
  admin: [
    { ruta: '/admin/sedes', icono: 'domain', texto: 'Sedes' },
    { ruta: '/admin/especialidades', icono: 'medical_services', texto: 'Especialidades' },
    { ruta: '/admin/coberturas', icono: 'badge', texto: 'Coberturas' },
    { ruta: '/admin/auditoria', icono: 'history', texto: 'Auditoría' },
    { ruta: '/admin/reportes', icono: 'bar_chart', texto: 'Reportes' },
  ],
};
