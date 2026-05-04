# WEAGRO Landing

Servicios digitales orientados al agro.

Landing page responsive para WEAGRO, una agencia de servicios digitales para empresas agropecuarias del NEA.

## Stack

- HTML5 standalone
- CSS3 separado en `style.css`
- JavaScript minimo en `main.js`
- Tipografias Nunito + Poppins desde Google Fonts
- Vite para desarrollo local y build de produccion
- Vercel para despliegue
- Vercel Functions + Resend para el envio de consultas por email

## Configuracion editable

En `index.html` se pueden ajustar estos valores:

- Email de contacto: buscar `info@weagro.com.ar`
- WhatsApp: buscar `543704602028` y reemplazar por el numero real si cambia
- Google Analytics: reemplazar `G-XXXXXXXXXX` por el ID de medicion real y descomentar el bloque del `<head>`
- Dominio/canonical/OG: reemplazar `https://weagro.vercel.app/` por el dominio definitivo cuando este configurado
- Favicon y preview social: editar `public/favicon.png` y `public/og-image.svg`

## Formulario de contacto

El formulario envia consultas por email usando la funcion serverless `api/contact.js`.

Para activarlo en Vercel, configurar estas variables de entorno:

```text
RESEND_API_KEY=...
CONTACT_FROM_EMAIL=WEAGRO <contacto@tudominio.com>
CONTACT_TO_EMAIL=info@weagro.com.ar
```

Notas:

- `CONTACT_FROM_EMAIL` debe pertenecer a un dominio verificado en Resend.
- `CONTACT_TO_EMAIL` es opcional; si no se define, usa `info@weagro.com.ar`.
- Para probar el envio localmente conviene usar `vercel dev`, porque Vite no ejecuta la carpeta `api/`.

### Prueba y logs

Una vez configuradas las variables en Vercel, probar el endpoint con:

```bash
curl -X POST https://weagro.com.ar/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Prueba\",\"company\":\"Campo Demo\",\"email\":\"tu-email@dominio.com\",\"service\":\"Webapps a medida\",\"message\":\"Mensaje de prueba\"}"
```

Respuesta esperada:

```json
{
  "ok": true,
  "id": "...",
  "requestId": "contact_..."
}
```

Si falla, la respuesta incluye `requestId`. Buscar ese codigo en Vercel:

- Project > Logs > Runtime Logs
- Filtrar por `/api/contact` o por el `requestId`

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

## Futuras Mejoras Sugeridas

- [x] **Optimizacion SEO:** Implementar Schema.org (JSON-LD) para servicios locales.
- [ ] **Performance:** Convertir imagenes a formato WebP/AVIF y anadir `loading="lazy"`.
- [ ] **Accesibilidad (A11y):** Asegurar contraste de colores y etiquetas ARIA en el formulario/botones.
- [x] **Arquitectura CSS:** Migrar el CSS embebido a archivos `.css` separados aprovechando los modulos de Vite para mejor mantenibilidad.
- [x] **PWA:** Anadir un `manifest.webmanifest` para que la landing pueda "instalarse" en dispositivos moviles de clientes en el campo.
- [x] **Formulario de Contacto:** Enviar consultas por email con Vercel Functions y Resend.
