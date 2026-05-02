# WEAGRO Landing

Servicios digitales orientados al agro.

Landing page responsive para WEAGRO, una agencia de servicios digitales para empresas agropecuarias del NEA.

## Stack

- HTML5 standalone
- CSS3 embebido
- JavaScript mínimo embebido
- Vite para desarrollo local y build de producción
- Vercel para despliegue

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
