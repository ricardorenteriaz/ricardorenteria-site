# XOLTEC CRM LAB

Ruta privada para migrar el CRM de demo estatica a una app real.

## Objetivo

- Mantener `/xoltec-crm` como demo estable para prospectos.
- Usar `/xoltec-crm-lab` como ambiente de trabajo.
- Migrar gradualmente de `localStorage` a backend real.

## Fases

1. Preparar Supabase con tablas y autenticacion.
2. Migrar usuarios y roles.
3. Migrar productos.
4. Migrar clientes y cotizaciones.
5. Reemplazar respaldos manuales por respaldo de base de datos.
6. Revisar permisos por rol antes de usar datos reales.

## Base de datos

Archivos creados:

- `supabase/migrations/20260526_xoltec_crm_schema.sql`
- `supabase/seed/20260526_xoltec_seed.sql`

Orden de ejecucion en Supabase SQL Editor:

1. Ejecutar `20260526_xoltec_crm_schema.sql`.
2. Ejecutar `20260526_xoltec_seed.sql`.
3. Crear usuarios reales desde Supabase Auth.
4. Insertar cada usuario en `profiles` con su `organization_id`.

## Nota

Esta ruta sigue siendo estatica hasta conectar backend. La contrasena del gate solo oculta el acceso casual.
