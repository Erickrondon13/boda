# /boda-erick-telma

Invitación de boda interactiva con RSVP conectado a Supabase.

## Estructura

```
/boda-erick-telma
│
├── index.html             # Página principal de invitación
├── admin.html             # Panel de administración
│
├── css/
│   ├── style.css          # Estilos de la invitación
│   └── admin.css          # Estilos del panel admin
│
├── js/
│   ├── supabase.js        # Configuración y funciones Supabase
│   ├── app.js             # Lógica principal (RSVP, animaciones)
│   ├── countdown.js       # Cronómetro regresivo
│   └── admin.js           # Lógica del panel admin
│
├── sql/
│   ├── 01_schema.sql      # Creación de tablas y funciones
│   ├── 02_invitados.sql   # Carga inicial de invitados
│   ├── 03_view_admin.sql  # Vista para consultas
│   └── 04_policies.sql    # Políticas RLS
│
└── assets/
    ├── banner.jpg         # Foto de portada (reemplazar)
    └── bg-floral.jpg      # Decorativo
```

## Deploy en Vercel

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta los SQL en orden: `01_schema.sql` → `02_invitados.sql` → `03_view_admin.sql` → `04_policies.sql`
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
