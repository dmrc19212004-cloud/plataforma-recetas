# Plataforma de Recetas de Cocina

Plataforma web desarrollada en Next.js y Supabase para descubrir, compartir y gestionar recetas culinarias de la comunidad y del mundo, permitiendo a los usuarios interactuar mediante roles de usuario y un completo panel de administración.

🔗 **Demo en vivo:** [https://plataforma-recetas.vercel.app](https://plataforma-recetas.vercel.app)

---

## 📸 Capturas de pantalla

## 📸 Capturas de pantalla

1. **Vista principal / Home:** ![Home](./public/home.png)
2. **Dashboard del Chef:** ![Dashboard](./public/dashboard.png)
3. **Dashboard del Lector:** ![Lector](./public/lector.png)  
4. **Formulario de edición/creación:** ![Editar Receta](./public/editar.png)

## 🛠️ Stack tecnológico

- **Next.js 14** (App Router & Server Actions)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Auth + Row Level Security)
- **Vercel** (Despliegue y hosting en la nube)

---

## 👥 Roles de usuario

- **Administrador:** Tiene control total sobre el sistema, con capacidad de gestionar perfiles, supervisar y moderar las recetas de cualquier usuario registrado en la plataforma.
- **Chef / Creador de Recetas:** Puede registrarse, iniciar sesión, crear sus propias recetas (con título, ingredientes, instrucciones, categorías, tiempos e imágenes), además de editar o eliminar exclusivamente sus propias publicaciones.
- **Visitante / Usuario general:** Puede navegar por el catálogo público de recetas y consultar información detallada de los platillos.

---

## 📊 Modelo de datos

La base de datos en Supabase se compone principalmente de las siguientes tablas:

1. **`profiles` (Perfiles):**
   - `id` (UUID, vinculado a `auth.users`)
   - `role` (Texto: `administrador` o `chef`)
   - `updated_at` (Timestamp)

2. **`recetas` (Recetas):**
   - `id` (UUID, Clave primaria)
   - `titulo` (Texto)
   - `descripcion` (Texto)
   - `ingredientes` (Texto)
   - `instrucciones` (Texto)
   - `categoria` (Texto)
   - `tiempo_preparacion` (Entero en minutos)
   - `imagen_url` (Texto)
   - `chef_id` (UUID, Clave foránea referenciando a `profiles.id`)
   - `created_at` (Timestamp)

---

## ⚙️ Instalación local

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local:

```bash
# 1. Clonar el repositorio
git clone [https://github.com/dmrc19212004-cloud/plataforma-recetas.git](https://github.com/dmrc19212004-cloud/plataforma-recetas.git)

# 2. Entrar a la carpeta del proyecto
cd plataforma-recetas

# 3. Instalar las dependencias
npm install

# 4. Configurar las variables de entorno (crear un archivo .env.local basado en .env.example)
NEXT_PUBLIC_SUPABASE_URL=https://fakexosgvcgqoxfkkczy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2V4b3NndmNncW94ZmtrY3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NzEwOTgsImV4cCI6MjEwMzU0NzA5OH0.Ju0VZGw9UaNzeU7L_BIFWgXDM6bon48m7jaR7gryL7g

# 5. Ejecutar el servidor de desarrollo
npm run dev