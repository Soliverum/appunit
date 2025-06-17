# AppUnit

**AppUnit** es una plataforma modular y multilenguaje para la gestión de proyectos de construcción, presupuestos, análisis de precios unitarios (APU), integración BIM/CAD y control de costos.

## Características principales

- Gestión de usuarios, proyectos, recursos y documentos
- Análisis de precios unitarios (APU) y presupuesto
- Integración BIM (IFC, glTF) y CAD (DXF)
- Control y seguimiento de costos reales
- Gestión de tareas y programación (Gantt, Kanban)
- Soporte multilenguaje (i18n) desde el MVP (Español/English)
- Arquitectura modular, escalable y documentada

## Tabla de contenidos

- [Roadmap](./ROADMAP.md)
- [Estrategia Multilenguaje](./MULTILANGUAGE_STRATEGY.md)
- [Estrategia BIM/CAD](./BIM_CAD_INTEGRATION.md)
- [Desarrollo Incremental y Modular](./INCREMENTAL_MODULAR_DEVELOPMENT.md)
- [Buenas Prácticas y Documentación](./DOCS_AND_BEST_PRACTICES.md)

## Instalación (Desarrollo)

1. Clona el repositorio
   ```bash
   git clone https://github.com/[tu-org]/appunit.git
   cd appunit
   ```

2. Instala las dependencias (ejemplo para monorepo JS/Python)
   ```bash
   # Frontend
   cd frontend
   yarn install
   # Backend
   cd ../backend
   npm install
   ```

3. Configura variables de entorno
   - Ver `.env.example` en cada módulo
   - Configura idiomas soportados: `en, es`

4. Base de datos
   - MongoDB (e.g., v5.0+ o compatible) recomendado.
   - No se requieren migraciones estructuradas como en SQL; las estructuras de los documentos son definidas por los esquemas de Mongoose en `backend/models/`.

5. Ejecuta los servidores
   ```bash
   # Backend
   npm run dev  # Para desarrollo (con nodemon)
   # o
   npm start    # Para ejecución directa
   # Frontend (React)
   yarn start
   ```

## Estructura de carpetas

- `/frontend`: Aplicación web/móvil (React, React Native, Tauri)
- `/backend`: API (Node.js, Express)
- `/docs`: Documentación técnica y de usuario
- `/locales`: Archivos de recursos de traducción i18n

## Multilenguaje

- Todos los textos y mensajes se encuentran en `/locales/{idioma}/translation.json`
- Instrucciones para contribuir traducciones en [MULTILANGUAGE_STRATEGY.md](./MULTILANGUAGE_STRATEGY.md)

## Documentación

Consulta la documentación completa en la carpeta `/docs` y archivos Markdown raíz del repositorio.

---

## Licencia

MIT © [Tu Organización]