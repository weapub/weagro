# WEAGRO Landing

Servicios digitales orientados al agro.

Landing page responsive para WEAGRO, una agencia de servicios digitales para empresas agropecuarias del NEA.

## Stack

- HTML5 standalone
- CSS3 embebido
- JavaScript minimo embebido
- Tipografia Rubik desde Google Fonts
- Vite para desarrollo local y build de produccion
- Vercel para despliegue

## Configuracion editable

En `index.html` se pueden ajustar estos valores:

- Email de contacto: buscar `hola@weagro.com.ar`
- WhatsApp: buscar `543704602028` y reemplazar por el numero real si cambia
- Google Analytics: reemplazar `G-XXXXXXXXXX` por el ID de medicion real y descomentar el bloque del `<head>`
- Dominio/canonical/OG: reemplazar `https://weagro.vercel.app/` por el dominio definitivo cuando este configurado
- Favicon y preview social: editar `public/favicon.svg` y `public/og-image.svg`

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir:

```text
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

El sitio se genera en `dist/`.

## Deploy en Vercel

Al importar el repositorio desde GitHub en Vercel, usar:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

El archivo `vercel.json` ya deja esos valores configurados.
