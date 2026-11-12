# Guion Maestro de Exposición y Demostración en Vivo: Aplicación Móvil React Native

**Proyecto:** PlatformOps & Product Feedback Hub — Sistema de Portal Integrado de Soporte y Solicitudes Internas  
**Empresa / Core de Negocio:** TuNegocio.pe (Proveedor SaaS de Facturación Electrónica y Operaciones Comerciales)  
**Institución:** Instituto de Educación Superior IDAT  
**Carrera:** Desarrollo de Sistemas Frontend y Backend (VI Ciclo)  
**Duración Total Sugerida:** 10 a 12 minutos de exposición + ronda de preguntas del jurado/docente.  
**Modalidad:** Presencial o Virtual (Diapositivas de contexto + Demostración en vivo de la App en Expo Go o Emulador).

---

## 👥 Distribución del Equipo (4 Integrantes)

| Expositor | Integrante | Rol en la Exposición | Tiempo Estimado |
|---|---|---|---|
| **Expositor 1** | **Cahuana Ccallocunto, Aldair Santos** | Introducción, Core de Negocio, Situación Problemática y UI Base | 00:00 – 02:30 |
| **Expositor 2** | **Monroy Gutierrez, Henry Raul** | Arquitectura Técnica, Estado Global (`useReducer` + `Context API`) y Validaciones | 02:30 – 05:00 |
| **Expositor 3** | **Morales Quiroga, Josue David** | Demo en Vivo 1: Dashboard, KPIs, Buscador Reactivo y Creación con Validaciones | 05:00 – 08:00 |
| **Expositor 4** | **Sánchez Peña, Eduardo Enrique** | Demo en Vivo 2: Detalle/Edición, Concurrencia Optimista (409), Eliminación `Alert` y Cierre | 08:00 – 10:30 |
| **Todos** | **Equipo Completo** | Defensa y Ronda de Preguntas Técnicas del Docente | 10:30 – 15:00 |

> **Nota:** Si por indicación del docente la presentación debe realizarla **un solo integrante**, este guion está diseñado de forma modular para que una sola persona pueda leerlo y ejecutarlo de manera fluida de inicio a fin.

---

## ⚙️ Checklist Técnico Previo a la Exposición

Antes de que el jurado inicie la sesión, asegúrense de cumplir con lo siguiente:
1. **Servidor Expo Activo:** En la terminal de la máquina del presentador, ejecutar dentro de `mobile/`:
   ```bash
   npx expo start
   ```
2. **Dispositivo Listo para Transmitir:**
   * **Opción A (Celular Físico):** Tener la app abierta en **Expo Go**. Para proyectar la pantalla del celular en la laptop del proyector, usar herramientas como `scrcpy` (por cable USB), *Vysor*, o la función de compartir pantalla de Meet/Zoom/Teams desde el celular.
   * **Opción B (Emulador Android / iOS):** Tener el emulador de Android Studio abierto y presionar la tecla `a` en la terminal de Expo.
3. **Mismo Wi-Fi o Túnel:** Si el Wi-Fi institucional de IDAT tiene restricciones de aislamiento de red (AP Isolation), inicien Expo con:
   ```bash
   npx expo start --tunnel
   ```
4. **Estado Limpio:** La aplicación cargará automáticamente los tickets iniciales de prueba en memoria.

---

## ⏱️ Estructura Cronológica de la Presentación

```
[00:00 - 02:30] Bloque 1: Introducción, Core de Negocio y Problemática (Aldair Cahuana)
[02:30 - 05:00] Bloque 2: Arquitectura del Software y Hooks Obligatorios (Henry Monroy)
[05:00 - 08:00] Bloque 3: Demostración en Vivo Parte 1 (Josue Morales)
                 • Dashboard y KPIs operativos en tiempo real
                 • Buscador instantáneo y filtros por chips de estado
                 • Formulario de creación con validaciones bajo el input (teléfono obligatorio)
[08:00 - 10:30] Bloque 4: Demostración en Vivo Parte 2 y Cierre (Eduardo Sánchez)
                 • Detalle de registro y edición en memoria
                 • Simulación y captura de conflicto de concurrencia optimista (409)
                 • Eliminación de registro con diálogo nativo Alert de confirmación
                 • Verificación técnica (TypeScript 0 errores, Metro bundle)
[10:30 - 15:00] Bloque 5: Ronda de Preguntas y Respuestas Técnicas con el Jurado
```

---

# 🎙️ GUION PASO A PASO (PALABRA POR PALABRA)

---

### BLOQUE 1: Introducción, Core de Negocio y Problemática
**Expositor:** Cahuana Ccallocunto, Aldair Santos  
**Tiempo:** 2:30 minutos  
**Material de apoyo:** Diapositiva de carátula y organigrama / flujo actual (Figuras 1 y 2).

> **🗣️ Qué decir:**
> 
> "Buenos días / buenas tardes, profesor y miembros del jurado evaluador.  
> Somos estudiantes del sexto ciclo de la carrera de **Desarrollo de Sistemas Frontend y Backend** de IDAT. El equipo está conformado por Henry Monroy, Josue Morales, Eduardo Sánchez y quien les habla, Aldair Cahuana.  
> 
> El día de hoy venimos a presentarles nuestro proyecto de aplicación profesional: **PlatformOps & Product Feedback Hub**, una aplicación móvil desarrollada en **React Native con TypeScript y Expo**, orientada a resolver un problema crítico de gestión operativa en la empresa peruana de software **TuNegocio.pe**.  
> 
> **Poniéndonos en contexto con el core de negocio:**  
> TuNegocio.pe es un proveedor SaaS de facturación electrónica y gestión comercial que atiende a más de **10,000 micro y pequeños empresarios a nivel nacional**. En este tipo de negocio, la estabilidad del software es vital: si el sistema falla, los comercios no pueden emitir boletas ante SUNAT ni cobrar a sus clientes.  
> 
> **¿Cuál es la situación problemática?**  
> Identificamos que la comunicación entre las áreas de Soporte Técnico y TI/Desarrollo se realizaba de manera informal a través de grupos de WhatsApp. Esto provocaba:  
> 1. **Pérdida de información:** Los reportes llegaban sin capturas, sin logs y sin datos de contacto claros.  
> 2. **Carencia de priorización:** Los programadores atendían los mensajes conforme caían al chat, mezclando incidencias críticas que paralizaban ventas con simples consultas de usuarios.  
> 3. **Cero trazabilidad:** Soporte nunca sabía el estado real de un fallo, provocando retrasos y clientes insatisfechos.  
> 
> Ante esta problemática, diseñamos y construimos una aplicación móvil nativa que centraliza, organiza y gestiona en tiempo real todo el ciclo de vida de las incidencias técnicas y solicitudes de atención.  
> 
> Para explicar la arquitectura y los fundamentos técnicos que sostienen la aplicación, le cedo la palabra a mi compañero **Henry Monroy**."

---

### BLOQUE 2: Arquitectura del Software y Hooks Obligatorios
**Expositor:** Monroy Gutierrez, Henry Raul  
**Tiempo:** 2:30 minutos  
**Material de apoyo:** Diapositiva de arquitectura de carpetas y tabla de hooks obligatorios.

> **🗣️ Qué decir:**
> 
> "Muchas gracias, Aldair. Estimado docente, para garantizar un código profesional, escalable y mantenible, estructuramos la aplicación bajo una **arquitectura desacoplada por capas** dentro del directorio `mobile/src/`:  
> - **Screens:** Contiene las pantallas principales (Login, Dashboard, Listado, Formulario y Detalle).  
> - **Components:** Componentes reutilizables modulares como tarjetas de incidencias, insignias semánticas de estado y severidad, e iconos SVG vectoriales.  
> - **Context & Reducer:** La columna vertebral de la aplicación que administra el estado global.  
> - **Models y Types:** Modelado estricto con TypeScript para asegurar que cada registro cumpla con los atributos mínimos obligatorios: `id`, `clienteNombre`, `telefono` directo de contacto, `categoria` (tipo de servicio), `prioridad` (P1 a P4), `descripcion`, `estado`, `fechaRegistro` y control de `version`.  
> 
> **Cumplimiento estricto de los Hooks Obligatorios:**  
> En concordancia con las directrices académicas del curso, la aplicación **no depende de una base de datos física externa**, sino que gestiona íntegramente su persistencia reactiva en memoria utilizando los 4 hooks obligatorios de React:  
> 1. **`useState`:** Utilizado en pantallas locales para controlar las entradas de formularios, el término de búsqueda dinámica y los filtros activos por chips.  
> 2. **`useEffect`:** Utilizado al inicializar la aplicación para cargar el repositorio inicial en memoria y sincronizar las estadísticas en tiempo real.  
> 3. **`useReducer`:** Es el corazón del CRUD. A través del reducer `ticketReducer`, centralizamos todas las transiciones de estado mediante acciones puras e inmutables: `LOAD_START`, `LOAD_SUCCESS`, `ADD_TICKET`, `UPDATE_TICKET` y `DELETE_TICKET`.  
> 4. **`Context API`:** A través de `TicketContext` y `TicketProvider`, exponemos el estado y las funciones del reducer a lo largo de todo el árbol de navegación sin incurrir en *prop-drilling*.  
> 
> Además, implementamos un mecanismo de **bloqueo optimista contra concurrencia**, protegiendo la información ante modificaciones simultáneas mediante detección de código HTTP 409.  
> 
> A continuación, daremos paso a la demostración práctica en vivo de la aplicación móvil. Inicia mi compañero **Josue Morales**."

---

### BLOQUE 3: Demostración en Vivo (Parte 1: Dashboard, Filtros y Creación)
**Expositor:** Morales Quiroga, Josue David  
**Tiempo:** 3:00 minutos  
**Material de apoyo:** Pantalla transmitida de la aplicación móvil en Expo Go o Emulador.

> **📱 Acción previa:** Josue (o quien maneje el dispositivo) proyecta la pantalla del celular o emulador mostrando la pantalla de **Dashboard / Home**.

> **🗣️ Qué decir:**
> 
> "Buenos días, profesor. Pasamos a evidenciar el funcionamiento real de la aplicación ejecutándose en nuestro entorno móvil.  
> 
> **1. Dashboard y Telemetría Operativa (HomeScreen):**  
> *(👉 Señalar las métricas en la pantalla del celular)*  
> Al ingresar, el operador visualiza de inmediato su panel de control con métricas calculadas reactivamente desde el `useReducer`:  
> - Vemos el total de tickets abiertos.  
> - El contador de incidencias críticas **P1**, que requieren atención inmediata de desarrollo.  
> - Y el porcentaje de cumplimiento de SLA global.  
> Abajo observamos las incidencias más recientes registradas con su código institucional, cliente y nivel de severidad.  
> 
> *(👉 Pulsar el botón 'Ver Incidencias' o el tab inferior para ir a TicketListScreen)*  
> 
> **2. Bandeja de Incidencias, Buscador y Filtros (TicketListScreen):**  
> Aquí tenemos la lista completa de registros. Cada incidencia se presenta en una tarjeta `TicketCard` con diseño limpio, sombra suave y badges semánticos de color.  
> 
> *(👉 Escribir 'Firma' o 'SUNAT' en la barra de búsqueda)*  
> Observe profesor cómo la búsqueda es instantánea: gracias al hook `useState` combinado con el estado del contexto, filtramos en tiempo real por cliente, código o problema sin necesidad de recargar la pantalla.  
> 
> *(👉 Limpiar el buscador y presionar los chips de filtro: [TODOS], [NUEVO], [EN DIAGNÓSTICO], [RESUELTO])*  
> También disponemos de **chips de estado**. Al tocar 'NUEVO' o 'EN DIAGNÓSTICO', la lista se actualiza al instante reflejando únicamente los tickets en esa fase.  
> 
> *(👉 Presionar el botón flotante '+' o 'Nueva Incidencia' para abrir TicketFormScreen)*  
> 
> **3. Formulario de Creación con Validaciones bajo el Input (TicketFormScreen):**  
> Procedemos a registrar una nueva orden de atención. Noten que la interfaz guía al usuario con validaciones contextuales.  
> 
> *(👉 Dejar el formulario en blanco y presionar 'Crear Incidencia')*  
> Si intento enviar el formulario vacío, de inmediato se despliegan mensajes de error contextuales de color rojo **exactamente debajo de cada input** obligatorio.  
> 
> *(👉 Llenar los campos en vivo mientras se explica)*  
> Vamos a registrar un caso real:  
> - **Título:** Falla de conexión con Web Service SUNAT.  
> - **Cliente:** Distribuidora Lima Norte E.I.R.L.  
> - **Teléfono de Contacto (Campo obligatorio según rúbrica):** Ingresamos `+51 984 771 229`.  
> - **Categoría:** Seleccionamos el chip `API`.  
> - **Severidad:** Seleccionamos `P1 - Crítica`.  
> - **Descripción:** El endpoint de facturación devuelve error de timeout al procesar el resumen diario.  
> 
> *(👉 Presionar 'Crear Incidencia')*  
> Al pulsar 'Crear Incidencia', se despacha la acción `ADD_TICKET` en el reducer. El nuevo ticket se añade de inmediato a la memoria compartida, se muestra una alerta de confirmación y regresamos a la lista, donde ya podemos ver el ticket recién creado encabezando la bandeja.  
> 
> Para continuar con el flujo de edición, control de concurrencia y eliminación, cedo la palabra a **Eduardo Sánchez**."

---

### BLOQUE 4: Demostración en Vivo (Parte 2: Detalle, Concurrencia, Eliminación y Cierre)
**Expositor:** Sánchez Peña, Eduardo Enrique  
**Tiempo:** 2:30 minutos  
**Material de apoyo:** Pantalla transmitida de la aplicación móvil en Expo Go o Emulador.

> **📱 Acción previa:** Eduardo toca la tarjeta del ticket recién creado (o `INC-2026-001`) para abrir `TicketDetailScreen`.

> **🗣️ Qué decir:**
> 
> "Muchas gracias, Josue. Continuando con la evaluación del flujo CRUD completo:  
> 
> **4. Detalle y Edición de Registro (TicketDetailScreen):**  
> Al ingresar al detalle de la incidencia, podemos auditar toda su metadata:  
> *(👉 Señalar en pantalla)*  
> Vemos el código correlativo, la razón social, el **teléfono de contacto directo del cliente**, la categoría con su icono correspondiente, la fecha y hora de registro, y la versión actual en memoria.  
> 
> *(👉 Presionar 'Editar Incidencia', cambiar el estado de NUEVO a EN_DIAGNOSTICO y presionar 'Guardar Cambios')*  
> En el modo de edición, podemos reasignar la severidad o cambiar el estado del ciclo de vida a `EN_DIAGNOSTICO`. Al guardar, se despacha la acción `UPDATE_TICKET` al reducer y los cambios impactan inmediatamente en todo el sistema.  
> 
> **5. Detección de Conflicto de Concurrencia Optimista (HTTP 409 Conflict):**  
> *(👉 Presionar el botón de prueba 'Simular conflicto concurrente')*  
> ¿Qué ocurre si mientras yo tengo este ticket abierto en mi celular, otro operador lo modifica desde otra terminal?  
> Simulamos ese caso presionando este botón: la versión en el servidor se incrementa a v2.  
> Ahora, si yo intento guardar un cambio con mi versión local obsoleta v1:  
> *(👉 Intentar guardar cambios)*  
> Miren la pantalla: el sistema intercepta el conflicto y muestra un diálogo de alerta nativo informando: **'Conflicto de Concurrencia (409) - Este ticket fue modificado por otro operador'**, actualizando los datos locales de manera segura para evitar sobreescritura accidental.  
> 
> **6. Eliminación de Registros con Confirmación Nativa (Alert.alert):**  
> *(👉 Presionar el botón rojo 'Eliminar Incidencia')*  
> Por último, la rúbrica exige que la eliminación cuente con confirmación explícita para evitar pérdidas involuntarias de información.  
> Al presionar el botón de eliminación, la aplicación despliega un diálogo nativo `Alert.alert`:  
> *'¿Estás seguro de que deseas eliminar permanentemente la incidencia INC-2026-001?'*  
> - Si pulso **Cancelar**, la operación se aborta sin alterar el estado.  
> *(👉 Presionar 'Sí, Eliminar')*  
> - Si pulso **Eliminar**, se ejecuta `DELETE_TICKET` en el reducer, el registro se remueve de la memoria y la pantalla retorna automáticamente a la bandeja, donde el ticket ha desaparecido y los contadores del Dashboard se han recalculado.  
> 
> **Verificación Técnica de Compilación:**  
> Certificamos que la solución cuenta con **cero errores de compilación TypeScript** (`npx tsc --noEmit`) y empaquetado exitoso en Metro Bundler de Expo SDK 58 con más de 3,100 módulos optimizados.  
> 
> Con esto demostramos el ciclo CRUD completo, la solidez de la arquitectura en memoria y la usabilidad de la interfaz móvil. Quedamos a su disposición para cualquier consulta del jurado. **Muchas gracias.**"

---

# 🛡️ BANCO DE PREGUNTAS Y RESPUESTAS PARA LA DEFENSA ANTE EL JURADO

A continuación se preparan las respuestas a las preguntas técnicas más probables que formulará el docente evaluador:

---

### Pregunta 1: *"¿Por qué la aplicación no usa una base de datos externa como SQLite, MySQL o Firebase?"*
* **Quién responde recomendado:** Henry Monroy o Eduardo Sánchez.
* **Respuesta clave:**  
  > *"Profesor, la directriz de la rúbrica académica especifica explícitamente que no es obligatorio el uso de una base de datos externa y que la información debe administrarse en memoria mediante `useReducer` y `Context API`.  
  > El objetivo pedagógico es evidenciar el dominio avanzado de los hooks nativos de React, la arquitectura de flujo de datos unidireccional y la inmutabilidad del estado. No obstante, gracias a que el repositorio en `ticketsApi.ts` está completamente desacoplado, en una fase posterior basta con reemplazar las promesas simuladas por llamadas `axios.get` o `fetch` hacia un backend REST en Node.js o .NET sin alterar ninguno de los componentes visuales ni el reducer."*

---

### Pregunta 2: *"¿Por qué utilizaron `useReducer` en lugar de manejar todo con simples `useState`?"*
* **Quién responde recomendado:** Henry Monroy.
* **Respuesta clave:**  
  > *"Utilizamos `useState` para estados locales efímeros de cada pantalla (como el texto de búsqueda o las validaciones del formulario). Sin embargo, para la lógica central del CRUD (`TicketContext`), `useReducer` es superior porque desacopla la lógica de negocio de la vista.  
  > En lugar de tener múltiples funciones mutando arrays con `setTickets`, todas las modificaciones pasan por un único punto centralizado: el `ticketReducer`. Esto garantiza transiciones de estado atómicas, inmutabilidad y predictibilidad, facilitando además la detección de errores y el testing."*

---

### Pregunta 3: *"¿Cómo implementaron la validación con mensajes debajo del input?"*
* **Quién responde recomendado:** Josue Morales o Aldair Cahuana.
* **Respuesta clave:**  
  > *"En `TicketFormScreen.tsx` definimos un estado de errores `errors` mediante `useState`. Al presionar 'Crear Incidencia', se ejecuta una función validadora `validateForm()` que comprueba la longitud mínima del título, el formato del teléfono (al menos 9 dígitos y prefijo válido) y la presencia de descripción.  
  > Si hay fallas, se puebla el objeto `errors` y los componentes de texto `<Text style={styles.errorText}>` se renderizan condicionalmente justo debajo de la caja de texto afectada con borde rojo de alerta, guiando al usuario de forma clara."*

---

### Pregunta 4: *"¿Qué es el control de concurrencia optimista y cómo lo probaron?"*
* **Quién responde recomendado:** Eduardo Sánchez.
* **Respuesta clave:**  
  > *"El bloqueo optimista asume que múltiples transacciones pueden completarse sin afectarse mutuamente, pero verifica si hubo colisiones antes de guardar. Cada ticket tiene un campo numérico `version`.  
  > Cuando un cliente lee un ticket en versión 1 e intenta actualizarlo enviando esa versión 1, el servicio comprueba si en memoria sigue siendo versión 1. Si otro operador ya lo modificó y elevó la versión a 2, el servicio rechaza la petición con un error HTTP 409 (Conflict). En la app capturamos ese error con un `try/catch` y mostramos una alerta nativa que recarga los datos para evitar que se pierdan los cambios del otro compañero."*

---

### Pregunta 5: *"¿Cómo se evidencian los commits de cada integrante en GitHub?"*
* **Quién responde recomendado:** Aldair Cahuana o Eduardo Sánchez.
* **Respuesta clave:**  
  > *"El repositorio en GitHub cuenta con ramas e historial de commits donde se aprecia la participación de los 4 integrantes:  
  > - Aldair Cahuana en la estandarización de componentes de UI y navegación.  
  > - Henry Monroy en la arquitectura de `useReducer`, `Context API` y validaciones.  
  > - Josue Morales en los filtros por chips, buscador reactivo y badges.  
  > - Eduardo Sánchez en el detalle de registro, concurrencia 409 y eliminación con `Alert.alert`.  
  > Todo el historial está respaldado en la rama principal de nuestro repositorio público."*

---

## 💡 Consejos Finales para Obtener la Máxima Calificación (20)

1. **Seguridad y fluidez:** Hablen con tono firme y pausado. Eviten leer las diapositivas; usen las diapositivas como apoyo visual y miren al jurado o a la cámara.
2. **Coordinación previa:** Hagan una prueba técnica 15 minutos antes de la exposición para validar que el celular proyecta sin retraso (*lag*) y que Expo Go abre sin problemas.
3. **Respetar el tiempo:** Manténganse dentro del rango de 10 a 12 minutos. Si un jurado los interrumpe con una pregunta, respóndanla con amabilidad y retomen el hilo del guion sin perder la calma.
