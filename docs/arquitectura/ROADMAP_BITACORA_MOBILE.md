# Roadmap y Bitácora de Desarrollo de la Aplicación Móvil (React Native & Expo)

**Proyecto:** PlatformOps & Product Feedback Hub — Aplicación Operativa Móvil (*TuNegocio.pe*)  
**Documento Vivo de Gestión:** Registro de estado, checklist de tareas por fases, instrucciones de verificación manual y bitácora técnica de sustentación.  
**Tecnología Móvil:** React Native 0.88 | Expo SDK 58 | TypeScript 6 | React Navigation Stack | Context API + useReducer  
**Backend:** AWS Lambda (.NET Core 10 Serverless Web API) | AWS API Gateway HTTP API v2  
**Base de Datos:** Amazon RDS MySQL 8.4 LTS Multi-AZ (`opshub_db`, 30 tablas)  
**Almacenamiento Cloud:** Amazon S3 (Bucket privado con Presigned URLs en `us-east-2`)  
**Identidad:** AWS Cognito User Pool (`us-east-2_5QCZKDuMi`) + Tokens JWT  

---

## 1. Panel de Estado General de la Aplicación Móvil

```
┌────────────────────────────────────────────────────────────────────────┐
│                       ESTADO DE LAS FASES MOBILE                       │
│                                                                        │
│ Total de Fases: 6                                                      │
│ Fases Completadas: 6 / 6 (100%)                                        │
├───────────────────────────────────────────────────────┬────────────────┤
│ Fase                                                  │ Estado         │
├───────────────────────────────────────────────────────┼────────────────┤
│ Fase 1: Arquitectura Base, Tokens Obsidian & Stack    │ ✅ COMPLETADO  │
│ Fase 2: Control de Acceso, Cognito & 1-Clic por Rol   │ ✅ COMPLETADO  │
│ Fase 3: Core de Incidentes, Bloqueo 409 & Subida S3   │ ✅ COMPLETADO  │
│ Fase 4: Clientes SaaS & Llamada Telefónica Táctil     │ ✅ COMPLETADO  │
│ Fase 5: Feedback de Producto, ARR & Votación en Vivo  │ ✅ COMPLETADO  │
│ Fase 6: Dashboard, Avisos & Telemetría AWS en Vivo    │ ✅ COMPLETADO  │
└───────────────────────────────────────────────────────┴────────────────┘
```

---

## 2. Checklist Detallado por Fases y Verificación Manual

### Fase 1: Arquitectura Base, Tokens Obsidian Telemetry & Navegación Stack
* [x] Configurar proyecto Expo SDK 58 / React Native en `projects/mobile/` con TypeScript y modo oscuro de alta precisión Obsidian Telemetry (`#0F172A`, `#1E293B`, `#334155`).
* [x] Instalar dependencias esenciales:
  * [x] `@react-navigation/native` y `@react-navigation/native-stack` para transiciones fluidas de pantalla.
  * [x] `lucide-react-native` y `react-native-svg` para iconografía SVG vectorial idéntica a la web.
  * [x] `axios` para consumo de Web API REST serverless en AWS.
  * [x] `expo-secure-store` para custodia de tokens JWT en hardware seguro (Android KeyStore / iOS Keychain).
  * [x] `expo-image-picker` y `expo-file-system` para captura y transmisión binaria a Amazon S3.
* [x] Diseñar e implementar componentes compartidos (`projects/mobile/src/components/`):
  * [x] `PriorityBadge.tsx`: Píldora de severidad (P1 a P4) con dot de color y fondo translúcido.
  * [x] `StatusBadge.tsx`: Píldora reactiva con indicador dinámico de estado del ticket.
  * [x] `Button.tsx`: Botón con soporte de spinner de carga y variantes primario/secundario/peligro.
  * [x] `InputText.tsx`: Input con validación visual y botón interactivo con iconos vectoriales `Eye` / `EyeOff` para alternar visibilidad de contraseña.
  * [x] `TicketCard.tsx`: Tarjeta interactiva con código, severidad, estado y cliente SaaS.
* [x] Configurar `RootNavigator.tsx` con enrutamiento condicional según el estado de autenticación.
* [x] **Criterio de Aceptación:** `npx tsc --noEmit` compila con 0 errores y Expo inicia la navegación básica. (Verificado ✅)
* 🔍 **Instrucciones de Verificación Manual:** Ejecutar `npx expo start` dentro de `projects/mobile` y abrir en Expo Go o emulador Android; validar que la paleta oscura, bordes hairline y tipografías coincidan 100% con el Design System Obsidian Telemetry.

---

### Fase 2: Control de Acceso, Identidad con AWS Cognito & Cuentas Demo de 1-Clic (Módulo 1)
* [x] Definir modelos TypeScript en `src/types/auth.ts` alineados con el backend .NET 10 (`User`, `UserRole`, `LoginCredentials`, `RegisterData`, `ApiResponse<T>`, `CatalogDepartmentDto`).
* [x] Configurar cliente HTTP Axios en `src/api/client.ts` apuntando a Amazon API Gateway HTTP API v2 (`https://193b69gfya.execute-api.us-east-2.amazonaws.com/api/v1`) inyectando el header `X-Client-Platform: REACT_NATIVE_ANDROID`.
* [x] Implementar `AuthContext.tsx` con almacenamiento en `expo-secure-store` y verificación de sesión en vivo contra `GET /api/v1/auth/me`.
* [x] Diseñar `LoginScreen.tsx` con formulario reactivo, validaciones Zod y selector de cuentas demo de 1 clic:
  * [x] Aldair Cahuana (Ingeniero DEV / TI — `aldair.cahuana@tunegocio.pe`)
  * [x] Henry Monroy (Agente de Soporte Técnico — `henry.monroy@tunegocio.pe`)
  * [x] Josue Morales (Ejecutivo de Ventas — `josue.morales@tunegocio.pe`)
  * [x] Eduardo Sánchez (Líder de Producto & Marketing — `eduardo.sanchez@tunegocio.pe`)
  * [x] Administrador General (Admin — `admin@tunegocio.pe`)
* [x] Diseñar `RegisterScreen.tsx` con consumo dinámico del catálogo público `GET /api/v1/catalogs/departamentos` para prevenir la escalación de privilegios (OWASP Top 1: Broken Access Control).
* [x] Incorporar campo de "Confirmar Contraseña" (`confirmPassword`) en `RegisterScreen.tsx` con validación Zod cruzada idéntica a la plataforma web.
* [x] Refinamiento de UX y copywriting: eliminación de jerga técnica interna y subtítulos académicos en Login, Registro, Home y formularios para una experiencia de usuario clara y orientativa.
* [x] **Criterio de Aceptación:** Inicio de sesión almacena el token JWT de forma segura, el formulario de registro valida coincidencia estricta de contraseñas, no expone selección de rol arbitrario y el botón de cerrar sesión purga la sesión. (Verificado ✅)
* 🔍 **Instrucciones de Verificación Manual:** En la pantalla de login, pulsar "Cuentas demo de 1 clic", seleccionar "Aldair Cahuana (DEV / TI)", pulsar "Ingresar a la Plataforma" y verificar que se accede al Dashboard mostrando el avatar "A", el nombre completo y el badge morado "Ingeniero TI".

---

### Fase 3: Core Transaccional de Incidentes, Bloqueo Optimista (HTTP 409) & Carga en S3 (Módulo 3)
* [x] Definir contratos de datos en `src/types/ticket.ts` (`Ticket`, `TicketPriority`, `TicketStatus`, `TicketAttachment`, `TicketComment`, `CreateTicketInput`, `UpdateTicketInput`).
* [x] Implementar `TicketContext.tsx` con `useReducer` y **Live Reactive Polling silencioso** cada 25 segundos para mantener la bandeja sincronizada en segundo plano con Amazon RDS MySQL.
* [x] Desarrollar `TicketListScreen.tsx` con barra de búsqueda en tiempo real, chips de filtro rápido (P1 Críticos, P2 Alta, En Diagnóstico, Resueltos) y soporte de Pull-to-Refresh.
* [x] Desarrollar `TicketDetailScreen.tsx` con vista 360°, notas técnicas, comentarios e historial de escalación a TI.
* [x] Implementar **Bloqueo Optimista (Optimistic Locking)**:
  * [x] Envío de `currentVersion` en `PUT /api/v1/tickets/{id}/status`.
  * [x] Detección de error `HTTP 409 Conflict`.
  * [x] Despliegue de modal interactivo de advertencia de concurrencia con botón para sincronizar la versión más reciente del servidor sin sobreescribir datos ajenos.
  * [x] Botón auxiliar de simulación concurrente para demostración académica ante el jurado calificador.
* [x] Desarrollar `TicketFormScreen.tsx` con selector dinámico de clientes SaaS desde base de datos, categorización y selector multimedia:
  * [x] Petición de URL prefirmada: `POST /api/v1/tickets/{id}/attachments/presigned-url`.
  * [x] Subida binaria directa a Amazon S3 vía `PUT` con `expo-file-system`.
  * [x] Confirmación de adjunto en MySQL (`POST /api/v1/tickets/{id}/attachments`).
* [x] **Criterio de Aceptación:** La lista actualiza datos desde la nube, las imágenes se suben directo a S3 sin saturar Lambda y los conflictos de concurrencia emiten `HTTP 409 Conflict` manejado con modal. (Verificado ✅)
* 🔍 **Instrucciones de Verificación Manual:** Abrir el ticket `#TK-1082`, pulsar "Simular Edición Externa Remota" (eleva la versión en el servidor a v2) y luego presionar "Guardar Cambios". Corroborar que la app intercepta el `HTTP 409` y levanta el diálogo de conflicto ofreciendo recargar la versión fresca.

---

### Fase 4: Directorio de Clientes SaaS, Ficha 360° & Acciones Telefónicas Táctiles (Módulo 2)
* [x] Definir modelos TypeScript en `src/types/client.ts` (`ClientSaas`, `ClientContact`).
* [x] Implementar `clientsApi.ts` consumiendo el endpoint `GET /api/v1/clients`.
* [x] Desarrollar pantalla `ClientsScreen.tsx`:
  * [x] Buscador en tiempo real por RUC, nombre comercial o plan SaaS.
  * [x] Indicador de Health Score porcentual y semáforo de riesgo de Churn (`ALTO` / `MEDIO` / `BAJO`).
  * [x] Información del contacto técnico principal de la empresa.
  * [x] **Botones táctiles de acción directa:** Marcación telefónica instantánea con protocolo nativo `tel:` y redacción de correo con `mailto:`.
  * [x] Pull-to-Refresh para recarga de empresas en caliente.
* [x] **Criterio de Aceptación:** La pantalla lista los clientes corporativos de Amazon RDS, muestra el monto anual contratado (ARR) y los botones táctiles abren el marcador telefónico nativo. (Verificado ✅)
* 🔍 **Instrucciones de Verificación Manual:** En el menú del Home, ingresar a "Clientes SaaS & Churn", buscar "Acme Logistics" y pulsar el icono de teléfono junto a "Ing. Rodrigo Paz" para comprobar la apertura del marcador telefónico con el número precargado.

---

### Fase 5: Feedback de Producto, Priorización ARR & Votación en Tiempo Real (Módulo 4)
* [x] Definir contratos TypeScript en `src/types/feedback.ts` (`SugerenciaProducto`).
* [x] Implementar `feedbackApi.ts` consumiendo:
  * [x] `GET /api/v1/feedback/sugerencias`: Consulta de requerimientos de clientes.
  * [x] `POST /api/v1/feedback/sugerencias/{id}/votar`: Procesamiento de votos.
* [x] Desarrollar pantalla `FeedbackScreen.tsx`:
  * [x] Listado vertical optimizado para móviles (sustituyendo el drag & drop horizontal incómodo de escritorio por un feed táctil ordenado por votos e impacto ARR).
  * [x] Píldoras de estado (`PLANIFICADA`, `EN_DESARROLLO`, `LANZADA`).
  * [x] Indicador de ARR comercial impactado por la funcionalidad solicitada.
  * [x] Botón interactivo de Upvote con actualización optimista de UI (+1 en pantalla de inmediato sin latencia).
* [x] **Criterio de Aceptación:** Los votos de las peticiones de producto se alternan en caliente con respuesta visual inmediata. (Verificado ✅)
* 🔍 **Instrucciones de Verificación Manual:** Entrar a "Feedback & Roadmap", pulsar el botón de pulgar arriba en la sugerencia de "Sunat Facturador Offline" y observar cómo el contador pasa de 42 a 43 votos y el botón se ilumina en morado.

---

### Fase 6: Dashboard Ejecutivo, Avisos de Mantenimiento & Telemetría AWS en Vivo (M5/M6)
* [x] Definir modelos TypeScript en `src/types/announcements.ts` y `src/types/operations.ts` (`ComunicadoSistema`, `ChangelogRelease`, `ServiceHealth`, `SlaSummary`).
* [x] Implementar `announcementsApi.ts` (`GET /announcements/active`, `GET /announcements/changelog`) y `operationsApi.ts` (`GET /health`, `GET /operations/metrics/sla`).
* [x] Rediseñar y enriquecer `HomeScreen.tsx`:
  * [x] Cabecera con datos del usuario autenticado vía `GET /auth/me`, departamento y rol.
  * [x] Banner dinámico de conectividad en tiempo real: `AWS CLOUD TIEMPO REAL ACTIVO (Lambda .NET 10 | RDS MySQL 8.4 Multi-AZ)`.
  * [x] Banner interactivo de advertencia de mantenimiento o degradación programada.
  * [x] Grilla de KPIs en tiempo real (Total Abiertos, P1 Críticos, Asignados a Mí, Cumplimiento SLA %).
  * [x] Menú unificado de acceso táctil a los 5 módulos del Hub operativo.
* [x] Desarrollar pantalla `AnnouncementsScreen.tsx` con navegación por pestañas segmentadas:
  * [x] Pestaña 1: Avisos y alertas operativas del sistema.
  * [x] Pestaña 2: Telemetría en caliente de los 6 servicios AWS legítimos en Ohio (Amazon RDS, AWS Lambda, API Gateway, Amazon S3, AWS Cognito, CloudFront) con latencias en milisegundos.
  * [x] Pestaña 3: Historial de releases y changelog de la plataforma.
* [x] **Criterio de Aceptación:** `npx tsc --noEmit` compila con 0 errores y el Dashboard consolida la salud cloud y las métricas operativas del sistema. (Verificado ✅)
* 🔍 **Instrucciones de Verificación Manual:** En el Home, tocar "Avisos & Salud Cloud", seleccionar la pestaña "AWS Cloud" y corroborar que se despliegan los 6 servicios de infraestructura en `us-east-2 (Ohio)` con sus estados "OPERACIONAL" y latencias en milisegundos reales.

---

## 3. Bitácora de Sincronización y Validación Técnica

| Fecha / Hito | Alcance de la Intervención | Resultado Técnico |
|---|---|:---:|
| **2026-11-17 16:15** | Normalización de modelos TypeScript en `src/types/` (`auth.ts`, `ticket.ts`, `client.ts`, `feedback.ts`, `announcements.ts`, `operations.ts`). | ✅ Contratos alineados al 100% con .NET 10 |
| **2026-11-17 16:18** | Actualización de `client.ts` con URL de producción de API Gateway en AWS y cabecera `X-Client-Platform`. | ✅ Conectividad HTTPS REST hacia AWS Lambda |
| **2026-11-17 16:21** | Integración de endpoints reales en `authApi.ts`, `ticketsApi.ts`, `clientsApi.ts`, `feedbackApi.ts`, `announcementsApi.ts`, `operationsApi.ts`. | ✅ 31 endpoints cubiertos con fallback resiliente |
| **2026-11-17 16:22** | Implementación de Live Reactive Polling de 25s en `TicketContext.tsx` y resolución de tipo de retorno en `setInterval`. | ✅ Sincronización en segundo plano sin parpadeos |
| **2026-11-17 16:23** | Creación de pantallas `ClientsScreen.tsx`, `FeedbackScreen.tsx`, `AnnouncementsScreen.tsx` y actualización de `HomeScreen.tsx`, `TicketFormScreen.tsx`, `LoginScreen.tsx`, `RegisterScreen.tsx`. | ✅ Menú y módulos alineados a la Web Angular |
| **2026-11-17 16:24** | Ejecución de verificación estricta de compilación con TypeScript (`npx tsc --noEmit`). | ✅ 0 errores y 0 advertencias de tipos |
| **2026-11-17 16:25** | Generación de la especificación técnica formal `ESPECIFICACION_MOBILE_REACT_NATIVE.md` y este roadmap `ROADMAP_BITACORA_MOBILE.md`. | ✅ Estándar documental completo por proyecto |
| **2026-11-17 19:25** | Corrección de destello blanco en transiciones al retroceder (`goBack`): configuración de `theme={CustomDarkTheme}` en `NavigationContainer`, ventana nativa en `app.json`, `SafeAreaProvider` y `document.body`. | ✅ Transiciones oscuras continuas (#0F172A) sin parpadeo blanco |
| **2026-11-17 21:55** | Preparación de configuración de compilación de binarios Android (`.apk`): definición de `package: "pe.tunegocio.opshub"` en `app.json` y perfiles de compilación standalone en `eas.json` (`preview` -> `buildType: "apk"`). | ✅ Listo para compilación directa en la nube con EAS Build |
| **2026-11-17 22:30** | Refinamiento de UX en autenticación y formularios: reemplazo de botón de texto "VER" por iconos vectoriales interactivos `Eye` y `EyeOff` en `InputText.tsx`. Incorporación de campo "Confirmar Contraseña" con validación Zod cruzada en `RegisterScreen.tsx`. Depuración integral de textos y subtítulos confusos en toda la aplicación para una experiencia de usuario limpia y profesional. | ✅ UX alineada a la Web Angular, 0 errores tsc |
