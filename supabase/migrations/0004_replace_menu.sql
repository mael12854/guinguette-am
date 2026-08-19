-- clear test order data and the old (too ambitious) menu
delete from order_items;
delete from orders;
delete from menu_items; -- cascades to menu_item_options

insert into menu_items (name, description, price, category) values
  ('Chips nature', null, 2.00, 'entree'),
  ('Cacahuètes grillées', null, 2.00, 'entree'),
  ('Sirop à l''eau', 'Menthe, grenadine, fraise ou citron', 1.50, 'boisson'),
  ('Limonade artisanale', 'Pression, verre 33cl', 3.00, 'boisson'),
  ('Jus de pomme', '25cl', 2.50, 'boisson'),
  ('Eau plate (50cl)', null, 1.50, 'boisson'),
  ('Eau pétillante (50cl)', null, 1.50, 'boisson'),
  ('Café', null, 1.50, 'boisson'),
  ('Thé', null, 1.50, 'boisson'),
  ('Mousse au chocolat maison', null, 3.50, 'dessert'),
  ('Gâteau au yaourt maison', null, 3.50, 'dessert');

insert into menu_item_options (menu_item_id, label, extra_price, sort_order)
select id, opt.label, 0, opt.sort_order
from menu_items, (values
  ('Menthe', 1),
  ('Grenadine', 2),
  ('Fraise', 3),
  ('Citron', 4)
) as opt(label, sort_order)
where menu_items.name = 'Sirop à l''eau';
