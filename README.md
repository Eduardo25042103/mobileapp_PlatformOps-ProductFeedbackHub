# Platform Ops & Product Feedback Hub - Mobile App

Aplicación móvil empresarial desarrollada en **React Native** con **Expo** para la gestión centralizada de incidencias técnicas, trazabilidad de logs y seguimiento de telemetría operativa entre las áreas de Soporte, TI/Desarrollo, Ventas y Marketing en empresas de software como servicio (SaaS).

---

## 📋 Características Implementadas

* **Autenticación Corporativa y RBAC:** Inicio de sesión y registro de personal interno clasificado por departamentos (*Soporte, TI/Desarrollo, Ventas y Marketing*) con persistencia segura de tokens JWT en el almacenamiento del dispositivo.
* **Tablero de Telemetría (Dashboard):** Visualización de métricas operativas en tiempo real (KPIs de tickets abiertos, severidades P1 a P4, cumplimiento de SLAs y avisos de infraestructura).
* **Bandeja de Incidencias:** Listado de tickets con filtros por severidad, búsqueda rápida por código o cliente, y recarga táctil (*pull-to-refresh*).
* **Control de Concurrencia (Bloqueo Optimista):** Manejo de control de versión por ticket (`version`) y captura del error **HTTP 409 (Conflict)** con modal de recarga para prevenir sobreescritura accidental entre múltiples usuarios.
* **Trazabilidad de Logs y Soporte Multimedia:** Registro detallado de fallas técnicas y selección de capturas de pantalla preparadas para subida directa a Amazon S3 mediante URLs prefirmadas.

---

## 🏗️ Tecnologías Utilizadas

* **Framework:** React Native con Expo
* **Navegación:** React Navigation (Native Stack)
* **Formularios y Validación:** React Hook Form + Zod
* **Cliente HTTP y Almacenamiento:** Axios + Expo Secure Store
* **Multimedia y Archivos:** Expo Image Picker + Expo File System
* **Diseño:** Componentes modulares con paleta dark mode de alta densidad informativa

---

## 🚀 Guía de Instalación y Ejecución

### Prerrequisitos
* Node.js (v18 o superior)
* Aplicación **Expo Go** instalada en tu teléfono móvil (Android o iOS)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Eduardo25042103/mobileapp_PlatformOps-ProductFeedbackHub.git
cd mobileapp_PlatformOps-ProductFeedbackHub

# 2. Entrar al directorio de la aplicación
cd mobile

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npx expo start
```

* **En teléfono móvil:** Escanea el código QR desde la app **Expo Go**.
* **En emulador Android:** Presiona la tecla `a`.
* **En navegador web:** Presiona la tecla `w`.

---

## 📂 Estructura del Proyecto

```text
mobile/
├── src/
│   ├── api/                      # Clientes de red Axios y servicios de incidencias
│   ├── components/               # Componentes reutilizables (Botones, Inputs, Badges)
│   ├── context/                  # AuthContext y estado global de usuario
│   ├── navigation/               # RootNavigator, AuthNavigator y AppNavigator
│   ├── screens/                  # Pantallas (Login, Register, Home, List, Detail, Form)
│   ├── types/                    # Tipado TypeScript (auth, ticket, navegación)
│   └── utils/                    # Manejo de almacenamiento seguro y formateadores
├── App.tsx                       # Punto de entrada de la aplicación
├── package.json                  # Dependencias del proyecto
└── tsconfig.json                 # Configuración estricta de TypeScript
```
