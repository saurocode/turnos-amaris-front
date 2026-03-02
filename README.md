# Turnos Amaris — Frontend

Aplicación web para el sistema de agendamiento de turnos bancarios.  
Construida con **Angular 20** y **Bootstrap 5**.

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18+ |
| Angular CLI | 20 |
| npm | 9+ |

Verifica tu versión de Node:
```bash
node -v
ng version
```

---

### 1. Instalar dependencias

```bash
cd turnos-amaris-front
npm install
```

### 2. Configurar la URL del backend

En `src/environments/environment.ts` verifica que apunte a tu API local:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:44345/api'
};
```

### 3. Iniciar la app

```bash
ng serve
```

Abre el navegador en **`http://localhost:4200`**

---

## 🗺️ Flujo de la aplicación

```
http://localhost:4200/
│
├── Soy Cliente
│   └── Ingresa cédula → /cliente/:cedula
│       ├── Ver mis turnos
│       ├── Agendar nuevo turno
│       ├── Activar turno pendiente
│       └── Cancelar turno
│
└── http://localhost:4200/admin/login   - Url Admin
    └── Login admin → /admin
        ├── Ver todos los turnos
        ├── Filtrar por cédula, estado, sede, servicio y fecha
        ├── Activar / Completar turnos
        └── Cancelar turnos
```

---

## Accesos

| Perfil | URL | Credenciales |
|---|---|---|
| Cliente | `http://localhost:4200` | Solo necesita su cédula |
| Administrador | `http://localhost:4200/admin/login` | `admin` / `admin123*` |

> La URL del admin no está enlazada en ninguna parte visible de la app.

---

## Estructura del proyecto

```
src/app/
├── core/
│   ├── guards/         # Protege rutas del admin (authGuard)
│   ├── interceptors/   # Inyecta el JWT en cada petición (authInterceptor)
│   ├── models/         # Interfaces TypeScript
│   └── services/       # AuthService, TurnoService, SucursalService...
├── features/
│   ├── public/
│   │   ├── home/           # Pantalla de inicio — ingreso por cédula
│   │   └── client-turns/   # Vista del cliente — sus turnos
│   ├── auth/
│   │   ├── login/          # Login administrador
│   │   └── register/       # Registro administrador
│   └── admin/
│       └── admin-turns/    # Panel admin con filtros
└── shared/
    └── components/
        └── navbar/         # Navbar del panel admin
```
