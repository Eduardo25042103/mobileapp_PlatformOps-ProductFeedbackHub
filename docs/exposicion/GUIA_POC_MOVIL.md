# Guía Técnica de Implementación: Prueba de Concepto Móvil (PoC)

Esta guía detalla la implementación modular y progresiva de la aplicación móvil en **React Native (Expo)** para el sistema **Platform Ops & Product Feedback Hub**, conectada a los servicios backend en AWS y basada en el sistema de diseño **Obsidian Telemetry** de Google Stitch ([DESIGN.md](file:///d:/react/proyecto-sexto-ciclo/DESIGN.md)).

---

## Tablero de Monitoreo de Progreso (Roadmap por Fases)

| Fase | Descripción | Estado |
| :--- | :--- | :---: |
| **Fase 1** | Inicialización del entorno, estructura modular y pantalla "Hola Mundo" |  **COMPLETADA** |
| **Fase 2** | Autenticación, gestión segura de sesión (JWT) y navegación (Auth / App) |  **COMPLETADA** |
| **Fase 3** | Tablero Operativo (`HomeScreen`) con métricas KPI y conexión reactiva Server-Sent Events (SSE) |  **COMPLETADA** |
| **Fase 4** | Bandeja de tickets (`TicketListScreen`) y detalle con Bloqueo Optimista 409 (`TicketDetailScreen`) |  **COMPLETADA** |
| **Fase 5** | Formulario de reporte de incidencias (`TicketFormScreen`) con subida binaria a Amazon S3 |  **COMPLETADA** |
| **Fase 6** | Pruebas integrales y demostración de arquitectura | ⏳ *Siguiente* |
| **Fase 6** | Pruebas integrales de flujo y validación de tiempos de escalación | ⏸ Pendiente |

---

## Detalle de Fases y Tareas de Implementación

### Fase 1: Setup Inicial, Arquitectura Base y Hola Mundo
- [x] **Tarea 1.1:** Inicializar proyecto Expo con TypeScript (`mobile/`).
- [x] **Tarea 1.2:** Generar estructura de directorios modular (`src/api`, `components`, `context`, `navigation`, `screens`, `types`, `utils`).
- [x] **Tarea 1.3:** Crear pantalla "Hola Mundo" con diseño base dark mode *Obsidian Telemetry*.
- [x] **Tarea 1.4:** Verificar compilación TypeScript sin errores (`tsc --noEmit`).

---

### Fase 2: Autenticación, Sesión y Navegadores
- [x] **Tarea 2.1: Tipado y Almacenamiento Seguro**
  - Definir interfaces de usuario, roles y credenciales en `src/types/auth.ts`.
  - Configurar envoltorios en `src/utils/storage.ts` con `expo-secure-store` y respaldo seguro para web.
- [x] **Tarea 2.2: Contexto Global de Sesión y Cliente HTTP**
  - Configurar `src/api/client.ts` con Axios e interceptor automático de token `Bearer`.
  - Crear `src/context/AuthContext.tsx` con métodos `login()`, `register()`, `logout()` y persistencia de sesión.
- [x] **Tarea 2.3: Arquitectura de Navegación**
  - Instalar dependencias de `@react-navigation/native-stack`.
  - Crear `AuthNavigator.tsx` (Login, Register).
  - Crear `AppNavigator.tsx` (Home, Tickets, Detalle, Nuevo).
  - Conectar `RootNavigator.tsx` para conmutar automáticamente según el estado de autenticación.
- [x] **Tarea 2.4: Pantallas de Acceso y Registro**
  - `LoginScreen.tsx`: formulario corporativo con validación Zod y React Hook Form.
  - `RegisterScreen.tsx`: selector interactivo de departamentos (*Soporte, TI/Desarrollo, Ventas, Marketing*).

---

### Fase 3: Tablero Operativo (Dashboard) & Telemetría SSE
- [x] **Tarea 3.1: Cliente Server-Sent Events y Modelo Reactivo**
  - Configuración de canal de eventos y sincronización de estado.
- [x] **Tarea 3.2: Componentes Reutilizables de Telemetría**
  - `PriorityBadge.tsx`: Badges semánticos para prioridades (P1 Crítico a P4 Baja).
  - `StatusBadge.tsx`: Badges de estado con punto de pulso animado (*Live Pulse*).
  - Tarjetas KPI con diseño *Obsidian Telemetry* (incidencias activas, SLA).
- [x] **Tarea 3.3: Pantalla Principal (`HomeScreen.tsx`)**
  - Header de usuario con departamento y estado de conexión en vivo (*Live SSE*).
  - Banner dinámico de incidentes de infraestructura y avisos de mantenimiento.
  - Navegación conectada hacia la Bandeja de Tickets.

---

### Fase 4: Gestión de Incidencias & Control de Concurrencia (Bloqueo Optimista)
- [x] **Tarea 4.1: Capa de Datos y Modelos de Tickets**
  - Definir interfaces en `src/types/ticket.ts` (Ticket, Prioridad, Estado, Adjuntos, Comentarios).
  - Implementar `src/api/ticketsApi.ts` con motor de validación de versión y simulación de colisión.
- [x] **Tarea 4.2: Bandeja de Incidencias (`TicketListScreen.tsx`)**
  - Filtros rápidos tipo chips por severidad (`Todos`, `P1 Crítico`, `P2 Alta`) y estado.
  - Barra de búsqueda por palabra clave o código identificador (`#TK-1082`).
  - Lista optimizada con `FlatList` usando componentes `TicketCard.tsx`.
- [x] **Tarea 4.3: Detalle de Incidencia (`TicketDetailScreen.tsx`)**
  - Vista de información técnica, logs y miniatura de captura adjunta.
  - Indicador visible del número de versión de concurrencia (`Versión: v1`).
  - Selector de cambio de estado operativo (ej. *En Diagnóstico* a *En Desarrollo*).
- [x] **Tarea 4.4: Demostración de Bloqueo Optimista (HTTP 409)**
  - Envío del payload con la versión actual `{ estado, version }`.
  - Captura del error HTTP 409 (Conflicto de concurrencia).
  - Despliegue de modal interactivo alertando de colisión y botón para recargar la versión más reciente del servidor sin sobreescribir datos.

---

### Fase 5: Reporte de Incidencias y Subida Directa a Amazon S3
- [x] **Tarea 5.1: Manejo de Capturas y URLs Prefirmadas**
  - Integrar `expo-image-picker` para selección de capturas desde la galería.
  - Implementar llamada de solicitud de URL prefirmada (`POST /api/v1/tickets/upload-url`).
  - Usar `expo-file-system/legacy` (`uploadAsync` con método `PUT` binario) para subir la imagen directo a Amazon S3 con caducidad de 5 minutos.
- [x] **Tarea 5.2: Formulario de Creación (`TicketFormScreen.tsx`)**
  - Título, categoría técnica, selección de cliente SaaS y descripción del fallo.
  - Selector interactivo de severidad (P1 a P4) con retroalimentación cromática.
  - Barra de preview de captura y confirmación visual.
  - Conexión al listado reactivo de tickets.

---

### Fase 6: Pruebas Integrales y Evaluación del Piloto
- [ ] **Tarea 6.1: Validación de Flujo Completo**
  - Ejecutar el flujo Login -> Home -> Nuevo Ticket con S3 -> Listado -> Detalle -> Conflicto 409.
- [ ] **Tarea 6.2: Verificación de Despliegue y Conectividad**
  - Pruebas de conexión con API en AWS App Runner / Backend local con IP de red.

---

## Estructura Actual de Archivos del Proyecto Móvil

```text
mobile/
├── src/
│   ├── api/                      # Clientes HTTP (Axios) y SSE
│   ├── components/               # Elementos visuales reutilizables
│   ├── context/                  # AuthContext y estado global
│   ├── navigation/               # RootNavigator, AuthNavigator, AppNavigator
│   ├── screens/                  # Login, Register, Home, List, Form, Detail
│   ├── types/                    # Tipado TypeScript (auth, ticket, nav)
│   └── utils/                    # SecureStore y formatters
├── App.tsx                       # Hola Mundo / Entrada verificada
├── app.json                      # Configuración de Expo
├── package.json                  # Dependencias del proyecto
└── tsconfig.json                 # TypeScript verificado (0 errores)
```
