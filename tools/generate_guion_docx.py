# -*- coding: utf-8 -*-
import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_printable_script():
    doc = Document()
    
    # -------------------------------------------------------------
    # 1. PAGE SETUP (Print-friendly margins: 2.0 cm / 0.79 inch)
    # -------------------------------------------------------------
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        section.different_first_page_header_footer = True
        
        # Header & Footer setup
        footer = section.footer
        f_p = footer.paragraphs[0]
        f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        f_run = f_p.add_run("Guion de Sustentación · Proyecto Móvil React Native | ")
        f_run.font.name = "Arial"
        f_run.font.size = Pt(8.5)
        f_run.font.color.rgb = RGBColor(148, 163, 184)
        
        fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
        f_p._p.append(fldSimple)

    # Colors
    C_NAVY = RGBColor(30, 58, 138)       # #1E3A8A - Headings
    C_CHARCOAL = RGBColor(31, 41, 55)    # #1F2937 - Subheadings
    C_TEXT = RGBColor(17, 24, 39)        # #111827 - Body Text
    C_MUTED = RGBColor(100, 116, 139)    # #64748B - Notes
    C_BLUE = RGBColor(37, 99, 235)       # #2563EB - Accents
    C_AMBER = RGBColor(180, 83, 9)       # #B45309 - Action cues

    def p_body(text, bold_prefix=None, space_after=4, italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(space_after)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.bold = True
            r_bold.font.name = "Arial"
            r_bold.font.size = Pt(10.5)
            r_bold.font.color.rgb = C_CHARCOAL
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.italic = italic
        r.font.color.rgb = C_TEXT
        return p

    def h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.name = "Arial"
        r.font.size = Pt(14)
        r.font.color.rgb = C_NAVY
        return p

    def h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.name = "Arial"
        r.font.size = Pt(12)
        r.font.color.rgb = C_CHARCOAL
        return p

    def bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(3)
        if bold_prefix:
            r_b = p.add_run(bold_prefix)
            r_b.bold = True
            r_b.font.name = "Arial"
            r_b.font.size = Pt(10)
            r_b.font.color.rgb = C_CHARCOAL
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.color.rgb = C_TEXT
        return p

    def add_action_box(title, text):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(7.0)
        tcPr = cell._tc.get_or_add_tcPr()
        
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="F59E0B"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="FFFBEB"/>')
        tcPr.append(shd)
        
        p = cell.paragraphs[0]
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r_t = p.add_run(f"📱 {title} ")
        r_t.bold = True
        r_t.font.name = "Arial"
        r_t.font.size = Pt(10)
        r_t.font.color.rgb = C_AMBER
        
        r_body = p.add_run(text)
        r_body.font.name = "Arial"
        r_body.font.size = Pt(9.5)
        r_body.font.color.rgb = C_TEXT
        
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(3)

    def add_speech_box(speaker, text):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(7.0)
        tcPr = cell._tc.get_or_add_tcPr()
        
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
        p.paragraph_format.line_spacing = 1.2
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r_t = p.add_run(f"🗣️ QUÉ DECIR ({speaker}):\n")
        r_t.bold = True
        r_t.font.name = "Arial"
        r_t.font.size = Pt(10.5)
        r_t.font.color.rgb = C_NAVY
        
        r_body = p.add_run(f'"{text}"')
        r_body.font.name = "Arial"
        r_body.font.size = Pt(10)
        r_body.font.color.rgb = C_TEXT
        
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(4)

    def add_styled_table(headers, rows, col_widths=None):
        table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            cell = hdr_cells[i]
            cell.text = header_text
            tcPr = cell._tc.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="1E3A8A"/>')
            tcPr.append(shd)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            for run in p.runs:
                run.bold = True
                run.font.name = "Arial"
                run.font.size = Pt(9)
                run.font.color.rgb = RGBColor(255, 255, 255)
                
        for r_idx, row_data in enumerate(rows):
            row_cells = table.rows[r_idx + 1].cells
            fill_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                cell = row_cells[c_idx]
                cell.text = str(cell_value)
                tcPr = cell._tc.get_or_add_tcPr()
                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_color}"/>')
                tcPr.append(shd)
                
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
                p.paragraph_format.space_before = Pt(3)
                p.paragraph_format.space_after = Pt(3)
                for run in p.runs:
                    run.font.name = "Arial"
                    run.font.size = Pt(8.5)
                    run.font.color.rgb = C_TEXT
                    
        if col_widths:
            for row in table.rows:
                for c_idx, width in enumerate(col_widths):
                    row.cells[c_idx].width = Inches(width)
                    
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(4)
        return table

    # =============================================================
    # ENCABEZADO Y FICHA TÉCNICA
    # =============================================================
    p_t = doc.add_paragraph()
    p_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t.paragraph_format.space_after = Pt(2)
    r = p_t.add_run("GUION MAESTRO DE SUSTENTACIÓN Y DEMO EN VIVO")
    r.bold = True
    r.font.name = "Arial"
    r.font.size = Pt(15)
    r.font.color.rgb = C_NAVY

    p_st = doc.add_paragraph()
    p_st.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_st.paragraph_format.space_after = Pt(12)
    r = p_st.add_run("Aplicación Móvil React Native (Expo SDK 58) | TuNegocio.pe · IDAT Sexto Ciclo")
    r.italic = True
    r.font.name = "Arial"
    r.font.size = Pt(10.5)
    r.font.color.rgb = C_MUTED

    # Ficha del Equipo
    ficha_headers = ["Expositor", "Alumno / Código", "Responsabilidad Principal", "Tiempo Asignado"]
    ficha_rows = [
        ["Expositor 1", "Cahuana Ccallocunto, Aldair (SL70869993)", "Intro, Core de Negocio, Problemática y UI Base", "00:00 - 02:30 (2.5 min)"],
        ["Expositor 2", "Monroy Gutierrez, Henry (SV45340722)", "Arquitectura, useReducer + Context API y Validaciones", "02:30 - 05:00 (2.5 min)"],
        ["Expositor 3", "Morales Quiroga, Josue (VV60962824)", "Demo 1: Dashboard, Buscador, Filtros y Formulario", "05:00 - 08:00 (3.0 min)"],
        ["Expositor 4", "Sánchez Peña, Eduardo (IV73197168)", "Demo 2: Detalle/Edición, Concurrencia 409, Eliminación Alert", "08:00 - 10:30 (2.5 min)"],
        ["Todo el Equipo", "4 Integrantes", "Ronda de Preguntas y Respuestas Técnicas", "10:30 - 15:00 (Ronda Q&A)"]
    ]
    add_styled_table(ficha_headers, ficha_rows, [1.1, 2.3, 2.2, 1.4])

    # =============================================================
    # CHECKLIST PREVIO A EXPONER
    # =============================================================
    h1("1. Checklist Rápido (5 Minutos Antes de Entrar)")
    bullet("Tener la terminal abierta en la carpeta 'mobile' con el comando: npx expo start", "[1] Servidor Expo Iniciado: ")
    bullet("Celular con la app abierta en Expo Go, proyectado vía USB con 'scrcpy' (o emulador de Android Studio visible con la tecla 'a').", "[2] Pantalla Proyectada: ")
    bullet("Si el Wi-Fi de IDAT aísla dispositivos, iniciar con: npx expo start --tunnel", "[3] Conectividad Wi-Fi: ")
    bullet("Tener impreso este guion físico sobre la mesa para evitar distracciones en pantalla.", "[4] Material Físico: ")

    doc.add_page_break()

    # =============================================================
    # BLOQUE 1: INTRODUCCIÓN Y PROBLEMÁTICA
    # =============================================================
    h1("2. Guion Detallado de Exposición (Paso a Paso)")
    
    h2("BLOQUE 1: Introducción, Core de Negocio y Problemática (00:00 - 02:30)")
    p_body("Aldair Cahuana Ccallocunto (o presentador inicial).", bold_prefix="Expositor: ")
    p_body("Diapositiva de carátula institucional y diagrama de flujo/organigrama.", bold_prefix="Apoyo Visual: ")

    add_speech_box(
        "Aldair Cahuana",
        "Buenos días profesor y miembros del jurado. Somos estudiantes del sexto ciclo de la carrera de Desarrollo "
        "de Sistemas Frontend y Backend en IDAT. Nuestro equipo está conformado por Henry Monroy, Josue Morales, "
        "Eduardo Sánchez y quien les habla, Aldair Cahuana.\n\n"
        "Hoy sustentamos nuestro proyecto: PlatformOps & Product Feedback Hub, una aplicación móvil desarrollada en "
        "React Native con TypeScript y Expo, orientada al core de negocio de la empresa peruana TuNegocio.pe.\n\n"
        "TuNegocio.pe es una empresa SaaS de facturación electrónica y gestión comercial que brinda servicio a más de "
        "10,000 micro y pequeñas empresas a nivel nacional. En este modelo de negocio, un fallo en el software detiene la "
        "emisión de comprobantes tributarios ante SUNAT y paraliza las ventas de los clientes.\n\n"
        "La situación problemática detectada fue que la comunicación entre Soporte Técnico y TI/Desarrollo se gestionaba "
        "por grupos informales de WhatsApp. Esto provocaba tres graves dolores operativos: pérdida de información técnica, "
        "falta de priorización de errores críticos y nula visibilidad del estado de atención.\n\n"
        "Para erradicar este cuello de botella, diseñamos una solución móvil nativa con arquitectura en memoria que estandariza "
        "el reporte, diagnóstico y resolución de incidencias. Cedo la palabra a mi compañero Henry Monroy para explicar la arquitectura."
    )

    doc.add_page_break()

    # =============================================================
    # BLOQUE 2: ARQUITECTURA Y HOOKS
    # =============================================================
    h2("BLOQUE 2: Arquitectura del Software y Hooks Obligatorios (02:30 - 05:00)")
    p_body("Henry Raul Monroy Gutierrez.", bold_prefix="Expositor: ")
    p_body("Diapositiva de estructura de carpetas y tabla de hooks de la rúbrica.", bold_prefix="Apoyo Visual: ")

    add_speech_box(
        "Henry Monroy",
        "Gracias, Aldair. Estimado docente, la arquitectura de nuestra aplicación se construyó siguiendo buenas prácticas "
        "de separación por capas dentro de 'mobile/src/':\n"
        "• Screens: Pantallas limpias desacopladas de la persistencia.\n"
        "• Components: Tarjetas modulares, badges de severidad e iconografía SVG por tipo de servicio.\n"
        "• Models y Types: Tipado TypeScript estricto de la entidad principal 'Ticket' con los campos obligatorios: id, "
        "clienteNombre, teléfono directo de contacto, categoría, prioridad (P1 a P4), descripción, estado, fecha de registro y versión.\n\n"
        "Sobre el manejo de datos, en estricto cumplimiento de la rúbrica académica, la aplicación no requiere base de datos física "
        "externa, sino que gestiona toda su información en memoria mediante los cuatro hooks obligatorios de React:\n"
        "1. useState: Para el manejo de campos en formularios, texto de búsqueda reactiva y chips de filtrado.\n"
        "2. useEffect: Para inicializar la data en memoria y sincronizar métricas en tiempo real.\n"
        "3. useReducer: El motor del CRUD. Centralizamos las transiciones en 'ticketReducer' con acciones atómicas e inmutables: "
        "LOAD_SUCCESS, ADD_TICKET, UPDATE_TICKET y DELETE_TICKET.\n"
        "4. Context API: Con TicketProvider distribuimos el estado global y las funciones a toda la jerarquía de pantallas.\n\n"
        "Adicionalmente, implementamos control de concurrencia optimista con versión de registro para capturar el error HTTP 409 "
        "y evitar sobreescrituras accidentales entre operadores. Pasamos ahora a la demostración en vivo con Josue Morales."
    )

    doc.add_page_break()

    # =============================================================
    # BLOQUE 3: DEMOSTRACIÓN EN VIVO 1
    # =============================================================
    h2("BLOQUE 3: Demostración en Vivo Parte 1 (05:00 - 08:00)")
    p_body("Josue David Morales Quiroga.", bold_prefix="Expositor: ")
    p_body("Pantalla del celular o emulador proyectada en vivo ante el jurado.", bold_prefix="Apoyo Visual: ")

    add_action_box(
        "ACCIÓN 1 EN EL CELULAR: PANTALLA PRINCIPAL / DASHBOARD",
        "Tener abierta la app en la pantalla 'Home'. Apuntar con el puntero o dedo hacia las tarjetas de KPIs superiores."
    )

    add_speech_box(
        "Josue Morales",
        "Buenos días profesor. Pasamos a demostrar el funcionamiento real de la aplicación en el dispositivo móvil.\n\n"
        "Aquí vemos la pantalla de Bienvenida y Dashboard Operativo (HomeScreen). En la parte superior observamos las métricas "
        "en tiempo real calculadas directamente desde el useReducer: total de tickets abiertos, incidencias críticas P1 que "
        "comprometen el servicio y el cumplimiento global del SLA. Abajo se aprecian las incidencias más recientes registradas."
    )

    add_action_box(
        "ACCIÓN 2 EN EL CELULAR: LISTADO, BUSCADOR Y CHIPS DE FILTRO",
        "Tocar el botón 'Ver Incidencias' (o tab inferior). Luego escribir 'Firma' en el buscador. "
        "Borrar el texto y tocar los chips de filtro [NUEVO], [EN DIAGNÓSTICO], [RESUELTO]."
    )

    add_speech_box(
        "Josue Morales",
        "Ingresamos a la Bandeja de Incidencias (TicketListScreen). Noten la presentación en tarjetas individuales con elevación, "
        "chips de color según estado y su categoría con icono respectivo.\n\n"
        "Si escribo en la barra de búsqueda 'Firma', el hook useState filtra en memoria al instante sin recargar la pantalla. "
        "Asimismo, si toco los chips superiores de estado —por ejemplo 'NUEVO' o 'EN DIAGNÓSTICO'— la lista responde de forma reactiva."
    )

    add_action_box(
        "ACCIÓN 3 EN EL CELULAR: CREAR INCIDENCIA Y VALIDACIONES CONTEXTUALES",
        "Presionar el botón flotante '+' (FAB). Intentar presionar 'Crear Incidencia' con campos vacíos. "
        "Mostrar los errores en rojo. Luego llenar: Título: 'Falla Web Service SUNAT', Cliente: 'Distribuidora Lima Norte', "
        "Teléfono: '+51 984 771 229', Categoría: 'API', Prioridad: 'P1 - Crítica', Descripción: 'Timeout en resumen diario'. "
        "Pulsar 'Crear Incidencia'."
    )

    add_speech_box(
        "Josue Morales",
        "Ahora crearemos una nueva orden de atención con el botón '+'. Como exige la directriz de UI/UX, si intentamos guardar "
        "con campos vacíos, se despliegan mensajes de error contextuales de color rojo exactamente debajo de cada input.\n\n"
        "Completamos los datos: Título 'Falla Web Service SUNAT', Cliente 'Distribuidora Lima Norte', y el teléfono directo "
        "'+51 984 771 229' exigido por la rúbrica. Seleccionamos categoría API y prioridad crítica P1.\n\n"
        "Al presionar 'Crear Incidencia', se despacha la acción ADD_TICKET en el reducer. Se añade de inmediato al estado en "
        "memoria, sale la confirmación y al volver a la bandeja ya visualizamos el ticket recién creado en la primera posición.\n\n"
        "Cedo el paso a Eduardo Sánchez para mostrar la edición, el bloqueo optimista y la eliminación confirmada."
    )

    doc.add_page_break()

    # =============================================================
    # BLOQUE 4: DEMOSTRACIÓN EN VIVO 2 Y CIERRE
    # =============================================================
    h2("BLOQUE 4: Demostración en Vivo Parte 2 y Cierre (08:00 - 10:30)")
    p_body("Eduardo Enrique Sánchez Peña.", bold_prefix="Expositor: ")
    p_body("Pantalla del celular o emulador proyectada en vivo ante el jurado.", bold_prefix="Apoyo Visual: ")

    add_action_box(
        "ACCIÓN 4 EN EL CELULAR: DETALLE Y EDICIÓN EN MEMORIA",
        "Tocar el ticket recién creado en la lista. Mostrar los datos de contacto y teléfono. "
        "Presionar 'Editar Incidencia', cambiar estado a 'EN_DIAGNOSTICO' y presionar 'Guardar Cambios'."
    )

    add_speech_box(
        "Eduardo Sánchez",
        "Gracias, Josue. Al seleccionar cualquier incidencia entramos a TicketDetailScreen. Vemos toda la metadata estructurada: "
        "cliente, teléfono directo de contacto, versión en memoria, categoría y descripción técnica.\n\n"
        "Si entramos al modo de edición, podemos actualizar el estado de atención a 'EN_DIAGNOSTICO'. Al guardar, se despacha "
        "UPDATE_TICKET al reducer y la información se sincroniza instantáneamente en todos los componentes."
    )

    add_action_box(
        "ACCIÓN 5 EN EL CELULAR: SIMULAR CONFLICTO DE CONCURRENCIA (HTTP 409)",
        "En la pantalla de detalle, presionar el botón secundario 'Simular conflicto concurrente'. "
        "Luego intentar guardar un cambio de estado para provocar el conflicto. Mostrar la alerta en pantalla."
    )

    add_speech_box(
        "Eduardo Sánchez",
        "¿Qué pasa si dos operadores intentan modificar el mismo ticket a la vez? Lo probamos con este botón de simulación: "
        "elevamos la versión remota a versión 2. Ahora, si intento guardar con mi versión obsoleta versión 1, el sistema intercepta "
        "el choque y despliega una alerta nativa: 'Conflicto de Concurrencia (409)'. Los datos se recargan automáticamente, evitando "
        "que un operador sobreescriba por error el trabajo de otro."
    )

    add_action_box(
        "ACCIÓN 6 EN EL CELULAR: ELIMINACIÓN CON CONFIRMACIÓN ALERT",
        "Presionar el botón rojo 'Eliminar Incidencia'. Mostrar el diálogo nativo Alert con 'Cancelar' y 'Eliminar'. "
        "Tocar 'Cancelar' primero, luego volver a pulsar y tocar 'Sí, Eliminar'. Verificar retorno al listado."
    )

    add_speech_box(
        "Eduardo Sánchez",
        "Finalmente, probamos la eliminación. La rúbrica prohíbe borrar registros sin confirmación. Al pulsar 'Eliminar Incidencia', "
        "se activa el diálogo nativo Alert.alert con opciones 'Cancelar' y 'Eliminar'. Al confirmar, se despacha DELETE_TICKET, "
        "el registro desaparece de la memoria compartida y el listado y métricas del Dashboard se descuentan en vivo.\n\n"
        "Certificamos además que el proyecto compila con 0 errores de TypeScript con 'npx tsc --noEmit' y genera su bundle de producción "
        "Android en Metro con 3,135 módulos empaquetados exitosamente.\n\n"
        "Con esto demostramos el ciclo CRUD completo, la solidez de los hooks y la usabilidad de la interfaz. Muchas gracias."
    )

    doc.add_page_break()

    # =============================================================
    # BANCO DE PREGUNTAS Y DEFENSAS TÉCNICAS
    # =============================================================
    h1("3. Banco de Preguntas y Respuestas para la Defensa")
    p_body(
        "Respuestas clave preparadas ante las preguntas más frecuentes del docente o jurado evaluador:"
    )

    p_body("1. '¿Por qué no usaron una base de datos física como SQLite o Firebase?'", bold_prefix="PREGUNTA: ")
    add_speech_box(
        "Henry o Eduardo",
        "Profesor, la directriz de la rúbrica del curso establece explícitamente que no es obligatorio el uso de una base de datos "
        "externa y que la información debe manejarse en memoria mediante useReducer y Context API. El objetivo pedagógico es evidenciar "
        "el dominio de los hooks avanzados de React y el flujo de datos unidireccional. La capa de datos en 'ticketsApi.ts' está totalmente "
        "desacoplada, por lo que en el siguiente ciclo basta con sustituir las promesas locales por llamadas HTTP con Axios sin tocar "
        "la interfaz ni los componentes."
    )

    p_body("2. '¿Por qué eligieron useReducer en vez de manejar todo con useState?'", bold_prefix="PREGUNTA: ")
    add_speech_box(
        "Henry Monroy",
        "Porque useState se recomienda para estados locales sencillos de un único componente, mientras que useReducer desacopla la "
        "lógica de negocio de la vista. Al centralizar las acciones en 'ticketReducer', evitamos tener múltiples funciones dispersas "
        "mutando arrays. Garantizamos transiciones atómicas, inmutabilidad de datos y facilitamos las pruebas unitarias."
    )

    p_body("3. '¿Cómo aseguraron la validación de los datos en el formulario?'", bold_prefix="PREGUNTA: ")
    add_speech_box(
        "Josue o Aldair",
        "Implementamos una función 'validateForm' en TicketFormScreen vinculada a un estado 'errors'. Comprobamos longitud mínima de título, "
        "presencia de descripción y validamos que el teléfono directo tenga al menos 9 dígitos numéricos válidos. Si hay omisiones, "
        "los mensajes de advertencia se muestran de forma contextual exactamente debajo de la caja de texto afectada."
    )

    p_body("4. '¿Qué es y cómo funciona el bloqueo optimista de concurrencia?'", bold_prefix="PREGUNTA: ")
    add_speech_box(
        "Eduardo Sánchez",
        "El bloqueo optimista permite que varios usuarios lean el mismo registro sin bloquear la base. La entidad tiene una propiedad "
        "'version'. Al guardar una modificación, el servicio verifica si la versión enviada sigue coincidiendo con la versión actual en memoria. "
        "Si otro operador ya la modificó y elevó la versión, se rechaza la operación con código HTTP 409 Conflict y se fuerza a recargar "
        "para no pisar datos ajenos."
    )

    # Save document
    base_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(os.path.dirname(base_dir), 'docs', 'exposicion', 'Guion_Exposicion_Imprimible_AppMovil.docx')
    doc.save(out_file)
    print(f"Document saved successfully as: {out_file}")

if __name__ == "__main__":
    create_printable_script()
