# 🗺️ Mapa de Navegación del Proyecto: PlatformOps Hub

**Proyecto:** PlatformOps & Product Feedback Hub — Sistema de Portal Integrado de Soporte y Solicitudes Internas  
**Empresa de Aplicación:** TuNegocio.pe (Proveedor SaaS de Facturación Electrónica y Operaciones)  
**Institución:** Instituto de Educación Superior IDAT — VI Ciclo (Desarrollo de Sistemas Frontend y Backend)  
**Integrantes:** Aldair Cahuana, Henry Monroy, Josue Morales, Eduardo Sánchez  

Este documento sirve como **índice maestro y mapa de acceso directo** a todos los recursos, código fuente, especificaciones de ingeniería y documentación académica del repositorio.

---

## 📂 Estructura General del Repositorio

```text
proyecto-sexto-ciclo/
├── projects/                  # Código fuente de las aplicaciones y software ejecutable
│   └── mobile/                # Aplicación Móvil (React Native + Expo SDK 58 + Web)
├── docs/                      # Documentación centralizada del proyecto
│   ├── arquitectura/          # Especificaciones técnicas, BD MySQL, Backend .NET y diagramas
│   ├── academico/             # Informes Word/PDF, diapositivas y matriz Scrum de IDAT
│   └── exposicion/            # Guiones de sustentación, manuales y hojas imprimibles
├── design/                    # Diseños visuales, maquetas previas y tokens de interfaz
├── tools/                     # Scripts utilitarios en Python y activos gráficos de soporte
├── README.md                  # Documentación principal del repositorio y guía de la App
└── MAPA_DEL_PROYECTO.md       # Este archivo (Índice y mapa de navegación rápido)
```

---

## 🧭 Acceso Directo por Áreas y Módulos

### 1. 🏗️ Arquitectura e Ingeniería de Software (`docs/arquitectura/`)

Carpeta que contiene todas las especificaciones de diseño técnico, contratos de backend y base de datos:

| Recurso | Tipo | Descripción |
|---|:---:|---|
| [**`ESPECIFICACION_ARQUITECTURA.md`**](docs/arquitectura/ESPECIFICACION_ARQUITECTURA.md) | Markdown | **Documento Maestro de Arquitectura.** Detalla los objetivos generales y específicos, arquitectura serverless en AWS, flujo multiplataforma, bloqueo optimista (`version` / HTTP 409), integración con Zoho CRM y las 30 tablas. |
| [**`ESPECIFICACION_BACKEND_DOTNET.md`**](docs/arquitectura/ESPECIFICACION_BACKEND_DOTNET.md) | Markdown | **Arquitectura de Backend .NET Core 10.** Implementación bajo Clean Architecture (Domain, Application, Infrastructure, Api) aplicando principios SOLID, CQRS, AWS Lambda, API Gateway y Pomelo MySQL. |
| [**`ESPECIFICACION_BASE_DATOS_OPSHUB.md`**](docs/arquitectura/ESPECIFICACION_BASE_DATOS_OPSHUB.md) | Markdown | **Especificación de Base de Datos MySQL 8.4.** Diccionario exhaustivo de las 30 tablas en 6 módulos, restricciones, normalización 1FN-3FN, índices, collation `utf8mb4_unicode_ci` y triggers. |
| [**`schema_opshub_db.sql`**](docs/arquitectura/schema_opshub_db.sql) | SQL Script | Script DDL completo y ejecutable para crear la base de datos `opshub_db` con sus 30 tablas en MySQL 8.4 / Amazon RDS. |
| [**`opshub_db.png`**](docs/arquitectura/opshub_db.png) | Imagen | Diagrama de Entidad-Relación visual de la base de datos completa. |
| [**`ROADMAP_BITACORA_BACKEND.md`**](docs/arquitectura/ROADMAP_BITACORA_BACKEND.md) | Markdown | Plan de trabajo y bitácora de desarrollo de los servicios del backend. |
| [**`arqui.drawio`**](docs/arquitectura/arqui.drawio) | Draw.io | Diagrama editable de la arquitectura de nube y flujo de componentes. |
| [**`flujo.drawio`**](docs/arquitectura/flujo.drawio) | Draw.io | Diagrama editable de los flujos de escalación y procesos del sistema. |

---

### 2. 🎓 Entregables Académicos IDAT (`docs/academico/`)

Documentos institucionales alineados con las pautas del Trabajo de Aplicación Profesional del sexto ciclo:

| Recurso | Formato | Descripción |
|---|:---:|---|
| [**`informe-parcial.docx`**](docs/academico/informe-parcial.docx) | Word (`.docx`) | **Informe Académico Formal Completo (Capítulos 1 al 7).** 192 párrafos, 7 tablas institucionales y 9 figuras con formato APA 7ma edición, listo para imprimir o exportar a PDF. |
| [**`Portal_TuNegocio_Presentacion.pptx`**](docs/academico/Portal_TuNegocio_Presentacion.pptx) | PowerPoint | Presentación formal de 18 diapositivas estructurada con organigrama, diagnóstico, objetivos y stack tecnológico. |
| [**`Fase_02_Actividad_02A_Scrum_Artefactos_Ceremonias_COPIA.xlsx`**](docs/academico/Fase_02_Actividad_02A_Scrum_Artefactos_Ceremonias_COPIA.xlsx) | Excel | Matriz ágil de gestión del proyecto (Product Backlog, Sprint Planning, Burndown y ceremonias Scrum). |
| [**`4.1 Estructura del proyecto_Idat_PROYECTO DE APLICACIÓN EMPRESARIAL.pdf`**](docs/academico/4.1%20Estructura%20del%20proyecto_Idat_PROYECTO%20DE%20APLICACIÓN%20EMPRESARIAL.pdf) | PDF | Manual y estructura oficial de evaluación emitida por IDAT. |
| [**`4.1 Estructura del proyecto_Idat_PROYECTO DE APLICACIÓN EMPRESARIAL (1).docx`**](docs/academico/4.1%20Estructura%20del%20proyecto_Idat_PROYECTO%20DE%20APLICACIÓN%20EMPRESARIAL%20(1).docx) | Word | Plantilla editable institucional de IDAT. |

---

### 3. 🎙️ Sustentación y Presentación en Vivo (`docs/exposicion/`)

Materiales para coordinar la exposición frente al jurado evaluador o docente:

| Recurso | Formato | Descripción |
|---|:---:|---|
| [**`Guion_Exposicion_Imprimible_AppMovil.docx`**](docs/exposicion/Guion_Exposicion_Imprimible_AppMovil.docx) | Word (`.docx`) | **Guion listo para imprimir.** Formato optimizado para hojas A4 con saltos de página por expositor, cajas amarillas para acciones en el celular, cajas azules con el discurso exacto y banco de preguntas de defensa. |
| [**`GUION_PRESENTACION_APP_MOVIL.md`**](docs/exposicion/GUION_PRESENTACION_APP_MOVIL.md) | Markdown | Guion maestro paso a paso para la sustentación y demostración en vivo de la App Móvil en Expo Go o emulador. |
| [**`GUION_EXPOSICION_PROYECTO.md`**](docs/exposicion/GUION_EXPOSICION_PROYECTO.md) | Markdown | Guion para la sustentación teórica de las diapositivas (Capítulos 1 al 4). |
| [**`GUIA_POC_MOVIL.md`**](docs/exposicion/GUIA_POC_MOVIL.md) | Markdown | Manual de pruebas rápidas del flujo funcional de la App Móvil. |

---

### 4. 📱 Código Fuente de la Aplicación Móvil (`projects/mobile/`)

Proyecto en React Native con TypeScript, Expo SDK 58 y soporte Web:

```text
projects/mobile/
├── src/
│   ├── api/                      # ticketsApi.ts (CRUD en memoria, simulación HTTP 409)
│   ├── components/               # TicketCard, StatusBadge, PriorityBadge, Button, InputText, Icons
│   ├── context/                  # TicketContext.tsx (useReducer + Context API) y AuthContext.tsx
│   ├── models/                   # ticket.model.ts (contratos e interfaces)
│   ├── navigation/               # RootNavigator, AuthNavigator, AppNavigator
│   ├── screens/                  # LoginScreen, RegisterScreen, HomeScreen, TicketListScreen,
│   │                             # TicketFormScreen, TicketDetailScreen
│   ├── types/                    # Tipado TypeScript del dominio
│   └── utils/                    # storage.ts (SecureStore + LocalStorage fallback para web)
├── App.tsx                       # Punto de entrada con TicketProvider y AuthProvider
├── app.json                      # Configuración de Expo (iOS, Android, Web)
└── package.json                  # Dependencias del proyecto
```

#### Comandos Rápidos de Ejecución:
* **Iniciar en Móvil (Expo Go):** `cd projects/mobile` ➔ `npx expo start`
* **Iniciar en Web (Navegador):** `cd projects/mobile` ➔ `npx expo start --web`
* **Verificar Compilación TypeScript:** `cd projects/mobile` ➔ `npx tsc --noEmit`

---

### 5. 🎨 Diseños y Prototipado (`design/`)

* [**`design/DESIGN.md`**](design/DESIGN.md): Guía de tokens de diseño, paleta de colores Dark Mode y lineamientos visuales.
* **`design/stitch_designs/`**: Maquetas interactivas en HTML para previsualización de pantallas.

---

### 6. 🛠️ Herramientas y Scripts Utilitarios (`tools/`)

* **`tools/generate_report_docx.py`**: Generador automático del informe académico en formato Word utilizando `python-docx`.
* **`tools/generate_guion_docx.py`**: Generador del guion imprimible con cajas de acción y estilos de lectura.
* **`tools/create_mockups.py`**: Script con Pillow (PIL) para renderizar las 6 capturas de pantalla de la app móvil.
* **`tools/assets_doc/`**: Imágenes, capturas procesadas y logos utilizados en los informes.
