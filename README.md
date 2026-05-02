# WEAGRO Landing

Servicios digitales orientados al agro.

Landing page responsive para WEAGRO, una agencia de servicios digitales para empresas agropecuarias del NEA.

## Stack

- HTML5 standalone
- CSS3 embebido
- JavaScript mínimo embebido
- Tipografía Rubik desde Google Fonts
- Vite para desarrollo local y build de producción
- Vercel para despliegue

## Configuración editable

En `index.html` se pueden ajustar estos valores:

- Email de contacto: buscar `hola@weagro.com.ar`
- WhatsApp: reemplazar `https://wa.me/5490000000000` por el número real
- Google Analytics: reemplazar `G-XXXXXXXXXX` por el ID de medición real y descomentar el bloque del `<head>`

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
