-- ==============================================================================
-- PROYECTO DE APLICACIÓN PROFESIONAL - IDAT (VI CICLO)
-- Plataforma: PlatformOps & Product Feedback Hub (TuNegocio.pe)
-- Base de Datos: opshub_db
-- Motor: MySQL 8.4 (InnoDB / utf8mb4)
-- Descripción: Script DDL y Semilla Inicial de Catálogos (30 Tablas Normalizadas)
-- ==============================================================================

USE opshub_db;

-- ------------------------------------------------------------------------------
-- DESACTIVAR REVISIÓN DE CLAVES FORÁNEAS PARA CREACIÓN LIMPIA
-- ------------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- MÓDULO 1: CONTROL DE ACCESO, USUARIOS Y ORGANIZACIÓN (5 Tablas)
-- ------------------------------------------------------------------------------

DROP TABLE IF EXISTS roles_permisos;
DROP TABLE IF EXISTS permisos;
DROP TABLE IF EXISTS usuarios_internos;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departamentos;

CREATE TABLE departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    modulo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roles_permisos (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    CONSTRAINT fk_rp_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permiso FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios_internos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cognito_sub VARCHAR(64) NULL UNIQUE COMMENT 'UUID emitido por AWS Cognito User Pool',
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL COMMENT 'Hash local de contraseña o respaldo',
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(25) NULL,
    departamento_id INT NOT NULL,
    rol_id INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_departamento FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_usuarios_cognito (cognito_sub),
    INDEX idx_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------------------------
-- MÓDULO 2: CLIENTES SAAS Y CUENTAS COMERCIALES (4 Tablas)
-- ------------------------------------------------------------------------------

DROP TABLE IF EXISTS notas_cliente;
DROP TABLE IF EXISTS contactos_cliente;
DROP TABLE IF EXISTS clientes_saas;
DROP TABLE IF EXISTS planes_suscripcion;

CREATE TABLE planes_suscripcion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    precio_mensual DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    limite_usuarios INT NOT NULL DEFAULT 5,
    sla_horas_resolucion INT NOT NULL DEFAULT 24,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE clientes_saas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruc VARCHAR(11) NOT NULL UNIQUE,
    razon_social VARCHAR(150) NOT NULL,
    nombre_comercial VARCHAR(150) NULL,
    plan_id INT NOT NULL,
    monto_anual_contratado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    estado_cuenta VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_clientes_plan FOREIGN KEY (plan_id) REFERENCES planes_suscripcion(id) ON DELETE RESTRICT,
    INDEX idx_clientes_ruc (ruc),
    INDEX idx_clientes_estado (estado_cuenta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contactos_cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(25) NULL,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contactos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes_saas(id) ON DELETE CASCADE,
    INDEX idx_contactos_cliente_id (cliente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notas_cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_nota VARCHAR(30) NOT NULL DEFAULT 'GENERAL',
    nota TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notas_cliente FOREIGN KEY (cliente_id) REFERENCES clientes_saas(id) ON DELETE CASCADE,
    CONSTRAINT fk_notas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------------------------
-- MÓDULO 3: GESTIÓN DE INCIDENTES TÉCNICOS (7 Tablas)
-- ------------------------------------------------------------------------------

DROP TABLE IF EXISTS escalaciones_ticket;
DROP TABLE IF EXISTS ticket_adjuntos;
DROP TABLE IF EXISTS ticket_comentarios;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS categorias_incidencia;
DROP TABLE IF EXISTS estados_ticket;
DROP TABLE IF EXISTS prioridades;

CREATE TABLE prioridades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    tiempo_max_respuesta_min INT NOT NULL,
    tiempo_max_resolucion_horas INT NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#6366F1',
    orden INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE estados_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#64748B',
    es_final BOOLEAN NOT NULL DEFAULT FALSE,
    orden INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categorias_incidencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(25) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    reportado_por_id INT NOT NULL,
    asignado_a_id INT NULL,
    categoria_id INT NOT NULL,
    prioridad_id INT NOT NULL,
    estado_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    telefono_contacto VARCHAR(25) NULL,
    canal_origen VARCHAR(20) NOT NULL DEFAULT 'WEB' COMMENT 'WEB_ANGULAR, APP_MOBILE, API_EXTERNA',
    version INT NOT NULL DEFAULT 1 COMMENT 'Control de concurrencia optimista contra sobreescritura 409',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP NULL,
    CONSTRAINT fk_tickets_cliente FOREIGN KEY (cliente_id) REFERENCES clientes_saas(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tickets_reportador FOREIGN KEY (reportado_por_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tickets_asignado FOREIGN KEY (asignado_a_id) REFERENCES usuarios_internos(id) ON DELETE SET NULL,
    CONSTRAINT fk_tickets_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_incidencia(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tickets_prioridad FOREIGN KEY (prioridad_id) REFERENCES prioridades(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tickets_estado FOREIGN KEY (estado_id) REFERENCES estados_ticket(id) ON DELETE RESTRICT,
    INDEX idx_tickets_codigo (codigo),
    INDEX idx_tickets_estado (estado_id),
    INDEX idx_tickets_prioridad (prioridad_id),
    INDEX idx_tickets_asignado (asignado_a_id),
    INDEX idx_tickets_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ticket_comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    usuario_id INT NOT NULL,
    comentario TEXT NOT NULL,
    es_privado_ti BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentarios_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_comentarios_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT,
    INDEX idx_comentarios_ticket_id (ticket_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ticket_adjuntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    usuario_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_url VARCHAR(1000) NOT NULL,
    tipo_mime VARCHAR(100) NOT NULL,
    tamanio_bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_adjuntos_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_adjuntos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT,
    INDEX idx_adjuntos_ticket_id (ticket_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE escalaciones_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    escalado_por_id INT NOT NULL,
    asignado_a_id INT NOT NULL,
    motivo_escalacion VARCHAR(255) NOT NULL,
    diagnostico_inicial TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_escalaciones_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_escalaciones_escalador FOREIGN KEY (escalado_por_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_escalaciones_asignado FOREIGN KEY (asignado_a_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT,
    INDEX idx_escalaciones_ticket_id (ticket_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------------------------
-- MÓDULO 4: SOLICITUDES DE PRODUCTO Y ROADMAP (5 Tablas)
-- ------------------------------------------------------------------------------

DROP TABLE IF EXISTS priorizacion_sugerencia;
DROP TABLE IF EXISTS clientes_solicitantes;
DROP TABLE IF EXISTS votos_sugerencia;
DROP TABLE IF EXISTS sugerencias_producto;
DROP TABLE IF EXISTS estados_sugerencia;

CREATE TABLE estados_sugerencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    orden INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sugerencias_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(25) NOT NULL UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    modulo_afectado VARCHAR(100) NOT NULL,
    estado_id INT NOT NULL,
    creado_por_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sugerencias_estado FOREIGN KEY (estado_id) REFERENCES estados_sugerencia(id) ON DELETE RESTRICT,
    CONSTRAINT fk_sugerencias_creador FOREIGN KEY (creado_por_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT,
    INDEX idx_sugerencias_estado_id (estado_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE votos_sugerencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sugerencia_id INT NOT NULL,
    usuario_id INT NOT NULL,
    motivo_voto VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_sugerencia_usuario (sugerencia_id, usuario_id),
    CONSTRAINT fk_votos_sugerencia FOREIGN KEY (sugerencia_id) REFERENCES sugerencias_producto(id) ON DELETE CASCADE,
    CONSTRAINT fk_votos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE clientes_solicitantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sugerencia_id INT NOT NULL,
    cliente_id INT NOT NULL,
    valor_anual_representado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    origen_webhook VARCHAR(50) NULL DEFAULT 'MANUAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_sugerencia_cliente (sugerencia_id, cliente_id),
    CONSTRAINT fk_solicitantes_sugerencia FOREIGN KEY (sugerencia_id) REFERENCES sugerencias_producto(id) ON DELETE CASCADE,
    CONSTRAINT fk_solicitantes_cliente FOREIGN KEY (cliente_id) REFERENCES clientes_saas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE priorizacion_sugerencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sugerencia_id INT NOT NULL UNIQUE,
    esfuerzo_ti_dias INT NOT NULL DEFAULT 1,
    impacto_comercial_score INT NOT NULL DEFAULT 1,
    puntuacion_final DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    evaluado_por_id INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_priorizacion_sugerencia FOREIGN KEY (sugerencia_id) REFERENCES sugerencias_producto(id) ON DELETE CASCADE,
    CONSTRAINT fk_priorizacion_evaluador FOREIGN KEY (evaluado_por_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------------------------
-- MÓDULO 5: COMUNICADOS INTERNOS, ESTADO Y CHANGELOG (4 Tablas)
-- ------------------------------------------------------------------------------

DROP TABLE IF EXISTS destinatarios_comunicado;
DROP TABLE IF EXISTS anuncios_changelog;
DROP TABLE IF EXISTS comunicados_sistema;
DROP TABLE IF EXISTS tipos_comunicado;

CREATE TABLE tipos_comunicado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#3B82F6'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comunicados_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    afecta_servicio BOOLEAN NOT NULL DEFAULT FALSE,
    publicado_por_id INT NOT NULL,
    inicio_evento TIMESTAMP NULL,
    fin_estimado TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_comunicados_tipo FOREIGN KEY (tipo_id) REFERENCES tipos_comunicado(id) ON DELETE RESTRICT,
    CONSTRAINT fk_comunicados_publicador FOREIGN KEY (publicado_por_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE destinatarios_comunicado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comunicado_id INT NOT NULL,
    departamento_id INT NULL,
    cliente_id INT NULL,
    CONSTRAINT fk_destinatarios_comunicado FOREIGN KEY (comunicado_id) REFERENCES comunicados_sistema(id) ON DELETE CASCADE,
    CONSTRAINT fk_destinatarios_departamento FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE CASCADE,
    CONSTRAINT fk_destinatarios_cliente FOREIGN KEY (cliente_id) REFERENCES clientes_saas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE anuncios_changelog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version_tag VARCHAR(20) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    resumen TEXT NOT NULL,
    redactado_por_id INT NOT NULL,
    fecha_lanzamiento DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_changelog_redactor FOREIGN KEY (redactado_por_id) REFERENCES usuarios_internos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------------------------
-- MÓDULO 6: SLAS, AUDITORÍA, TURNOS Y NOTIFICACIONES (5 Tablas)
-- ------------------------------------------------------------------------------

DROP TABLE IF EXISTS notificaciones_usuario;
DROP TABLE IF EXISTS logs_actividad;
DROP TABLE IF EXISTS turnos_disponibilidad;
DROP TABLE IF EXISTS evaluaciones_atencion;
DROP TABLE IF EXISTS metricas_ticket;

CREATE TABLE metricas_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL UNIQUE,
    minutos_primera_respuesta INT NULL,
    minutos_resolucion INT NULL,
    cumplio_sla_respuesta BOOLEAN NULL,
    cumplio_sla_resolucion BOOLEAN NULL,
    CONSTRAINT fk_metricas_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE evaluaciones_atencion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL UNIQUE,
    puntaje_estrellas INT NOT NULL,
    comentarios VARCHAR(500) NULL,
    evaluado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evaluaciones_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE turnos_disponibilidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    esta_activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_turnos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios_internos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE logs_actividad (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    accion VARCHAR(50) NOT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id INT NOT NULL,
    ip_origen VARCHAR(45) NULL,
    plataforma VARCHAR(20) NULL COMMENT 'ANGULAR_DESKTOP, REACT_NATIVE_ANDROID, REACT_NATIVE_IOS',
    valores_anteriores_json JSON NULL,
    valores_nuevos_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios_internos(id) ON DELETE SET NULL,
    INDEX idx_logs_tabla_registro (tabla_afectada, registro_id),
    INDEX idx_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notificaciones_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje VARCHAR(500) NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    url_destino VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificaciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios_internos(id) ON DELETE CASCADE,
    INDEX idx_notificaciones_usuario_leido (usuario_id, leido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- REACTIVAR CHEQUEO DE CLAVES FORÁNEAS
SET FOREIGN_KEY_CHECKS = 1;


-- ==============================================================================
-- INSERCIÓN DE DATOS SEMILLA (CATÁLOGOS MAESTROS DE INICIO)
-- ==============================================================================

-- 1. Departamentos
INSERT INTO departamentos (codigo, nombre, descripcion) VALUES
('SOP', 'Soporte Técnico', 'Atención directa y diagnóstico de incidencias'),
('TI', 'TI & Desarrollo', 'Ingeniería de software, corrección de bugs e infraestructura'),
('VENTAS', 'Ventas Corporativas', 'Gestión de clientes comerciales y cuentas SaaS'),
('MKT', 'Marketing & Producto', 'Roadmap, priorización comercial y changelog'),
('OPS', 'Operaciones & SRE', 'Disponibilidad de plataforma y monitoreo');

-- 2. Roles
INSERT INTO roles (codigo, nombre, descripcion) VALUES
('ADMIN', 'Administrador General', 'Acceso total y configuración del sistema'),
('AGENTE_SOPORTE', 'Agente de Soporte', 'Recepción, tipificación y escalación de tickets'),
('DEV_INGENIERO', 'Ingeniero de Software / TI', 'Resolución de incidencias técnicas y estimación de mejoras'),
('EJECUTIVO_VENTAS', 'Ejecutivo de Ventas', 'Votos a sugerencias y vinculación de impacto ARR'),
('MARKETING_LEAD', 'Líder de Producto & Marketing', 'Aprobación de roadmap y publicación de changelog');

-- 3. Permisos
INSERT INTO permisos (codigo, modulo, descripcion) VALUES
('TICKET_CREATE', 'TICKETS', 'Registrar nuevas incidencias'),
('TICKET_UPDATE', 'TICKETS', 'Editar estado y prioridad de tickets'),
('TICKET_DELETE', 'TICKETS', 'Eliminar o descartar tickets'),
('TICKET_ESCALATE', 'TICKETS', 'Transferir incidencias a TI'),
('SUGGESTION_CREATE', 'FEEDBACK', 'Crear sugerencias de producto'),
('SUGGESTION_VOTE', 'FEEDBACK', 'Votar solicitudes de funciones'),
('SUGGESTION_PRIORITIZE', 'FEEDBACK', 'Calificar esfuerzo y puntaje RICE'),
('COMMUNICATION_PUBLISH', 'COMUNICADOS', 'Publicar alertas de caída o mantenimiento'),
('CHANGELOG_PUBLISH', 'CHANGELOG', 'Publicar notas de nuevas versiones');

-- 4. Planes de Suscripción SaaS
INSERT INTO planes_suscripcion (codigo, nombre, precio_mensual, limite_usuarios, sla_horas_resolucion) VALUES
('STARTER', 'Plan Inicial Emprendedor', 89.00, 3, 48),
('PROFESSIONAL', 'Plan Profesional Pyme', 249.00, 15, 24),
('ENTERPRISE', 'Plan Corporativo Enterprise', 699.00, 50, 4),
('CUSTOM', 'Plan Custom / Dedicated', 1499.00, 200, 2);

-- 5. Prioridades SLA
INSERT INTO prioridades (codigo, nombre, tiempo_max_respuesta_min, tiempo_max_resolucion_horas, color_hex, orden) VALUES
('P1', 'Crítica / Servicio Caído', 15, 4, '#EF4444', 1),
('P2', 'Alta / Bloqueo Operativo', 60, 12, '#F59E0B', 2),
('P3', 'Media / Degradación Parcial', 240, 48, '#EAB308', 3),
('P4', 'Baja / Consulta Menor', 480, 96, '#3B82F6', 4);

-- 6. Estados de Tickets
INSERT INTO estados_ticket (codigo, nombre, color_hex, es_final, orden) VALUES
('NUEVO', 'Nuevo', '#3B82F6', FALSE, 1),
('EN_DIAGNOSTICO', 'En Diagnóstico', '#8B5CF6', FALSE, 2),
('EN_DESARROLLO', 'En Desarrollo', '#F59E0B', FALSE, 3),
('EN_QA', 'En Pruebas QA', '#06B6D4', FALSE, 4),
('RESUELTO', 'Resuelto', '#10B981', TRUE, 5),
('CERRADO', 'Cerrado', '#64748B', TRUE, 6);

-- 7. Categorías de Incidencia
INSERT INTO categorias_incidencia (codigo, nombre, descripcion) VALUES
('FIRMA_ELECTRONICA', 'Firma Electrónica', 'Fallas con certificados digitales o firma XML'),
('BASE_DE_DATOS', 'Base de Datos', 'Bloqueos de registros, lentitud o timeouts'),
('AUTENTICACION', 'Autenticación & Accesos', 'Problemas de inicio de sesión o permisos'),
('IMPRESION', 'Impresión & Reportes', 'Error en generación de PDFs y tickets térmicos'),
('API', 'API & Integraciones', 'Fallas de conexión con SUNAT o pasarelas de pago'),
('OTRO', 'Otros Requerimientos', 'Consultas generales de configuración');

-- 8. Estados de Sugerencia (Roadmap)
INSERT INTO estados_sugerencia (codigo, nombre, orden) VALUES
('EVALUACION', 'En Evaluación', 1),
('EN_ROADMAP', 'En Roadmap', 2),
('EN_DESARROLLO', 'En Desarrollo', 3),
('DESCARTADA', 'Descartada', 4),
('LANZADA', 'Lanzada en Producción', 5);

-- 9. Tipos de Comunicado
INSERT INTO tipos_comunicado (codigo, nombre, color_hex) VALUES
('CAIDA_SERVICIO', 'Incidencia de Infraestructura', '#EF4444'),
('MANTENIMIENTO', 'Mantenimiento Programado', '#F59E0B'),
('INFORMATIVO', 'Actualización Informativa', '#3B82F6');
