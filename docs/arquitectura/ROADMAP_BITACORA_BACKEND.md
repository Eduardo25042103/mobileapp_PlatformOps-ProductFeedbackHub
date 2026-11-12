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
│ Fase 1: Fundación y Conexión (Clean Architecture & DB)│ ⏳ PENDIENTE   │
│ Fase 2: Control de Acceso y Autenticación (Módulo 1)  │ ⏳ PENDIENTE   │
│ Fase 3: Core Transaccional e Incidentes (Módulo 3)    │ ⏳ PENDIENTE   │
│ Fase 4: Solicitudes de Producto y Webhook Zoho (M4/M2)│ ⏳ PENDIENTE   │
│ Fase 5: Comunicados, Changelog y Auditoría (M5/M6)    │ ⏳ PENDIENTE   │
│ Fase 6: Empaquetado Serverless y Despliegue en AWS    │ ⏳ PENDIENTE   │
└───────────────────────────────────────────────────────┴────────────────┘
```

---

## 2. Checklist Detallado por Fases

### Fase 1: Fundación y Conexión (Clean Architecture & DB)
* [ ] Crear la solución `OpsHub.Backend.sln`.
* [ ] Crear los 4 proyectos de Clean Architecture:
  * [ ] `OpsHub.Domain` (Class Library - .NET 10)
  * [ ] `OpsHub.Application` (Class Library - .NET 10)
  * [ ] `OpsHub.Infrastructure` (Class Library - .NET 10)
  * [ ] `OpsHub.Api` (Web API - .NET 10)
* [ ] Configurar las referencias entre proyectos respetando la Regla de Dependencia:
  * `Domain` no referencia nada.
  * `Application` referencia `Domain`.
  * `Infrastructure` referencia `Application` y `Domain`.
  * `Api` referencia `Infrastructure` y `Application`.
* [ ] Instalar paquetes NuGet clave:
  * `Pomelo.EntityFrameworkCore.MySql` en `Infrastructure`.
  * `FluentValidation.DependencyInjectionExtensions` en `Application`.
  * `Swashbuckle.AspNetCore` en `Api`.
* [ ] Configurar `ApplicationDbContext` y la cadena de conexión con pool limitado para MySQL (`opshub_db`).
* [ ] Implementar middleware global de excepciones (`ExceptionHandlingMiddleware`).
* [ ] Implementar endpoint de salud: `GET /api/v1/health`.
* [ ] Configurar Swagger / OpenAPI en `Program.cs`.
* **Criterio de Aceptación:** `dotnet build` compila con 0 errores y al ejecutar `dotnet run`, Swagger abre en el navegador y el endpoint `/health` responde `200 OK` con conexión exitosa a MySQL.

---

### Fase 2: Control de Acceso y Autenticación (Módulo 1)
* [ ] Mapeo de entidades en `Domain/Entities/AccessControl`:
  * [ ] `UsuarioInterno`, `Rol`, `Permiso`, `Departamento`, `RolPermiso`.
* [ ] Mapeo Fluent API en `Infrastructure/Persistence/Configurations`.
* [ ] Implementar servicio de hash de contraseñas (`PasswordHasher`) y generador de JWT (`JwtTokenGenerator`).
* [ ] Implementar Casos de Uso en `Application/Features/Auth`:
  * [ ] `LoginCommand` y Handler (retorna JWT y datos de usuario).
  * [ ] `RegisterCommand` y Handler (alta de colaborador con rol y departamento).
  * [ ] `GetCurrentUserQuery` (obtiene datos del token activo).
* [ ] Exponer endpoints en `AuthController`:
  * [ ] `POST /api/v1/auth/login`
  * [ ] `POST /api/v1/auth/register`
  * [ ] `GET /api/v1/auth/me`
* [ ] Configurar autenticación JWT Bearer en `Program.cs` y soporte para Authorize en Swagger.
* **Criterio de Aceptación:** Se registra un usuario en Swagger/Postman, se inicia sesión obteniendo un JWT válido, y el endpoint protegido `/me` devuelve la información con su rol.

---

### Fase 3: Core Transaccional e Incidentes (Módulo 3)
* [ ] Mapeo de entidades en `Domain/Entities/Incidents`:
  * [ ] `Ticket`, `Prioridad`, `EstadoTicket`, `CategoriaIncidencia`, `TicketComentario`, `TicketAdjunto`, `EscalacionTicket`.
* [ ] Configurar **Bloqueo Optimista** en `TicketConfiguration.cs`:
  * [ ] Mapear columna `version` con `.IsConcurrencyToken()`.
  * [ ] Captura de `DbUpdateConcurrencyException` devolviendo `HTTP 409 Conflict`.
* [ ] Implementar servicio de Amazon S3 (`IS3StorageService` y `S3StorageService` con AWSSDK.S3):
  * [ ] Generación de URLs prefirmadas para subida de adjuntos (validez 5 minutos).
* [ ] Casos de uso de tickets:
  * [ ] `CreateTicketCommand`: Registro de incidencia con generación de código correlativo (`INC-2026-xxx`).
  * [ ] `UpdateTicketStatusCommand`: Actualización de estado validando el token `version`.
  * [ ] `AddTicketCommentCommand`: Comentarios técnicos con soporte de visibilidad `es_privado_ti`.
  * [ ] `GetTicketsQuery`: Listado filtrado por prioridad, estado y departamento con paginación.
  * [ ] `GetTicketPresignedUrlCommand`: Solicitud de URL prefirmada para adjuntos.
* [ ] Exponer endpoints en `TicketsController`.
* **Criterio de Aceptación:** Registro de tickets verificado. Prueba de concurrencia: dos peticiones con la misma versión lanzan 409 en la segunda. Prueba de S3: generación de URL prefirmada funcional.

---

### Fase 4: Solicitudes de Producto y Webhook de Zoho (Módulos 4 y 2)
* [ ] Mapeo de entidades en `Domain/Entities/ProductFeedback` y `Commercial`:
  * [ ] `SugerenciasProducto`, `EstadosSugerencia`, `VotosSugerencia`, `ClientesSolicitantes`, `PriorizacionSugerencia`.
  * [ ] `ClientesSaas`, `PlanesSuscripcion`.
* [ ] Implementar algoritmo de cálculo de priorización:
  * [ ] Puntuación ponderada basada en `monto_anual_contratado` / `valor_anual_representado` vs `esfuerzo_ti_dias`.
* [ ] Integración Webhook Zoho:
  * [ ] Filtro/Middleware de validación de firma criptográfica `X-Zoho-Signature` (HMAC-SHA256).
  * [ ] Caso de uso: `ProcessZohoWebhookCommand` (actualiza `clientes_solicitantes` y recalcula la priorización).
* [ ] Endpoints en `ProductFeedbackController` e `IntegrationsController`.
* **Criterio de Aceptación:** Recepción simulada de webhook de Zoho con firma correcta aceptada (200) e inválida rechazada (401).

---

### Fase 5: Comunicados, Changelog y Auditoría Automática (Módulos 5 y 6)
* [ ] Mapeo de entidades en `Domain/Entities/Announcements` y `OperationsAndAudit`:
  * [ ] `ComunicadosSistema`, `TiposComunicado`, `AnunciosChangelog`.
  * [ ] `LogsActividad`, `MetricasTicket`, `EvaluacionesAtencion`.
* [ ] Implementar `AuditLogsInterceptor` en EF Core:
  * [ ] Capturar entidades modificadas y serializar estado previo y nuevo en formato JSON para la tabla `logs_actividad`.
* [ ] Casos de uso de comunicados y notas de versión.
* [ ] Endpoints en `AnnouncementsController` y `AuditController`.
* **Criterio de Aceptación:** Al crear o modificar tickets o comunicados, se comprueba en la tabla `logs_actividad` la creación automática del registro de auditoría con su respectivo JSON.

---

### Fase 6: Empaquetado Serverless y Despliegue en AWS Lambda
* [ ] Instalar paquete `Amazon.Lambda.AspNetCoreServer.Hosting` en `OpsHub.Api`.
* [ ] Configurar `builder.Services.AddAWSLambdaHosting(LambdaServerMode.HttpApi);` en `Program.cs`.
* [ ] Crear plantilla de despliegue `serverless.template` (AWS SAM / CloudFormation).
* [ ] Configurar variables de entorno y políticas IAM mínimas para S3 y CloudWatch.
* [ ] Documentar pruebas en la nube tras API Gateway.
* **Criterio de Aceptación:** Despliegue exitoso en AWS Lambda y prueba de endpoints a través de la URL de API Gateway.

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
* **Estado:** Planificación completada al 100%. Todo listo para arrancar la **Fase 1**.
* **Próxima Tarea (Sesión 1):** Iniciar la **Fase 1** (Crear solución .NET 10, los 4 proyectos de Clean Architecture, configurar EF Core con Pomelo MySQL, Middleware de excepciones y endpoint `/health` con Swagger).

---

## 4. Guía para Continuar en Nuevas Sesiones

Cuando abras una nueva sesión de desarrollo con el asistente de IA, simplemente indícale:

> *"Hola, revisa `ROADMAP_BITACORA_BACKEND.md` y `ESPECIFICACION_BACKEND_DOTNET.md` para ver el estado actual del backend y continuemos con la siguiente tarea pendiente de la Fase X."*

Esto garantizará que no se repitan pasos, se mantengan los estándares de nombres, paquetes y arquitectura, y la bitácora se actualice con cada avance probado.

---

## 5. Referencia Rápida de Comandos

```bash
# Compilar toda la solución
dotnet build

# Ejecutar el backend en local (API + Swagger)
dotnet run --project src/OpsHub.Api

# Configurar secretos locales de desarrollo (evita quemar contraseñas)
dotnet user-secrets init --project src/OpsHub.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=opshub_db;..." --project src/OpsHub.Api

# Empaquetado para AWS Lambda (requiere dotnet-lambda tool)
dotnet lambda package --project src/OpsHub.Api
```
