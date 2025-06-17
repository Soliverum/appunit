# AppUnit

**AppUnit** es una plataforma modular y multilenguaje para la gestión de proyectos de construcción, presupuestos, análisis de precios unitarios (APU), integración BIM/CAD y control de costos.

## Características principales

- Gestión de usuarios y roles (con autenticación JWT y control de acceso basado en roles)
- Gestión de proyectos, recursos y documentos
- Análisis de precios unitarios (APU) y presupuesto
- Integración BIM (IFC, glTF) y CAD (DXF)
- Control y seguimiento de costos reales
- Gestión de tareas y programación (Gantt, Kanban)
- Arquitectura modular, escalable y documentada

## Prerrequisitos

Para instalar y ejecutar AppUnit, necesitarás tener instalado lo siguiente:

- Git
- Python 3.7+
- Node.js (recomendado v18 o superior) y Yarn

- [Roadmap](./ROADMAP.md)
- [Estrategia Multilenguaje](./MULTILANGUAGE_STRATEGY.md)
- [Esquema de Base de Datos](./DATABASE_SCHEMA.md)
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
   pip install -r requirements.txt
   ```

3. Configura variables de entorno
   - Ver `.env.example` en cada módulo
   - Configura idiomas soportados: `en, es`

4. Base de datos
   - PostgreSQL 13+ recomendado
   - Ejecuta migraciones iniciales (ver [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md))

5. Ejecuta los servidores
   ```bash
   # Backend
   uvicorn main:app --reload
   # Frontend (React)
   yarn start
   ```

## Estructura de carpetas

- `/frontend`: Aplicación web/móvil (React, React Native, Tauri)
- `/backend`: API (FastAPI, Python)
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