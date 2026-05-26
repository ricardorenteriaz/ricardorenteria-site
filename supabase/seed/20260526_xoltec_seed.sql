insert into public.organizations (id, name, slug)
values ('00000000-0000-4000-8000-000000000001', 'XOLTEC Soluciones Solares', 'xoltec')
on conflict (slug) do update set name = excluded.name;

insert into public.products (organization_id, legacy_id, name, price, default_quantity)
values
  ('00000000-0000-4000-8000-000000000001', 'panel-longi-640', 'Panel solar marca SOL LONGI Mod 640 HIMO 6 NYTPE', 4800, 14),
  ('00000000-0000-4000-8000-000000000001', 'inversor-growatt-max-9000', 'Inversor GROWAT MAX 9,000 KW Mod TL', 16000, 1),
  ('00000000-0000-4000-8000-000000000001', 'kit-estructural-ajustable', 'KIT estructural Ajustable a 14 paneles solares', 15500, 1),
  ('00000000-0000-4000-8000-000000000001', 'cables-conectores-accesorios', 'Cables conectores, accesorios eléctricos', 12350, 1),
  ('00000000-0000-4000-8000-000000000001', 'tramites-gestorias', 'Tramites y Gestorías', 5500, 1),
  ('00000000-0000-4000-8000-000000000001', 'mano-obra', 'Mano de Obra', 20500, 1)
on conflict (organization_id, legacy_id) do update
set
  name = excluded.name,
  price = excluded.price,
  default_quantity = excluded.default_quantity,
  active = true;
