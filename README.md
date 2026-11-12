# PlatformOps & Product Feedback Hub - Mobile App

Aplicación móvil empresarial desarrollada en **React Native** con **TypeScript** y **Expo (SDK 58)** para la gestión centralizada de incidencias técnicas, órdenes de atención y seguimiento de telemetría operativa entre las áreas de Soporte, TI/Desarrollo, Ventas y Marketing en empresas de software como servicio (SaaS).

> 📍 **Índice y Mapa General del Repositorio:**  
> Para consultar la ubicación y descripción de todas las especificaciones de arquitectura, el backend en .NET 10, la base de datos MySQL 8.4, los informes académicos y los guiones de sustentación, revisa el [**`MAPA_DEL_PROYECTO.md`**](MAPA_DEL_PROYECTO.md).

---

## 👥 Integrantes del Grupo (4 Integrantes)

* **Institución:** Instituto de Educación Superior IDAT
* **Carrera:** Desarrollo de Sistemas Frontend y Backend
* **Ciclo:** VI Ciclo
* **Curso:** Proyecto de Aplicación Profesional / Desarrollo Móvil

| N° | Apellidos y Nombres | Rol / Participación |
|---|---|---|
| 1 | **Cahuana Ccallocunto, Aldair Santos** | Arquitectura de UI, Componentes Reutilizables y Formulario de Registro |
| 2 | **Monroy Gutierrez, Henry Raul** | Estado Global con Context API, useReducer y Validaciones de Entrada |
| 3 | **Morales Quiroga, Josue David** | Navegación, Bandeja de Incidencias, Buscador y Filtros por Estado |
| 4 | **Sánchez Peña, Eduardo Enrique** | Detalle de Registro, Control de Concurrencia y Flujo de Eliminación |

---

## 🏢 Core de Negocio y Situación Problemática

* **Empresa / Entorno:** TuNegocio.pe / Proveedor SaaS de Soluciones de Facturación y Operaciones Empresariales.
* **Problemática:** La dispersión de canales de atención (correos, chats, llamadas telefónicas) genera duplicidad de registros, pérdida de solicitudes críticas, falta de trazabilidad en los estados de atención y desorden en la priorización según severidad y SLA.
* **Solución Implementada:** Aplicación móvil corporativa con arquitectura modular y desacoplada que centraliza el registro, diagnóstico, seguimiento y resolución de órdenes de atención e incidencias técnicas, administrando la información de manera íntegra en memoria mediante `useReducer` y `Context API`.

---

## 📦 Modelo de Datos Mínimo (Entidad Principal: Ticket / Incidencia)

La entidad principal `Ticket` cumple con los campos obligatorios establecidos por las directrices del proyecto:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único del registro (UUID) |
| `codigo` | `string` | Código correlativo legible (ej. `INC-2026-001`) |
| `clienteNombre` | `string` | Razón social o nombre del cliente solicitante |
| `telefono` | `string` | Teléfono o celular de contacto directo del cliente |
| `categoria` (`tipoServicio`) | `TicketCategory` | Tipo de servicio: `FIRMA_ELECTRONICA`, `BASE_DE_DATOS`, `AUTENTICACION`, `IMPRESION`, `API`, `OTRO` |
| `prioridad` | `TicketPriority` | Nivel de atención: `P1` (Crítica), `P2` (Alta), `P3` (Media), `P4` (Baja) |
| `descripcion` | `string` | Detalle técnico del requerimiento o problema reportado |
| `estado` | `TicketStatus` | Estado del ciclo de vida: `NUEVO`, `EN_DIAGNOSTICO`, `EN_DESARROLLO`, `EN_QA`, `RESUELTO`, `CERRADO` |
| `createdAt` (`fechaRegistro`)| `string` | Fecha y hora de creación formateada en hora peruana |
| `version` | `number` | Control de concurrencia optimista contra sobreescritura |

---

## 🏗️ Arquitectura y Estructura del Proyecto

El proyecto sigue una separación clara de responsabilidades por capas en `mobile/src/`:

```text
mobile/
├── src/
│   ├── api/                      # Simulación de servicios CRUD y persistencia en memoria
│   ├── components/               # Componentes reutilizables (TicketCard, StatusBadge, Botones, Inputs)
│   ├── context/                  # TicketContext (useReducer) y AuthContext (Context API)
│   ├── models/                   # Modelos de datos y re-exportación de interfaces
│   ├── navigation/               # RootNavigator, AuthNavigator y AppNavigator (React Navigation)
│   ├── screens/                  # Pantallas del flujo de la aplicación
│   │   ├── LoginScreen.tsx       # Pantalla de bienvenida y autenticación
│   │   ├── RegisterScreen.tsx    # Registro de nuevos operadores internos
│   │   ├── HomeScreen.tsx        # Dashboard con KPIs operativos en tiempo real
│   │   ├── TicketListScreen.tsx  # Listado reactivo con buscador por texto y filtros por estado
│   │   ├── TicketFormScreen.tsx  # Pantalla de creación de nuevo registro con validaciones
│   │   └── TicketDetailScreen.tsx# Detalle, edición de estado/prioridad y eliminación confirmada
│   ├── types/                    # Tipos TypeScript del dominio
│   └── utils/                    # Constantes de diseño, formateadores de fecha y tema
├── App.tsx                       # Punto de entrada con TicketProvider y AuthProvider
├── package.json                  # Dependencias y scripts (Expo SDK 58)
└── tsconfig.json                 # Configuración estricta de TypeScript
```

---

## 🪝 Evidencia de Uso de Hooks Obligatorios

| Hook Obligatorio | Ubicación en el Código | Propósito Técnico |
|---|---|---|
| **`useState`** | `TicketFormScreen.tsx`, `TicketListScreen.tsx`, `TicketDetailScreen.tsx` | Control del estado local en formularios de entrada, texto de búsqueda (`searchQuery`), filtros activos de chips y modo edición. |
| **`useEffect`** | `TicketContext.tsx`, `HomeScreen.tsx`, `TicketListScreen.tsx` | Carga inicial del conjunto de datos en memoria al montar los componentes y sincronización reactiva de estadísticas. |
| **`useReducer`** | `TicketContext.tsx` (`ticketReducer`) | Gestión centralizada de las transiciones de estado del CRUD (`LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `ADD_TICKET`, `UPDATE_TICKET`, `DELETE_TICKET`). |
| **`Context API`**| `TicketContext.tsx` y `AuthContext.tsx` | Distribución global del estado y las acciones a través de toda la jerarquía de pantallas sin prop-drilling. |

> **Nota:** La información se administra íntegramente en memoria compartida a través de `useReducer` + `Context API`, sin requerir base de datos externa obligatoria.

---

## 🎨 Principios de UI/UX Aplicados

* **Tarjetas por registro:** Cada incidencia se visualiza en un componente `TicketCard` con elevación sutil, bordes redondeados y jerarquía tipográfica clara.
* **Chips de estado y prioridad:** Badges semánticos con códigos de color normalizados (P1 rojo, P2 naranja, P3 amarillo, P4 azul; Resuelto verde, Cerrado gris).
* **Iconos por tipo de servicio:** Iconografía SVG vectorial según categoría (Base de Datos, Firma Electrónica, Autenticación, Impresión, API) y acciones operativas.
* **Validación con mensajes debajo del input:** Los campos obligatorios del formulario muestran mensajes de error contextuales de forma inmediata bajo cada caja de texto.
* **Eliminación con confirmación:** Botón de acción destructiva que dispara un diálogo nativo `Alert.alert` solicitando confirmación explícita antes de despachar la acción `DELETE_TICKET`.
* **Accesibilidad y diseño ergonómico:** Botones de acción flotantes (FAB), botones con contraste verificado, y controles táctiles de tamaño accesible.
* **Feedback de usuario:** Notificaciones y diálogos de alerta nativos para confirmaciones de guardado, actualización y detección de conflictos.

---

## 🔄 Flujo de Prueba del CRUD

1. **Crear Registro:**
   * En la pantalla principal o listado, presionar el botón `+` / "Nueva Incidencia".
   * Completar los campos: Título, Cliente, Teléfono, Categoría, Prioridad y Descripción.
   * Presionar "Crear Incidencia". Se valida el formulario y se añade al estado en memoria mediante `ADD_TICKET`.
2. **Listar, Buscar y Filtrar:**
   * Navegar a la pantalla "Incidencias".
   * Escribir en la barra de búsqueda para filtrar instantáneamente por código, título o nombre de cliente.
   * Tocar los chips de filtro para filtrar por estado (`TODOS`, `NUEVO`, `EN_DIAGNOSTICO`, `RESUELTO`, etc.).
3. **Ver Detalle y Editar:**
   * Tocar cualquier tarjeta del listado para abrir su pantalla de Detalle.
   * Se muestra la información completa, teléfono de contacto y trazabilidad.
   * Presionar "Editar Incidencia", modificar el estado o la severidad y presionar "Guardar Cambios" (`UPDATE_TICKET`).
4. **Eliminar con Confirmación:**
   * En la pantalla de Detalle, presionar el botón "Eliminar Incidencia".
   * Se despliega un diálogo nativo con las opciones "Cancelar" y "Eliminar".
   * Al confirmar, se despacha `DELETE_TICKET`, se remueve del estado en memoria y se retorna al listado actualizado.
5. **Control de Concurrencia (Simulación):**
   * En el detalle, pulsar "Simular conflicto concurrente" para elevar la versión externa.
   * Al intentar guardar una modificación con una versión obsoleta, se detecta el conflicto y se previene la sobreescritura accidental.

---

## 🚀 Requisitos e Instalación

### Requisitos del Sistema
* **Node.js:** Versión 18.x o superior
* **JDK:** OpenJDK 17 (para compilación local en Android)
* **Android Studio / Xcode:** Opcional (para emuladores locales)
* **Dispositivo Físico:** Con la aplicación gratuita **Expo Go** instalada (disponible en Google Play Store y App Store)

### Instalación de Dependencias

```bash
# 1. Clonar el repositorio
git clone https://github.com/Eduardo25042103/mobileapp_PlatformOps-ProductFeedbackHub.git
cd mobileapp_PlatformOps-ProductFeedbackHub

# 2. Navegar al directorio mobile
cd mobile

# 3. Instalar las dependencias del proyecto
npm install
```

### Ejecución de la Aplicación

```bash
# Iniciar el bundler de Expo
npx expo start

# Para limpiar caché en caso de actualización
npx expo start -c
```

* **Dispositivo Móvil (Recomendado):** Escanear el código QR que aparece en la terminal desde la app **Expo Go**.
* **Emulador Android:** Presionar la tecla `a` en la terminal (o ejecutar `npx react-native run-android`).
* **Simulador iOS:** Presionar la tecla `i` en la terminal (o ejecutar `npx react-native run-ios`).
