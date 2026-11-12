# Guion de Exposición: Avance del Proyecto de Aplicación Profesional (Capítulos 1 al 4)

**Proyecto:** Sistema de Portal Integrado de Soporte y Solicitudes Internas  
**Empresa de Aplicación:** TuNegocio.pe  
**Institución:** Instituto de Educación Superior IDAT  
**Carrera:** Desarrollo de Sistemas Frontend y Backend  
**Duración Total Estimada:** 12 a 15 minutos (aprox. 3 a 4 minutos por integrante)  
**Distribución del Equipo (4 integrantes):**
1. **Expositor 1:** Cahuana Ccallocunto, Aldair Santos (Diapositivas 1 a 4)
2. **Expositor 2:** Monroy Gutierrez, Henry Raul (Diapositivas 5 a 9)
3. **Expositor 3:** Morales Quiroga, Josue David (Diapositivas 10 a 14)
4. **Expositor 4:** Sánchez Peña, Eduardo Enrique (Diapositivas 15 a 18)

---

## Estructura General y Tiempos de Presentación

```
[00:00 - 03:00] Bloque 1: Introducción, Entorno y Estructura Organizacional (Aldair Cahuana)
[03:00 - 07:00] Bloque 2: Diagnóstico, Flujo Actual, Árbol de Problemas y Actores (Henry Monroy)
[07:00 - 11:00] Bloque 3: Justificación, Innovación, Viabilidad y Objetivos (Josue Morales)
[11:00 - 14:30] Bloque 4: Stack Tecnológico, Marco Legal, Normas ISO y Cierre (Eduardo Sánchez)
[14:30 - 20:00] Ronda de Preguntas y Respuestas con el Jurado Docente
```

---

## BLOQUE 1: Introducción, Entorno y Estructura de la Empresa
**Expositor 1:** Cahuana Ccallocunto, Aldair Santos  
**Diapositivas:** 1 a 4  
**Tiempo objetivo:** 3:00 minutos  

---

### Diapositiva 1: Carátula Institucional
* **Visual en pantalla:** Logo IDAT, Título del proyecto, Carrera y Nombres de los integrantes.
* **Tiempo sugerido:** 40 segundos.

> **Guion de Exposición:**
> 
> "Buenos días / buenas tardes, estimado profesor y miembros del jurado evaluador.  
> Somos estudiantes del sexto ciclo de la carrera de **Desarrollo de Sistemas Frontend y Backend** en el Instituto IDAT. Mi equipo está conformado por Aldair Cahuana, Henry Monroy, Josue Morales y Eduardo Sánchez.  
> 
> El día de hoy nos complace presentarles el avance formal de nuestro Trabajo de Aplicación Profesional, el cual hemos titulado: **'Sistema de Portal Integrado de Soporte y Solicitudes Internas'**, una solución tecnológica diseñada a medida para optimizar los procesos operativos y de comunicación en la empresa peruana de software **TuNegocio.pe**."

---

### Diapositiva 2: Contenido / Agenda
* **Visual en pantalla:** Los 4 capítulos a exponer (1. Diagnóstico del problema, 2. Justificación, 3. Objetivos, 4. Marco referencial).
* **Tiempo sugerido:** 30 segundos.

> **Guion de Exposición:**
> 
> "La presente sustentación abarca el desarrollo de los cuatro primeros capítulos de nuestra investigación aplicada:
> 1. En primer lugar, abordaremos el **Diagnóstico del Problema**, entendiendo a la empresa y las causas que frenan su productividad.
> 2. En segundo lugar, presentaremos la **Justificación del Proyecto**, destacando su valor de negocio e innovación tecnológica.
> 3. En tercer lugar, definiremos los **Objetivos**, tanto el general como los específicos que guían la construcción del sistema.
> 4. Y finalmente, revisaremos el **Marco Referencial**, detallando nuestro stack arquitectónico, la base legal y los estándares internacionales de ingeniería de software que respaldan la solución."

---

### Diapositiva 3: Capítulo 1 · Contexto y Delimitación (1.1)
* **Visual en pantalla:** TuNegocio.pe, Misión, cifras clave (+10 mil emprendedores, 3 módulos, 4 áreas, modelo SaaS).
* **Tiempo sugerido:** 50 segundos.

> **Guion de Exposición:**
> 
> "Iniciando con el Capítulo 1, pongámonos en contexto:  
> **TuNegocio.pe** es una empresa de tecnología peruana ubicada en Miraflores, Lima, que opera bajo el modelo de **Software as a Service (SaaS)**. Su misión es brindar a los micro y pequeños empresarios del país una plataforma ágil y segura para la gestión de sus negocios.  
> 
> Actualmente, atienden a una cartera activa de más de **10 000 emprendedores a nivel nacional**, quienes dependen diariamente de su aplicación web y móvil para tres funciones vitales: facturación electrónica conectada a SUNAT, control de inventario y registro de ventas.  
> 
> La operación se sostiene en cuatro áreas clave: Comercial/Ventas, Marketing, Soporte Técnico y el área de TI y Desarrollo."

---

### Diapositiva 4: Capítulo 1 · Estructura de la Empresa (Figura 1)
* **Visual en pantalla:** Organigrama de TuNegocio.pe mostrando la Gerencia General y las cuatro jefaturas con sus respectivos equipos.
* **Tiempo sugerido:** 40 segundos.

> **Guion de Exposición:**
> 
> "Como podemos observar en la **Figura 1**, la estructura jerárquica depende de la Gerencia General y se distribuye en:  
> - La jefatura Comercial y Ventas con sus ejecutivos.  
> - Marketing y Fidelización.  
> - La jefatura de Soporte Técnico con los agentes de atención al cliente.  
> - Y la jefatura de TI y Desarrollo con el equipo de programadores.  
> 
> Aunque orgánicamente están divididas, en la práctica cotidiana **Soporte y Desarrollo mantienen una interdependencia absoluta y crítica**: cuando un cliente detecta un fallo que le impide facturar, Soporte lo atiende, pero depende 100% de los programadores para solucionarlo. Y es justamente en este punto de interacción donde se genera el problema central.  
> 
> Para explicar a detalle esta problemática, cedo la palabra a mi compañero **Henry Monroy**."

---

## BLOQUE 2: Diagnóstico, Flujo Crítico, Causas y Actores
**Expositor 2:** Monroy Gutierrez, Henry Raul  
**Diapositivas:** 5 a 9  
**Tiempo objetivo:** 4:00 minutos  

---

### Diapositiva 5: Capítulo 1 · Identificación del Problema (1.2)
* **Visual en pantalla:** El problema: comunicación informal por WhatsApp, 4 tarjetas con los dolores operativos.
* **Tiempo sugerido:** 50 segundos.

> **Guion de Exposición:**
> 
> "Muchas gracias, Aldair. Profesores, el problema principal detectado en TuNegocio.pe es que **la comunicación operativa entre las áreas se realiza por canales informales, específicamente chats de WhatsApp**.  
> 
> Esta informalidad detona cuatro problemas severos en el día a día:
> 1. **Pérdida de información:** Los reportes de fallas se envían como mensajes de texto sueltos, sin capturas completas ni registros técnicos.
> 2. **Desorden de prioridades:** Se atienden mensajes según entran al chat, mezclando incidencias críticas que paralizan ventas con dudas menores de usuarios.
> 3. **Cero visibilidad:** Soporte no sabe si Desarrollo ya está trabajando en el error, si ya lo solucionó o en qué versión saldrá, generando estrés y respuestas inciertas al cliente.
> 4. **Pérdida de oportunidades comerciales:** Las sugerencias y mejoras solicitadas por los clientes se quedan perdidas en el historial del chat y nunca se materializan en el producto."

---

### Diapositiva 6: Capítulo 1 · Flujo Actual y Puntos Críticos (Figura 2)
* **Visual en pantalla:** Diagrama de flujo actual señalando los 4 momentos críticos (1: WhatsApp genérico, 2: Dev sin logs, 3: Falta de visibilidad, 4: Pérdida de sugerencias).
* **Tiempo sugerido:** 50 segundos.

> **Guion de Exposición:**
> 
> "Para entender la gravedad del proceso, analicemos el flujo actual en la **Figura 2**, donde hemos mapeado cuatro momentos críticos:  
> - **Punto 1:** El agente de soporte recibe la queja del cliente y, en lugar de registrarla en un sistema formal, redacta un mensaje genérico por WhatsApp hacia el grupo de desarrollo.  
> - **Punto 2:** El programador recibe la alerta sin trazas de error (*stack trace*), sin entorno ni pasos de reproducción; esto obliga a un ida y vuelta de preguntas que hace perder horas valiosas.  
> - **Punto 3:** Mientras TI corrige el fallo, no existe ningún mecanismo para notificar el estado. Soporte tiene que volver a interrumpir a los programadores preguntando: *'¿Ya salió?'*.  
> - **Punto 4:** Por el lado de ventas y marketing, las sugerencias de los usuarios nunca llegan a una cartera priorizada, frustrando a los clientes que piden mejoras para sus planes."

---

### Diapositiva 7: Capítulo 1 · Árbol de Problemas (Figura 3 - 1.3)
* **Visual en pantalla:** Diagrama de Árbol de Problemas (Causas Raíz, Problema Central, Efectos Directos e Indirectos).
* **Tiempo sugerido:** 50 segundos.

> **Guion de Exposición:**
> 
> "Aplicamos la herramienta metodológica del **Árbol de Problemas** (Figura 3) para identificar la causa raíz y no quedarnos solo en los síntomas.  
> 
> - **Problema Central:** *'Comunicación no estructurada ni trazable de incidencias, sugerencias y avisos entre las áreas de TuNegocio.pe'*.  
> - **Causas Raíz:** La ausencia de un proceso formal interdepartamental y la falta de una herramienta de software unificada accesible para la empresa.  
> - **Efectos Directos:** Un elevado tiempo medio de resolución de fallas (**MTTR alto**), reprocesos continuos y desatención de errores críticos.  
> - **Efecto Final de Negocio:** La insatisfacción acumulada de los usuarios deriva en la pérdida de clientes (**churn**) y la disminución directa en los ingresos por suscripción de la empresa."

---

### Diapositiva 8: Capítulo 1 · Áreas y Actores Afectados (1.4)
* **Visual en pantalla:** Matriz de actores (Soporte Técnico, TI/Desarrollo, Marketing, Ventas).
* **Tiempo sugerido:** 40 segundos.

> **Guion de Exposición:**
> 
> "En la sección 1.4 desglosamos cómo este problema impacta de forma diferenciada a cada área:  
> - **Soporte Técnico:** Carece de un panel unificado para monitorear el ciclo de vida del ticket en tiempo real.  
> - **TI y Desarrollo:** Sufre constantes interrupciones que rompen la concentración del equipo y recibe reportes incompletos que dificultan diagnosticar la causa raíz.  
> - **Marketing:** Ante mantenimientos del servidor o caídas imprevistas, no tiene un medio ágil para avisar masivamente a los usuarios, recibiendo la queja pública en redes sociales.  
> - **Ventas:** Pierde el rastro de peticiones comerciales clave que podrían cerrar contratos de mayor valor."

---

### Diapositiva 9: Capítulo 1 · Viabilidad y Pertinencia Profesional (1.5)
* **Visual en pantalla:** Pertinencia como estudiantes de Frontend/Backend, solución a medida y recursos para 4 meses.
* **Tiempo sugerido:** 30 segundos.

> **Guion de Exposición:**
> 
> "Como futuros profesionales de **Desarrollo de Sistemas Frontend y Backend**, este problema calza directamente con nuestras competencias formativas:  
> Contamos con la capacidad técnica para diseñar la arquitectura de base de datos, construir las APIs de negocio y crear interfaces web y móviles reactivas. Además, el proyecto está dimensionado de manera realista para ejecutarse en el marco de la unidad didáctica de 16 semanas con los recursos tecnológicos a nuestro alcance.  
> 
> A continuación, mi compañero **Josue Morales** expondrá la justificación, la innovación y los objetivos planteados."

---

## BLOQUE 3: Justificación, Innovación y Objetivos del Proyecto
**Expositor 3:** Morales Quiroga, Josue David  
**Diapositivas:** 10 a 14  
**Tiempo objetivo:** 3:30 minutos  

---

### Diapositiva 10: Capítulo 2 · Relevancia del Proyecto (2.1)
* **Visual en pantalla:** Cifra de +10 000 emprendedores y los 3 impactos críticos: emitir comprobantes, atender compradores y cumplir tributariamente.
* **Tiempo sugerido:** 45 segundos.

> **Guion de Exposición:**
> 
> "Gracias, Henry. En el Capítulo 2 sustentamos por qué este proyecto es de alta relevancia:  
> En una empresa de facturación electrónica como TuNegocio.pe, el software es el corazón del negocio de los clientes. Si la plataforma presenta una caída o un error en la emisión del comprobante, el comerciante no puede cobrar, detiene sus ventas y se expone a multas tributarias ante la SUNAT.  
> 
> Por lo tanto, la velocidad y la calidad con la que la empresa responde y corrige los errores técnicos no es un tema secundario: es el factor determinante para retener a los clientes y evitar la fuga hacia otros competidores del mercado."

---

### Diapositiva 11: Capítulo 2 · Justificación de la Innovación (2.2)
* **Visual en pantalla:** De la gestión informal a la sistematizada: Digitalización, Automatización, Analítica de gestión y marco ágil.
* **Tiempo sugerido:** 50 segundos.

> **Guion de Exposición:**
> 
> "Nuestra propuesta representa una innovación aplicada concreta: no inventamos el concepto de ticket, sino que lo adaptamos específicamente a la dinámica operativa de una empresa SaaS de facturación electrónica a través de tres componentes:  
> 1. **Digitalización y Centralización:** Reemplazamos el chat informal por un formulario estructurado que exige al agente registrar obligatoriamente datos técnicos (pantallazo, módulo afectado, mensaje del sistema).  
> 2. **Automatización:** Reglas de negocio que asignan el ticket automáticamente según severidad, envían alertas en tiempo real y gestionan los estados sin intervención manual.  
> 3. **Analítica de Gestión:** El sistema convierte cada incidencia en métricas medibles, permitiendo saber qué módulo falla con mayor frecuencia y cuáles son los cuellos de botella en la atención.  
> 
> Todo esto implementado bajo un enfoque de desarrollo ágil con **Scrum**, permitiendo validar incrementos de software con usuarios reales de la empresa."

---

### Diapositiva 12: Capítulo 2 · Análisis de Viabilidad (2.3)
* **Visual en pantalla:** Cuadrantes de viabilidad: Alcance/Plazo, Técnica, RRHH, Financiera, Información y Riesgos.
* **Tiempo sugerido:** 45 segundos.

> **Guion de Exposición:**
> 
> "Para asegurar que el proyecto sea una realidad, en la sección 2.3 evaluamos su viabilidad integral:  
> - **Alcance y Plazo:** Delimitamos la entrega a un piloto funcional en 16 semanas que cubra el ciclo completo de tickets y comunicados, postergando módulos complejos para versiones futuras.  
> - **Viabilidad Técnica:** Se emplean tecnologías web y móviles maduras, con extensa documentación comunitaria y sin alterar el código fuente de la plataforma de facturación principal.  
> - **Recursos Humanos:** El equipo de 4 integrantes asume los roles del Scrum Team con una dedicación semanal estimada de 14 horas cada uno.  
> - **Viabilidad Financiera:** Costo operativo cero en licencias gracias a herramientas de código abierto y aprovechamiento de la capa gratuita de Amazon Web Services (AWS).  
> - **Viabilidad Legal y Ética:** Garantizamos el cumplimiento de la **Ley N.° 29733** mediante el uso de datos sintéticos y anonimizados en la fase de pruebas."

---

### Diapositiva 13: Capítulo 3 · Objetivo General (3.1)
* **Visual en pantalla:** Declaración formal del Objetivo General y los 3 mecanismos de acción (Trazabilidad, Priorización y Comunicación).
* **Tiempo sugerido:** 40 segundos.

> **Guion de Exposición:**
> 
> "Entrando al Capítulo 3, definimos nuestro **Objetivo General**:  
> *'Diseñar e implementar una plataforma centralizada que resuelva la fragmentación operativa entre Soporte, Desarrollo, Ventas y Marketing en TuNegocio.pe'*.  
> 
> Este objetivo se materializa mediante tres mecanismos directos:  
> 1. Transferir fallas técnicas desde Soporte hacia Desarrollo con trazabilidad y adjuntos estructurados.  
> 2. Clasificar solicitudes de mejora según el volumen de peticiones y el valor comercial de los clientes.  
> 3. Automatizar la difusión de comunicados sobre estados del servicio, mantenimientos de infraestructura y notas de versión."

---

### Diapositiva 14: Capítulo 3 · Objetivos Específicos (3.2)
* **Visual en pantalla:** Los 3 objetivos específicos: 1. Formular diseño técnico, 2. Construir prototipo, 3. Evaluar en entorno operativo.
* **Tiempo sugerido:** 40 segundos.

> **Guion de Exposición:**
> 
> "Para alcanzar la meta general, establecimos tres **Objetivos Específicos**:  
> 1. **Diseñar:** Formular el diseño técnico del sistema mediante una arquitectura desacoplada orientada a servicios REST y un modelo relacional de base de datos que articule incidencias, solicitudes y auditoría.  
> 2. **Construir:** Desarrollar el prototipo funcional con una interfaz multiplataforma reactiva y servicios de backend que administren la gestión de incidencias, el bloqueo optimista de concurrencia y la priorización de mejoras.  
> 3. **Evaluar:** Poner a prueba el piloto en un entorno operativo con los colaboradores de las cuatro áreas, midiendo cuantitativamente los tiempos de respuesta y la reducción de transferencias manuales.  
> 
> Para detallar el stack tecnológico y las normativas que sustentan el proyecto, doy el pase a mi compañero **Eduardo Sánchez**."

---

## BLOQUE 4: Stack Tecnológico, Normativas y Cierre
**Expositor 4:** Sánchez Peña, Eduardo Enrique  
**Diapositivas:** 15 a 18  
**Tiempo objetivo:** 3:30 minutos  

---

### Diapositiva 15: Capítulo 4 · Fundamentos Técnicos / Stack (4.1)
* **Visual en pantalla:** Diagrama de capas: Frontend (Angular / App Móvil), Backend (.NET Web API REST), Base de Datos (MySQL) y Cloud (AWS).
* **Tiempo sugerido:** 50 segundos.

> **Guion de Exposición:**
> 
> "Muchas gracias, Josue. Estimados jurados, en el Capítulo 4 establecemos los pilares de ingeniería de nuestro proyecto:  
> Adoptamos una arquitectura cliente-servidor desacoplada basada en estándares de la industria:  
> - **Capa Frontend:** Utilizamos **Angular** para la consola web de administración de escritorio, complementada con una aplicación móvil desarrollada en **React Native con Expo** para que los agentes y programadores puedan consultar y actualizar tickets desde cualquier lugar.  
> - **Capa Backend:** Implementamos una API REST en **.NET con ASP.NET Core**, aprovechando su alto rendimiento tipado, robustez en la inyección de dependencias y control de concurrencia mediante bloqueo optimista.  
> - **Capa de Persistencia:** Empleamos **MySQL**, con un esquema relacional normalizado que asegura la integridad referencial de usuarios, roles, tickets, comentarios e historial de auditoría.  
> - **Infraestructura Cloud:** Desplegado sobre **Amazon Web Services (AWS)**, empleando instancias EC2 y almacenamiento S3 para adjuntos y logs."

---

### Diapositiva 16: Capítulo 4 · Normativas, Estándares y Seguridad (4.2)
* **Visual en pantalla:** Marco Legal (Ley 29733, Ley 30096, Ley 29783), Estándares ISO (25010, 27001, 12207) y Protocolos de Seguridad.
* **Tiempo sugerido:** 50 segundos.

> **Guion de Exposición:**
> 
> "Ningún software empresarial puede considerarse completo sin un marco de cumplimiento estricto:  
> - **Marco Legal Peruano:**  
>   - **Ley N.° 29733:** Ley de Protección de Datos Personales, garantizando el principio de confidencialidad y proporcionalidad en la información de los usuarios.  
>   - **Ley N.° 30096:** Ley de Delitos Informáticos, previniendo el acceso no autorizado y la manipulación indebida de datos.  
>   - **Ley N.° 29783:** Normas de ergonomía y seguridad en el trabajo digital.  
> - **Estándares Internacionales de Software:**  
>   - **ISO/IEC 25010:** Modelo de calidad del software enfocado en usabilidad, fiabilidad y eficiencia de desempeño.  
>   - **ISO/IEC 27001:** Buenas prácticas en gestión de la seguridad de la información.  
>   - **ISO/IEC/IEEE 12207:** Procesos del ciclo de vida del software aplicados a nuestro desarrollo.  
> - **Protocolos de Seguridad Aplicados:** Autenticación por tokens JWT, control de acceso basado en roles (**RBAC**), comunicaciones cifradas mediante **HTTPS/TLS** y almacenamiento de contraseñas con algoritmos hash seguros."

---

### Diapositiva 17: Capítulo 4 · Cumplimiento Específico del Portal (4.2.4)
* **Visual en pantalla:** 6 capacidades funcionales del sistema (Trazabilidad, Priorización, SLA, Protección de datos, Calidad y Gestión de cambios).
* **Tiempo sugerido:** 40 segundos.

> **Guion de Exposición:**
> 
> "En la sección 4.2.4 aterrizamos estas normas directamente en el funcionamiento de la herramienta:  
> - **Trazabilidad:** Cada ticket genera un historial inmutable con quién modificó el estado, cuándo y por qué motivo.  
> - **Matriz de Priorización:** Criterios estandarizados de criticidad (P1 a P4) basados en impacto y urgencia.  
> - **Cumplimiento de SLAs:** Monitoreo del tiempo de primera respuesta y tiempo de resolución.  
> - **Aseguramiento de Calidad:** Pruebas unitarias y de integración en endpoints clave de la API.  
> - **Gestión de Cambios:** Registro de versiones y notas de despliegue para mantener alineadas a todas las áreas de la empresa."

---

### Diapositiva 18: En Resumen / Conclusiones del Avance
* **Visual en pantalla:** Los 3 pilares del resumen: El problema, La solución propuesta y La viabilidad demostrada.
* **Tiempo sugerido:** 40 segundos.

> **Guion de Exposición:**
> 
> "En conclusión:  
> - **El problema:** TuNegocio.pe pierde trazabilidad, tiempo y dinero resolviendo incidencias críticas a través de chats informales de WhatsApp.  
> - **La solución:** Un Portal Integrado multiplataforma que centraliza tickets, audita cambios, prioriza la voz del cliente y difunde avisos corporativos en tiempo real.  
> - **La viabilidad:** Contamos con los requerimientos definidos, un stack técnico robusto (Angular, React Native, .NET, MySQL y AWS) y un plan de trabajo ágil estructurado para 16 semanas.  
> 
> Con esto concluimos la presentación de nuestro avance hasta el Capítulo 4. Quedamos a su entera disposición para responder las preguntas y observaciones que el jurado estime convenientes.  
> 
> **Muchas gracias por su atención.**"

---

## BANCO DE PREGUNTAS Y RESPUESTAS PARA LA DEFENSA ANTE EL JURADO

A continuación se preparan las respuestas a las preguntas más frecuentes que suele formular el jurado docente de IDAT en esta etapa:

### Pregunta 1: *"¿Por qué desarrollar un software propio si ya existen herramientas en el mercado como Jira, Zendesk o Trello?"*
* **Quién responde recomendado:** Josue Morales o Aldair Cahuana.
* **Respuesta clave:**  
  *"Herramientas como Jira o Zendesk son plataformas genéricas orientadas a grandes corporaciones con modelos de cobro por usuario en dólares, lo que resulta financieramente inviable para una escala SaaS local. Además, no se integran de forma natural con los módulos propios de facturación electrónica de TuNegocio.pe, ni permiten que el área de Ventas priorice una mejora de producto en función del valor económico de la cartera del cliente, que es el factor diferenciador de nuestro portal."*

### Pregunta 2: *"En el informe mencionan Angular en el stack, pero en los objetivos y repositorio tienen React Native. ¿Cómo se complementan?"*
* **Quién responde recomendado:** Eduardo Sánchez.
* **Respuesta clave:**  
  *"El sistema tiene una arquitectura desacoplada basada en una API REST unificada en ASP.NET Core. Para la administración en oficina y generación de reportes pesados se emplea el portal web de escritorio en **Angular**, mientras que para el personal operativo que requiere responder incidentes y validar estados en tiempo real contamos con la aplicación móvil en **React Native con Expo**. Ambas interfaces consumen los mismos endpoints y comparten el mismo modelo de seguridad RBAC."*

### Pregunta 3: *"¿Cómo aseguran que dos usuarios no sobrescriban el estado de un mismo ticket al mismo tiempo?"*
* **Quién responde recomendado:** Eduardo Sánchez o Henry Monroy.
* **Respuesta clave:**  
  *"Hemos implementado un mecanismo de **concurrencia optimista** a través de una columna de control de versión en la entidad Ticket. Cuando un usuario intenta actualizar un registro cuya versión ya cambió en el servidor, el backend responde con un código de error **HTTP 409 Conflict**, forzando al cliente a recargar los datos actualizados y evitando la pérdida accidental de información."*

### Pregunta 4: *"¿Cómo garantizan el cumplimiento de la Ley de Protección de Datos Personales (Ley 29733) si manejan información de clientes?"*
* **Quién responde recomendado:** Henry Monroy o Josue Morales.
* **Respuesta clave:**  
  *"Durante la fase de construcción y pruebas piloto, la base de datos se alimenta exclusivamente con datos sintéticos y anonimizados generados para pruebas, sin manipular datos reales de contribuyentes. En producción, el sistema aplica el principio de proporcionalidad, registrando únicamente la razón social y el correo de contacto técnico, protegiendo todos los accesos mediante control por roles y cifrado HTTPS."*

### Pregunta 5: *"¿Cuáles son los pasos a seguir para los Capítulos 5 y 6?"*
* **Quién responde recomendado:** Cualquiera de los integrantes.
* **Respuesta clave:**  
  *"Para el Capítulo 5 consolidaremos los diagramas de arquitectura detallados, el diagrama de Gantt de 16 semanas y el presupuesto de recursos. En el Capítulo 6 iniciaremos la ejecución de los 3 sprints bajo el marco Scrum, documentando el Product Backlog, las historias de usuario con sus criterios de aceptación (DoR y DoD), los Burndown Charts y las evidencias de código y despliegue del incremento de producto."*
