# Frontend — Sistema de Gestión de Turnos Médicos

Aplicación Angular del trabajo práctico integrador de Programación 2. Consume la API REST
desarrollada en la etapa de backend, que vive en un repositorio aparte.

Esta entrega corresponde a la **semana 1 del frontend**: setup, Angular Material, layout
general y circuito completo de autenticación.

## Versiones utilizadas

| Herramienta      | Versión  |
|------------------|----------|
| Node.js          | 24.19.0  |
| npm              | 11.17.0  |
| Angular CLI      | 21.2.26  |
| Angular          | 21.2.0   |
| Angular Material | 21.2.14  |
| TypeScript       | 5.9.2    |

El proyecto se creó sin Server-Side Rendering (`--ssr=false`).

## Requisitos previos

- Node.js `^20.19.0`, `^22.12.0` o `^24.0.0`.
- El **backend levantado en `http://localhost:3000`**, con su base de datos importada.
  El backend ya tiene CORS habilitado, así que no hace falta configurar nada extra.

## Instalación y arranque

```bash
npm install
npm start
```

El servidor de desarrollo queda en `http://localhost:4200`. También se puede usar
`ng serve` directamente.

Para generar el build de producción:

```bash
npm run build
```

## Configuración de la API

La URL base de la API está definida en **un único lugar**, en los archivos de entorno:

- `src/environments/environment.ts` (producción)
- `src/environments/environment.development.ts` (desarrollo)

```ts
export const environment = {
  produccion: false,
  apiUrl: 'http://localhost:3000',
};
```

Los servicios la toman de ahí; ninguno repite la dirección. Si el backend corre en otro
puerto, se cambia solo en esos dos archivos.

## Estructura del proyecto

```
src/app
├── core/
│   ├── models/          Interfaces de la API (respuesta uniforme, usuario, cobertura)
│   ├── services/        AuthService, CoberturaService y el helper de errores
│   ├── interceptors/    Agrega el JWT a cada petición y maneja el 401
│   └── guards/          sesionGuard y rolGuard
├── layout/
│   ├── header/          Barra superior, menú de usuario y campana de notificaciones
│   ├── menu/            Menú lateral con las opciones de cada rol
│   └── footer/          Datos de contacto de la clínica
├── pages/
│   ├── inicio/          Pantalla principal, con y sin sesión
│   ├── login/           Formulario de inicio de sesión
│   ├── registro/        Alta de paciente
│   ├── perfil/          Datos del usuario logueado
│   ├── en-construccion/ Funciones de las próximas entregas
│   ├── acceso-denegado/ Rol sin permiso sobre la sección
│   └── no-encontrada/   Ruta inexistente
├── app.routes.ts        Rutas, agrupadas por rol
└── app.config.ts        Providers: router, HttpClient con interceptor y animaciones
```

## Endpoints que consume

| Método | Endpoint          | Usado en                                   |
|--------|-------------------|--------------------------------------------|
| POST   | `/auth/registro`  | Alta de paciente                           |
| POST   | `/auth/login`     | Inicio de sesión                           |
| GET    | `/auth/perfil`    | "Mi perfil" y datos del usuario del header |
| GET    | `/coberturas`     | Desplegable de coberturas del registro     |

El login devuelve solo `id`, `rol` e `id_sede`, así que inmediatamente después se pide
`GET /auth/perfil` para tener el nombre que muestra el encabezado.

## Manejo de la sesión

- El token se guarda en `localStorage`, junto con el perfil, de modo que **la sesión
  sobrevive a una recarga de la página**.
- El interceptor `tokenInterceptor` agrega la cabecera `Authorization: Bearer <token>` a
  todas las peticiones salientes.
- Si el backend responde `401`, el interceptor cierra la sesión y manda al login avisando
  que venció.
- "Cerrar sesión" borra el token y el perfil, y vuelve a la pantalla principal.

## Rutas y acceso por rol

| Ruta                | Acceso                                      |
|---------------------|---------------------------------------------|
| `/`                 | Pública. Cambia según haya sesión o no      |
| `/login`            | Pública                                     |
| `/registro`         | Pública                                     |
| `/perfil`           | Cualquier rol con sesión iniciada           |
| `/paciente/...`     | Solo rol `paciente`                         |
| `/medico/...`       | Solo rol `medico`                           |
| `/operador/...`     | Solo rol `operador`                         |
| `/admin/...`        | Solo rol `admin`                            |
| `/acceso-denegado`  | Pantalla de rol sin permiso                 |
| `**`                | Pantalla "Página no encontrada"             |

- `sesionGuard`: sin sesión redirige a `/login`, recordando a dónde se quería ir.
- `rolGuard`: con un rol no permitido redirige a `/acceso-denegado`, incluso si la URL se
  escribe a mano en la barra de direcciones.

Las funciones que se implementan en las próximas entregas están visibles en el menú y
llevan a una pantalla "En construcción".

## Usuarios de prueba

Los cuatro usuarios que trae el script de base del backend usan la contraseña `test1234`:

| DNI        | Rol      | Nombre          |
|------------|----------|-----------------|
| `18222333` | admin    | Marcos Gómez    |
| `20111222` | médico   | Ana López       |
| `15200548` | operador | Juan Pérez      |
| `36000960` | paciente | Franco Friggeri |

También se puede crear una cuenta nueva desde la pantalla de registro, eligiendo una
cobertura del listado que trae el backend.
