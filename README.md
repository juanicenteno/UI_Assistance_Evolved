# aiBrief Evolved 🧠✨

**aiBrief Evolved** es una aplicación web full-stack potenciada por inteligencia artificial diseñada para generar **briefs creativos, estrategias de UX y guías de branding** completas y personalizadas a partir de una idea de negocio.

La aplicación utiliza inteligencia artificial para crear una identidad visual (paleta de colores, tipografías recomendadas), una ficha detallada del *User Persona* (público objetivo), y genera de forma asíncrona un logotipo y mockups visuales utilizando modelos de difusión de imágenes. También permite la exportación a un documento PDF de alta fidelidad listo para imprimir o enviar.

---

## 🚀 Características Principales

*   **Generación de Brief con IA:** Crea un análisis completo del proyecto (nombre, descripción estratégica, paleta de colores, tipografías sugeridas y User Persona detallado) usando el modelo **Gemini 3.1 Flash Lite** (a través de la API de Gemini).
*   **Generación Asíncrona de Logotipos y Mockups:** Utiliza la API de **Pollinations.ai** (modelo FLUX) para generar de forma asíncrona imágenes de branding únicas, guardándolas localmente en el servidor.
*   **Refinamiento Interactivo (Chat de Refinamiento):** Modifica y pule secciones del brief mediante instrucciones en lenguaje natural. El backend actualiza la estrategia visual manteniendo intactos el logotipo y mockup generados.
*   **Exportación a PDF de Alta Calidad:** Genera un PDF del brief listo para imprimir compilando plantillas HTML dinámicas con **Handlebars** y renderizándolas mediante un navegador headless con **Puppeteer**.
*   **Historial Local:** Almacena en el `LocalStorage` del navegador los briefs consultados para poder acceder a ellos rápidamente en la sección "Mis Briefs".

---

## 🛠️ Arquitectura del Proyecto

El proyecto está dividido en dos partes principales:

### 1. Frontend (`/frontend`)
*   **Framework:** Next.js 16 (App Router) con React 19 y TypeScript.
*   **Estilos:** Tailwind CSS para un diseño moderno, responsivo y dinámico.
*   **Componentes:** Radix UI / Base UI, iconos de Lucide React y animaciones fluidas.
*   **Persistencia:** `LocalStorage` para el historial de briefs del usuario.

### 2. Backend (`/backend`)
*   **Entorno:** Node.js con Express.
*   **Base de Datos:** MySQL para persistir el estado de generación y los datos estructurados del brief.
*   **Procesamiento en Segundo Plano:** Generación asíncrona de imágenes para responder instantáneamente al cliente mientras las imágenes se procesan de fondo.
*   **Generación de PDFs:** Puppeteer (Headless Browser) + Handlebars (Motores de plantillas).

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
*   [Node.js](https://nodejs.org/) (versión 18 o superior recomendado)
*   [MySQL](https://www.mysql.com/) corriendo localmente o en un servidor
*   Una API Key de **Gemini** (Google AI Studio)

---

## ⚙️ Instalación y Configuración

### 1. Clonar el proyecto
Navega a la carpeta del proyecto:
```bash
cd aiBrief_evolved
```

### 2. Configurar la Base de Datos (MySQL)
Usa el archivo de esquema provisto para crear la base de datos y la tabla correspondiente en tu servidor MySQL:
```bash
# Puedes importar el archivo directamente en tu gestor de base de datos (MySQL Workbench, phpMyAdmin, CLI)
mysql -u tu_usuario -p < backend/schema.sql
```
El archivo de esquema [backend/schema.sql](backend/schema.sql) creará una base de datos llamada `ux_brief` con la tabla `briefs` estructurada para almacenar el JSON del brief y el estado del mismo (`pending`, `ready`, `error`).

### 3. Configurar el Backend
1. Ve a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Duplica el archivo `.env.example` y renómbralo a `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edita `.env` agregando tu API Key de Gemini y tus credenciales de MySQL:
   ```env
   PORT=4000
   DB_HOST=127.0.0.1
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=ux_brief
   GEMINI_API_KEY=tu_gemini_api_key_real
   ```

### 4. Configurar el Frontend
1. Ve a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Asegúrate de tener configurado el archivo `.env.local` indicando la URL del backend (por defecto viene configurado a `http://localhost:4000`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

---

## 🏃 Cómo Ejecutar el Proyecto

### Ejecutar el Backend
Desde la carpeta `backend`:
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (usa nodemon)
npm run dev
```
El servidor backend correrá en `http://localhost:4000`.

### Ejecutar el Frontend
Desde la carpeta `frontend` (en otra pestaña de la terminal):
```bash
# Instalar dependencias
npm install # o pnpm install

# Iniciar servidor de desarrollo de Next.js
npm run dev
```
La aplicación web estará disponible en `http://localhost:3000`.

---

## 🔌 Endpoints de la API Backend

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/api/generar` | Recibe los parámetros de negocio del formulario, genera la estructura del brief con Gemini, crea un registro `pending` en la DB, inicia la generación de imágenes en segundo plano y devuelve el ID. |
| **GET** | `/api/brief/:id` | Devuelve el JSON del brief y su estado de generación (`pending`, `ready`, `error`). |
| **POST** | `/api/brief/:id/refinar` | Recibe instrucciones de modificación, refina la información usando IA conservando las imágenes y actualiza el registro en la base de datos. |
| **GET** | `/api/generar-pdf` | Compila los datos en la plantilla de Handlebars y genera un flujo binario PDF usando Puppeteer. |

---

## 📄 Estructura de Archivos Clave

```text
aiBrief_evolved/
├── backend/
│   ├── routes/              # Controladores de rutas (generar, brief, pdf)
│   ├── services/            # Servicios (Gemini, imágenes con Pollinations, Puppeteer)
│   ├── templates/           # Plantilla HTML para la generación del PDF
│   ├── uploads/             # Archivos estáticos y renders generados localmente (ignorado por Git)
│   ├── schema.sql           # Estructura e inicialización de la base de datos
│   └── App.js               # Entrada principal de la API Express
├── frontend/
│   ├── app/                 # Páginas principales de Next.js (landing, ver brief, historial)
│   ├── components/          # Componentes de React (BriefForm, LandingView, BriefResult)
│   └── lib/                 # Utilidades, llamadas a API y manejo de almacenamiento local
└── .gitignore               # Configuración de exclusión para Git
```
