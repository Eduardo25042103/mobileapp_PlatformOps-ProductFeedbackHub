import os
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets_doc')
os.makedirs(ASSETS_DIR, exist_ok=True)

def asset_path(filename):
    return os.path.join(ASSETS_DIR, filename)

# Load fonts
font_path = 'C:/Windows/Fonts/'
f_title = ImageFont.truetype(font_path + 'segoeui.ttf', 20)
f_sub = ImageFont.truetype(font_path + 'segoeui.ttf', 14)
f_body = ImageFont.truetype(font_path + 'segoeui.ttf', 13)
f_body_bold = ImageFont.truetype(font_path + 'segoeuib.ttf', 13)
f_small = ImageFont.truetype(font_path + 'segoeui.ttf', 11)
f_kpi = ImageFont.truetype(font_path + 'segoeuib.ttf', 28)

def draw_phone_base(title="TuNegocio.pe - PlatformOps"):
    w, h = 480, 880
    im = Image.new('RGB', (w, h), '#0F172A')
    d = ImageDraw.Draw(im)
    
    # Status bar
    d.text((24, 10), '10:45', fill='#94A3B8', font=f_small)
    d.text((410, 10), '📶 100%', fill='#94A3B8', font=f_small)
    
    # App Header
    d.rounded_rectangle([16, 36, 464, 86], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((32, 48), title, fill='#F8FAFC', font=f_sub)
    d.text((32, 66), 'Portal de Soporte y Operaciones TI', fill='#38BDF8', font=f_small)
    return im, d, w, h

# -------------------------------------------------------------
# 1. SCREEN 1: DASHBOARD / HOME SCREEN
# -------------------------------------------------------------
def make_screen1():
    im, d, w, h = draw_phone_base("Dashboard Operativo")
    
    # Operator info card
    d.rounded_rectangle([16, 96, 464, 150], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((32, 106), 'Operador Conectado:', fill='#94A3B8', font=f_small)
    d.text((32, 124), 'Henry Monroy · Soporte & TI', fill='#F8FAFC', font=f_body_bold)
    d.rounded_rectangle([340, 110, 444, 136], radius=6, fill='#0284C7')
    d.text((352, 115), 'EN LÍNEA', fill='#FFFFFF', font=f_small)
    
    # KPIs Title
    d.text((20, 162), 'Métricas de Atención en Tiempo Real', fill='#E2E8F0', font=f_body_bold)
    
    # KPI 1 (Abiertos)
    d.rounded_rectangle([16, 184, 158, 264], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((26, 194), 'ABIERTOS', fill='#94A3B8', font=f_small)
    d.text((26, 214), '4', fill='#38BDF8', font=f_kpi)
    d.text((26, 246), '2 en proceso', fill='#64748B', font=f_small)
    
    # KPI 2 (Severidad P1)
    d.rounded_rectangle([168, 184, 310, 264], radius=10, fill='#1E293B', outline='#EF4444', width=1)
    d.text((178, 194), 'CRÍTICOS P1', fill='#EF4444', font=f_small)
    d.text((178, 214), '1', fill='#EF4444', font=f_kpi)
    d.text((178, 246), 'Atención urgente', fill='#64748B', font=f_small)
    
    # KPI 3 (SLA)
    d.rounded_rectangle([320, 184, 464, 264], radius=10, fill='#1E293B', outline='#22C55E', width=1)
    d.text((330, 194), 'SLA GLOBAL', fill='#22C55E', font=f_small)
    d.text((330, 214), '98.4%', fill='#22C55E', font=f_sub)
    d.text((330, 246), 'Objetivo >95%', fill='#64748B', font=f_small)
    
    # Quick Action Buttons
    d.text((20, 276), 'Acciones Rápidas', fill='#E2E8F0', font=f_body_bold)
    d.rounded_rectangle([16, 298, 234, 344], radius=8, fill='#2563EB')
    d.text((45, 312), '➕  Nueva Incidencia', fill='#FFFFFF', font=f_body_bold)
    
    d.rounded_rectangle([246, 298, 464, 344], radius=8, fill='#334155')
    d.text((285, 312), '📋  Ver Incidencias', fill='#FFFFFF', font=f_body_bold)
    
    # Recent Tickets
    d.text((20, 360), 'Incidencias Recientes', fill='#E2E8F0', font=f_body_bold)
    
    # Card 1
    d.rounded_rectangle([16, 384, 464, 510], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((30, 396), 'INC-2026-001', fill='#38BDF8', font=f_body_bold)
    d.rounded_rectangle([360, 394, 448, 416], radius=5, fill='#EF4444')
    d.text((372, 397), 'P1 CRÍTICA', fill='#FFFFFF', font=f_small)
    d.text((30, 422), 'Firma Electrónica · Inversiones El Roble S.A.C.', fill='#94A3B8', font=f_small)
    d.text((30, 442), 'Error 500 al firmar XML de boletas masivas', fill='#F1F5F9', font=f_body)
    d.text((30, 466), '📞 +51 987 654 321  ·  Estado: NUEVO', fill='#38BDF8', font=f_small)
    d.text((30, 488), 'Registrado: 02/11/2026 14:30', fill='#64748B', font=f_small)
    
    # Card 2
    d.rounded_rectangle([16, 524, 464, 650], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((30, 536), 'INC-2026-002', fill='#38BDF8', font=f_body_bold)
    d.rounded_rectangle([360, 534, 448, 556], radius=5, fill='#F59E0B')
    d.text((376, 537), 'P2 ALTA', fill='#FFFFFF', font=f_small)
    d.text((30, 562), 'Base de Datos · Comercializadora del Centro', fill='#94A3B8', font=f_small)
    d.text((30, 582), 'Timeout en consulta de inventario réplica', fill='#F1F5F9', font=f_body)
    d.text((30, 606), '📞 +51 912 345 678  ·  Estado: EN_DIAGNOSTICO', fill='#38BDF8', font=f_small)
    d.text((30, 628), 'Registrado: 02/11/2026 12:15', fill='#64748B', font=f_small)
    
    # Card 3
    d.rounded_rectangle([16, 664, 464, 790], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((30, 676), 'INC-2026-003', fill='#38BDF8', font=f_body_bold)
    d.rounded_rectangle([360, 674, 448, 696], radius=5, fill='#22C55E')
    d.text((370, 677), 'RESUELTO', fill='#FFFFFF', font=f_small)
    d.text((30, 702), 'Impresión · Ferretería San Juan', fill='#94A3B8', font=f_small)
    d.text((30, 722), 'Formato de ticket 80mm desalineado', fill='#F1F5F9', font=f_body)
    d.text((30, 746), '📞 +51 955 882 114  ·  P3 MEDIA', fill='#38BDF8', font=f_small)
    d.text((30, 768), 'Registrado: 01/11/2026 18:40', fill='#64748B', font=f_small)

    im.save(asset_path('screen1_dashboard.png'))

# -------------------------------------------------------------
# 2. SCREEN 2: TICKET LIST WITH SEARCH AND FILTERS
# -------------------------------------------------------------
def make_screen2():
    im, d, w, h = draw_phone_base("Bandeja de Incidencias")
    
    # Search Bar
    d.rounded_rectangle([16, 96, 464, 142], radius=8, fill='#1E293B', outline='#38BDF8', width=1)
    d.text((28, 108), '🔍  Firma', fill='#FFFFFF', font=f_body)
    d.text((430, 108), '✖', fill='#94A3B8', font=f_body)
    
    # Filter Chips
    d.text((20, 154), 'Filtrar por Estado:', fill='#94A3B8', font=f_small)
    
    chips = [('TODOS', False), ('NUEVO (1)', True), ('EN DIAGNÓSTICO', False), ('RESUELTO', False)]
    cx = 16
    for text, active in chips:
        bg = '#2563EB' if active else '#1E293B'
        border = '#38BDF8' if active else '#334155'
        cw = len(text) * 8 + 20
        d.rounded_rectangle([cx, 174, cx + cw, 204], radius=6, fill=bg, outline=border, width=1)
        d.text((cx + 10, 181), text, fill='#FFFFFF', font=f_small)
        cx += cw + 8
        
    # Result count
    d.text((20, 218), '1 resultado encontrado para "Firma"', fill='#38BDF8', font=f_small)
    
    # Ticket Card Match
    d.rounded_rectangle([16, 240, 464, 386], radius=10, fill='#1E293B', outline='#38BDF8', width=2)
    d.text((30, 252), 'INC-2026-001', fill='#38BDF8', font=f_body_bold)
    d.rounded_rectangle([360, 250, 448, 272], radius=5, fill='#EF4444')
    d.text((372, 253), 'P1 CRÍTICA', fill='#FFFFFF', font=f_small)
    
    d.text((30, 278), 'Cliente: Inversiones El Roble S.A.C.', fill='#F1F5F9', font=f_body_bold)
    d.text((30, 300), '📞 Teléfono: +51 987 654 321', fill='#38BDF8', font=f_body)
    d.text((30, 322), 'Categoría: Firma Electrónica  ·  Estado: NUEVO', fill='#94A3B8', font=f_small)
    d.text((30, 342), 'Error 500 al firmar digitalmente boletas XML...', fill='#E2E8F0', font=f_body)
    d.text((30, 364), 'Registrado: 02/11/2026 14:30 · Versión: 1', fill='#64748B', font=f_small)
    
    # Empty space illustration / helper
    d.rounded_rectangle([16, 404, 464, 520], radius=10, fill='#0F172A', outline='#334155', width=1)
    d.text((60, 436), 'ℹ️  Búsqueda reactiva con useState y Reducer', fill='#94A3B8', font=f_body)
    d.text((45, 462), 'Filtra al instante por código, cliente, descripción o teléfono', fill='#64748B', font=f_small)
    d.text((100, 484), 'Sin peticiones HTTP innecesarias al servidor', fill='#38BDF8', font=f_small)
    
    # Floating Action Button (FAB)
    d.ellipse([390, 780, 454, 844], fill='#2563EB', outline='#60A5FA', width=2)
    d.text((410, 792), '➕', fill='#FFFFFF', font=f_sub)
    
    im.save(asset_path('screen2_listado.png'))

# -------------------------------------------------------------
# 3. SCREEN 3: FORM SCREEN WITH VALIDATIONS
# -------------------------------------------------------------
def make_screen3():
    im, d, w, h = draw_phone_base("Registrar Nueva Incidencia")
    
    y = 96
    # Title input
    d.text((20, y), 'TÍTULO DE LA INCIDENCIA (*)', fill='#94A3B8', font=f_small)
    d.rounded_rectangle([16, y+20, 464, y+62], radius=8, fill='#1E293B', outline='#334155', width=1)
    d.text((28, y+32), 'Falla en comunicación con API SUNAT', fill='#F1F5F9', font=f_body)
    
    y += 74
    # Client input
    d.text((20, y), 'CLIENTE / RAZÓN SOCIAL (*)', fill='#94A3B8', font=f_small)
    d.rounded_rectangle([16, y+20, 464, y+62], radius=8, fill='#1E293B', outline='#334155', width=1)
    d.text((28, y+32), 'Distribuidora Lima Norte E.I.R.L.', fill='#F1F5F9', font=f_body)
    
    y += 74
    # Phone input (WITH VALIDATION PREVIEW)
    d.text((20, y), 'TELÉFONO DE CONTACTO (*) - Requisito Rúbrica', fill='#38BDF8', font=f_small)
    d.rounded_rectangle([16, y+20, 464, y+62], radius=8, fill='#1E293B', outline='#EF4444', width=1)
    d.text((28, y+32), '📞  98477122', fill='#F1F5F9', font=f_body)
    d.text((20, y+66), '⚠️ El teléfono debe tener al menos 9 dígitos (+51...)', fill='#EF4444', font=f_small)
    
    y += 88
    # Category Selector
    d.text((20, y), 'CATEGORÍA / TIPO DE SERVICIO (*)', fill='#94A3B8', font=f_small)
    cats = [('Firma Electrónica', False), ('API Rest', True), ('Base de Datos', False)]
    cx = 16
    for ctext, active in cats:
        bg = '#2563EB' if active else '#1E293B'
        border = '#38BDF8' if active else '#334155'
        cw = len(ctext) * 8 + 24
        d.rounded_rectangle([cx, y+20, cx+cw, y+50], radius=6, fill=bg, outline=border, width=1)
        d.text((cx+12, y+26), ctext, fill='#FFFFFF', font=f_small)
        cx += cw + 10
        
    y += 66
    # Priority Selector
    d.text((20, y), 'PRIORIDAD / SEVERIDAD (*)', fill='#94A3B8', font=f_small)
    prios = [('P1 - Crítica', True), ('P2 - Alta', False), ('P3 - Media', False), ('P4 - Baja', False)]
    cx = 16
    for ptext, active in prios:
        bg = '#EF4444' if active else '#1E293B'
        border = '#F87171' if active else '#334155'
        cw = len(ptext) * 7 + 16
        d.rounded_rectangle([cx, y+20, cx+cw, y+50], radius=6, fill=bg, outline=border, width=1)
        d.text((cx+8, y+26), ptext, fill='#FFFFFF', font=f_small)
        cx += cw + 8

    y += 66
    # Description input
    d.text((20, y), 'DESCRIPCIÓN TÉCNICA DEL PROBLEMA (*)', fill='#94A3B8', font=f_small)
    d.rounded_rectangle([16, y+20, 464, y+100], radius=8, fill='#1E293B', outline='#334155', width=1)
    d.text((28, y+32), 'El servicio devuelve error HTTP 504 Timeout al procesar', fill='#F1F5F9', font=f_small)
    d.text((28, y+50), 'el resumen diario de comprobantes electrónicos con SUNAT.', fill='#F1F5F9', font=f_small)
    
    # Submit Button
    d.rounded_rectangle([16, 780, 464, 830], radius=8, fill='#2563EB')
    d.text((150, 794), '💾  Crear Incidencia (CRUD)', fill='#FFFFFF', font=f_body_bold)
    
    im.save(asset_path('screen3_crear.png'))

# -------------------------------------------------------------
# 4. SCREEN 4: DETAIL AND EDIT SCREEN
# -------------------------------------------------------------
def make_screen4():
    im, d, w, h = draw_phone_base("Detalle y Edición de Incidencia")
    
    # Ticket Badge & Status
    d.rounded_rectangle([16, 96, 464, 150], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((30, 108), 'INC-2026-001', fill='#38BDF8', font=f_sub)
    d.rounded_rectangle([360, 106, 448, 130], radius=5, fill='#0284C7')
    d.text((375, 111), 'NUEVO', fill='#FFFFFF', font=f_small)
    d.text((30, 130), 'Versión de concurrencia: v1  ·  Prioridad: P1 Crítica', fill='#94A3B8', font=f_small)
    
    # Metadata Details
    d.rounded_rectangle([16, 160, 464, 300], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((30, 172), 'INFORMACIÓN DEL CLIENTE Y CONTACTO', fill='#38BDF8', font=f_small)
    d.text((30, 194), 'Cliente: Inversiones El Roble S.A.C.', fill='#F1F5F9', font=f_body_bold)
    d.text((30, 218), '📞 Teléfono Directo: +51 987 654 321', fill='#38BDF8', font=f_body_bold)
    d.text((30, 242), 'Categoría: Firma Electrónica  ·  Plan: Empresarial Pro', fill='#94A3B8', font=f_small)
    d.text((30, 266), 'Fecha Registro: 02/11/2026, 14:30  ·  Por: Operador Soporte', fill='#64748B', font=f_small)
    
    # Edit Section
    d.text((20, 314), 'Editar Estado y Severidad (useReducer):', fill='#E2E8F0', font=f_body_bold)
    
    # Estado Dropdown
    d.rounded_rectangle([16, 336, 234, 380], radius=8, fill='#0F172A', outline='#38BDF8', width=1)
    d.text((26, 348), 'Estado: EN_DIAGNOSTICO  ▼', fill='#38BDF8', font=f_small)
    
    # Prioridad Dropdown
    d.rounded_rectangle([246, 336, 464, 380], radius=8, fill='#0F172A', outline='#EF4444', width=1)
    d.text((256, 348), 'Severidad: P1 CRÍTICA  ▼', fill='#EF4444', font=f_small)
    
    # Description box
    d.rounded_rectangle([16, 394, 464, 490], radius=10, fill='#1E293B', outline='#334155', width=1)
    d.text((30, 406), 'Descripción del Problema:', fill='#94A3B8', font=f_small)
    d.text((30, 426), 'Error 500 recurrente en endpoint /v1/firmar-boleta.', fill='#F1F5F9', font=f_body)
    d.text((30, 448), 'Los logs indican timeout con el certificado digital de SUNAT.', fill='#94A3B8', font=f_small)
    
    # Action Buttons
    d.rounded_rectangle([16, 510, 464, 556], radius=8, fill='#2563EB')
    d.text((150, 524), '💾  Guardar Modificaciones', fill='#FFFFFF', font=f_body_bold)
    
    d.rounded_rectangle([16, 568, 464, 614], radius=8, fill='#334155', outline='#64748B', width=1)
    d.text((115, 582), '⚡  Simular Conflicto Concurrente (409)', fill='#E2E8F0', font=f_body)
    
    d.rounded_rectangle([16, 626, 464, 672], radius=8, fill='#7F1D1D', outline='#EF4444', width=1)
    d.text((140, 640), '🗑️  Eliminar Registro (Confirmar)', fill='#FCA5A5', font=f_body_bold)
    
    im.save(asset_path('screen4_detalle.png'))

# -------------------------------------------------------------
# 5. SCREEN 5: DELETE WITH NATIVE CONFIRMATION ALERT
# -------------------------------------------------------------
def make_screen5():
    # Load base detail screen
    im = Image.open(asset_path('screen4_detalle.png'))
    
    # Create dark semi-transparent overlay
    overlay = Image.new('RGBA', im.size, (0, 0, 0, 160))
    im = Image.alpha_composite(im.convert('RGBA'), overlay).convert('RGB')
    d = ImageDraw.Draw(im)
    
    # Native Alert Modal Box
    dx1, dy1, dx2, dy2 = 40, 320, 440, 520
    d.rounded_rectangle([dx1, dy1, dx2, dy2], radius=16, fill='#1E293B', outline='#64748B', width=2)
    
    # Title
    d.text((dx1+30, dy1+25), '🗑️ Eliminar Incidencia', fill='#FFFFFF', font=f_title)
    
    # Message
    d.text((dx1+30, dy1+65), '¿Estás seguro de que deseas eliminar permanentemente', fill='#E2E8F0', font=f_body)
    d.text((dx1+30, dy1+85), 'la incidencia INC-2026-001 de Inversiones El Roble?', fill='#38BDF8', font=f_body_bold)
    d.text((dx1+30, dy1+110), 'Esta acción despachará DELETE_TICKET en memoria.', fill='#94A3B8', font=f_small)
    
    # Buttons
    # Cancel Button
    d.rounded_rectangle([dx1+25, dy1+140, dx1+180, dy1+185], radius=8, fill='#334155')
    d.text((dx1+65, dy1+152), 'Cancelar', fill='#E2E8F0', font=f_body_bold)
    
    # Delete Button
    d.rounded_rectangle([dx1+195, dy1+140, dx2-25, dy1+185], radius=8, fill='#DC2626')
    d.text((dx1+230, dy1+152), 'Sí, Eliminar', fill='#FFFFFF', font=f_body_bold)
    
    im.save(asset_path('screen5_eliminar_alert.png'))

# -------------------------------------------------------------
# 6. SCREEN 6: OPTIMISTIC CONCURRENCY CONFLICT (HTTP 409)
# -------------------------------------------------------------
def make_screen6():
    # Load base detail screen
    im = Image.open(asset_path('screen4_detalle.png'))
    
    # Create dark overlay
    overlay = Image.new('RGBA', im.size, (0, 0, 0, 160))
    im = Image.alpha_composite(im.convert('RGBA'), overlay).convert('RGB')
    d = ImageDraw.Draw(im)
    
    # Native Alert Modal Box
    dx1, dy1, dx2, dy2 = 40, 310, 440, 540
    d.rounded_rectangle([dx1, dy1, dx2, dy2], radius=16, fill='#1E293B', outline='#F59E0B', width=2)
    
    # Title
    d.text((dx1+30, dy1+25), '⚠️ Conflicto de Concurrencia (409)', fill='#F59E0B', font=f_title)
    
    # Message
    d.text((dx1+30, dy1+65), 'Este ticket fue modificado por otro operador en segundo plano.', fill='#F1F5F9', font=f_body)
    d.text((dx1+30, dy1+90), '• Tu versión local: v1', fill='#EF4444', font=f_body)
    d.text((dx1+30, dy1+110), '• Versión más reciente en el servidor: v2', fill='#22C55E', font=f_body)
    d.text((dx1+30, dy1+135), 'Se actualizaron los datos automáticamente para evitar sobreescritura.', fill='#94A3B8', font=f_small)
    
    # Button
    d.rounded_rectangle([dx1+25, dy1+165, dx2-25, dy1+210], radius=8, fill='#0284C7')
    d.text((dx1+110, dy1+177), 'Entendido y Recargar Datos', fill='#FFFFFF', font=f_body_bold)
    
    im.save(asset_path('screen6_concurrencia.png'))

make_screen1()
make_screen2()
make_screen3()
make_screen4()
make_screen5()
make_screen6()
print('All 6 screen mockups generated successfully.')
