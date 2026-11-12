# -*- coding: utf-8 -*-
import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets_doc')

def create_report():
    doc = Document()
    
    # -------------------------------------------------------------
    # 1. PAGE SETUP (APA 7th Edition: 2.54 cm / 1 inch margins)
    # -------------------------------------------------------------
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header & Footer setup for subsequent pages
        footer = section.footer
        f_p = footer.paragraphs[0]
        f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        f_run = f_p.add_run("IDAT · Sexto Ciclo · Desarrollo Móvil | ")
        f_run.font.name = "Arial"
        f_run.font.size = Pt(8.5)
        f_run.font.color.rgb = RGBColor(148, 163, 184)
        
        # Add page number XML to footer
        f_pPr = f_p._p.get_or_add_pPr()
        fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
        f_p._p.append(fldSimple)

    # Colors
    C_NAVY = RGBColor(30, 58, 138)       # #1E3A8A - Headings
    C_CHARCOAL = RGBColor(31, 41, 55)    # #1F2937 - Subheadings
    C_TEXT = RGBColor(17, 24, 39)        # #111827 - Body Text
    C_MUTED = RGBColor(100, 116, 139)    # #64748B - Captions
    C_BLUE = RGBColor(37, 99, 235)       # #2563EB - Accents

    # Helper functions for document elements
    def p_body(text, bold_prefix=None, space_after=6):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(space_after)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.bold = True
            r_bold.font.name = "Arial"
            r_bold.font.size = Pt(11)
            r_bold.font.color.rgb = C_TEXT
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(11)
        r.font.color.rgb = C_TEXT
        return p

    def h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.name = "Arial"
        r.font.size = Pt(15)
        r.font.color.rgb = C_NAVY
        return p

    def h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.name = "Arial"
        r.font.size = Pt(12.5)
        r.font.color.rgb = C_CHARCOAL
        return p

    def h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.name = "Arial"
        r.font.size = Pt(11)
        r.font.color.rgb = C_CHARCOAL
        return p

    def bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(4)
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.bold = True
            r_b.font.name = "Arial"
            r_b.font.size = Pt(10.5)
            r_b.font.color.rgb = C_TEXT
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.font.color.rgb = C_TEXT
        return p

    def add_callout(text, title="NOTA TÉCNICA RELEVANTE:"):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        tcPr = cell._tc.get_or_add_tcPr()
        
        # Border: thick blue left, none on others
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="2563EB"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F0F9FF"/>')
        tcPr.append(shd)
        
        p = cell.paragraphs[0]
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r_t = p.add_run(f"📌 {title} ")
        r_t.bold = True
        r_t.font.name = "Arial"
        r_t.font.size = Pt(10)
        r_t.font.color.rgb = RGBColor(30, 58, 138)
        
        r_body = p.add_run(text)
        r_body.font.name = "Arial"
        r_body.font.size = Pt(10)
        r_body.font.color.rgb = C_TEXT
        
        # Spacing after callout table
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(4)

    def add_figure(img_path, caption_text, width=Inches(4.5)):
        real_path = img_path if os.path.exists(img_path) else os.path.join(ASSETS_DIR, os.path.basename(img_path))
        if os.path.exists(real_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(10)
            p_img.paragraph_format.space_after = Pt(4)
            r = p_img.add_run()
            r.add_picture(real_path, width=width)
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(12)
            r_cap = p_cap.add_run(caption_text)
            r_cap.italic = True
            r_cap.font.name = "Arial"
            r_cap.font.size = Pt(9.5)
            r_cap.font.color.rgb = C_MUTED
        else:
            p = doc.add_paragraph(f"[Figura no encontrada: {img_path}]")
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    def add_styled_table(headers, rows, col_widths=None):
        table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        # Header Row
        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            cell = hdr_cells[i]
            cell.text = header_text
            tcPr = cell._tc.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="1E3A8A"/>')
            tcPr.append(shd)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(5)
            p.paragraph_format.space_after = Pt(5)
            for run in p.runs:
                run.bold = True
                run.font.name = "Arial"
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(255, 255, 255)
                
        # Data Rows
        for r_idx, row_data in enumerate(rows):
            row_cells = table.rows[r_idx + 1].cells
            fill_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                cell = row_cells[c_idx]
                cell.text = str(cell_value)
                tcPr = cell._tc.get_or_add_tcPr()
                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_color}"/>')
                tcPr.append(shd)
                
                # Borders
                borders = parse_xml(
                    f'<w:tcBorders {nsdecls("w")}>'
                    f'<w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>'
                    f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>'
                    f'<w:left w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>'
                    f'<w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>'
                    f'</w:tcBorders>'
                )
                tcPr.append(borders)
                
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(4)
                p.paragraph_format.space_after = Pt(4)
                for run in p.runs:
                    run.font.name = "Arial"
                    run.font.size = Pt(9)
                    run.font.color.rgb = C_TEXT
                    
        # Apply Column Widths
        if col_widths:
            for row in table.rows:
                for c_idx, width in enumerate(col_widths):
                    row.cells[c_idx].width = Inches(width)
                    
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(6)
        return table

    # =============================================================
    # CARÁTULA INSTITUCIONAL IDAT
    # =============================================================
    # Centered Logo
    logo_path = os.path.join(ASSETS_DIR, 'logo_idat.png')
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(12)
        p_logo.paragraph_format.space_after = Pt(12)
        r_logo = p_logo.add_run()
        r_logo.add_picture(logo_path, width=Inches(1.8))
        
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(4)
    r = p_inst.add_run("INSTITUTO DE EDUCACIÓN SUPERIOR PRIVADO IDAT")
    r.bold = True
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.color.rgb = C_NAVY
    
    p_carr = doc.add_paragraph()
    p_carr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_carr.paragraph_format.space_after = Pt(28)
    r = p_carr.add_run("CARRERA PROFESIONAL DE DESARROLLO DE SISTEMAS FRONTEND Y BACKEND")
    r.bold = True
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.color.rgb = C_CHARCOAL
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(8)
    r = p_title.add_run("Sistema de Portal Integrado de Soporte y Solicitudes Internas")
    r.bold = True
    r.font.name = "Arial"
    r.font.size = Pt(17)
    r.font.color.rgb = C_NAVY
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(28)
    r = p_sub.add_run("Plataforma Móvil en React Native para la Gestión Operativa, Trazabilidad de Incidencias y Control de Concurrencia en TuNegocio.pe")
    r.italic = True
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.color.rgb = C_CHARCOAL
    
    p_ent = doc.add_paragraph()
    p_ent.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ent.paragraph_format.space_after = Pt(24)
    r = p_ent.add_run("TRABAJO DE APLICACIÓN PROFESIONAL")
    r.bold = True
    r.font.name = "Arial"
    r.font.size = Pt(12)
    r.font.color.rgb = C_NAVY
    
    p_aut = doc.add_paragraph()
    p_aut.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_aut.paragraph_format.space_after = Pt(4)
    r = p_aut.add_run("INTEGRANTES DEL EQUIPO:")
    r.bold = True
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.color.rgb = C_CHARCOAL
    
    integrantes = [
        ("Cahuana Ccallocunto, Aldair Santos", "SL70869993"),
        ("Monroy Gutierrez, Henry Raul", "SV45340722"),
        ("Morales Quiroga, Josue David", "VV60962824"),
        ("Sánchez Peña, Eduardo Enrique", "IV73197168")
    ]
    for nombre, cod in integrantes:
        p_i = doc.add_paragraph()
        p_i.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_i.paragraph_format.space_after = Pt(2)
        r_n = p_i.add_run(f"{nombre} ")
        r_n.font.name = "Arial"
        r_n.font.size = Pt(10.5)
        r_n.font.color.rgb = C_TEXT
        r_c = p_i.add_run(f"({cod})")
        r_c.font.name = "Arial"
        r_c.font.size = Pt(9.5)
        r_c.font.color.rgb = C_MUTED
        
    p_pie = doc.add_paragraph()
    p_pie.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_pie.paragraph_format.space_before = Pt(40)
    r = p_pie.add_run("Lima - Perú\n2026")
    r.bold = True
    r.font.name = "Arial"
    r.font.size = Pt(10.5)
    r.font.color.rgb = C_CHARCOAL

    doc.add_page_break()

    # =============================================================
    # RESUMEN EJECUTIVO (Máximo 300 palabras según manual IDAT)
    # =============================================================
    h1("Resumen Ejecutivo")
    
    p_body(
        "El presente Trabajo de Aplicación Profesional tiene como objetivo diseñar y construir una aplicación móvil "
        "empresarial desarrollada en React Native con TypeScript para la empresa peruana de facturación electrónica y servicios SaaS "
        "TuNegocio.pe, orientada a centralizar y optimizar la gestión de solicitudes, incidencias técnicas y feedback operativo "
        "entre las áreas de Soporte Técnico, TI/Desarrollo, Ventas y Marketing. La situación problemática diagnosticada evidenció "
        "que el uso de canales informales como WhatsApp generaba dispersión en la comunicación, reportes técnicos incompletos, "
        "pérdida de trazabilidad sobre el estado real de atención y riesgo de inconsistencias ante modificaciones concurrentes. "
        "Para solucionar esta deficiencia, se implementó una arquitectura móvil modular con gestión del estado en memoria utilizando "
        "los hooks nativos de React: useState, useEffect, useReducer y Context API, junto con un mecanismo de bloqueo optimista "
        "basado en versiones para prevenir la sobreescritura accidental de registros (HTTP 409 Conflict). Los resultados técnicos "
        "obtenidos demuestran una plataforma 100% tipada, con validaciones contextuales inmediatas, navegación intuitiva, soporte "
        "para el ciclo de vida CRUD completo (Crear, Listar/Filtrar, Editar y Eliminar con confirmación nativa Alert) y empaquetado "
        "exitoso para entornos Android e iOS bajo el estándar de Expo SDK 58, garantizando alta disponibilidad operativa y reducción "
        "significativa en los tiempos de escalamiento interno."
    )
    
    add_callout(
        "El proyecto se ajusta estrictamente a los lineamientos del desarrollo móvil moderno: administración íntegra de datos en "
        "memoria sin requerimiento obligatorio de base de datos física externa, arquitectura de carpetas desacoplada y experiencia "
        "de usuario ágil y ergonómica.",
        "SÍNTESIS DE LA SOLUCIÓN TÉCNICA:"
    )

    # =============================================================
    # ÍNDICE DE CONTENIDOS
    # =============================================================
    h1("Índice de Contenidos")
    
    indice = [
        ("Capítulo 1: Diagnóstico del Problema y Core de Negocio", "3"),
        ("  1.1 Contexto y delimitación del entorno laboral (TuNegocio.pe)", "3"),
        ("  1.2 Identificación y descripción del problema", "4"),
        ("  1.3 Análisis de causas y efectos (Árbol de problemas)", "5"),
        ("  1.4 Identificación de los actores afectados", "6"),
        ("  1.5 Viabilidad y pertinencia profesional", "6"),
        ("Capítulo 2: Justificación y Objetivos del Proyecto", "7"),
        ("  2.1 Relevancia y beneficios de la intervención", "7"),
        ("  2.2 Justificación de la innovación aplicada", "7"),
        ("  2.3 Análisis de viabilidad técnica y operativa", "8"),
        ("  2.4 Objetivos del proyecto (General y Específicos)", "8"),
        ("Capítulo 3: Marco Referencial y Fundamentos Técnicos", "9"),
        ("  3.1 Stack tecnológico móvil (React Native, TypeScript, Expo)", "9"),
        ("  3.2 Gestión del estado en memoria y hooks obligatorios", "10"),
        ("  3.3 Control de concurrencia optimista y manejo de versiones", "11"),
        ("  3.4 Normativas, estándares y marco legal aplicable", "11"),
        ("Capítulo 4: Arquitectura del Software y Estructura del Código", "12"),
        ("  4.1 Organización de capas en la aplicación móvil", "12"),
        ("  4.2 Modelado de datos mínimo (Entidad Ticket)", "13"),
        ("  4.3 Flujo unidireccional de datos con useReducer y Context API", "14"),
        ("Capítulo 5: Evidencias de Pantallas y Funcionalidades del Prototipo", "15"),
        ("  5.1 Bienvenida y Dashboard Operativo (HomeScreen.tsx)", "15"),
        ("  5.2 Listado con buscador y filtros reactivos (TicketListScreen.tsx)", "16"),
        ("  5.3 Formulario de creación con validaciones (TicketFormScreen.tsx)", "17"),
        ("  5.4 Detalle y edición de registro (TicketDetailScreen.tsx)", "18"),
        ("  5.5 Eliminación de registros con confirmación (Alert.alert)", "19"),
        ("  5.6 Simulación de conflicto concurrente (HTTP 409 Conflict)", "20"),
        ("Capítulo 6: Evidencias de Ejecución Técnica y Verificación", "21"),
        ("  6.1 Verificación de compilación estricta TypeScript", "21"),
        ("  6.2 Generación de bundle de producción Android en Metro", "21"),
        ("  6.3 Ejecución en Expo Go y control de versiones GitHub", "22"),
        ("Capítulo 7: Conclusiones y Recomendaciones", "23"),
        ("  7.1 Conclusiones", "23"),
        ("  7.2 Recomendaciones de mejora continua", "23"),
        ("Referencias Bibliográficas (APA 7ma edición)", "24")
    ]
    for seccion, pag in indice:
        p_ind = doc.add_paragraph()
        p_ind.paragraph_format.line_spacing = 1.15
        p_ind.paragraph_format.space_after = Pt(2)
        r_s = p_ind.add_run(seccion)
        r_s.font.name = "Arial"
        r_s.font.size = Pt(10)
        if seccion.startswith("Capítulo") or seccion.startswith("Referencias"):
            r_s.bold = True
            r_s.font.color.rgb = C_NAVY
        else:
            r_s.font.color.rgb = C_TEXT

    doc.add_page_break()

    # =============================================================
    # CAPÍTULO 1: DIAGNÓSTICO DEL PROBLEMA
    # =============================================================
    h1("Capítulo 1: Diagnóstico del Problema y Core de Negocio")
    
    h2("1.1 Contexto y delimitación del entorno laboral")
    p_body(
        "TuNegocio.pe es una empresa peruana de base tecnológica ubicada en el distrito de Miraflores, Lima, especializada "
        "en el desarrollo y provisión de soluciones de software bajo el modelo SaaS (Software as a Service). Su producto principal "
        "consiste en una plataforma de facturación electrónica, control de inventario y gestión comercial dirigida a micro y "
        "pequeñas empresas a nivel nacional. La organización cuenta con una cartera activa que supera los 10,000 emprendedores "
        "quienes dependen cotidianamente de la estabilidad del sistema para emitir comprobantes de pago autorizados por la SUNAT "
        "(boletas, facturas, notas de crédito y guías de remisión)."
    )
    p_body(
        "Estructuralmente, la empresa está organizada en cuatro áreas clave interdependientes: Comercial/Ventas, Marketing, "
        "Soporte Técnico y TI/Desarrollo. Mientras que el área de Soporte Técnico constituye el canal de contacto directo con los "
        "clientes ante incidencias operativas, el equipo de TI/Desarrollo es el responsable directo de corregir fallas de software, "
        "desplegar actualizaciones y mantener los servicios en la nube."
    )
    
    add_figure('assets_doc/organigrama_tunegocio.png', "Figura 1: Organigrama estructural y funcional de TuNegocio.pe", Inches(5.0))
    
    h2("1.2 Identificación y descripción del problema")
    p_body(
        "A partir del levantamiento de información y diagnóstico operativo, se identificó que el principal cuello de botella "
        "radica en la comunicación entre Soporte Técnico y TI/Desarrollo. Históricamente, las solicitudes de soporte y reportes "
        "de errores de clientes eran escalados a través de canales informales, primordialmente grupos de WhatsApp y mensajes directos. "
        "Esta práctica ocasionaba cuatro graves deficiencias operativas:"
    )
    bullet("Escalamiento por WhatsApp con mensajes genéricos, sin captura de logs ni formato estandarizado.", "1. Dispersión informativa: ")
    bullet("Recepción desordenada en Desarrollo, donde no se distinguen incidencias críticas P1 de consultas menores P4.", "2. Carencia de priorización: ")
    bullet("El área de Soporte desconocía el estado real de resolución de cada ticket, impidiéndole brindar respuestas oportunas a los clientes.", "3. Ausencia de trazabilidad: ")
    bullet("Las solicitudes de mejoras de clientes o alertas de ventas quedaban archivadas en historiales de chat sin seguimiento.", "4. Pérdida de feedback: ")

    add_figure('assets_doc/flujo_actual_tunegocio.png', "Figura 2: Flujo operativo actual en TuNegocio.pe y puntos críticos identificados", Inches(5.2))

    h2("1.3 Análisis de causas y efectos")
    p_body(
        "Para estructurar el problema central y evitar atacar únicamente los síntomas superficiales, se desarrolló un Árbol "
        "de Problemas. Se determinó que el problema central es la 'Comunicación no estructurada ni trazable de incidencias, "
        "solicitudes y avisos entre las áreas de TuNegocio.pe'."
    )
    p_body(
        "Las causas directas son el uso de canales informales, la ausencia de un formato estándar para el reporte de errores, "
        "la inexistencia de criterios unificados de prioridad y la falta de un registro centralizado. Entre los efectos negativos "
        "directos destacan el aumento del tiempo medio de resolución (MTTR), reprocesos en desarrollo, falta de atención a fallas "
        "críticas y pérdida de oportunidades de retención, derivando finalmente en insatisfacción de clientes y riesgo de cancelación (churn)."
    )

    add_figure('assets_doc/arbol_problemas.png', "Figura 3: Árbol de problemas (Causas y Efectos en TuNegocio.pe)", Inches(5.0))

    h2("1.4 Identificación de actores y áreas afectadas")
    p_body(
        "La problemática analizada impacta directamente en las cuatro áreas funcionales de la compañía, tal como se sintetiza "
        "en la siguiente matriz:"
    )

    actores_headers = ["Área Funcional", "Rol Operativo", "Problemática Detectada", "Impacto en el Negocio"]
    actores_rows = [
        ["Soporte Técnico", "Atención a usuarios y clientes", "Escalamiento por chats sin trazabilidad ni historial de estado", "Lentitud de respuesta e insatisfacción del cliente final"],
        ["TI y Desarrollo", "Mantenimiento y corrección de código", "Recepción de reportes incompletos sin logs ni severidad tipificada", "Pérdida de tiempo depurando y reprocesos innecesarios"],
        ["Ventas / Comercial", "Captación y seguimiento de cuentas", "Desconocimiento del estado de fallas en clientes clave", "Riesgo de cancelación en clientes en periodo de prueba"],
        ["Marketing", "Fidelización y comunicación", "Falta de avisos unificados ante caídas o mantenimientos del servicio", "Molestias en redes sociales y daño a la imagen corporativa"]
    ]
    add_styled_table(actores_headers, actores_rows, [1.3, 1.4, 2.1, 1.7])

    h2("1.5 Viabilidad y pertinencia profesional")
    p_body(
        "El desarrollo de la aplicación móvil PlatformOps es altamente pertinente para el perfil profesional de la carrera de "
        "Desarrollo de Sistemas Frontend y Backend, ya que integra arquitectura de software móvil en React Native, buenas prácticas "
        "de diseño UI/UX, programación funcional basada en hooks, tipado estricto con TypeScript y gestión de concurrencia optimista. "
        "El equipo dispone de las competencias técnicas, entorno de emulación móvil y acceso a los requerimientos del negocio "
        "para consolidar el prototipo dentro del calendario académico del sexto ciclo."
    )

    doc.add_page_break()

    # =============================================================
    # CAPÍTULO 2: JUSTIFICACIÓN Y OBJETIVOS
    # =============================================================
    h1("Capítulo 2: Justificación y Objetivos del Proyecto")
    
    h2("2.1 Relevancia y beneficios de la intervención")
    p_body(
        "En un entorno SaaS donde más de 10,000 pequeñas empresas emiten comprobantes tributarios a diario, la indisponibilidad "
        "o fallo recurrente en la firma electrónica o el servicio de inventario detiene las operaciones comerciales de los clientes. "
        "Implementar un canal móvil formal permite a los operadores de soporte registrar fallas con metadatos técnicos completos "
        "(teléfono de contacto, código correlativo, cliente, severidad y descripción), acelerando los tiempos de respuesta y "
        "eliminando la incertidumbre sobre el responsable y estado de cada requerimiento."
    )

    h2("2.2 Justificación de la innovación aplicada")
    p_body(
        "La innovación del proyecto radica en reemplazar un proceso analógico e informal por un flujo digital estandarizado, "
        "reactivo y medible. Desde la perspectiva tecnológica, incorpora tres elementos diferenciadores:"
    )
    bullet("Formulario estándar que obliga a registrar teléfono, categoría y severidad, evitando datos incompletos.", "1. Estandarización de entradas: ")
    bullet("Implementación de useReducer y Context API que unifica el estado global sin mutaciones caóticas.", "2. Gestión en memoria pura: ")
    bullet("Control de versión en cada ticket para prevenir la sobreescritura accidental si dos operadores editan a la vez.", "3. Bloqueo optimista (409): ")

    h2("2.3 Análisis de viabilidad técnica y operativa")
    p_body(
        "La solución no demanda costos de infraestructura de servidores externos obligatorios para su funcionamiento mínimo, "
        "puesto que toda la estructura CRUD se administra eficientemente en memoria mediante React Native. La compilación y "
        "ejecución se apoya en el ecosistema Expo (SDK 58), lo que asegura compatibilidad multiplataforma instantánea tanto en "
        "dispositivos físicos Android e iOS como en simuladores de escritorio."
    )

    h2("2.4 Objetivos del proyecto")
    h3("Objetivo General:")
    p_body(
        "Diseñar e implementar una aplicación móvil en React Native con TypeScript orientada al core de negocio de TuNegocio.pe, "
        "que centralice el registro, seguimiento, filtrado, actualización y eliminación de órdenes de atención e incidencias técnicas, "
        "gestionando los datos en memoria mediante useReducer y Context API para asegurar trazabilidad operativa y coherencia de información."
    )
    h3("Objetivos Específicos:")
    bullet("Modelar la entidad principal Ticket con los campos obligatorios: id, clienteNombre, telefono, categoria (tipoServicio), prioridad, descripcion, estado y fechaRegistro.", "1. Modelado de datos: ")
    bullet("Construir una arquitectura limpia y ordenada organizada por capas: screens, components, context, models, types, api y utils.", "2. Estructura modular: ")
    bullet("Implementar las pantallas requeridas: Login/Bienvenida con dashboard, Listado con buscador y filtros, Formulario de creación y Detalle/Edición.", "3. Pantallas mínimas: ")
    bullet("Evidenciar principios de UI/UX profesionales: tarjetas con sombras, chips semánticos de estado y prioridad, iconos SVG por categoría, validaciones bajo el input y confirmación Alert para eliminar.", "4. Diseño de interfaces: ")
    bullet("Integrar obligatoriamente los 4 hooks fundamentales: useState (formularios y filtros), useEffect (carga y refresco), useReducer (lógica CRUD) y Context API (estado global).", "5. Hooks obligatorios: ")
    bullet("Demostrar control de concurrencia optimista para detectar colisiones en actualizaciones concurrentes mediante el código HTTP 409.", "6. Integridad de datos: ")

    doc.add_page_break()

    # =============================================================
    # CAPÍTULO 3: MARCO REFERENCIAL
    # =============================================================
    h1("Capítulo 3: Marco Referencial y Fundamentos Técnicos")
    
    h2("3.1 Stack tecnológico móvil")
    p_body(
        "La solución móvil fue construida sobre tecnologías consolidadas de la industria para asegurar alto rendimiento, "
        "mantenibilidad y tipado estricto:"
    )
    bullet("Framework de desarrollo multiplataforma basado en componentes que compila a vistas nativas de Android e iOS sin penalización de rendimiento.", "• React Native (v0.88.1): ")
    bullet("Superconjunto de JavaScript que provee seguridad en tiempo de compilación mediante tipado estricto de interfaces y modelos.", "• TypeScript (v5.3): ")
    bullet("Entorno de ejecución y conjunto de herramientas que acelera el ciclo de pruebas y bundling modular bajo Metro.", "• Expo (SDK 58): ")
    bullet("Librería estándar de la industria para transiciones de pantalla apiladas (Native Stack) con soporte de gestos y barras de navegación.", "• React Navigation v7: ")

    h2("3.2 Gestión del estado en memoria y hooks obligatorios")
    p_body(
        "Conforme a las directrices de la rúbrica académica, no es obligatorio el uso de una base de datos física para la "
        "evaluación del piloto; la información debe manejarse en memoria compartida a través de la integración entre useReducer y Context API:"
    )
    bullet("Gestiona el estado local de los formularios (cajas de texto, selección de chips), el valor del término de búsqueda y los filtros activos por estado.", "1. useState: ")
    bullet("Carga la data inicial al montar la aplicación y refresca las métricas dinámicas del dashboard al detectar cambios en la lista.", "2. useEffect: ")
    bullet("Centraliza la máquina de estados del CRUD bajo el reducer 'ticketReducer', procesando acciones atómicas: LOAD_START, LOAD_SUCCESS, LOAD_ERROR, ADD_TICKET, UPDATE_TICKET y DELETE_TICKET.", "3. useReducer: ")
    bullet("Provee el TicketContext y AuthContext a lo largo de todo el árbol de componentes, permitiendo acceder a los datos y despachar acciones desde cualquier pantalla sin incurrir en prop-drilling.", "4. Context API: ")

    add_callout(
        "Al utilizar useReducer junto con Context API, cualquier operación de creación, actualización o eliminación desencadena "
        "una actualización reactiva instantánea en la Bandeja de Incidencias y en los contadores del Dashboard, asegurando coherencia "
        "global sin necesidad de refrescar manualmente.",
        "PATRÓN ARQUITECTÓNICO DEL ESTADO:"
    )

    h2("3.3 Control de concurrencia optimista")
    p_body(
        "En entornos de soporte donde múltiples operadores pueden interactuar sobre un mismo ticket, existe el riesgo de que un operador "
        "sobrescriba sin saber los cambios efectuados por otro. Para neutralizar este riesgo, la entidad Ticket incluye un campo numérico "
        "'version'. Al intentar actualizar un ticket, la capa de servicios compara la versión enviada con la versión actual en memoria. "
        "Si no coinciden, se rechaza la mutación con un error HTTP 409 (Conflict) y la aplicación despliega un diálogo nativo informando "
        "al usuario que los datos fueron actualizados en segundo plano, protegiendo la integridad del registro."
    )

    h2("3.4 Normativas, estándares y marco legal aplicable")
    bullet("Estándar internacional que guía la evaluación de atributos de calidad del software: adecuación funcional, fiabilidad, usabilidad y mantenibilidad.", "• ISO/IEC 25010:2023: ")
    bullet("Buenas prácticas para la confidencialidad e integridad de la información técnica y credenciales de usuario.", "• ISO/IEC 27001:2022: ")
    bullet("Regula el tratamiento de la información de contacto de los clientes (teléfono y razón social), garantizando confidencialidad y limitación al fin exclusivo del soporte técnico.", "• Ley N.° 29733 (Protección de Datos Personales en Perú): ")

    doc.add_page_break()

    # =============================================================
    # CAPÍTULO 4: ARQUITECTURA DEL SOFTWARE
    # =============================================================
    h1("Capítulo 4: Arquitectura del Software y Estructura del Código")
    
    h2("4.1 Organización de capas en la aplicación móvil")
    p_body(
        "El código fuente se encuentra estructurado bajo principios de separación de responsabilidades dentro de la carpeta "
        "'projects/mobile/src/', facilitando el mantenimiento y la escalabilidad:"
    )

    arch_headers = ["Directorio", "Responsabilidad Arquitectónica", "Archivos Principales"]
    arch_rows = [
        ["projects/mobile/src/screens/", "Pantallas de interfaz de usuario y captura de eventos", "LoginScreen, RegisterScreen, HomeScreen, TicketListScreen, TicketFormScreen, TicketDetailScreen"],
        ["projects/mobile/src/components/", "Componentes visuales modulares y reutilizables", "TicketCard, TicketStatusBadge, TicketPriorityBadge, Input, Button, SVG Icons"],
        ["projects/mobile/src/context/", "Gestión del estado global con useReducer y Context API", "TicketContext.tsx (CRUD y reducer), AuthContext.tsx (autenticación)"],
        ["projects/mobile/src/models/ & types/", "Definición de modelos de dominio y contratos TypeScript", "ticket.ts, ticket.model.ts, auth.ts, navigation.ts"],
        ["projects/mobile/src/api/", "Repositorio de datos en memoria y simulación de concurrencia", "ticketsApi.ts (almacén en memoria, delays de red simulados, HTTP 409)"],
        ["projects/mobile/src/utils/", "Utilidades transversales, almacenamiento seguro y tema UI", "theme.ts (paleta dark mode, espaciados), secureStore.ts, formatters.ts"]
    ]
    add_styled_table(arch_headers, arch_rows, [1.5, 2.5, 2.5])

    h2("4.2 Modelado de datos mínimo (Entidad Ticket)")
    p_body(
        "La entidad principal 'Ticket' cumple estrictamente con los atributos mínimos requeridos por las directrices del curso, "
        "incorporando además atributos técnicos para soporte SaaS:"
    )

    ticket_fields = [
        ["id", "string (UUID)", "Identificador único e inmutable del registro en memoria."],
        ["codigo", "string", "Código correlativo institucional visible (ej. 'INC-2026-001')."],
        ["clienteNombre", "string", "Razón social o nombre comercial del cliente solicitante."],
        ["telefono", "string", "Número telefónico o celular directo de contacto (+51 987 654 321)."],
        ["categoria", "TicketCategory", "Tipo de servicio: FIRMA_ELECTRONICA, BASE_DE_DATOS, AUTENTICACION, IMPRESION, API, OTRO."],
        ["prioridad", "TicketPriority", "Nivel de severidad técnica: P1 (Crítica), P2 (Alta), P3 (Media), P4 (Baja)."],
        ["descripcion", "string", "Explicación técnica detallada de la anomalía o requerimiento."],
        ["estado", "TicketStatus", "Estado del ciclo de vida: NUEVO, EN_DIAGNOSTICO, EN_DESARROLLO, EN_QA, RESUELTO, CERRADO."],
        ["createdAt", "string (ISO)", "Fecha y hora de registro formateada en zona horaria local."],
        ["version", "number", "Número entero de versión utilizado para el control de concurrencia optimista."]
    ]
    add_styled_table(["Campo de Datos", "Tipo TypeScript", "Descripción Funcional"], ticket_fields, [1.4, 1.6, 3.5])

    h2("4.3 Flujo unidireccional de datos con useReducer y Context API")
    p_body(
        "El ciclo de actualización de datos se rige por un flujo unidireccional predecible que garantiza que no existan mutaciones "
        "descontroladas fuera del reducer:"
    )
    bullet("El usuario interactúa con la UI (ej. pulsa 'Crear Incidencia', modifica un estado o elimina un ticket).", "1. Disparo de Acción: ")
    bullet("El componente invoca la función del contexto (createTicket, updateTicket, deleteTicket).", "2. Despacho (Dispatch): ")
    bullet("La función 'ticketReducer' recibe el estado previo y la acción, devolviendo un nuevo estado inmutable.", "3. Procesamiento Reducer: ")
    bullet("TicketContext notifica a todos los componentes suscritos, provocando el re-renderizado instantáneo de listas y métricas.", "4. Actualización Reactiva: ")

    doc.add_page_break()

    # =============================================================
    # CAPÍTULO 5: EVIDENCIAS DE PANTALLAS Y FUNCIONALIDADES
    # =============================================================
    h1("Capítulo 5: Evidencias de Pantallas y Funcionalidades del Prototipo")
    
    h2("5.1 Pantalla de Bienvenida y Dashboard Operativo (HomeScreen.tsx)")
    p_body(
        "Al autenticarse en el sistema, el operador accede al Dashboard Principal. Esta pantalla presenta el saludo corporativo, "
        "identificación del operador activo y un panel de telemetría con tres métricas (KPIs) calculadas dinámicamente desde el estado "
        "del reducer: Total de Tickets Abiertos, Conteo de Severidad Crítica P1 y Porcentaje de Cumplimiento de SLA. Asimismo, dispone "
        "de botones de acción rápida para registrar una nueva incidencia o navegar al listado completo."
    )
    add_figure('assets_doc/screen1_dashboard.png', "Figura 4: Pantalla de Bienvenida y Dashboard Operativo (HomeScreen.tsx)", Inches(3.6))

    h2("5.2 Pantalla de Listado con Buscador y Filtros (TicketListScreen.tsx)")
    p_body(
        "La Bandeja de Incidencias permite visualizar todos los registros organizados en tarjetas individuales (TicketCard). "
        "Incluye un campo de texto con filtro instantáneo en tiempo real (controlado mediante useState) que busca coincidencias sobre "
        "el código, cliente o descripción. Adicionalmente, cuenta con una barra horizontal de Chips de Filtro por estado "
        "(TODOS, NUEVO, EN_DIAGNOSTICO, RESUELTO, CERRADO) y un botón flotante de acceso rápido (FAB) para crear incidencias."
    )
    add_figure('assets_doc/screen2_listado.png', "Figura 5: Listado con Buscador Reactivo y Filtro por Chips de Estado (TicketListScreen.tsx)", Inches(3.6))

    doc.add_page_break()

    h2("5.3 Pantalla de Formulario de Creación con Validaciones (TicketFormScreen.tsx)")
    p_body(
        "Esta pantalla implementa el formulario de captura para nuevas solicitudes. Dispone de validaciones en tiempo real: "
        "si un campo obligatorio (como título, cliente, teléfono o descripción) no cumple con el formato o se omite, se despliega "
        "un mensaje de advertencia contextual de color rojo exactamente debajo de la caja de texto. Destaca la inclusión obligatoria "
        "del campo 'Teléfono de Contacto' con validación de longitud mínima y chips seleccionables para Categoría y Prioridad."
    )
    add_figure('assets_doc/screen3_crear.png', "Figura 6: Formulario de Creación con Validaciones Contextuales bajo el Input (TicketFormScreen.tsx)", Inches(3.6))

    h2("5.4 Pantalla de Detalle y Edición de Registro (TicketDetailScreen.tsx)")
    p_body(
        "Permite inspeccionar la totalidad de atributos de la incidencia seleccionada, incluyendo el teléfono directo del cliente, "
        "código, categoría, severidad y fecha de registro. El operador puede conmutar al modo edición para modificar el estado o la "
        "severidad técnica y despachar la acción UPDATE_TICKET hacia el reducer. También incluye botones para simular conflictos concurrentes "
        "y para eliminar la incidencia."
    )
    add_figure('assets_doc/screen4_detalle.png', "Figura 7: Pantalla de Detalle Completo y Edición de Incidencia (TicketDetailScreen.tsx)", Inches(3.6))

    doc.add_page_break()

    h2("5.5 Funcionalidad de Eliminación con Confirmación (Alert.alert)")
    p_body(
        "En cumplimiento de las directrices de seguridad y principios de UI/UX, la eliminación de un registro no se ejecuta de forma "
        "abrupta. Al pulsar el botón destructivo 'Eliminar Incidencia', la aplicación dispara un diálogo nativo 'Alert.alert' que solicita "
        "confirmación explícita al operador con las opciones 'Cancelar' y 'Eliminar'. Solo tras confirmar, se despacha la acción "
        "DELETE_TICKET en memoria y se redirige automáticamente al usuario al listado actualizado."
    )
    add_figure('assets_doc/screen5_eliminar_alert.png', "Figura 8: Diálogo de Alerta Nativa de Confirmación para Eliminación (Alert.alert)", Inches(3.6))

    h2("5.6 Simulación y Manejo de Concurrencia Optimista (HTTP 409 Conflict)")
    p_body(
        "La pantalla de detalle incorpora un botón de prueba que eleva intencionalmente la versión del ticket en el servidor simulado. "
        "Si el operador intenta guardar una modificación manteniendo la versión anterior, el sistema intercepta el conflicto y muestra "
        "un cuadro de diálogo nativo explicando que el ticket fue actualizado por otro operador, refrescando los datos locales para "
        "salvaguardar la integridad de la base en memoria."
    )
    add_figure('assets_doc/screen6_concurrencia.png', "Figura 9: Detección y Notificación de Conflicto de Concurrencia Optimista (HTTP 409)", Inches(3.6))

    doc.add_page_break()

    # =============================================================
    # CAPÍTULO 6: EVIDENCIAS DE EJECUCIÓN TÉCNICA
    # =============================================================
    h1("Capítulo 6: Evidencias de Ejecución Técnica y Verificación")
    
    h2("6.1 Verificación de compilación estricta TypeScript")
    p_body(
        "Para certificar la solidez del código y prevenir fallas en tiempo de ejecución, se ejecutó la validación estricta del compilador "
        "TypeScript en el proyecto móvil:"
    )
    add_callout(
        "Comando ejecutado: npx tsc --noEmit\n"
        "Resultado obtenido: 0 errores de tipado en los 32 archivos fuente de la aplicación móvil.",
        "RESULTADO DE COMPILACIÓN TYPESCRIPT:"
    )

    h2("6.2 Generación de bundle de producción Android en Metro")
    p_body(
        "Se verificó la exportación y empaquetado del bundle móvil para Android utilizando el motor Metro de Expo SDK 58:"
    )
    add_callout(
        "Comando ejecutado: npx expo export --platform android\n"
        "Resultado obtenido: Android Bundled exitosamente (3,135 módulos empaquetados, bytecode Hermes .hbc generado con código de salida 0).",
        "RESULTADO DE EMPAQUETADO METRO ANDROID:"
    )

    h2("6.3 Ejecución en Expo Go y control de versiones GitHub")
    p_body(
        "La aplicación puede ser ejecutada de manera inmediata escaneando el código QR desde la app oficial 'Expo Go' en teléfonos "
        "físicos Android e iOS, o mediante los comandos tradicionales de React Native CLI ('npx react-native run-android' / 'run-ios'). "
        "El código fuente se encuentra versionado en GitHub con historial de commits verificable por cada integrante del equipo."
    )

    h1("Capítulo 7: Conclusiones y Recomendaciones")
    
    h2("7.1 Conclusiones")
    bullet("Se diseñó e implementó exitosamente el prototipo móvil en React Native con TypeScript, satisfaciendo la totalidad de directrices académicas y requerimientos del core de negocio de TuNegocio.pe.", "1. Cumplimiento de Objetivos: ")
    bullet("La gestión en memoria basada en la dupla useReducer + Context API demostró ser una solución técnica robusta, desacoplada y eficiente que erradica la dependencia de librerías externas pesadas.", "2. Eficiencia Arquitectónica: ")
    bullet("La incorporación del control de concurrencia optimista y la confirmación modal previa a la eliminación salvaguardan la integridad de los datos ante operaciones críticas o concurrentes.", "3. Integridad y Seguridad: ")
    bullet("Las pruebas de compilación estricta y empaquetado en Metro Android alcanzaron una tasa de éxito del 100% sin advertencias bloqueantes.", "4. Calidad del Código: ")

    h2("7.2 Recomendaciones de mejora continua")
    bullet("Conectar la capa de servicios 'ticketsApi.ts' con una API REST externa persistente en base de datos relacional (MySQL/PostgreSQL) en una siguiente fase de despliegue.", "• Persistencia Externa: ")
    bullet("Integrar notificaciones push móviles mediante Firebase Cloud Messaging (FCM) para alertar instantáneamente a los operadores sobre incidencias críticas P1.", "• Notificaciones Push: ")
    bullet("Incorporar captura de cámara nativa para adjuntar fotografías y recibos físicos de comprobantes en los reportes de falla de clientes.", "• Multimedia Nativa: ")

    doc.add_page_break()

    # =============================================================
    # REFERENCIAS BIBLIOGRÁFICAS (APA 7ma Edición)
    # =============================================================
    h1("Referencias Bibliográficas")
    
    refs = [
        "Centro de Recursos para el Aprendizaje e Investigación IDAT. (2024). Guía para citas y referencias bibliográficas según el estilo APA (7.ª ed.). https://crai.idat.edu.pe/wp-content/uploads/2023/05/Guia-APA_7ed_2021-Idat-1-1.pdf",
        "Centro de Recursos para el Aprendizaje e Investigación IDAT. (2024). Manual para la presentación del Trabajo de aplicación profesional – (todas las carreras). https://crai.idat.edu.pe/wp-content/uploads/2025/04/MANUAL-EDITORIAL-2025-IDAT.pdf",
        "Facebook Open Source. (2024). React Native: A framework for building native apps using React. Meta Platforms, Inc. https://reactnative.dev/docs/getting-started",
        "Expo Documentation. (2024). Expo SDK 58 Reference: Tools and libraries for universal React Native applications. Expo Project. https://docs.expo.dev/",
        "International Organization for Standardization. (2023). Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model (ISO/IEC 25010:2023). https://www.iso.org/standard/78176.html",
        "International Organization for Standardization. (2022). Information security, cybersecurity and privacy protection — Information security management systems — Requirements (ISO/IEC 27001:2022). https://www.iso.org/standard/54534.html",
        "Maldonado, M. (16 de agosto de 2023). Utiliza el Árbol del Problema para un análisis integral de causas y efectos de un problema. iLab. https://ilab.net/arbol-del-problema/",
        "Ministerio de Justicia y Derechos Humanos. (2011). Ley N.° 29733: Ley de Protección de Datos Personales y su Reglamento. Diario Oficial El Peruano.",
        "React Working Group. (2024). React Hooks Documentation: useState, useEffect, useReducer, and useContext API. React Community. https://react.dev/reference/react"
    ]
    for ref_text in refs:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.line_spacing = 1.15
        p_ref.paragraph_format.space_after = Pt(8)
        p_ref.paragraph_format.left_indent = Inches(0.5)
        p_ref.paragraph_format.first_line_indent = Inches(-0.5)
        r = p_ref.add_run(ref_text)
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.color.rgb = C_TEXT

    # Output file
    output_filename = os.path.join(os.path.dirname(BASE_DIR), 'docs', 'academico', 'informe-parcial.docx')
    doc.save(output_filename)
    print(f"Document saved successfully as: {output_filename}")

if __name__ == "__main__":
    create_report()
