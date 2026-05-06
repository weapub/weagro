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
- Supabase para marcas, trabajos realizados, imagenes y acceso admin

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

## Panel admin con Supabase

El panel admin permite cargar marcas que confian en WEAGRO y trabajos realizados con sus servicios implementados.

El acceso al panel queda separado de la landing publica en:

```text
/admin
```

### 1. Crear proyecto en Supabase

1. Crear un proyecto Free en Supabase.
2. Ir a SQL Editor.
3. Ejecutar el contenido de `supabase/schema.sql`.
4. Crear un usuario admin en Authentication > Users.
5. Copiar el `User UID` del usuario creado y autorizarlo en SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('PEGAR-USER-UID-AQUI')
on conflict (user_id) do nothing;
```

### 2. Variables de entorno

Configurar en `.env` local y en Vercel:

```text
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```

Notas:

- La landing puede leer marcas y trabajos publicos sin iniciar sesion.
- Solo usuarios autenticados en Supabase pueden crear o borrar marcas/trabajos.
- Los logos se suben al bucket `logos`; las imagenes de trabajos se suben al bucket `projects`.
- Si faltan las variables de Supabase, el panel funciona en modo local con `localStorage` como respaldo.

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
