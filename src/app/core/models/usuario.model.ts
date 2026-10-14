export type Rol = 'paciente' | 'medico' | 'operador' | 'admin';

/** Datos del usuario que viajan dentro del JWT y devuelve el login. */
export interface UsuarioSesion {
  id: number;
  rol: Rol;
  id_sede: number | null;
}

/** Respuesta de POST /auth/login. */
export interface RespuestaLogin {
  token: string;
  usuario: UsuarioSesion;
}

/** Perfil completo devuelto por GET /auth/perfil. */
export interface Perfil {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  rol: Rol;
  id_sede: number | null;
  id_cobertura: number | null;
}

/** Credenciales enviadas a POST /auth/login. */
export interface Credenciales {
  dni: string;
  password: string;
}

/** Cuerpo enviado a POST /auth/registro. */
export interface NuevoPaciente {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
  fecha_nacimiento: string;
  id_cobertura: number;
  telefono?: string;
}

export const ETIQUETAS_ROL: Record<Rol, string> = {
  paciente: 'Paciente',
  medico: 'Médico',
  operador: 'Operador',
  admin: 'Administrador',
};
