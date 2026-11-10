# /boda

Invitación de boda interactiva con RSVP conectado a Supabase.

## Estructura

```
/boda
│
├── index.html             # Página principal de invitación
├── admin.html             # Panel de administración
├── comunidad.html          # Página del QR general (consejos + galería)
│
├── css/
│   ├── style.css          # Estilos de la invitación
│   ├── admin.css          # Estilos del panel admin
│   └── comunidad.css      # Estilos de la página comunidad
│
├── js/
│   ├── supabase.js        # Configuración y funciones Supabase
│   ├── app.js             # Lógica principal (RSVP, animaciones)
│   ├── countdown.js       # Cronómetro regresivo
│   ├── admin.js           # Lógica del panel admin
│   └── comunidad.js       # Lógica de consejos y galería (QR)
│
├── sql/
│   ├── 01_schema.sql      # Creación de tablas y funciones
│   ├── 02_invitados.sql   # Carga inicial de invitados
│   ├── 03_view_admin.sql  # Vista para consultas
│   ├── 04_policies.sql    # Políticas RLS
│   └── 08_comunidad.sql   # Tablas consejos/galería, bucket y políticas
│
└── assets/
    ├── banner.jpg         # Foto de portada (reemplazar)
    └── bg-floral.jpg      # Decorativo
```

## Deploy en Vercel

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta los SQL en orden: `01_schema.sql` → `02_invitados.sql` → `03_view_admin.sql` → `04_policies.sql` → `08_comunidad.sql`
3. Conecta tu repo de GitHub a Vercel e importa el proyecto
4. No necesita build command — es estático

## Links Personalizados

```
https://tu-dominio.vercel.app/?token={token_del_invitado}
```

## Admin

```
https://tu-dominio.vercel.app/admin.html
```

## Comunidad (QR general)

Página accesible por un único código QR que se coloca en la fiesta. Ofrece dos opciones:

1. **Consejos y más** — muro público donde los invitados dejan mensajes/consejos a los novios, más los datos bancarios del regalo.
2. **Galería de la boda** — los invitados suben fotos y videos (Supabase Storage, bucket `boda-media`, público) que quedan guardados para los novios.

```
https://tu-dominio.vercel.app/comunidad.html
```

La propia página muestra un QR en vivo (generado desde su URL actual) para que los novios lo impriman o muestren en pantalla. También existe un QR de respaldo en `assets/qr-comunidad.png` (apunta a `erickrondon13.github.io/boda/comunidad.html`; regenéralo con tu dominio real si despliegas en Vercel).

Para regenerar el QR de respaldo:

```bash
npx qrcode "https://TU-DOMINIO/comunidad.html" -o assets/qr-comunidad.png -w 8
```

> Nota: `08_comunidad.sql` crea el bucket por SQL. Si tu proyecto lo bloquea, crea manualmente el bucket `boda-media` como **público** en Storage y vuelve a ejecutar solo las políticas del archivo.
