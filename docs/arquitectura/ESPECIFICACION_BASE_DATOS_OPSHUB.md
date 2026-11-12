# Especificación Técnica de Base de Datos: PlatformOps & Product Feedback Hub
**Nombre de la Base de Datos:** `opshub_db`  
**Entorno de Servidor:** Amazon RDS for MySQL (Versión 8.4.11 / Multi-AZ Ready)  
* **Proyecto:** Plataforma Centralizada de Gestión Operativa y Feedback Comercial (*TuNegocio.pe*)  
* **Arquitectura de Clientes:** Multiplataforma (App Móvil en React Native + Portal Web en Angular)  
* **Capa de Servicios:** Backend Serverless en .NET Core 10 (C#) con AWS API Gateway y AWS Lambda  
* **Institución:** Instituto de Educación Superior IDAT — VI Ciclo (Carrera de Desarrollo de Sistemas)  

---

## 1. Visión General y Justificación de Arquitectura

El esquema relacional `opshub_db` da soporte a la interacción interdepartamental entre **Soporte, TI/Desarrollo, Ventas y Marketing**. Centraliza el ciclo de vida de fallas de software, priorización de requerimientos basada en impacto económico y trazabilidad de eventos operativos.

### 1.1. Parámetros Técnicos de Infraestructura en AWS RDS
* **Motor:** MySQL Community 8.4 LTS
* **Clase de Instancia:** `db.t4g.micro` (Arquitectura ARM Graviton2, optimizada para cuota gratuita).
* **Storage:** 20 GB General Purpose SSD (gp2).
* **Juego de Caracteres por Defecto:** `utf8mb4` (Soporte multilingüe y emojis técnicos).
* **Cotejamiento (Collation):** `utf8mb4_unicode_ci` (Ordenamiento lingüístico UCA exacto y sin distinción de mayúsculas/minúsculas).
* **Motor de Almacenamiento:** `InnoDB` (Soporte estricto de transacciones ACID, integridad referencial y bloqueos por fila).

---

## 2. Cumplimiento de Estándares de Diseño y Normalización

### 2.1. Primera Forma Normal (1FN)
* **Atomicidad:** Cada columna almacena un único dato indivisible.
* **Sin grupos repetitivos:** Listas de comentarios, adjuntos multimedia o destinatarios no se almacenan como cadenas separadas por comas ni en columnas fijas repetidas (`adjunto1`, `adjunto2`), sino en tablas hijas normalizadas (`ticket_adjuntos`, `ticket_comentarios`, `destinatarios_comunicado`).
* **Identificadores Únicos:** Cada entidad posee una clave primaria surrogate (`id INT AUTO_INCREMENT` o `BIGINT` en logs) y claves candidatas con restricción `UNIQUE` (`codigo`, `ruc`, `email`).

### 2.2. Segunda Forma Normal (2FN)
* Se cumple la 1FN y todos los atributos no clave tienen dependencia funcional completa de la clave primaria.
* En tablas intermedias de relaciones muchos a muchos (`roles_permisos`, `votos_sugerencia`, `clientes_solicitantes`), no existen dependencias parciales; los atributos contextuales (como `valor_anual_representado` o `motivo_voto`) dependen de la clave primaria compuesta o están unívocamente vinculados a la relación.

### 2.3. Tercera Forma Normal (3FN)
* Se cumple la 2FN y se eliminan las dependencias transitivas (ningún atributo no clave depende de otro atributo no clave).
* Catálogos maestros independientes: `departamentos`, `roles`, `prioridades`, `estados_ticket`, `categorias_incidencia`, `planes_suscripcion`, `estados_sugerencia`, `tipos_comunicado`.
* La tabla `tickets` almacena únicamente `prioridad_id` y `estado_id`. Datos derivados como el tiempo máximo de resolución o el color de la prioridad no se duplican en el ticket, garantizando consistencia si los acuerdos de nivel de servicio (SLA) se actualizan.

---

## 3. Patrones de Ingeniería Avanzados Incorporados

### 3.1. Control de Concurrencia Optimista (Optimistic Locking)
Para evitar la sobreescritura accidental de tickets cuando dos operadores o desarrolladores atienden la misma incidencia simultáneamente, la tabla `tickets` implementa la columna:
`version INT NOT NULL DEFAULT 1`

* **Mecanismo:** La aplicación móvil/web envía el número de versión al actualizar. La sentencia SQL ejecuta:
  ```sql
  UPDATE tickets 
  SET estado_id = ?, version = version + 1 
  WHERE id = ? AND version = ?;
  ```
* Si la fila no fue modificada, la actualización tiene éxito y la versión se incrementa a 2. Si otro usuario modificó el registro milisegundos antes, la condición `version = ?` no coincide, afectando 0 filas. El backend detecta esto y emite un código `HTTP 409 Conflict`, obligando al cliente a recargar los datos sin perder notas.

### 3.2. Compatibilidad con AWS Cognito (Linked Profile Pattern)
La tabla `usuarios_internos` soporta un esquema híbrido:
* `cognito_sub VARCHAR(64) UNIQUE NULL`: Almacena el identificador `sub` emitido en los tokens JWT por el User Pool de AWS Cognito.
* `password_hash VARCHAR(255) NULL`: Permite compatibilidad con autenticación local o de respaldo.
* Los roles, departamentos y permisos de negocio residen en MySQL, garantizando consultas relacionales rápidas sin incurrir en cuotas de llamadas a APIs externas en cada consulta.

---

## 4. Diccionario de Datos por Módulos (30 Tablas)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ESTRUCTURA DE MÓDULOS                           │
├───────────────────────────────────────────────────────┬────────────────┤
│ Módulo                                                │ N° de Tablas   │
├───────────────────────────────────────────────────────┼────────────────┤
│ 1. Control de Acceso, Usuarios y Organización         │ 5 tablas       │
│ 2. Clientes SaaS y Cuentas Comerciales                │ 4 tablas       │
│ 3. Gestión de Incidentes Técnicos (Core Transaccional)│ 7 tablas       │
│ 4. Solicitudes de Producto y Roadmap                  │ 5 tablas       │
│ 5. Comunicados Internos, Estado y Changelog           │ 4 tablas       │
│ 6. SLAs, Auditoría, Turnos y Notificaciones           │ 5 tablas       │
├───────────────────────────────────────────────────────┼────────────────┤
│ TOTAL                                                 │ 30 tablas      │
└───────────────────────────────────────────────────────┴────────────────┘
```

### Módulo 1: Control de Acceso, Usuarios y Organización (5 Tablas)

#### 1. `departamentos`
Catálogo de áreas funcionales de la organización.
* `id` (INT, PK, AUTO_INCREMENT): Identificador único.
* `codigo` (VARCHAR(20), UNIQUE, NOT NULL): Código nemotécnico (`SOP`, `TI`, `VENTAS`, `MKT`, `OPS`).
* `nombre` (VARCHAR(100), NOT NULL): Nombre completo del departamento.
* `descripcion` (VARCHAR(255), NULL): Resumen de responsabilidades.
* `is_active` (BOOLEAN, DEFAULT TRUE): Estado operativo del área.
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 2. `roles`
Roles jerárquicos y funcionales.
* `id` (INT, PK, AUTO_INCREMENT): Identificador del rol.
* `codigo` (VARCHAR(30), UNIQUE, NOT NULL): Clave (`ADMIN`, `AGENTE_SOPORTE`, `DEV_INGENIERO`, `EJECUTIVO_VENTAS`, `MARKETING_LEAD`).
* `nombre` (VARCHAR(100), NOT NULL): Etiqueta visual.
* `descripcion` (VARCHAR(255), NULL): Alcance del rol.
* `is_active` (BOOLEAN, DEFAULT TRUE).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 3. `permisos`
Catálogo granular de capacidades en el sistema.
* `id` (INT, PK, AUTO_INCREMENT): Identificador del permiso.
* `codigo` (VARCHAR(50), UNIQUE, NOT NULL): Ej: `TICKET_CREATE`, `TICKET_ASSIGN_DEV`, `TICKET_DELETE`, `CHANGELOG_PUBLISH`.
* `modulo` (VARCHAR(50), NOT NULL): Módulo funcional al que pertenece.
* `descripcion` (VARCHAR(255), NOT NULL): Acción permitida.
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 4. `roles_permisos`
Tabla asociativa n:m para asignación de privilegios a roles.
* `rol_id` (INT, PK, FK -> `roles.id` ON DELETE CASCADE).
* `permiso_id` (INT, PK, FK -> `permisos.id` ON DELETE CASCADE).

#### 5. `usuarios_internos`
Directorio de colaboradores autorizados.
* `id` (INT, PK, AUTO_INCREMENT): Identificador interno.
* `cognito_sub` (VARCHAR(64), UNIQUE, NULL): Identificador único emitido por AWS Cognito User Pool.
* `email` (VARCHAR(150), UNIQUE, NOT NULL): Correo electrónico corporativo.
* `password_hash` (VARCHAR(255), NULL): Hash seguro de contraseña (para autenticación directa o respaldo).
* `nombre` (VARCHAR(100), NOT NULL): Nombre del colaborador.
* `apellido` (VARCHAR(100), NOT NULL): Apellidos.
* `telefono` (VARCHAR(25), NULL): Celular de contacto de guardia.
* `departamento_id` (INT, NOT NULL, FK -> `departamentos.id` ON DELETE RESTRICT).
* `rol_id` (INT, NOT NULL, FK -> `roles.id` ON DELETE RESTRICT).
* `is_active` (BOOLEAN, DEFAULT TRUE).
* `ultimo_login` (TIMESTAMP, NULL).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).
* `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP).

---

### Módulo 2: Clientes SaaS y Cuentas Comerciales (4 Tablas)

#### 6. `planes_suscripcion`
Planes de servicio SaaS contratables en TuNegocio.pe.
* `id` (INT, PK, AUTO_INCREMENT).
* `codigo` (VARCHAR(30), UNIQUE, NOT NULL): `STARTER`, `PROFESSIONAL`, `ENTERPRISE`, `CUSTOM`.
* `nombre` (VARCHAR(100), NOT NULL).
* `precio_mensual` (DECIMAL(10,2), DEFAULT 0.00).
* `limite_usuarios` (INT, DEFAULT 5).
* `sla_horas_resolucion` (INT, DEFAULT 24): Horas máximas de atención comprometidas por contrato.
* `is_active` (BOOLEAN, DEFAULT TRUE).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 7. `clientes_saas`
Empresas usuarias que contratan el software SaaS.
* `id` (INT, PK, AUTO_INCREMENT).
* `ruc` (VARCHAR(11), UNIQUE, NOT NULL): Identificación fiscal en Perú.
* `razon_social` (VARCHAR(150), NOT NULL): Razón social registrada.
* `nombre_comercial` (VARCHAR(150), NULL).
* `plan_id` (INT, NOT NULL, FK -> `planes_suscripcion.id` ON DELETE RESTRICT).
* `monto_anual_contratado` (DECIMAL(12,2), DEFAULT 0.00): Valor del cliente (ARR) para priorización.
* `estado_cuenta` (VARCHAR(20), DEFAULT 'ACTIVO'): `ACTIVO`, `SUSPENDIDO`, `PRUEBA`, `CANCELADO`.
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).
* `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP).

#### 8. `contactos_cliente`
Personas autorizadas por cada cliente SaaS.
* `id` (INT, PK, AUTO_INCREMENT).
* `cliente_id` (INT, NOT NULL, FK -> `clientes_saas.id` ON DELETE CASCADE).
* `nombre` (VARCHAR(100), NOT NULL).
* `cargo` (VARCHAR(100), NULL).
* `email` (VARCHAR(150), NOT NULL).
* `telefono` (VARCHAR(25), NULL).
* `es_principal` (BOOLEAN, DEFAULT FALSE).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 9. `notas_cliente`
Anotaciones internas entre Soporte, Ventas y Cobranzas.
* `id` (INT, PK, AUTO_INCREMENT).
* `cliente_id` (INT, NOT NULL, FK -> `clientes_saas.id` ON DELETE CASCADE).
* `usuario_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `tipo_nota` (VARCHAR(30), DEFAULT 'GENERAL'): `SOPORTE`, `COMERCIAL`, `COBRANZA`, `GENERAL`.
* `nota` (TEXT, NOT NULL).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

---

### Módulo 3: Gestión de Incidentes Técnicos (Core Transaccional - 7 Tablas)

#### 10. `prioridades`
Niveles de severidad y SLA.
* `id` (INT, PK, AUTO_INCREMENT).
* `codigo` (VARCHAR(10), UNIQUE, NOT NULL): `P1`, `P2`, `P3`, `P4`.
* `nombre` (VARCHAR(50), NOT NULL): `Crítica / Servicio Caído`, `Alta`, `Media`, `Baja`.
* `tiempo_max_respuesta_min` (INT, NOT NULL): Ej. 15 minutos en P1.
* `tiempo_max_resolucion_horas` (INT, NOT NULL): Ej. 4 horas en P1.
* `color_hex` (VARCHAR(7), NOT NULL): Código hexadecimal para UI (`#EF4444`, `#F59E0B`, `#EAB308`, `#3B82F6`).
* `orden` (INT, NOT NULL DEFAULT 1).

#### 11. `estados_ticket`
Flujo de vida del ticket.
* `id` (INT, PK, AUTO_INCREMENT).
* `codigo` (VARCHAR(30), UNIQUE, NOT NULL): `NUEVO`, `EN_DIAGNOSTICO`, `EN_DESARROLLO`, `EN_QA`, `RESUELTO`, `CERRADO`.
* `nombre` (VARCHAR(50), NOT NULL).
* `color_hex` (VARCHAR(7), NOT NULL).
* `es_final` (BOOLEAN, DEFAULT FALSE).
* `orden` (INT, NOT NULL DEFAULT 1).

#### 12. `categorias_incidencia`
Tipificación técnica de las fallas reportadas.
* `id` (INT, PK, AUTO_INCREMENT).
* `codigo` (VARCHAR(30), UNIQUE, NOT NULL): `FIRMA_ELECTRONICA`, `BASE_DE_DATOS`, `AUTENTICACION`, `IMPRESION`, `API`, `OTRO`.
* `nombre` (VARCHAR(100), NOT NULL).
* `descripcion` (VARCHAR(255), NULL).
* `is_active` (BOOLEAN, DEFAULT TRUE).

#### 13. `tickets`
Entidad principal del sistema.
* `id` (INT, PK, AUTO_INCREMENT).
* `codigo` (VARCHAR(25), UNIQUE, NOT NULL): Ej. `INC-2026-001`.
* `cliente_id` (INT, NOT NULL, FK -> `clientes_saas.id` ON DELETE RESTRICT).
* `reportado_por_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `asignado_a_id` (INT, NULL, FK -> `usuarios_internos.id` ON DELETE SET NULL).
* `categoria_id` (INT, NOT NULL, FK -> `categorias_incidencia.id` ON DELETE RESTRICT).
* `prioridad_id` (INT, NOT NULL, FK -> `prioridades.id` ON DELETE RESTRICT).
* `estado_id` (INT, NOT NULL, FK -> `estados_ticket.id` ON DELETE RESTRICT).
* `titulo` (VARCHAR(200), NOT NULL).
* `descripcion` (TEXT, NOT NULL).
* `telefono_contacto` (VARCHAR(25), NULL).
* `canal_origen` (VARCHAR(20), NOT NULL, DEFAULT 'WEB'): Origen del registro (`WEB_ANGULAR`, `APP_MOBILE`, `API_EXTERNA`).
* `version` (INT, NOT NULL DEFAULT 1): Control de bloqueo optimista.
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).
* `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP).
* `fecha_cierre` (TIMESTAMP, NULL).

#### 14. `ticket_comentarios`
Hilo de mensajes interdepartamentales y bitácora técnica.
* `id` (INT, PK, AUTO_INCREMENT).
* `ticket_id` (INT, NOT NULL, FK -> `tickets.id` ON DELETE CASCADE).
* `usuario_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `comentario` (TEXT, NOT NULL).
* `es_privado_ti` (BOOLEAN, DEFAULT FALSE): Oculto a agentes que no sean de TI.
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 15. `ticket_adjuntos`
Archivos multimedia, capturas de pantalla y trazas de error vinculadas a Amazon S3.
* `id` (INT, PK, AUTO_INCREMENT).
* `ticket_id` (INT, NOT NULL, FK -> `tickets.id` ON DELETE CASCADE).
* `usuario_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `nombre_archivo` (VARCHAR(255), NOT NULL).
* `s3_key` (VARCHAR(500), NOT NULL).
* `s3_url` (VARCHAR(1000), NOT NULL).
* `tipo_mime` (VARCHAR(100), NOT NULL).
* `tamanio_bytes` (BIGINT, DEFAULT 0).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 16. `escalaciones_ticket`
Historial formal de transferencias de incidencias entre Soporte y Desarrollo.
* `id` (INT, PK, AUTO_INCREMENT).
* `ticket_id` (INT, NOT NULL, FK -> `tickets.id` ON DELETE CASCADE).
* `escalado_por_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `asignado_a_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `motivo_escalacion` (VARCHAR(255), NOT NULL).
* `diagnostico_inicial` (TEXT, NULL).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

---

### Módulo 4: Solicitudes de Producto y Roadmap (5 Tablas)

#### 17. `estados_sugerencia`
* `id` (INT, PK, AUTO_INCREMENT).
* `codigo` (VARCHAR(30), UNIQUE, NOT NULL): `EVALUACION`, `EN_ROADMAP`, `EN_DESARROLLO`, `DESCARTADA`, `LANZADA`.
* `nombre` (VARCHAR(50), NOT NULL).
* `orden` (INT, NOT NULL DEFAULT 1).

#### 18. `sugerencias_producto`
Feature requests y solicitudes de nuevas funciones.
* `id` (INT, PK, AUTO_INCREMENT).
* `codigo` (VARCHAR(25), UNIQUE, NOT NULL): Ej. `FEAT-2026-001`.
* `titulo` (VARCHAR(200), NOT NULL).
* `descripcion` (TEXT, NOT NULL).
* `modulo_afectado` (VARCHAR(100), NOT NULL).
* `estado_id` (INT, NOT NULL, FK -> `estados_sugerencia.id` ON DELETE RESTRICT).
* `creado_por_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).
* `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP).

#### 19. `votos_sugerencia`
Respaldo de empleados comerciales a pedidos específicos.
* `id` (INT, PK, AUTO_INCREMENT).
* `sugerencia_id` (INT, NOT NULL, FK -> `sugerencias_producto.id` ON DELETE CASCADE).
* `usuario_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `motivo_voto` (VARCHAR(255), NULL).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).
* Restricción: `UNIQUE KEY uq_sugerencia_usuario (sugerencia_id, usuario_id)`.

#### 20. `clientes_solicitantes`
Clientes específicos interesados en una mejora y su peso económico.
* `id` (INT, PK, AUTO_INCREMENT).
* `sugerencia_id` (INT, NOT NULL, FK -> `sugerencias_producto.id` ON DELETE CASCADE).
* `cliente_id` (INT, NOT NULL, FK -> `clientes_saas.id` ON DELETE CASCADE).
* `valor_anual_representado` (DECIMAL(12,2), DEFAULT 0.00).
* `origen_webhook` (VARCHAR(50), DEFAULT 'MANUAL'): `ZOHO_CRM`, `FORMULARIO`, `MANUAL`.
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).
* Restricción: `UNIQUE KEY uq_sugerencia_cliente (sugerencia_id, cliente_id)`.

#### 21. `priorizacion_sugerencia`
Matriz de impacto comercial vs esfuerzo técnico estimado.
* `id` (INT, PK, AUTO_INCREMENT).
* `sugerencia_id` (INT, UNIQUE, NOT NULL, FK -> `sugerencias_producto.id` ON DELETE CASCADE).
* `esfuerzo_ti_dias` (INT, DEFAULT 1).
* `impacto_comercial_score` (INT, DEFAULT 1): Escala de 1 a 10.
* `puntuacion_final` (DECIMAL(6,2), DEFAULT 0.00): Fórmula ponderada.
* `evaluado_por_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP).

---

### Módulo 5: Comunicados Internos, Estado y Changelog (4 Tablas)

#### 22. `tipos_comunicado`
* `id` (INT, PK, AUTO_INCREMENT).
* `codigo` (VARCHAR(30), UNIQUE, NOT NULL): `MANTENIMIENTO`, `CAIDA_SERVICIO`, `INFORMATIVO`.
* `nombre` (VARCHAR(50), NOT NULL).
* `color_hex` (VARCHAR(7), DEFAULT '#3B82F6').

#### 23. `comunicados_sistema`
Publicaciones institucionales del estado operativo.
* `id` (INT, PK, AUTO_INCREMENT).
* `tipo_id` (INT, NOT NULL, FK -> `tipos_comunicado.id` ON DELETE RESTRICT).
* `titulo` (VARCHAR(200), NOT NULL).
* `mensaje` (TEXT, NOT NULL).
* `afecta_servicio` (BOOLEAN, DEFAULT FALSE).
* `publicado_por_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `inicio_evento` (TIMESTAMP, NULL).
* `fin_estimado` (TIMESTAMP, NULL).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).
* `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP).

#### 24. `destinatarios_comunicado`
Alcance específico de los avisos.
* `id` (INT, PK, AUTO_INCREMENT).
* `comunicado_id` (INT, NOT NULL, FK -> `comunicados_sistema.id` ON DELETE CASCADE).
* `departamento_id` (INT, NULL, FK -> `departamentos.id` ON DELETE CASCADE).
* `cliente_id` (INT, NULL, FK -> `clientes_saas.id` ON DELETE CASCADE).

#### 25. `anuncios_changelog`
Notas de nuevas versiones liberadas redactadas para los usuarios.
* `id` (INT, PK, AUTO_INCREMENT).
* `version_tag` (VARCHAR(20), NOT NULL): Ej. `v1.2.0`.
* `titulo` (VARCHAR(200), NOT NULL).
* `resumen` (TEXT, NOT NULL).
* `redactado_por_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE RESTRICT).
* `fecha_lanzamiento` (DATE, NOT NULL).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

---

### Módulo 6: SLAs, Auditoría, Turnos y Notificaciones (5 Tablas)

#### 26. `metricas_ticket`
Mediciones cuantitativas para indicadores de calidad operativa.
* `id` (INT, PK, AUTO_INCREMENT).
* `ticket_id` (INT, UNIQUE, NOT NULL, FK -> `tickets.id` ON DELETE CASCADE).
* `minutos_primera_respuesta` (INT, NULL).
* `minutos_resolucion` (INT, NULL).
* `cumplio_sla_respuesta` (BOOLEAN, NULL).
* `cumplio_sla_resolucion` (BOOLEAN, NULL).

#### 27. `evaluaciones_atencion`
Calificaciones de satisfacción del soporte recibido.
* `id` (INT, PK, AUTO_INCREMENT).
* `ticket_id` (INT, UNIQUE, NOT NULL, FK -> `tickets.id` ON DELETE CASCADE).
* `puntaje_estrellas` (INT, NOT NULL): Rango de 1 a 5.
* `comentarios` (VARCHAR(500), NULL).
* `evaluado_en` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 28. `turnos_disponibilidad`
Guardias y disponibilidad del personal técnico.
* `id` (INT, PK, AUTO_INCREMENT).
* `usuario_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE CASCADE).
* `fecha_inicio` (DATETIME, NOT NULL).
* `fecha_fin` (DATETIME, NOT NULL).
* `esta_activo` (BOOLEAN, DEFAULT TRUE).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 29. `logs_actividad`
Auditoría inmutable de transacciones críticas para seguridad y compliance.
* `id` (BIGINT, PK, AUTO_INCREMENT).
* `usuario_id` (INT, NULL, FK -> `usuarios_internos.id` ON DELETE SET NULL).
* `accion` (VARCHAR(50), NOT NULL): `CREATE_TICKET`, `UPDATE_STATUS`, `ESCALATE`, `DELETE_TICKET`.
* `tabla_afectada` (VARCHAR(50), NOT NULL).
* `registro_id` (INT, NOT NULL).
* `ip_origen` (VARCHAR(45), NULL).
* `plataforma` (VARCHAR(20), NULL): Canal de ejecución (`ANGULAR_DESKTOP`, `REACT_NATIVE_ANDROID`, `REACT_NATIVE_IOS`).
* `valores_anteriores_json` (JSON, NULL).
* `valores_nuevos_json` (JSON, NULL).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

#### 30. `notificaciones_usuario`
Alertas en tiempo real para las interfaces de usuario (web/móvil).
* `id` (INT, PK, AUTO_INCREMENT).
* `usuario_id` (INT, NOT NULL, FK -> `usuarios_internos.id` ON DELETE CASCADE).
* `titulo` (VARCHAR(150), NOT NULL).
* `mensaje` (VARCHAR(500), NOT NULL).
* `tipo_evento` (VARCHAR(50), NOT NULL): `TICKET_ASIGNADO`, `SLA_POR_VENCER`, `COMUNICADO_URGENTE`.
* `leido` (BOOLEAN, DEFAULT FALSE).
* `url_destino` (VARCHAR(255), NULL).
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP).

---

## 5. Puntos Clave para la Sustentación del Proyecto (Rúbrica IDAT)

1. **Desacoplamiento:** El diseño relacional no depende de ninguna biblioteca o framework específico; puede ser consumido por Node.js/Express, Python/FastAPI, .NET 8 o Spring Boot.
2. **Escalabilidad y Seguridad:**
   * Índices B-Tree en columnas de filtrado frecuente (`codigo`, `estado_id`, `prioridad_id`, `ruc`, `created_at`).
   * Motor `InnoDB` con protección de transacciones.
   * Cero almacenamiento en texto plano de contraseñas.
3. **Solución a Problemas de Negocio Reales:**
   * Se elimina la duplicidad y desorden de solicitudes mediante códigos correlativos (`codigo`).
   * Se previene la sobreescritura de datos mediante bloqueo optimista (`version`).
   * Se cuantifica el valor monetario de las incidencias vinculando cada falla a la cuenta y plan SaaS (`monto_anual_contratado`, `sla_horas_resolucion`).
