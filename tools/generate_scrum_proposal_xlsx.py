# -*- coding: utf-8 -*-
"""
Script para generar la propuesta de distribución ágil en Scrum (Fase 02 - Actividad 02A)
para el proyecto PlatformOps & Product Feedback Hub (TuNegocio.pe - IDAT).
Distribuye los 30 Requerimientos de Usuario en 3 Sprints integrando:
- Base de Datos MySQL 8.4
- Backend .NET Core 10 (Clean Architecture)
- Aplicación Móvil React Native (Expo)
- Portal Web Corporativo Angular
"""

import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_XLSX = os.path.join(BASE_DIR, "docs", "academico", "Fase_02_Actividad_02A_Scrum_Artefactos_Ceremonias_COPIA.xlsx")
OUT_XLSX = os.path.join(BASE_DIR, "docs", "academico", "Fase_02_Actividad_02A_Scrum_Artefactos_Ceremonias_PROPUESTA_EQUIPO.xlsx")

def main():
    print(f"Cargando plantilla base: {SRC_XLSX}")
    wb = openpyxl.load_workbook(SRC_XLSX)

    # Desfusionar todas las celdas en todas las hojas para permitir manipulación limpia
    for sname in wb.sheetnames:
        ws = wb[sname]
        for mr in list(ws.merged_cells.ranges):
            ws.unmerge_cells(range_string=str(mr))
        for r in range(1, max(ws.max_row + 1, 80)):
            for c in range(1, max(ws.max_column + 1, 20)):
                cell = ws.cell(r, c)
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

    # Estilos globales
    font_title = Font(name="Arial", size=14, bold=True, color="002060")
    font_section = Font(name="Arial", size=11, bold=True, color="FFFFFF")
    font_header = Font(name="Arial", size=10, bold=True, color="002060")
    font_bold = Font(name="Arial", size=10, bold=True, color="000000")
    font_normal = Font(name="Arial", size=9, color="000000")
    font_small = Font(name="Arial", size=8, color="555555")

    fill_header_dark = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    fill_header_light = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    fill_sprint1 = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid") # Azul suave
    fill_sprint2 = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid") # Verde suave
    fill_sprint3 = PatternFill(start_color="FCE4D6", end_color="FCE4D6", fill_type="solid") # Naranja suave
    fill_zebra = PatternFill(start_color="F9FBFD", end_color="F9FBFD", fill_type="solid")

    thin_border_side = Side(border_style="thin", color="B0C4DE")
    border_box = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    thick_bottom = Border(bottom=Side(border_style="medium", color="1F4E79"))

    align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
    align_left = Alignment(horizontal="left", vertical="center", wrap_text=True)
    align_right = Alignment(horizontal="right", vertical="center")

    # =========================================================================
    # 1. PESTAÑA: Presentación
    # =========================================================================
    print("Configurando pestaña: Presentación...")
    ws_pres = wb["Presentación"]
    ws_pres.views.sheetView[0].showGridLines = True

    # Encabezado institucional
    ws_pres["B2"] = "PROYECTO DE APLICACIÓN EMPRESARIAL - VI CICLO"
    ws_pres["B2"].font = Font(name="Arial", size=11, bold=True, color="1F4E79")

    ws_pres["B3"] = "PlatformOps & Product Feedback Hub — Sistema de Soporte y Solicitudes Internas"
    ws_pres["B3"].font = font_title

    ws_pres["B4"] = "Empresa Aplicativa: TuNegocio.pe | Instituto de Educación Superior IDAT"
    ws_pres["B4"].font = Font(name="Arial", size=10, italic=True, color="555555")

    # Tabla de Participantes y Roles Scrum
    ws_pres["B6"] = "PARTICIPANTES Y ROLES EN EL EQUIPO SCRUM"
    ws_pres["B6"].font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
    for col_idx in range(2, 7):
        ws_pres.cell(6, col_idx).fill = fill_header_dark

    headers_pres = ["Rol Scrum", "Apellidos y Nombres", "Especialidad Técnica Principal", "Dedicación Semanal"]
    col_letters = ["B", "C", "D", "E"]
    for i, h in enumerate(headers_pres):
        cell = ws_pres.cell(7, i + 2, h)
        cell.font = font_header
        cell.fill = fill_header_light
        cell.alignment = align_center
        cell.border = border_box

    participantes_data = [
        ("Product Owner (PO)", "Monroy Gutiérrez, Henry Raul", "Lógica de Negocio, Backend .NET Core 10 & API Gateway", "14 horas/sem"),
        ("Scrum Master (SM)", "Sánchez Peña, Eduardo Enrique", "Arquitectura Fullstack, Concurrencia Optimista & DevOps", "14 horas/sem"),
        ("Developer / Dev Team", "Cahuana Ccallocunto, Aldair Santos", "Frontend Mobile (React Native / Expo) & Componentes UI", "14 horas/sem"),
        ("Developer / Dev Team", "Morales Quiroga, Josue David", "Base de Datos MySQL 8.4, Vistas Analíticas & Frontend Web Angular", "14 horas/sem"),
    ]

    for row_idx, data in enumerate(participantes_data, start=8):
        for col_idx, val in enumerate(data, start=2):
            cell = ws_pres.cell(row_idx, col_idx, val)
            cell.font = font_bold if col_idx == 2 or col_idx == 3 else font_normal
            cell.alignment = align_center if col_idx in [2, 5] else align_left
            cell.border = border_box
            if row_idx % 2 == 0:
                cell.fill = fill_zebra

    # Resumen Arquitectónico Multicapa
    ws_pres["B13"] = "ARQUITECTURA MULTIPROYECTO Y PILA TECNOLÓGICA (ROADMAP TÉCNICO)"
    ws_pres["B13"].font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
    for col_idx in range(2, 7):
        ws_pres.cell(13, col_idx).fill = fill_header_dark

    arqui_data = [
        ("1. Base de Datos", "MySQL 8.4 Server / Amazon RDS", "30 tablas normalizadas (1FN-3FN), collation utf8mb4_unicode_ci, triggers de auditoría e integridad referencial estricta."),
        ("2. Backend API", ".NET Core 10 (Clean Architecture)", "Domain, Application, Infrastructure y API con ASP.NET Core, CQRS con MediatR, Entity Framework Core y Pomelo MySQL."),
        ("3. Aplicación Móvil", "React Native + Expo SDK 58 + TypeScript", "Dark Mode UI, estado reactivo con useReducer y Context API, soporte offline en memoria y sincronización REST."),
        ("4. Portal Web", "Angular (TypeScript)", "Portal corporativo para administración de catálogos SaaS, Dashboard operativo de turno, Roadmap Kanban y analítica SLA.")
    ]

    for i, h in enumerate(["Capa Arquitectónica", "Tecnología / Framework", "Alcance y Responsabilidad Técnica"]):
        cell = ws_pres.cell(14, i + 2, h)
        cell.font = font_header
        cell.fill = fill_header_light
        cell.alignment = align_center
        cell.border = border_box

    for row_idx, data in enumerate(arqui_data, start=15):
        for col_idx, val in enumerate(data, start=2):
            cell = ws_pres.cell(row_idx, col_idx, val)
            cell.font = font_bold if col_idx == 2 else font_normal
            cell.alignment = align_left
            cell.border = border_box
            if row_idx % 2 == 0:
                cell.fill = fill_zebra

    # Ajuste de anchos en Presentación
    ws_pres.column_dimensions["B"].width = 24
    ws_pres.column_dimensions["C"].width = 34
    ws_pres.column_dimensions["D"].width = 38
    ws_pres.column_dimensions["E"].width = 50
    ws_pres.column_dimensions["F"].width = 18

    # =========================================================================
    # 2. PESTAÑA: Requerimientos de Usuario
    # =========================================================================
    print("Configurando pestaña: Requerimientos de Usuario...")
    ws_ru = wb["Requerimientos de Usuario"]
    ws_ru.views.sheetView[0].showGridLines = True

    ws_ru["B2"] = "MATRIZ DE REQUERIMIENTOS DE USUARIO (RU) Y TRAZABILIDAD TÉCNICA"
    ws_ru["B2"].font = font_title

    ws_ru["B3"] = "Clasificación oficial según formato IDAT, componente técnico ejecutable y asignación de Sprint"
    ws_ru["B3"].font = Font(name="Arial", size=10, italic=True, color="555555")

    ru_headers = ["Código", "Descripción del Requerimiento de Usuario", "Categoría IDAT", "Capa Técnica de Ejecución", "Sprint Asignado", "Estado"]
    for i, h in enumerate(ru_headers):
        cell = ws_ru.cell(5, i + 2, h)
        cell.font = font_section
        cell.fill = fill_header_dark
        cell.alignment = align_center
        cell.border = border_box

    # Los 30 requerimientos del usuario
    ru_list = [
        ("RU01", "El empleado de la empresa debe poder iniciar sesión con su correo corporativo y contraseña para acceder a las herramientas de su área de forma segura.", "Presentación", "Backend .NET (JWT) / Mobile React Native / Web Angular", "Sprint 1", "Planificado"),
        ("RU02", "El nuevo colaborador debe poder registrar su cuenta seleccionando su departamento (Soporte, TI/Desarrollo, Ventas, Marketing) para recibir las atribuciones de su rol.", "Presentación", "Base de Datos MySQL / Backend .NET / Mobile & Web", "Sprint 1", "Planificado"),
        ("RU03", "El empleado debe disponer de una sesión persistente y protegida en su teléfono para no tener que ingresar sus credenciales en cada uso.", "Presentación", "Mobile React Native (SecureStore / LocalStorage)", "Sprint 1", "Planificado"),
        ("RU04", "El usuario debe poder consultar su perfil y roles asignados, con la opción de actualizar su contraseña periódicamente.", "Presentación", "Backend .NET / Mobile React Native / Web Angular", "Sprint 1", "Planificado"),
        ("RU05", "El administrador debe poder mantener el catálogo de empresas clientes de la plataforma SaaS, registrando su plan contratado y estado comercial.", "Tablas maestras", "Base de Datos MySQL / Backend .NET / Web Angular", "Sprint 2", "Planificado"),
        ("RU06", "El personal interno debe poder consultar la lista de contactos autorizados por cada empresa cliente para validar la legitimidad de un reporte.", "Tablas maestras", "Base de Datos MySQL / Backend .NET / Web Angular", "Sprint 2", "Planificado"),
        ("RU07", "El equipo técnico debe contar con un catálogo estandarizado de tipos de falla (Autenticación, Firma Electrónica, Base de Datos, APIs) para categorizar los problemas.", "Tablas maestras", "Base de Datos MySQL / Backend .NET / Mobile React Native", "Sprint 1", "Planificado"),
        ("RU08", "Los colaboradores deben contar con niveles de severidad predefinidos (P1 a P4) para distinguir fallas críticas que paralizan a un cliente de detalles menores.", "Tablas maestras", "Base de Datos MySQL / Mobile React Native (Badges)", "Sprint 1", "Planificado"),
        ("RU09", "El agente de soporte debe poder registrar incidencias técnicas reportadas por clientes SaaS, indicando el problema, cliente afectado y nivel de urgencia.", "TRANSACCIONES", "Base de Datos MySQL / Backend .NET / Mobile React Native", "Sprint 1", "Planificado"),
        ("RU10", "El usuario debe poder adjuntar capturas de pantalla tomadas desde su teléfono para documentar el error técnico ante los desarrolladores.", "TRANSACCIONES", "Mobile React Native (ImagePicker) / Storage S3", "Sprint 1", "Planificado"),
        ("RU11", "El desarrollador de TI debe poder actualizar el estado de una incidencia (En Diagnóstico, En Desarrollo, Resuelto) asegurando que sus cambios no sobreescriban notas hechas por otro colega al mismo tiempo.", "TRANSACCIONES", "Base de Datos MySQL / Backend .NET (HTTP 409) / Mobile", "Sprint 1", "Planificado"),
        ("RU12", "El agente de soporte debe poder escalar formalmente un ticket al equipo de programadores cuando el problema requiere intervención en el código fuente.", "TRANSACCIONES", "Backend .NET / Web Angular / Mobile React Native", "Sprint 2", "Planificado"),
        ("RU13", "El personal de cualquier área debe poder agregar comentarios y aclaraciones técnicas en el historial de la incidencia.", "TRANSACCIONES", "Base de Datos MySQL / Backend .NET / Mobile & Web", "Sprint 2", "Planificado"),
        ("RU14", "El ejecutivo de ventas debe poder registrar pedidos de nuevas funciones (Feature Requests) solicitadas por clientes durante sus reuniones comerciales.", "TRANSACCIONES", "Base de Datos MySQL / Backend .NET / Web Angular", "Sprint 2", "Planificado"),
        ("RU15", "Los colaboradores de Ventas y Marketing deben poder votar y respaldar solicitudes de clientes para impulsar su desarrollo en el producto.", "TRANSACCIONES", "Backend .NET / Web Angular", "Sprint 2", "Planificado"),
        ("RU16", "El usuario debe recibir avisos y actualizaciones inmediatas en su pantalla cuando un ticket cambie de estado, sin tener que recargar manualmente la app.", "Procesos", "Backend .NET (SignalR / WebSockets) / Mobile & Web", "Sprint 3", "Planificado"),
        ("RU17", "El equipo de producto debe ver reflejado automáticamente el impacto económico ($ contratado) en las sugerencias de mejora cuando Ventas registre un pedido en Zoho CRM.", "Procesos", "Backend .NET (Zoho CRM Webhook) / BD MySQL", "Sprint 3", "Planificado"),
        ("RU18", "El personal de soporte y TI debe ser alertado automáticamente cuando un ticket esté próximo a vencer el tiempo límite de atención pactado (SLA).", "Procesos", "Backend .NET (Background Worker) / Mobile & Web Push", "Sprint 3", "Planificado"),
        ("RU19", "El líder de producto debe contar con una priorización automática que clasifique las mejoras considerando el valor de los clientes vs. la dificultad técnica estimada por TI.", "Procesos", "Backend .NET (Algoritmo Matriz Valor/Esfuerzo) / Web", "Sprint 3", "Planificado"),
        ("RU20", "El personal técnico debe disponer de una bandeja de incidencias con filtros rápidos por urgencia y buscador para localizar tickets inmediatamente.", "Listados", "Mobile React Native (TicketListScreen) / Web Angular", "Sprint 1", "Planificado"),
        ("RU21", "El colaborador debe visualizar un tablero principal (Dashboard) que resuma los incidentes abiertos y las prioridades de atención de su turno.", "Listados", "Web Angular (Dashboard) / Mobile React Native (HomeScreen)", "Sprint 2", "Planificado"),
        ("RU22", "El equipo de desarrollo debe poder consultar una lista exclusiva de los tickets técnicos asignados a su persona.", "Listados", "Backend .NET / Mobile React Native / Web Angular", "Sprint 2", "Planificado"),
        ("RU23", "El área comercial debe poder revisar el catálogo de clientes SaaS con sus notas internas sobre comportamiento o riesgo de cancelación.", "Consultas", "Base de Datos MySQL / Web Angular (Vista CRM)", "Sprint 2", "Planificado"),
        ("RU24", "El equipo de marketing y producto debe disponer de una vista del Roadmap con las funciones en evaluación, desarrollo y lanzamiento.", "Consultas", "Web Angular (Kanban Roadmap) / Mobile React Native", "Sprint 3", "Planificado"),
        ("RU25", "El supervisor de soporte debe poder consultar indicadores de cumplimiento de tiempos de respuesta y resolución por cada tipo de cliente.", "Consultas", "Base de Datos MySQL (Vistas analíticas) / Web Angular", "Sprint 3", "Planificado"),
        ("RU26", "El programador debe poder inspeccionar a detalle los archivos adjuntos y trazas de logs asociados a un incidente para reproducir la falla.", "Consultas", "Mobile React Native / Web Angular / S3 Storage", "Sprint 2", "Planificado"),
        ("RU27", "El ejecutivo de ventas debe poder consultar el historial de incidencias y solicitudes pasadas de un cliente antes de una reunión de renovación.", "Consultas", "Base de Datos MySQL / Web Angular (Ficha 360)", "Sprint 3", "Planificado"),
        ("RU28", "El equipo de TI debe poder publicar avisos urgentes sobre caídas de infraestructura y mantenimientos programados para toda la organización.", "Otros", "Backend .NET / Web Angular / Mobile React Native (Banner)", "Sprint 3", "Planificado"),
        ("RU29", "El equipo de marketing debe poder publicar notas de versión (Changelogs) para que toda la empresa conozca las nuevas funciones liberadas.", "Otros", "Backend .NET / Web Angular / Mobile React Native", "Sprint 3", "Planificado"),
        ("RU30", "El auditor debe poder revisar el registro histórico inmutable de quién modificó cada ticket, a qué hora y qué datos fueron alterados.", "Otros", "Base de Datos MySQL (auditoria_logs Triggers) / Web", "Sprint 3", "Planificado")
    ]

    for row_idx, rdata in enumerate(ru_list, start=6):
        for col_idx, val in enumerate(rdata, start=2):
            cell = ws_ru.cell(row_idx, col_idx, val)
            cell.font = font_bold if col_idx in [2, 6] else font_normal
            cell.alignment = align_center if col_idx in [2, 6, 7] else align_left
            cell.border = border_box

            # Colorear según Sprint
            sprint_tag = rdata[4]
            if col_idx == 6:
                if sprint_tag == "Sprint 1":
                    cell.fill = fill_sprint1
                elif sprint_tag == "Sprint 2":
                    cell.fill = fill_sprint2
                elif sprint_tag == "Sprint 3":
                    cell.fill = fill_sprint3
            elif row_idx % 2 == 1:
                cell.fill = fill_zebra

    ws_ru.column_dimensions["B"].width = 12
    ws_ru.column_dimensions["C"].width = 60
    ws_ru.column_dimensions["D"].width = 20
    ws_ru.column_dimensions["E"].width = 44
    ws_ru.column_dimensions["F"].width = 16
    ws_ru.column_dimensions["G"].width = 14

    # =========================================================================
    # 3. PESTAÑA: Product Backlog Priorizado
    # =========================================================================
    print("Configurando pestaña: Product Backlog Priorizado...")
    ws_pb = wb["Product Backlog Priorizado"]
    ws_pb.views.sheetView[0].showGridLines = True

    ws_pb["B2"] = "PRODUCT BACKLOG PRIORIZADO Y ESTIMADO (HISTORIAS DE USUARIO)"
    ws_pb["B2"].font = font_title

    ws_pb["B3"] = "Formato estándar: Como [rol] / Quiero [funcionalidad] / Para [beneficio de negocio] | Estimación en Story Points (Fibonacci)"
    ws_pb["B3"].font = Font(name="Arial", size=10, italic=True, color="555555")

    pb_headers = ["Sprint", "PB_ID", "Descripción de la Historia de Usuario (Como / Quiero / Para)", "Prioridad", "Estimación (SP)", "Capa Arquitectónica", "RU Origen"]
    for i, h in enumerate(pb_headers):
        cell = ws_pb.cell(5, i + 1, h)
        cell.font = font_section
        cell.fill = fill_header_dark
        cell.alignment = align_center
        cell.border = border_box

    # 30 Historias de Usuario
    hu_list = [
        # SPRINT 1 (10 HUs)
        ("Sprint 1", "HU01", "Como empleado corporativo, quiero iniciar sesión con mi correo institucional y contraseña, para acceder de forma autenticada y segura a las herramientas de mi área.", "Alta", 5, "Backend .NET (JWT) / Mobile / Web", "RU01"),
        ("Sprint 1", "HU02", "Como nuevo colaborador, quiero registrar mi cuenta especificando mi departamento (Soporte, TI, Ventas, Marketing), para que el sistema me asigne automáticamente los permisos de mi rol.", "Alta", 5, "Base de Datos MySQL / Backend / Mobile", "RU02"),
        ("Sprint 1", "HU03", "Como usuario móvil, quiero mantener una sesión persistente y cifrada en mi teléfono, para acceder directamente al portal sin reingresar mis credenciales.", "Media", 3, "Mobile React Native (SecureStore)", "RU03"),
        ("Sprint 1", "HU04", "Como colaborador activo, quiero visualizar mi perfil y actualizar mi contraseña de acceso, para mantener la integridad y confidencialidad de mi cuenta.", "Media", 3, "Backend .NET / Mobile / Web", "RU04"),
        ("Sprint 1", "HU05", "Como analista de soporte, quiero clasificar las incidencias seleccionando el tipo de servicio desde un catálogo predefinido (Firma, BD, API, etc.), para estandarizar el diagnóstico inicial.", "Alta", 3, "Base de Datos MySQL / Mobile React Native", "RU07"),
        ("Sprint 1", "HU06", "Como operador técnico, quiero clasificar cada reporte según niveles de severidad de P1 a P4, para priorizar inmediatamente los incidentes que paralizan a los clientes SaaS.", "Alta", 3, "Base de Datos MySQL / Mobile React Native", "RU08"),
        ("Sprint 1", "HU07", "Como agente de soporte, quiero registrar incidencias técnicas indicando empresa cliente, problema y urgencia, para generar la orden formal de atención.", "Muy Alta", 8, "Base de Datos MySQL / Backend / Mobile", "RU09"),
        ("Sprint 1", "HU08", "Como colaborador reportante, quiero adjuntar capturas de pantalla del error desde la cámara o galería del teléfono, para suministrar evidencia visual inmediata a los programadores.", "Alta", 5, "Mobile React Native / Amazon S3", "RU10"),
        ("Sprint 1", "HU09", "Como desarrollador de TI, quiero actualizar el estado del ticket con detección de concurrencia optimista, para garantizar que mis cambios no sobreescriban notas de otros colegas.", "Muy Alta", 8, "Backend .NET (HTTP 409) / Mobile & Web", "RU11"),
        ("Sprint 1", "HU10", "Como personal técnico, quiero consultar una bandeja de tickets con filtros por urgencia y buscador de texto, para ubicar cualquier caso crítico de forma inmediata.", "Alta", 5, "Mobile React Native / Web Angular", "RU20"),

        # SPRINT 2 (10 HUs)
        ("Sprint 2", "HU11", "Como administrador de operaciones, quiero mantener el catálogo de empresas clientes SaaS y sus planes contratados, para validar la procedencia de cada reporte técnico.", "Alta", 5, "Base de Datos MySQL / Web Angular", "RU05"),
        ("Sprint 2", "HU12", "Como agente de soporte, quiero consultar los contactos autorizados por cada empresa, para asegurarme de que quien reporta la incidencia está facultado por el cliente.", "Media", 3, "Base de Datos MySQL / Backend / Web", "RU06"),
        ("Sprint 2", "HU13", "Como agente de soporte, quiero escalar formalmente tickets de soporte al área de desarrollo de software, para transferir la atención cuando se requiere cambio de código.", "Alta", 5, "Backend .NET / Web Angular / Mobile", "RU12"),
        ("Sprint 2", "HU14", "Como colaborador asignado, quiero agregar comentarios y notas técnicas en la bitácora del ticket, para registrar el avance de la solución de forma colaborativa.", "Alta", 5, "Base de Datos MySQL / Backend / Mobile", "RU13"),
        ("Sprint 2", "HU15", "Como ejecutivo de ventas, quiero registrar pedidos de nuevas funciones (Feature Requests) surgidos en reuniones con clientes, para alimentar la cartera de producto.", "Alta", 5, "Base de Datos MySQL / Backend / Web Angular", "RU14"),
        ("Sprint 2", "HU16", "Como colaborador comercial o de marketing, quiero votar y respaldar solicitudes de nuevas funciones, para visibilizar las características más solicitadas por el mercado.", "Media", 3, "Backend .NET / Web Angular", "RU15"),
        ("Sprint 2", "HU17", "Como supervisor del área, quiero visualizar un Dashboard principal con métricas resumidas y prioridades de turno, para coordinar la carga de trabajo diaria.", "Alta", 8, "Web Angular / Mobile React Native", "RU21"),
        ("Sprint 2", "HU18", "Como programador de TI, quiero consultar una bandeja exclusiva con los tickets asignados a mi persona, para enfocarme en resolver mis tareas técnicas.", "Alta", 5, "Backend .NET / Mobile React Native / Web", "RU22"),
        ("Sprint 2", "HU19", "Como asesor comercial, quiero revisar el historial de notas de riesgo y comportamiento de cada cliente, para prevenir cancelaciones de suscripción (churn).", "Media", 5, "Base de Datos MySQL / Web Angular", "RU23"),
        ("Sprint 2", "HU20", "Como ingeniero de soporte, quiero inspeccionar a fondo archivos adjuntos y trazas de logs de un incidente, para reproducir y diagnosticar la causa raíz del error.", "Media", 5, "Mobile / Web Angular / S3 Storage", "RU26"),

        # SPRINT 3 (10 HUs)
        ("Sprint 3", "HU21", "Como usuario de la app, quiero recibir alertas reactivas en pantalla al cambiar el estado de un ticket, para informarme al instante sin necesidad de recargar la aplicación.", "Media", 5, "Backend .NET (SignalR) / Mobile & Web", "RU16"),
        ("Sprint 3", "HU22", "Como Product Manager, quiero que las sugerencias de mejora sincronicen automáticamente el valor económico ($) desde Zoho CRM, para evaluar el impacto comercial real.", "Alta", 8, "Backend .NET (CRM Webhook) / BD MySQL", "RU17"),
        ("Sprint 3", "HU23", "Como responsable de servicio, quiero recibir avisos automáticos cuando un ticket esté próximo a vencer su tiempo límite (SLA), para intervenir antes de penalizaciones.", "Muy Alta", 5, "Backend .NET (Worker) / Mobile Push", "RU18"),
        ("Sprint 3", "HU24", "Como Product Owner, quiero disponer de un algoritmo de priorización automática (Valor de Negocio vs. Esfuerzo de TI), para ordenar el roadmap de producto objetivamente.", "Alta", 8, "Backend .NET / Web Angular", "RU19"),
        ("Sprint 3", "HU25", "Como equipo de marketing y producto, quiero visualizar el Roadmap interactivo en fases (Evaluación, Desarrollo, Lanzamiento), para comunicar transparentemente el avance.", "Alta", 5, "Web Angular (Kanban Roadmap)", "RU24"),
        ("Sprint 3", "HU26", "Como supervisor de calidad, quiero consultar indicadores de cumplimiento de SLA y tiempos de resolución por segmento de cliente, para tomar decisiones de mejora continua.", "Alta", 8, "Base de Datos MySQL / Web Angular", "RU25"),
        ("Sprint 3", "HU27", "Como ejecutivo de ventas, quiero consultar la ficha 360 con todo el historial de soporte de un cliente antes de una reunión de renovación, para negociar con contexto.", "Media", 5, "Base de Datos MySQL / Web Angular", "RU27"),
        ("Sprint 3", "HU28", "Como administrador de sistemas, quiero publicar comunicados urgentes sobre mantenimientos y caídas de infraestructura, para alertar a toda la organización.", "Media", 3, "Backend .NET / Web Angular / Mobile", "RU28"),
        ("Sprint 3", "HU29", "Como equipo de marketing, quiero redactar y publicar notas de versión (Changelogs), para que los clientes internos y externos conozcan las funciones recién liberadas.", "Media", 3, "Backend .NET / Web Angular / Mobile", "RU29"),
        ("Sprint 3", "HU30", "Como oficial de seguridad y auditoría, quiero auditar un registro inmutable de cada cambio realizado en los tickets (quién, cuándo y qué campos variaron), para fines normativos.", "Alta", 5, "Base de Datos MySQL (Triggers) / Web", "RU30")
    ]

    current_row = 6
    for hdata in hu_list:
        sprint_name, pbid, desc, prio, sp, capa, ru_src = hdata

        ws_pb.cell(current_row, 1, sprint_name).alignment = align_center
        ws_pb.cell(current_row, 2, pbid).alignment = align_center
        ws_pb.cell(current_row, 3, desc).alignment = align_left
        ws_pb.cell(current_row, 4, prio).alignment = align_center
        ws_pb.cell(current_row, 5, sp).alignment = align_center
        ws_pb.cell(current_row, 6, capa).alignment = align_left
        ws_pb.cell(current_row, 7, ru_src).alignment = align_center

        for col_idx in range(1, 8):
            c = ws_pb.cell(current_row, col_idx)
            c.border = border_box
            c.font = font_bold if col_idx in [1, 2, 4, 5, 7] else font_normal

            if sprint_name == "Sprint 1":
                if col_idx == 1: c.fill = fill_sprint1
            elif sprint_name == "Sprint 2":
                if col_idx == 1: c.fill = fill_sprint2
            elif sprint_name == "Sprint 3":
                if col_idx == 1: c.fill = fill_sprint3

            if col_idx > 1 and current_row % 2 == 1:
                c.fill = fill_zebra

        current_row += 1

    ws_pb.column_dimensions["A"].width = 14
    ws_pb.column_dimensions["B"].width = 10
    ws_pb.column_dimensions["C"].width = 65
    ws_pb.column_dimensions["D"].width = 14
    ws_pb.column_dimensions["E"].width = 16
    ws_pb.column_dimensions["F"].width = 38
    ws_pb.column_dimensions["G"].width = 12

    # =========================================================================
    # 4. PESTAÑA: 1.0 Ceremonia Sprint Planning
    # =========================================================================
    print("Configurando pestaña: 1.0 Ceremonia Sprint Planning...")
    ws_sp = wb["1.0 Ceremonia Sprint Planning"]
    ws_sp.views.sheetView[0].showGridLines = True

    ws_sp["B2"] = "CEREMONIA DE SPRINT PLANNING Y DESCOMPOSICIÓN DE TAREAS MULTICAPA"
    ws_sp["B2"].font = font_title

    ws_sp["B3"] = "Planificación para los 3 Sprints integrando Base de Datos MySQL, Backend .NET, Web Angular y Mobile React Native"
    ws_sp["B3"].font = Font(name="Arial", size=10, italic=True, color="555555")

    # Columnas oficiales IDAT:
    # B: SPRINT | C: META Funcionando al 100% | D: ID_SPB | E: Nombre del SPB | F: ID_Tarea | G: Descripción Descomposición Tareas | H: Tipo Tarea | I: Estimación (h) | J: Responsable | K: Fecha Inicio | L: Fecha Fin | M: RESULTADO
    sp_headers = ["SPRINT", "META Funcionando al 100% (Sprint Goal)", "ID_SPB", "Nombre del SPB", "ID_Tarea", "Descripción de la Descomposición de Tareas Técnicas", "Tipo Tarea", "Estimación (h)", "Responsable", "Fecha Inicio", "Fecha Fin", "RESULTADO"]

    # Definir estructura de tareas por Sprint
    sprints_plan = [
        {
            "sprint_name": "Sprint 1",
            "fill_header": fill_sprint1,
            "goal": "Construir el núcleo del sistema con el esquema relacional de base de datos MySQL (30 tablas), servicios de autenticación y tickets en Backend .NET, y la aplicación móvil React Native funcional con CRUD y filtros en memoria.",
            "dates": ("21/09/2026", "16/10/2026"),
            "items": [
                ("HU01", "Acceso Seguro con JWT", [
                    ("T1.1", "Base de Datos: Diseño y creación de tablas 'usuarios', 'roles' y 'credenciales' con constraints.", "Base de Datos", 8, "Morales Quiroga, Josue David"),
                    ("T1.2", "Backend: Implementar endpoint 'POST /api/v1/auth/login' con generación y firma de tokens JWT.", "Backend .NET", 10, "Monroy Gutiérrez, Henry Raul"),
                    ("T1.3", "Mobile: Crear interfaz de LoginScreen con validaciones visuales y almacenamiento seguro de token.", "Frontend Mobile", 12, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T1.4", "Fullstack / QA: Pruebas unitarias de autenticación y verificación de seguridad de sesión.", "QA / Pruebas", 6, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU07", "Registro de Incidencias Técnicas", [
                    ("T1.5", "Base de Datos: Creación de tabla 'tickets', secuencias de códigos correlativos ('INC-2026-XXX').", "Base de Datos", 8, "Morales Quiroga, Josue David"),
                    ("T1.6", "Backend: Implementar controlador 'POST /api/v1/tickets' con validación de modelo y comandos CQRS.", "Backend .NET", 12, "Monroy Gutiérrez, Henry Raul"),
                    ("T1.7", "Mobile: Pantalla TicketFormScreen con selectores de categoría, severidad y mensajes de error.", "Frontend Mobile", 12, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T1.8", "Fullstack: Pruebas de integración del formulario y validación de campos obligatorios.", "QA / Pruebas", 6, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU09", "Actualización con Concurrencia Optimista", [
                    ("T1.9", "Base de Datos: Añadir columna 'version' (INT) y trigger de incremento automático en la tabla 'tickets'.", "Base de Datos", 6, "Morales Quiroga, Josue David"),
                    ("T1.10", "Backend: Lógica de concurrencia optimista en Application Layer con retorno de HTTP 409 Conflict.", "Backend .NET", 10, "Monroy Gutiérrez, Henry Raul"),
                    ("T1.11", "Mobile: Manejo del error 409 en TicketDetailScreen con diálogo de recarga y preservación de datos.", "Frontend Mobile", 10, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T1.12", "DevOps: Pruebas de colisión concurrente simulando edición simultánea entre dos terminales.", "Fullstack / QA", 8, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU10", "Bandeja y Búsqueda de Tickets", [
                    ("T1.13", "Base de Datos: Índices compuestos en 'estado', 'prioridad' y 'codigo' para búsquedas de alto rendimiento.", "Base de Datos", 6, "Morales Quiroga, Josue David"),
                    ("T1.14", "Backend: Endpoint 'GET /api/v1/tickets' con parámetros de paginación, búsqueda libre y filtros.", "Backend .NET", 10, "Monroy Gutiérrez, Henry Raul"),
                    ("T1.15", "Mobile: TicketListScreen con barra de búsqueda reactiva, chips de estado y componente TicketCard.", "Frontend Mobile", 12, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T1.16", "Web: Maquetación base en Angular del layout principal y tabla responsiva de incidencias.", "Frontend Web", 10, "Morales Quiroga, Josue David")
                ])
            ]
        },
        {
            "sprint_name": "Sprint 2",
            "fill_header": fill_sprint2,
            "goal": "Habilitar la colaboración interdepartamental desarrollando el portal administrativo en Web Angular para empresas y sugerencias, conectando la app móvil React Native con las APIs REST del Backend .NET, e incorporando escalación y notas técnicas.",
            "dates": ("19/10/2026", "13/11/2026"),
            "items": [
                ("HU11", "Catálogo de Empresas Clientes SaaS", [
                    ("T2.1", "Base de Datos: Creación de tablas 'empresas', 'planes_saas' y 'contactos_empresa' con claves foráneas.", "Base de Datos", 8, "Morales Quiroga, Josue David"),
                    ("T2.2", "Backend: Endpoints CRUD '/api/v1/empresas' y '/api/v1/empresas/{id}/contactos' en Clean Architecture.", "Backend .NET", 10, "Monroy Gutiérrez, Henry Raul"),
                    ("T2.3", "Web: Módulo administrativo en Angular con tabla interactiva de clientes SaaS y formulario modal.", "Frontend Web", 12, "Morales Quiroga, Josue David"),
                    ("T2.4", "QA: Verificación de consistencia relacional y pruebas funcionales de alta de empresas.", "QA / Pruebas", 6, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU13", "Escalación Formal de Soporte a TI", [
                    ("T2.5", "Base de Datos: Tabla 'escalaciones_ticket' para auditoría de transferencias interdepartamentales.", "Base de Datos", 6, "Morales Quiroga, Josue David"),
                    ("T2.6", "Backend: Servicio de dominio para escalación formal con validación de roles y notificación interna.", "Backend .NET", 10, "Monroy Gutiérrez, Henry Raul"),
                    ("T2.7", "Mobile: Conectar botón 'Escalar a Desarrollo' consumiendo API REST desde client.ts en React Native.", "Frontend Mobile", 10, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T2.8", "Fullstack: Pruebas de integración del flujo de derivación entre perfiles Soporte y Desarrollador.", "QA / Pruebas", 8, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU15", "Feature Requests y Votación Comercial", [
                    ("T2.9", "Base de Datos: Tablas 'feature_requests' y 'votos_feature_request' con unicidad por usuario/cliente.", "Base de Datos", 6, "Morales Quiroga, Josue David"),
                    ("T2.10", "Backend: Endpoints para registro de sugerencias y sistema transaccional de votación (/api/v1/features).", "Backend .NET", 10, "Monroy Gutiérrez, Henry Raul"),
                    ("T2.11", "Web: Interfaz en Angular para que Ventas y Marketing exploren y voten solicitudes de clientes.", "Frontend Web", 12, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T2.12", "Fullstack: Pruebas de concurrencia y validación de recuento de votos en tiempo real.", "QA / Pruebas", 6, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU17", "Dashboard Ejecutivo de Turno", [
                    ("T2.13", "Base de Datos: Procedimiento almacenado 'sp_obtener_metricas_turno' para KPIs consolidados.", "Base de Datos", 8, "Morales Quiroga, Josue David"),
                    ("T2.14", "Backend: Endpoint '/api/v1/dashboard/metricas' con caché en memoria y tiempos de respuesta < 100ms.", "Backend .NET", 8, "Monroy Gutiérrez, Henry Raul"),
                    ("T2.15", "Web: Componente Dashboard en Angular con widgets de tarjetas, distribución P1-P4 y gráficos.", "Frontend Web", 12, "Morales Quiroga, Josue David"),
                    ("T2.16", "Mobile: HomeScreen en React Native con resumen de estadísticas reactivas sincronizadas vía API.", "Frontend Mobile", 10, "Cahuana Ccallocunto, Aldair Santos")
                ])
            ]
        },
        {
            "sprint_name": "Sprint 3",
            "fill_header": fill_sprint3,
            "goal": "Implementar automatizaciones de negocio (monitoreo de SLA, integración con Zoho CRM, algoritmo de priorización), Roadmap interactivo en Angular, alertas en tiempo real, pista de auditoría inmutable en MySQL y pulido final de la app móvil.",
            "dates": ("16/11/2026", "11/12/2026"),
            "items": [
                ("HU22", "Integración Económica con Zoho CRM", [
                    ("T3.1", "Base de Datos: Tabla 'crm_deals_impacto' para vincular contratos ($) a requerimientos de software.", "Base de Datos", 8, "Morales Quiroga, Josue David"),
                    ("T3.2", "Backend: Endpoint Webhook para recepción de eventos de Zoho CRM y sincronización de valor comercial.", "Backend .NET", 12, "Monroy Gutiérrez, Henry Raul"),
                    ("T3.3", "Web: Visualización del impacto económico monetario ($) en la lista de solicitudes de Angular.", "Frontend Web", 10, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T3.4", "QA: Simulación de webhooks entrantes y validación de actualización en base de datos.", "QA / Pruebas", 6, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU23", "Alertas Automáticas de SLA", [
                    ("T3.5", "Base de Datos: Tablas 'sla_politicas' con tiempos límites de respuesta y resolución por severidad.", "Base de Datos", 6, "Morales Quiroga, Josue David"),
                    ("T3.6", "Backend: Background Worker en .NET (Hosted Service) para monitoreo continuo de vencimiento de SLA.", "Backend .NET", 12, "Monroy Gutiérrez, Henry Raul"),
                    ("T3.7", "Mobile: Pulido final de notificaciones reactivas y banners visuales de advertencia de SLA en móvil.", "Frontend Mobile", 10, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T3.8", "Fullstack: Pruebas de estrés y verificación del disparo de alertas preventivas antes del deadline.", "QA / Pruebas", 8, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU25", "Roadmap Visual Interactivo", [
                    ("T3.9", "Base de Datos: Tabla 'roadmap_items' con relaciones a feature requests y fechas estimadas de release.", "Base de Datos", 6, "Morales Quiroga, Josue David"),
                    ("T3.10", "Backend: Endpoints de gestión de columnas Kanban (Evaluación, Desarrollo, Lanzamiento).", "Backend .NET", 8, "Monroy Gutiérrez, Henry Raul"),
                    ("T3.11", "Web: Tablero Kanban interactivo con drag-and-drop en Angular para marketing y producto.", "Frontend Web", 14, "Cahuana Ccallocunto, Aldair Santos"),
                    ("T3.12", "DevOps: Pruebas de renderizado y rendimiento en navegadores de escritorio y tablets.", "QA / Pruebas", 6, "Sánchez Peña, Eduardo Enrique")
                ]),
                ("HU30", "Pista de Auditoría Inmutable", [
                    ("T3.13", "Base de Datos: Creación de triggers AFTER UPDATE y AFTER INSERT que pueblan 'auditoria_logs'.", "Base de Datos", 8, "Morales Quiroga, Josue David"),
                    ("T3.14", "Backend: Middleware global de auditoría para registro de IP de cliente, timestamp UTC y payload JSON.", "Backend .NET", 10, "Monroy Gutiérrez, Henry Raul"),
                    ("T3.15", "Web: Módulo de consulta de auditoría con visor de diferencias (diff) antes/después del registro.", "Frontend Web", 10, "Morales Quiroga, Josue David"),
                    ("T3.16", "Cierre Scrum: Consolidación del Product Release Note y verificación final de cobertura técnica 100%.", "Fullstack / QA", 8, "Sánchez Peña, Eduardo Enrique")
                ])
            ]
        }
    ]

    current_r = 5
    for s_info in sprints_plan:
        s_name = s_info["sprint_name"]
        s_fill = s_info["fill_header"]
        s_goal = s_info["goal"]
        f_ini, f_fin = s_info["dates"]

        # Encabezado de la tabla para este Sprint
        for col_idx, h in enumerate(sp_headers, start=2):
            cell = ws_sp.cell(current_r, col_idx, h)
            cell.font = font_section
            cell.fill = fill_header_dark
            cell.alignment = align_center
            cell.border = border_box
        current_r += 1

        start_sprint_row = current_r

        for item in s_info["items"]:
            spb_id, spb_name, tasks = item
            start_spb_row = current_r

            for t_id, t_desc, t_tipo, t_est, t_resp in tasks:
                ws_sp.cell(current_r, 2, s_name)  # B: Sprint
                ws_sp.cell(current_r, 3, s_goal)  # C: Meta
                ws_sp.cell(current_r, 4, spb_id)  # D: ID_SPB
                ws_sp.cell(current_r, 5, spb_name)# E: Nombre SPB
                ws_sp.cell(current_r, 6, t_id)    # F: ID_Tarea
                ws_sp.cell(current_r, 7, t_desc)  # G: Descripción
                ws_sp.cell(current_r, 8, t_tipo)  # H: Tipo Tarea
                ws_sp.cell(current_r, 9, f"{t_est}h") # I: Estimación
                ws_sp.cell(current_r, 10, t_resp) # J: Responsable
                ws_sp.cell(current_r, 11, f_ini)  # K: Fecha Inicio
                ws_sp.cell(current_r, 12, f_fin)  # L: Fecha Fin
                ws_sp.cell(current_r, 13, "Conforme 100%") # M: Resultado

                for c_idx in range(2, 14):
                    c = ws_sp.cell(current_r, c_idx)
                    c.border = border_box
                    c.font = font_bold if c_idx in [2, 4, 6, 8, 9, 13] else font_normal
                    if c_idx in [2, 4, 6, 8, 9, 11, 12, 13]:
                        c.alignment = align_center
                    else:
                        c.alignment = align_left

                    if current_r % 2 == 1:
                        c.fill = fill_zebra

                current_r += 1

        # Espacio entre Sprints
        current_r += 2

    ws_sp.column_dimensions["B"].width = 12
    ws_sp.column_dimensions["C"].width = 38
    ws_sp.column_dimensions["D"].width = 10
    ws_sp.column_dimensions["E"].width = 28
    ws_sp.column_dimensions["F"].width = 10
    ws_sp.column_dimensions["G"].width = 56
    ws_sp.column_dimensions["H"].width = 18
    ws_sp.column_dimensions["I"].width = 14
    ws_sp.column_dimensions["J"].width = 32
    ws_sp.column_dimensions["K"].width = 14
    ws_sp.column_dimensions["L"].width = 14
    ws_sp.column_dimensions["M"].width = 16

    print(f"Guardando propuesta completa en: {OUT_XLSX}")
    wb.save(OUT_XLSX)
    print("¡Archivo generado exitosamente!")

if __name__ == "__main__":
    main()
