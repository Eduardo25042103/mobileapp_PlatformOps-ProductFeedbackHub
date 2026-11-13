# Roadmap y Bitácora de Desarrollo del Backend OpsHub (.NET 10)
**Proyecto:** OpsHub - Plataforma Centralizada de Gestión Operativa y Feedback (*TuNegocio.pe*)  
**Documento Vivo de Gestión:** Registro de estado, checklist de tareas por fases y bitácora de sesiones.  
**Referencia Técnica:** [ESPECIFICACION_BACKEND_DOTNET.md](file:///d:/react/proyecto-sexto-ciclo/ESPECIFICACION_BACKEND_DOTNET.md)

---

## 1. Panel de Estado General del Proyecto

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ESTADO DE LAS FASES                             │
├───────────────────────────────────────────────────────┬────────────────┤
│ Fase                                                  │ Estado         │
├───────────────────────────────────────────────────────┼────────────────┤
│ Fase 1: Fundación y Conexión (Clean Architecture & DB)│ ✅ COMPLETADO  │
│ Fase 2: Control de Acceso y Autenticación (Módulo 1)  │ ✅ COMPLETADO  │
│ Fase 3: Core Transaccional e Incidentes (Módulo 3)    │ ✅ COMPLETADO  │
│ Fase 4: Solicitudes de Producto y Webhook Zoho (M4/M2)│ ✅ COMPLETADO  │
│ Fase 5: Comunicados, Changelog y Auditoría (M5/M6)    │ ✅ COMPLETADO  │
│ Fase 6: Empaquetado Serverless y Despliegue en AWS    │ ✅ COMPLETADO  │
└───────────────────────────────────────────────────────┴────────────────┘
```

---

## 2. Checklist Detallado por Fases

### Fase 1: Fundación y Conexión (Clean Architecture & DB)
* [x] Crear la solución `OpsHub.Backend.slnx`.
* [x] Crear los 4 proyectos de Clean Architecture:
  * [x] `OpsHub.Domain` (Class Library - .NET 10)
  * [x] `OpsHub.Application` (Class Library - .NET 10)
  * [x] `OpsHub.Infrastructure` (Class Library - .NET 10)
  * [x] `OpsHub.Api` (Web API - .NET 10)
* [x] Configurar las referencias entre proyectos respetando la Regla de Dependencia:
  * `Domain` no referencia nada.
  * `Application` referencia `Domain`.
  * `Infrastructure` referencia `Application` y `Domain`.
  * `Api` referencia `Infrastructure` y `Application`.
* [x] Instalar paquetes NuGet clave:
  * `Pomelo.EntityFrameworkCore.MySql` y `MySqlConnector` (3.0.0) en `Infrastructure`.
  * `FluentValidation.DependencyInjectionExtensions` en `Application`.
  * `Swashbuckle.AspNetCore` y `Amazon.Lambda.AspNetCoreServer.Hosting` en `Api`.
* [x] Configurar `ApplicationDbContext` y la cadena de conexión con pool limitado para MySQL (`opshub_db`).
* [x] Implementar middleware global de excepciones (`ExceptionHandlingMiddleware`).
* [x] Implementar endpoint de salud: `GET /api/v1/health`.
* [x] Configurar Swagger / OpenAPI en `Program.cs`.
* **Criterio de Aceptación:** `dotnet build` compila con 0 errores y 0 advertencias, el endpoint `/health` responde `200 OK` y Swagger funciona en `/swagger`. (Verificado ✅)

---

### Fase 2: Control de Acceso y Autenticación (Módulo 1)
* [x] Mapeo de entidades en `Domain/Entities/AccessControl`:
  * [x] `UsuarioInterno`, `Rol`, `Permiso`, `Departamento`, `RolPermiso`.
* [x] Mapeo Fluent API en `Infrastructure/Persistence/Configurations/AccessControl`:
  * [x] `DepartamentoConfiguration`, `RolConfiguration`, `PermisoConfiguration`, `RolPermisoConfiguration`, `UsuarioInternoConfiguration`.
* [x] Implementar servicio de hash de contraseñas (`PasswordHasher` con BCrypt) y generador de JWT (`JwtTokenGenerator`).
* [x] Implementar servicio de casos de uso `IAuthService` y `AuthService` en `Application/Features/Auth`:
  * [x] `LoginAsync` (valida con FluentValidation, verifica hash BCrypt, genera JWT con claims de rol/depto/cognito_sub y actualiza `ultimo_login`).
  * [x] `RegisterAsync` (valida email duplicado, existencia de depto y rol, hash seguro y retorno de token).
  * [x] `GetCurrentUserAsync` (obtiene datos del usuario activo con roles y permisos).
  * [x] Validadores FluentValidation: `LoginRequestValidator`, `RegisterRequestValidator`.
* [x] Exponer endpoints en `AuthController`:
  * [x] `POST /api/v1/auth/login`
  * [x] `POST /api/v1/auth/register`
  * [x] `GET /api/v1/auth/me` (`[Authorize]`)
* [x] Configurar autenticación JWT Bearer en `Program.cs` y soporte para Authorize con Bearer token en Swagger.
* **Criterio de Aceptación:** `dotnet build` compila con 0 errores y 0 advertencias. Swagger expone los endpoints con el candado de seguridad Bearer. Endpoint `/me` bloquea peticiones no autenticadas con 401 Unauthorized y validaciones responden 400 Bad Request formateadas. (Verificado ✅)

---

### Fase 3: Core Transaccional e Incidentes (Módulo 3)
* [x] Mapeo de entidades en `Domain/Entities/Incidents` y `Commercial`:
  * [x] `Ticket`, `Prioridad`, `EstadoTicket`, `CategoriaIncidencia`, `TicketComentario`, `TicketAdjunto`, `EscalacionTicket`.
  * [x] `ClienteSaas`, `PlanSuscripcion`.
* [x] Configurar **Bloqueo Optimista** en `TicketConfiguration.cs`:
  * [x] Mapear columna `version` con `.IsConcurrencyToken()`.
  * [x] Captura y validación de versión desactualizada lanzando `ConflictException` traducida a `HTTP 409 Conflict`.
* [x] Implementar servicio de Amazon S3 (`IS3StorageService` y `S3StorageService` con AWSSDK.S3):
  * [x] Generación de URLs prefirmadas para subida de adjuntos (validez 5 minutos, verbo PUT) y URLs de descarga GET.
* [x] Casos de uso de tickets en `ITicketService` y `TicketService`:
  * [x] `CreateTicketAsync`: Registro de incidencia con generación de código correlativo (`INC-2026-xxxx`).
  * [x] `UpdateTicketStatusAsync`: Actualización de estado validando el token `version` y control de cierre de ticket.
  * [x] `EscalateTicketAsync`: Registro de escalación técnica entre áreas y reasignación automática de responsable.
  * [x] `AddCommentAsync`: Hilo de comentarios técnicos con visibilidad privada para TI.
  * [x] `GetTicketsAsync`: Listado con filtros multicriterio (estado, prioridad, categoría, responsable, término de búsqueda) y paginación.
  * [x] `GetPresignedUploadUrlAsync` y `ConfirmAttachmentAsync`: Subida eficiente a Amazon S3 y registro del adjunto.
  * [x] Catálogos de prioridades, estados y categorías para selectores UI.
* [x] Exponer endpoints en `TicketsController` y `CatalogsController`:
  * [x] `GET /api/v1/tickets`, `GET /api/v1/tickets/{id}`, `POST /api/v1/tickets`
  * [x] `PUT /api/v1/tickets/{id}/status`, `POST /api/v1/tickets/{id}/escalate`, `POST /api/v1/tickets/{id}/comments`
  * [x] `POST /api/v1/tickets/{id}/attachments/presigned-url`, `POST /api/v1/tickets/{id}/attachments`
  * [x] `GET /api/v1/catalogs/prioridades`, `estados-ticket`, `categorias-incidencia`
* **Criterio de Aceptación:** `dotnet build` compila con 0 errores y 0 advertencias. 14 rutas expuestas en Swagger. Control de concurrencia optimista implementado con validación de versión y captura de conflictos. (Verificado ✅)

---

### Fase 4: Solicitudes de Producto y Webhook de Zoho (Módulos 4 y 2)
* [x] Mapeo de entidades en `Domain/Entities/ProductFeedback` y `Commercial`:
  * [x] `SugerenciaProducto`, `EstadoSugerencia`, `VotoSugerencia`, `ClienteSolicitante`, `PriorizacionSugerencia`.
  * [x] `ContactoCliente`, `NotaCliente` (completando las 4 tablas del Módulo 2).
* [x] Implementar algoritmo ponderado de priorización técnica vs impacto comercial:
  * [x] Puntuación automática basada en ARR total de clientes interesados, número de votos internos, score comercial (1-10) y días de esfuerzo TI.
* [x] Integración Webhook Zoho CRM con seguridad criptográfica:
  * [x] Validador de firma HMAC-SHA256 (`IZohoSignatureValidator`, `ZohoSignatureValidator`) para la cabecera `X-Zoho-Signature`.
  * [x] Servicio `IZohoWebhookService` y `ZohoWebhookService`: auto-aprovisionamiento/búsqueda de cliente SaaS, vinculación del requerimiento comercial, cálculo de ARR y recálculo automático de priorización.
* [x] Casos de uso de feedback en `ISugerenciaService` y `SugerenciaService`:
  * [x] Listado con filtros y ordenamiento (`prioridad`, `votos`, `arr`, `reciente`), detalle, creación con código `FEAT-2026-xxx`.
  * [x] Alternancia de votos internos (`ToggleVoteAsync`), vinculación manual de clientes y re-evaluación de esfuerzo/impacto.
* [x] Exponer endpoints en `FeedbackController` e `IntegrationsController`:
  * [x] `GET /api/v1/feedback/sugerencias`, `GET /api/v1/feedback/sugerencias/{id}`, `POST /api/v1/feedback/sugerencias`
  * [x] `POST /api/v1/feedback/sugerencias/{id}/votar`, `POST /api/v1/feedback/sugerencias/{id}/clientes`
  * [x] `PUT /api/v1/feedback/sugerencias/{id}/priorizar`, `GET /api/v1/feedback/estados`
  * [x] `POST /api/v1/integrations/zoho/webhook`
* **Criterio de Aceptación:** `dotnet build` compila con 0 errores y 0 advertencias. 21 rutas expuestas en Swagger. Validación criptográfica de HMAC-SHA256 probada: firma inválida rechazada con 401 Unauthorized y firma válida procesada correctamente. (Verificado ✅)

---

### Fase 5: Comunicados, Changelog y Auditoría Automática (Módulos 5 y 6)
* [x] Mapeo de entidades en `Domain/Entities/Announcements` y `OperationsAndAudit`:
  * [x] Módulo 5 (4 tablas): `TipoComunicado`, `ComunicadoSistema`, `DestinatarioComunicado`, `AnuncioChangelog`.
  * [x] Módulo 6 (5 tablas): `MetricaTicket`, `EvaluacionAtencion`, `TurnoDisponibilidad`, `LogActividad` (PK `long`), `NotificacionUsuario`.
  * [x] **Meta alcanzada:** 30 de 30 tablas del esquema `opshub_db` mapeadas al 100%.
* [x] Mapeos Fluent API en `Infrastructure/Persistence/Configurations/Announcements` y `OperationsAndAudit`.
* [x] Implementar `AuditLogsInterceptor` en EF Core (`SaveChangesInterceptor`):
  * [x] Detección automática de entidades agregadas (`CREATE`), modificadas (`UPDATE`) y eliminadas (`DELETE`).
  * [x] Serialización a JSON de valores previos y nuevos para `logs_actividad`.
  * [x] Enmascaramiento preventivo de seguridad para credenciales y tokens (`***`).
  * [x] Detección de IP y plataforma cliente (`ANGULAR_DESKTOP`, `REACT_NATIVE_ANDROID`, etc.) vía `ICurrentUserService`.
* [x] Casos de uso de comunicados y notas de versión en `IAnnouncementService` y `AnnouncementService`:
  * [x] Consulta de comunicados activos (degradación de servicio o emitidos en las últimas 72 horas).
  * [x] Publicación de comunicados con filtros departamentales o de clientes específicos.
  * [x] Registro y lectura del historial de versiones en Changelog.
* [x] Casos de uso de operaciones, métricas y turnos en `IOperationsService` y `OperationsService`:
  * [x] Cálculo en tiempo real de porcentaje de cumplimiento y tiempos promedio de SLAs de primera respuesta y resolución.
  * [x] Evaluación de satisfacción del cliente (1 a 5 estrellas).
  * [x] Bandeja de notificaciones y lectura por usuario.
  * [x] Asignación y consulta de turnos de guardia técnica.
* [x] Exponer endpoints en `AnnouncementsController` y `OperationsController`:
  * [x] `GET /api/v1/announcements`, `GET /api/v1/announcements/active`, `POST /api/v1/announcements`
  * [x] `GET /api/v1/announcements/changelog`, `POST /api/v1/announcements/changelog`, `GET /api/v1/announcements/types`
  * [x] `GET /api/v1/operations/audit`, `GET /api/v1/operations/metrics/sla`, `POST /api/v1/operations/evaluations`
  * [x] `GET /api/v1/operations/notifications`, `PUT /api/v1/operations/notifications/{id}/read`, `POST /api/v1/operations/notifications`
  * [x] `GET /api/v1/operations/shifts`, `POST /api/v1/operations/shifts`
* **Criterio de Aceptación:** `dotnet build` compila con 0 errores y 0 advertencias. 31 rutas expuestas en Swagger UI. `AuditLogsInterceptor` configurado e inyectado en el DbContext. (Verificado ✅)

---

### Fase 6: Empaquetado Serverless y Despliegue en AWS Lambda
* [x] Instalar paquete `Amazon.Lambda.AspNetCoreServer.Hosting` en `OpsHub.Api`.
* [x] Configurar `builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);` en `Program.cs`.
* [x] Crear plantilla de despliegue `serverless.template` (AWS SAM / CloudFormation):
  * [x] Definición de `AWS::Serverless::HttpApi` (API Gateway v2) con CORS y Payload Format 2.0.
  * [x] Definición de `AWS::Serverless::Function` con runtime `provided.al2023`, 1024 MB y timeout 30s.
  * [x] Variables de entorno desacopladas (`ConnectionStrings__DefaultConnection`, `JwtSettings__SecretKey`, etc.).
  * [x] Políticas de ejecución IAM mínimas (`AWSLambdaBasicExecutionRole` y políticas de S3).
* [x] Crear configuración `aws-lambda-tools-defaults.json` para herramientas de AWS y Visual Studio.
* [x] Crear `Dockerfile` multi-etapa (.NET 10) para despliegue alternativo en AWS Lambda Container Images o AWS App Runner.
* [x] Implementar script de automatización `deploy-lambda.ps1` para compilación self-contained `linux-x64`, configuración del binario `bootstrap` y empaquetado ZIP.
* [x] Verificación de empaquetado: Publicación self-contained de 50.63 MB generada exitosamente.
* **Criterio de Aceptación:** Paquete ZIP listo para Lambda, plantilla SAM validada y endpoints probados en local y listos para la nube. (Verificado ✅)

---

## 3. Bitácora de Sesiones (Session Log)

### Sesión 0 — Planificación y Especificación Arquitectónica
* **Fecha:** 11 de Noviembre de 2026
* **Objetivos:** Definir la arquitectura integral del backend, principios de diseño, estrategia de base de datos MySQL 8.4, integración con AWS Lambda, y documentación de sustento académico.
* **Tareas Realizadas:**
  * Análisis de los documentos de requerimientos de arquitectura (`ESPECIFICACION_ARQUITECTURA.md`) y base de datos relacional de 30 tablas (`ESPECIFICACION_BASE_DATOS_OPSHUB.md`).
  * Definición del patrón arquitectónico: Clean Architecture con Vertical Slices y Serverless Web API en AWS Lambda tras API Gateway.
  * Definición de la estrategia de conexión segura a MySQL RDS (mitigación de saturación del pool de conexiones).
  * Redacción y publicación de `ESPECIFICACION_BACKEND_DOTNET.md` (documento para sustentación de jurado con preguntas y respuestas técnicas).
  * Redacción y publicación de `ROADMAP_BITACORA_BACKEND.md` (este documento de control y continuidad).
* **Estado:** Planificación completada al 100%.

### Sesión 1 — Construcción y Validación de Fase 1 (Fundación y Conexión)
* **Fecha:** 12 de Noviembre de 2026
* **Objetivos:** Crear la solución .NET 10 bajo Clean Architecture, configurar EF Core con Pomelo MySQL y pool limitado, middleware de excepciones global, Swagger UI y endpoint de salud.
* **Tareas Realizadas:**
  * Creación de la solución `projects/backend/OpsHub.Backend.slnx` y los 4 proyectos: `OpsHub.Domain`, `OpsHub.Application`, `OpsHub.Infrastructure`, `OpsHub.Api`.
  * Configuración estricta de referencias entre proyectos respetando la Regla de Dependencia de Clean Architecture.
  * Instalación y actualización de paquetes NuGet: `Pomelo.EntityFrameworkCore.MySql`, `MySqlConnector` (3.0.0), `FluentValidation`, `Amazon.Lambda.AspNetCoreServer.Hosting`, `Swashbuckle.AspNetCore`.
  * Implementación de la base de Domain: `BaseEntity`, `IAuditableEntity`, `DomainException`.
  * Implementación de Application: `IApplicationDbContext`, `NotFoundException`, `ValidationException`, `ConflictException`, `ApiResponse<T>`, `DependencyInjection`.
  * Implementación de Infrastructure: `ApplicationDbContext` (con `CanConnectAsync`), inyección con pool tuning y políticas de reintento transaccional.
  * Implementación de API: `ExceptionHandlingMiddleware` (captura 400, 401, 404, 409 por bloqueo optimista, 500), `BaseApiController`, `HealthController` (`GET /api/v1/health`), configuración de Swagger UI y soporte Lambda Serverless (`LambdaEventSource.HttpApi`).
  * Pruebas en vivo: Compilación con 0 errores y 0 advertencias. Ejecución local en `http://localhost:5183`, validación exitosa de `/api/v1/health` (200 OK) y `/swagger/v1/swagger.json` (200 OK).
* **Estado:** Fase 1 completada al 100%.

### Sesión 2 — Construcción y Validación de Fase 2 (Control de Acceso y Autenticación - Módulo 1)
* **Fecha:** 12 de Noviembre de 2026
* **Objetivos:** Implementar las 5 tablas del Módulo 1 de OpsHub, hashing con BCrypt, emisión de tokens JWT, servicio de casos de uso `AuthService`, endpoints de login/registro/perfil y protección de Swagger.
* **Tareas Realizadas:**
  * Creación de entidades en `Domain/Entities/AccessControl`: `Departamento`, `Rol`, `Permiso`, `RolPermiso`, `UsuarioInterno`.
  * Creación de mapeos Fluent API en `Infrastructure/Persistence/Configurations/AccessControl` respetando el esquema MySQL `opshub_db`.
  * Registro de DbSets en `IApplicationDbContext` y `ApplicationDbContext`.
  * Implementación de servicios de seguridad: `PasswordHasher` (BCrypt) e `JwtTokenGenerator` (claims con email, rol, depto, cognito_sub y caducidad configurable).
  * Implementación de casos de uso y DTOs en `Application/Features/Auth`: `AuthService`, `LoginRequest`, `RegisterRequest`, `UserDto`, `AuthResponseDto`.
  * Validadores FluentValidation: `LoginRequestValidator` y `RegisterRequestValidator`.
  * Implementación de `ICurrentUserService` y `CurrentUserService` para extracción de usuario autenticado desde `HttpContext`.
  * Implementación de `AuthController` (`POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/me`).
  * Configuración de autenticación JWT Bearer en `Program.cs` y configuración de Swagger con definición de seguridad Bearer (botón *Authorize*).
  * Pruebas en vivo: Compilación con 0 advertencias y 0 errores. Swagger expone `/api/v1/Auth/*`. Prueba de validación responde `400 Bad Request` con errores detallados. Prueba de `/api/v1/Auth/me` responde `401 Unauthorized` si no se envía token.
* **Estado:** Fase 2 completada al 100%.

### Sesión 3 — Construcción y Validación de Fase 3 (Core Transaccional e Incidentes - Módulo 3)
* **Fecha:** 12 de Noviembre de 2026
* **Objetivos:** Implementar las 7 tablas de incidencias, control de bloqueo optimista (`version` -> `HTTP 409 Conflict`), generación de URLs prefirmadas de Amazon S3 (`AWSSDK.S3`), orquestación de tickets y endpoints en la API.
* **Tareas Realizadas:**
  * Creación de entidades en `Domain/Entities/Incidents`: `Ticket`, `Prioridad`, `EstadoTicket`, `CategoriaIncidencia`, `TicketComentario`, `TicketAdjunto`, `EscalacionTicket`.
  * Creación de entidades en `Domain/Entities/Commercial`: `ClienteSaas`, `PlanSuscripcion` (para integridad referencial de `tickets.cliente_id`).
  * Creación de mapeos Fluent API en `Infrastructure/Persistence/Configurations/Incidents` y `Commercial`. Configuración de `version` con `.IsConcurrencyToken()`.
  * Registro de DbSets correspondientes en `IApplicationDbContext` y `ApplicationDbContext`.
  * Instalación de `AWSSDK.S3` (v4.1.0) e implementación de `IS3StorageService` / `S3StorageService` para URLs prefirmadas de subida (PUT, 5 min) y descarga (GET).
  * Implementación de DTOs, validadores FluentValidation y servicio de casos de uso `ITicketService` / `TicketService` en `Application/Features/Incidents`:
    * Listado con filtros multicriterio y paginación (`GetTicketsAsync`).
    * Consulta detallada con carga ansiosa de comentarios, adjuntos y escalaciones (`GetTicketByIdAsync`).
    * Registro de incidencia con generación de código correlativo `INC-2026-xxxx` (`CreateTicketAsync`).
    * Actualización de estado con validación estricta de versión de concurrencia optimista (`UpdateTicketStatusAsync`).
    * Escalación formal entre áreas con reasignación y bitácora técnica (`EscalateTicketAsync`).
    * Hilos de comentarios con soporte de notas privadas para TI (`AddCommentAsync`).
    * Flujo de adjuntos con S3: solicitud de URL prefirmada y confirmación de registro (`GetPresignedUploadUrlAsync`, `ConfirmAttachmentAsync`).
    * Catálogos para selectores de interfaz (`GetPrioridadesAsync`, `GetEstadosAsync`, `GetCategoriasAsync`).
  * Implementación de controladores en `OpsHub.Api`: `TicketsController` (protegido con `[Authorize]`) y `CatalogsController` (público).
  * Pruebas en vivo: Compilación con 0 advertencias y 0 errores. 14 endpoints expuestos en Swagger UI. Verificación de protección 401 en `/api/v1/Tickets`.
* **Estado:** Fase 3 completada al 100%.

### Sesión 4 — Construcción y Validación de Fase 4 (Solicitudes de Producto y Webhook de Zoho - Módulos 4 y 2)
* **Fecha:** 12 de Noviembre de 2026
* **Objetivos:** Implementar las 5 tablas de feedback de producto y 2 tablas comerciales restantes (21 tablas mapeadas en total), algoritmo ponderado de priorización técnica vs comercial, recepción de webhooks de Zoho CRM con validación de firma HMAC-SHA256 (`X-Zoho-Signature`) y endpoints correspondientes.
* **Tareas Realizadas:**
  * Creación de entidades en `Domain/Entities/ProductFeedback`: `SugerenciaProducto`, `EstadoSugerencia`, `VotoSugerencia`, `ClienteSolicitante`, `PriorizacionSugerencia`.
  * Creación de entidades restantes en `Domain/Entities/Commercial`: `ContactoCliente`, `NotaCliente`.
  * Creación de mapeos Fluent API en `Infrastructure/Persistence/Configurations/ProductFeedback` y `Commercial`.
  * Registro de DbSets en `IApplicationDbContext` y `ApplicationDbContext`.
  * Implementación del algoritmo de priorización ponderada:
    $$\text{score} = \frac{(\text{ImpactoScore} \times 10) + \min(\text{TotalARR}/1000, 50) + (\text{TotalVotos} \times 2)}{\max(\text{EsfuerzoDias}, 1)}$$
  * Implementación de seguridad para Webhooks: `IZohoSignatureValidator` y `ZohoSignatureValidator` (HMAC-SHA256 con clave secreta).
  * Implementación de `IZohoWebhookService` y `ZohoWebhookService` (procesamiento seguro de leads/clientes, vinculación de requerimiento y recálculo dinámico de priorización).
  * Implementación de casos de uso en `ISugerenciaService` y `SugerenciaService`: creación de sugerencias (`FEAT-2026-xxx`), listado con filtros y ordenamientos, detalle, toggle de votos internos y vinculación de clientes SaaS.
  * Implementación de `FeedbackController` y `IntegrationsController` (`POST /api/v1/integrations/zoho/webhook`).
  * Pruebas en vivo: Compilación con 0 advertencias y 0 errores. 21 rutas expuestas en Swagger UI. Prueba criptográfica de HMAC: firma inválida rechazada con `401 Unauthorized` y firma válida aceptada con `200 OK`.
* **Estado:** Fase 4 completada al 100%.

### Sesión 5 — Construcción y Validación de Fase 5 (Comunicados, Changelog y Auditoría Automática - Módulos 5 y 6)
* **Fecha:** 12 de Noviembre de 2026
* **Objetivos:** Mapear las 9 tablas restantes de la base de datos (alcanzando el 100% de las 30 tablas del esquema MySQL), implementar el interceptor de auditoría automática `AuditLogsInterceptor` con serialización JSON, servicios de comunicados y operaciones/SLAs, y exponer 10 nuevos endpoints en `AnnouncementsController` y `OperationsController`.
* **Tareas Realizadas:**
  * Creación de entidades de Módulo 5 en `Domain/Entities/Announcements`: `TipoComunicado`, `ComunicadoSistema`, `DestinatarioComunicado`, `AnuncioChangelog`.
  * Creación de entidades de Módulo 6 en `Domain/Entities/OperationsAndAudit`: `MetricaTicket`, `EvaluacionAtencion`, `TurnoDisponibilidad`, `LogActividad` (con identificador BIGINT `long`), `NotificacionUsuario`.
  * Creación de mapeos Fluent API para las 9 entidades en `Infrastructure/Persistence/Configurations/Announcements` y `OperationsAndAudit`.
  * Registro de la totalidad de 30 DbSets en `IApplicationDbContext` y `ApplicationDbContext`.
  * Implementación del interceptor de base de datos `AuditLogsInterceptor : SaveChangesInterceptor` en `Infrastructure/Persistence/Interceptors`:
    * Detecta operaciones `CREATE` (Added), `UPDATE` (Modified) y `DELETE` (Deleted) en cualquier entidad del sistema.
    * Captura estado anterior y nuevo serializado a JSON para `valores_anteriores_json` y `valores_nuevos_json`.
    * Enmascara de forma automática datos sensibles (contraseñas, tokens y secrets) como `***`.
    * Vincula el `usuario_id`, dirección IP (`ip_origen`) y plataforma cliente (`ANGULAR_DESKTOP`, `REACT_NATIVE_ANDROID`, etc.) obtenidos de `ICurrentUserService`.
  * Implementación de casos de uso y DTOs en `Application/Features/Announcements`: `IAnnouncementService` y `AnnouncementService` (comunicados activos, filtrado por afectación de servicio, historial de versiones Changelog y catálogos).
  * Implementación de casos de uso y DTOs en `Application/Features/Operations`: `IOperationsService` y `OperationsService` (resumen dinámico de SLAs de primera respuesta y resolución, evaluaciones de satisfacción de tickets 1-5 estrellas, notificaciones al usuario y asignación de turnos).
  * Implementación de `AnnouncementsController` y `OperationsController` en `OpsHub.Api`.
  * Pruebas en vivo: Compilación con 0 advertencias y 0 errores. Total de 31 endpoints REST registrados y activos en Swagger UI. Comprobación de seguridad JWT (rutas protegidas retornan `401 Unauthorized` sin Bearer token).
* **Estado:** Fase 5 completada al 100% (30 de 30 tablas del modelo relacional implementadas).

### Sesión 6 — Construcción y Validación de Fase 6 (Empaquetado Serverless y Despliegue en AWS Lambda)
* **Fecha:** 12 de Noviembre de 2026
* **Objetivos:** Crear el manifiesto de infraestructura como código (IaC) para AWS SAM / CloudFormation (`serverless.template`), configuración de herramientas de AWS (`aws-lambda-tools-defaults.json`), Dockerfile multi-etapa, script de empaquetado para `provided.al2023` (`deploy-lambda.ps1`), y validación de la generación del artefacto ZIP para despliegue en la nube.
* **Tareas Realizadas:**
  * Creación del manifiesto `projects/backend/src/OpsHub.Api/serverless.template` (AWS SAM):
    * Declaración de `AWS::Serverless::HttpApi` (API Gateway v2) con CORS multi-origen y formato de payload 2.0.
    * Declaración de función Lambda `AWS::Serverless::Function` configurada con runtime `provided.al2023`, 1024 MB de memoria RAM y 30 segundos de timeout.
    * Mapeo desacoplado de variables de entorno para base de datos MySQL en Amazon RDS, secretos JWT, Amazon S3 y firma HMAC de Zoho.
    * Políticas IAM acotadas bajo el principio de menor privilegio (`AWSLambdaBasicExecutionRole` y permisos directos sobre el bucket S3 de evidencias).
  * Creación de `aws-lambda-tools-defaults.json` con metadatos de configuración para CLI y extensiones de AWS.
  * Creación de `projects/backend/Dockerfile` multi-etapa (.NET 10 SDK + ASP.NET Core Runtime) para habilitar despliegue alternativo como AWS Lambda Container Image o en AWS App Runner / ECS.
  * Creación de `projects/backend/deploy-lambda.ps1`: Script PowerShell con opciones para empaquetado ZIP (`Package`), despliegue SAM (`SamDeploy`) y construcción de contenedor (`DockerBuild`).
  * Validación del empaquetado: Ejecución de publicación self-contained para `linux-x64` y enlace del ejecutable `bootstrap`. Generación exitosa del archivo ZIP de despliegue (`opshub-backend-lambda.zip`, ~50.6 MB) listo para cargar en la consola o CLI de AWS.
  * Configuración de `.gitignore` para artefactos de compilación de .NET (`bin/`, `obj/`, `*.zip`).
  * Actualización de `ESPECIFICACION_BACKEND_DOTNET.md` con la arquitectura serverless, guía de mitigación de cold starts y preguntas de defensa para el jurado sobre Serverless vs Monolito tradicional.
* **Estado:** Fase 6 completada al 100%. **BACKEND 100% FINALIZADO Y LISTO PARA SUSTENTACIÓN.**

---

## 4. Guía para Continuar en Nuevas Sesiones

Cuando abras una nueva sesión de desarrollo con el asistente de IA, simplemente indícale:

> *"Hola, revisa `ROADMAP_BITACORA_BACKEND.md` y `ESPECIFICACION_BACKEND_DOTNET.md` para ver el estado actual del backend y continuemos con la siguiente tarea pendiente de la Fase X."*

Esto garantizará que no se repitan pasos, se mantengan los estándares de nombres, paquetes y arquitectura, y la bitácora se actualice con cada avance probado.

---

## 5. Referencia Rápida de Comandos

```bash
# Compilar toda la solución
dotnet build projects/backend/OpsHub.Backend.slnx

# Ejecutar el backend en local (API + Swagger en http://localhost:5183/swagger)
dotnet run --project projects/backend/src/OpsHub.Api

# Configurar secretos locales de desarrollo (evita quemar contraseñas)
dotnet user-secrets init --project projects/backend/src/OpsHub.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=opshub_db;..." --project projects/backend/src/OpsHub.Api

# Empaquetado para AWS Lambda (requiere dotnet-lambda tool)
dotnet lambda package --project projects/backend/src/OpsHub.Api
```
