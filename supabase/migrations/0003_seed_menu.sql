insert into menu_items (name, description, price, category) values
  ('Planche à partager', 'Charcuterie, fromages affinés, pain de campagne', 15.00, 'entree'),
  ('Soupe à l''oignon gratinée', 'Recette traditionnelle, croûtons et comté', 8.50, 'entree'),
  ('Burger Guinguette', 'Bœuf, cheddar, oignons confits, frites maison', 16.00, 'plat'),
  ('Tartare de bœuf au couteau', 'Coupé au couteau, frites maison', 17.50, 'plat'),
  ('Crêpe maison', 'Pâte maison, à garnir selon vos goûts', 6.00, 'dessert'),
  ('Boule de glace artisanale', '2 boules, coulis au choix', 5.50, 'dessert'),
  ('Limonade artisanale', 'Pression, verre 33cl', 4.00, 'boisson'),
  ('Pichet de rosé (50cl)', 'Côtes de Provence', 12.00, 'boisson');

insert into menu_item_options (menu_item_id, label, extra_price, sort_order)
select id, opt.label, opt.extra_price, opt.sort_order
from menu_items, (values
  ('Nature', 0, 1),
  ('Chocolat', 0, 2),
  ('Chocolat-banane', 1.00, 3),
  ('Caramel beurre salé', 1.00, 4)
) as opt(label, extra_price, sort_order)
where menu_items.name = 'Crêpe maison';

insert into menu_item_options (menu_item_id, label, extra_price, sort_order)
select id, opt.label, opt.extra_price, opt.sort_order
from menu_items, (values
  ('Vanille', 0, 1),
  ('Chocolat', 0, 2),
  ('Fraise', 0, 3),
  ('Caramel beurre salé', 0, 4)
) as opt(label, extra_price, sort_order)
where menu_items.name = 'Boule de glace artisanale';
