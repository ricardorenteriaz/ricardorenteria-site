insert into public.organizations (id, name, slug)
values ('00000000-0000-4000-8000-000000000001', 'XOLTEC Soluciones Solares', 'xoltec')
on conflict (slug) do update set name = excluded.name;

insert into public.products (organization_id, legacy_id, name, work_area, price, default_quantity)
values
  ('00000000-0000-4000-8000-000000000001', 'panel-longi-640', 'Panel solar marca SOL LONGI Mod 640 HIMO 6 NYTPE', 'Generación fotovoltaica', 4800, 14),
  ('00000000-0000-4000-8000-000000000001', 'inversor-growatt-max-9000', 'Inversor GROWAT MAX 9,000 KW Mod TL', 'Conversión eléctrica', 16000, 1),
  ('00000000-0000-4000-8000-000000000001', 'kit-estructural-ajustable', 'KIT estructural Ajustable a 14 paneles solares', 'Estructura y montaje', 15500, 1),
  ('00000000-0000-4000-8000-000000000001', 'cables-conectores-accesorios', 'Cables conectores, accesorios eléctricos', 'Instalación eléctrica', 12350, 1),
  ('00000000-0000-4000-8000-000000000001', 'tramites-gestorias', 'Tramites y Gestorías', 'Gestión CFE', 5500, 1),
  ('00000000-0000-4000-8000-000000000001', 'mano-obra', 'Mano de Obra', 'Mano de obra', 20500, 1)
on conflict (organization_id, legacy_id) do update
set
  name = excluded.name,
  work_area = excluded.work_area,
  price = excluded.price,
  default_quantity = excluded.default_quantity,
  active = true;
