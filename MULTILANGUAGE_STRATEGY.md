# Estrategia Multilenguaje para AppUnit

## 1. Principios generales

- Internacionalización (i18n): arquitectura preparada para múltiples idiomas y formatos regionales.
- Localización (l10n): ampliable a nuevos idiomas/culturas por demanda.
- Soporte para inglés y español desde MVP.

## 2. Frontend

- Usa `react-i18next`, archivos `/locales/{lang}/translation.json`
- Todas las cadenas de texto UI deben estar en archivos de recursos.
- Detección automática y selector manual de idioma.
- Soporte para traducción de validaciones, errores y notificaciones.

## 3. Backend

- Mensajes de error y validación traducibles usando `Accept-Language` o parámetro en la API.
- Serializar fechas/números en formato neutro; formatear en frontend.
- Para campos multilingües, usar JSON: `{ "es": "...", "en": "..." }`

## 4. Base de datos

- Campos multilenguaje en JSON o tablas auxiliares para descripciones/etiquetas editables.

## 5. Proceso de traducción

- Herramientas sugeridas: Crowdin, POEditor, Transifex o edición manual.
- Versionar archivos de idioma en `/locales`.
- Instrucciones para contribuir traducciones en este archivo.

## 6. Integración en el roadmap

- UI y backend preparados para i18n desde el inicio.
- QA y pruebas automáticas/manuales en todos los idiomas soportados.

## 7. Ejemplo de estructura de archivos

```
/locales/
  en/
    translation.json
  es/
    translation.json
```

## 8. Recursos

- [react-i18next docs](https://react.i18next.com/)
- [Python Babel](https://babel.pocoo.org/)

---

¿Quieres ayudar a traducir?  
1. Duplica el archivo correspondiente en `/locales`.
2. Completa las traducciones.
3. Haz un PR indicando el idioma añadido/corregido.