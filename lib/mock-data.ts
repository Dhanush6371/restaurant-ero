import type {
  DemoUser,
  RestaurantTable,
  Reservation,
  Order,
  MenuItem,
  Modifier,
  InventoryItem,
  Supplier,
  PurchaseOrder,
  Recipe,
  Customer,
  Payment,
  DeliveryOrder,
  Employee,
  Shift,
  Notification,
  HourlySale,
  SalesRecord,
  Expense,
  Invoice,
} from '@/types';

export const demoUsers: DemoUser[] = [
  { id: 'u1', name: 'Antoine Laurent', email: 'admin@maisoneetoile.com', password: 'admin123', role: 'Admin' },
  { id: 'u2', name: 'Claire Dubois', email: 'manager@maisoneetoile.com', password: 'manager123', role: 'Manager' },
  { id: 'u3', name: 'Jean Martin', email: 'waiter@maisoneetoile.com', password: 'waiter123', role: 'Waiter' },
  { id: 'u4', name: 'Louis Bernard', email: 'chef@maisoneetoile.com', password: 'chef123', role: 'Chef' },
];

export const rolePermissions: Record<string, string[]> = {
  Admin: [
    'dashboard', 'pos', 'tables', 'reservations', 'kitchen', 'waiter',
    'menu', 'inventory', 'purchasing', 'recipes', 'customers', 'staff',
    'payments', 'delivery', 'reports', 'accounting', 'settings',
  ],
  Manager: [
    'dashboard', 'pos', 'tables', 'reservations', 'kitchen',
    'menu', 'inventory', 'purchasing', 'recipes', 'customers', 'staff',
    'payments', 'delivery', 'reports', 'accounting',
  ],
  Waiter: ['dashboard', 'pos', 'tables', 'reservations', 'waiter', 'customers', 'payments'],
  Chef: ['dashboard', 'kitchen', 'menu', 'inventory', 'recipes'],
};

const dishImages: Record<string, string> = {
  'Steak Frites': 'https://images.pexels.com/photos/1544539/pexels-photo-1544539.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Duck Confit': 'https://images.pexels.com/photos/6210756/pexels-photo-6210756.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Bouillabaisse': 'https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Coq au Vin': 'https://images.pexels.com/photos/5409027/pexels-photo-5409027.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Escargots de Bourgogne': 'https://images.pexels.com/photos/5737335/pexels-photo-5737335.jpeg?auto=compress&cs=tinysrgb&w=400',
  'French Onion Soup': 'https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Crème Brûlée': 'https://images.pexels.com/photos/8784722/pexels-photo-8784722.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Tarte Tatin': 'https://images.pexels.com/photos/8784722/pexels-photo-8784722.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Ratatouille': 'https://images.pexels.com/photos/5737335/pexels-photo-5737335.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Beef Bourguignon': 'https://images.pexels.com/photos/5409027/pexels-photo-5409027.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Soufflé': 'https://images.pexels.com/photos/8784722/pexels-photo-8784722.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Cheese Board': 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400',
};

export const menuItems: MenuItem[] = [
  { id: 'm1', name: 'Steak Frites', description: 'Grilled ribeye with hand-cut frites and béarnaise sauce', category: 'Plats', price: 32, foodCost: 11.30, prepTime: 18, allergens: ['Gluten', 'Eggs'], tags: ['Signature', 'Popular'], available: true, hasModifiers: true, image: dishImages['Steak Frites'], station: 'Grill' },
  { id: 'm2', name: 'Duck Confit', description: 'Slow-cooked duck leg with sarladaise potatoes', category: 'Plats', price: 29, foodCost: 9.80, prepTime: 20, allergens: ['None'], tags: ['Classic'], available: true, hasModifiers: true, image: dishImages['Duck Confit'], station: 'Hot Kitchen' },
  { id: 'm3', name: 'Bouillabaisse', description: 'Provençal fish stew with saffron, rouille and croutons', category: 'Plats', price: 36, foodCost: 14.20, prepTime: 25, allergens: ['Fish', 'Gluten'], tags: ['Signature'], available: true, hasModifiers: false, image: dishImages['Bouillabaisse'], station: 'Hot Kitchen' },
  { id: 'm4', name: 'Coq au Vin', description: 'Chicken braised in red wine with lardons and mushrooms', category: 'Plats', price: 31, foodCost: 10.50, prepTime: 30, allergens: ['Sulphites'], tags: ['Classic'], available: true, hasModifiers: false, image: dishImages['Coq au Vin'], station: 'Hot Kitchen' },
  { id: 'm5', name: 'Escargots de Bourgogne', description: 'Burgundy snails in garlic-parsley butter', category: 'Entrées', price: 18, foodCost: 5.20, prepTime: 12, allergens: ['Dairy', 'Gluten'], tags: ['Classic'], available: true, hasModifiers: false, image: dishImages['Escargots de Bourgogne'], station: 'Garde Manger' },
  { id: 'm6', name: 'French Onion Soup', description: 'Caramelised onions, beef broth, gruyère crouton', category: 'Entrées', price: 14, foodCost: 3.80, prepTime: 10, allergens: ['Dairy', 'Gluten'], tags: ['Vegetarian'], available: true, hasModifiers: false, image: dishImages['French Onion Soup'], station: 'Hot Kitchen' },
  { id: 'm7', name: 'Crème Brûlée', description: 'Vanilla custard with caramelised sugar crust', category: 'Desserts', price: 10, foodCost: 2.40, prepTime: 8, allergens: ['Dairy', 'Eggs'], tags: ['Popular'], available: true, hasModifiers: false, image: dishImages['Crème Brûlée'], station: 'Pastry' },
  { id: 'm8', name: 'Tarte Tatin', description: 'Caramelised apple tart with crème fraîche', category: 'Desserts', price: 11, foodCost: 2.80, prepTime: 10, allergens: ['Dairy', 'Gluten'], tags: ['Classic'], available: true, hasModifiers: false, image: dishImages['Tarte Tatin'], station: 'Pastry' },
  { id: 'm9', name: 'Ratatouille', description: 'Provençal vegetable stew with herbs de Provence', category: 'Plats', price: 24, foodCost: 6.50, prepTime: 22, allergens: ['None'], tags: ['Vegetarian', 'Vegan'], available: true, hasModifiers: false, image: dishImages['Ratatouille'], station: 'Hot Kitchen' },
  { id: 'm10', name: 'Beef Bourguignon', description: 'Beef braised in red wine with root vegetables', category: 'Plats', price: 34, foodCost: 12.80, prepTime: 35, allergens: ['Sulphites'], tags: ['Signature'], available: true, hasModifiers: true, image: dishImages['Beef Bourguignon'], station: 'Hot Kitchen' },
  { id: 'm11', name: 'Soufflé au Fromage', description: 'Cheese soufflé with Gruyère and Comté', category: 'Entrées', price: 16, foodCost: 4.20, prepTime: 15, allergens: ['Dairy', 'Eggs', 'Gluten'], tags: ['Vegetarian'], available: true, hasModifiers: false, image: dishImages['Soufflé'], station: 'Pastry' },
  { id: 'm12', name: 'Cheese Board', description: 'Selection of French cheeses with fig jam and walnuts', category: 'Fromage', price: 19, foodCost: 7.50, prepTime: 5, allergens: ['Dairy', 'Nuts'], tags: ['Classic'], available: true, hasModifiers: true, image: dishImages['Cheese Board'], station: 'Garde Manger' },
  { id: 'm13', name: 'Salade Niçoise', description: 'Seared tuna, green beans, olives, egg, tomato', category: 'Entrées', price: 15, foodCost: 5.60, prepTime: 10, allergens: ['Fish', 'Eggs'], tags: ['Light'], available: true, hasModifiers: false, image: dishImages['Ratatouille'], station: 'Garde Manger' },
  { id: 'm14', name: 'Foie Gras Terrine', description: 'Goose foie gras with brioche and fig compote', category: 'Entrées', price: 22, foodCost: 9.80, prepTime: 8, allergens: ['Gluten'], tags: ['Premium'], available: true, hasModifiers: false, image: dishImages['Escargots de Bourgogne'], station: 'Garde Manger' },
  { id: 'm15', name: 'Profiteroles', description: 'Choux puffs with vanilla cream and chocolate sauce', category: 'Desserts', price: 12, foodCost: 3.20, prepTime: 10, allergens: ['Dairy', 'Eggs', 'Gluten'], tags: ['Popular'], available: true, hasModifiers: false, image: dishImages['Crème Brûlée'], station: 'Pastry' },
  { id: 'm16', name: 'Île Flottante', description: 'Poached meringue floating on crème anglaise', category: 'Desserts', price: 9, foodCost: 2.10, prepTime: 8, allergens: ['Dairy', 'Eggs'], tags: ['Classic'], available: true, hasModifiers: false, image: dishImages['Tarte Tatin'], station: 'Pastry' },
  { id: 'm17', name: 'Châteauneuf-du-Pape 2019', description: 'Full-bodied Rhône red, notes of black cherry and spice', category: 'Wine', price: 65, foodCost: 28, prepTime: 1, allergens: ['Sulphites'], tags: ['Premium'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm18', name: 'Sancerre Blanc 2021', description: 'Crisp Loire Sauvignon Blanc, citrus and mineral notes', category: 'Wine', price: 48, foodCost: 19, prepTime: 1, allergens: ['Sulphites'], tags: ['Popular'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm19', name: 'Champagne Brut', description: 'Maison Étoile house champagne, fine bubbles', category: 'Wine', price: 85, foodCost: 35, prepTime: 1, allergens: ['Sulphites'], tags: ['Signature'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm20', name: 'Kir Royal', description: 'Champagne with a touch of crème de cassis', category: 'Cocktails', price: 14, foodCost: 4.50, prepTime: 3, allergens: ['Sulphites'], tags: ['Popular'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm21', name: 'French 75', description: 'Gin, champagne, lemon juice and sugar', category: 'Cocktails', price: 15, foodCost: 4.80, prepTime: 4, allergens: ['Sulphites'], tags: ['Classic'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm22', name: 'Espresso', description: 'Double shot of single-origin Arabica', category: 'Drinks', price: 4, foodCost: 0.80, prepTime: 2, allergens: ['None'], tags: ['Hot'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm23', name: 'Café au Lait', description: 'Espresso with steamed milk', category: 'Drinks', price: 5, foodCost: 1.10, prepTime: 3, allergens: ['Dairy'], tags: ['Hot'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm24', name: 'Pâté de Campagne', description: 'Rustic pork pâté with cornichons and toasted baguette', category: 'Entrées', price: 13, foodCost: 4.00, prepTime: 6, allergens: ['Gluten'], tags: ['Classic'], available: true, hasModifiers: false, image: dishImages['Escargots de Bourgogne'], station: 'Garde Manger' },
  { id: 'm25', name: 'Magret de Canard', description: 'Seared duck breast with cherry jus and parsnip purée', category: 'Plats', price: 35, foodCost: 13.50, prepTime: 22, allergens: ['None'], tags: ['Signature'], available: true, hasModifiers: true, image: dishImages['Duck Confit'], station: 'Hot Kitchen' },
  { id: 'm26', name: 'Sole Meunière', description: 'Pan-fried sole with brown butter, lemon and parsley', category: 'Plats', price: 38, foodCost: 16.00, prepTime: 18, allergens: ['Dairy', 'Fish'], tags: ['Premium'], available: true, hasModifiers: false, image: dishImages['Bouillabaisse'], station: 'Hot Kitchen' },
  { id: 'm27', name: 'Lamb Provençal', description: 'Braised lamb shoulder with tomatoes, olives and herbs', category: 'Plats', price: 36, foodCost: 14.50, prepTime: 28, allergens: ['None'], tags: ['Special'], available: true, hasModifiers: true, image: dishImages['Beef Bourguignon'], station: 'Hot Kitchen' },
  { id: 'm28', name: 'Moules Marinières', description: 'Steamed mussels in white wine, shallots and cream', category: 'Plats', price: 26, foodCost: 8.20, prepTime: 15, allergens: ['Dairy', 'Shellfish', 'Sulphites'], tags: ['Popular'], available: true, hasModifiers: false, image: dishImages['Bouillabaisse'], station: 'Hot Kitchen' },
  { id: 'm29', name: 'Croque Monsieur', description: 'Grilled ham and cheese sandwich with béchamel', category: 'Plats', price: 18, foodCost: 5.50, prepTime: 8, allergens: ['Dairy', 'Gluten'], tags: ['Light'], available: true, hasModifiers: false, image: dishImages['French Onion Soup'], station: 'Hot Kitchen' },
  { id: 'm30', name: 'Pain Perdu', description: 'French toast with caramelised apples and ice cream', category: 'Desserts', price: 11, foodCost: 3.00, prepTime: 10, allergens: ['Dairy', 'Eggs', 'Gluten'], tags: ['Classic'], available: true, hasModifiers: false, image: dishImages['Tarte Tatin'], station: 'Pastry' },
  { id: 'm31', name: 'Lavender Honey Crème', description: 'Crème caramel with Provence lavender honey', category: 'Desserts', price: 10, foodCost: 2.50, prepTime: 8, allergens: ['Dairy', 'Eggs'], tags: ['Special'], available: true, hasModifiers: false, image: dishImages['Crème Brûlée'], station: 'Pastry' },
  { id: 'm32', name: 'Bordeaux Supérieur 2018', description: 'Elegant left-bank red, structured tannins', category: 'Wine', price: 55, foodCost: 22, prepTime: 1, allergens: ['Sulphites'], tags: ['Premium'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm33', name: 'Bourgogne Rouge 2020', description: 'Light Pinot Noir, red fruit and earthy notes', category: 'Wine', price: 42, foodCost: 17, prepTime: 1, allergens: ['Sulphites'], tags: ['Classic'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm34', name: 'Pastis', description: 'Anise-flavoured spirit from Marseille', category: 'Drinks', price: 7, foodCost: 1.50, prepTime: 2, allergens: ['None'], tags: ['Classic'], available: true, hasModifiers: false, image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400', station: 'Bar' },
  { id: 'm35', name: 'Chocolat Liégeois', description: 'Iced chocolate mousse with whipped cream', category: 'Desserts', price: 9, foodCost: 2.30, prepTime: 6, allergens: ['Dairy', 'Eggs'], tags: ['Popular'], available: false, hasModifiers: false, image: dishImages['Crème Brûlée'], station: 'Pastry' },
  { id: 'm36', name: 'Gaspacho Provençal', description: 'Chilled tomato and pepper soup', category: 'Entrées', price: 12, foodCost: 3.50, prepTime: 5, allergens: ['None'], tags: ['Vegan', 'Cold'], available: true, hasModifiers: false, image: dishImages['Ratatouille'], station: 'Garde Manger' },
  { id: 'm37', name: 'Carpaccio de Bœuf', description: 'Thinly sliced raw beef with truffle oil and parmesan', category: 'Entrées', price: 20, foodCost: 8.50, prepTime: 8, allergens: ['Dairy'], tags: ['Premium'], available: true, hasModifiers: false, image: dishImages['Steak Frites'], station: 'Garde Manger' },
  { id: 'm38', name: 'Quenelle de Brochet', description: 'Pike dumpling in Nantua sauce', category: 'Plats', price: 28, foodCost: 10.20, prepTime: 25, allergens: ['Dairy', 'Fish', 'Gluten'], tags: ['Classic'], available: true, hasModifiers: false, image: dishImages['Bouillabaisse'], station: 'Hot Kitchen' },
  { id: 'm39', name: 'Pissaladière', description: 'Caramelised onion and anchovy tart', category: 'Entrées', price: 14, foodCost: 4.20, prepTime: 12, allergens: ['Gluten', 'Fish'], tags: ['Classic'], available: true, hasModifiers: false, image: dishImages['French Onion Soup'], station: 'Pastry' },
  { id: 'm40', name: 'Mousse au Chocolat', description: 'Dark chocolate mousse with sea salt', category: 'Desserts', price: 8, foodCost: 1.90, prepTime: 6, allergens: ['Dairy', 'Eggs'], tags: ['Popular'], available: true, hasModifiers: false, image: dishImages['Crème Brûlée'], station: 'Pastry' },
];

export const modifiers: Modifier[] = [
  { id: 'mod1', name: 'Cooking Temperature', options: [
    { name: 'Rare', price: 0 }, { name: 'Medium Rare', price: 0 }, { name: 'Medium', price: 0 }, { name: 'Well Done', price: 0 },
  ]},
  { id: 'mod2', name: 'Sauce', options: [
    { name: 'Béarnaise', price: 0 }, { name: 'Peppercorn', price: 2 }, { name: 'Red Wine Jus', price: 2 }, { name: 'No Sauce', price: 0 },
  ]},
  { id: 'mod3', name: 'Side', options: [
    { name: 'Frites', price: 0 }, { name: 'Salade Verte', price: 0 }, { name: 'Pommes Purée', price: 0 }, { name: 'Legumes', price: 0 },
  ]},
  { id: 'mod4', name: 'Cheese Selection', options: [
    { name: 'Comté', price: 0 }, { name: 'Brie', price: 0 }, { name: 'Roquefort', price: 0 }, { name: 'Chèvre', price: 0 },
  ]},
];

export const restaurantTables: RestaurantTable[] = [
  { id: 't1', number: 1, zone: 'Main Dining', seats: 2, status: 'Available' },
  { id: 't2', number: 2, zone: 'Main Dining', seats: 2, status: 'Available' },
  { id: 't3', number: 3, zone: 'Main Dining', seats: 4, status: 'Occupied', guests: 3, waiter: 'Jean', amount: 142, elapsedMin: 38 },
  { id: 't4', number: 4, zone: 'Main Dining', seats: 4, status: 'Occupied', guests: 4, waiter: 'Jean', amount: 184, elapsedMin: 42 },
  { id: 't5', number: 5, zone: 'Main Dining', seats: 6, status: 'Reserved', reservation: 'Claire Martin' },
  { id: 't6', number: 6, zone: 'Main Dining', seats: 2, status: 'Available' },
  { id: 't7', number: 7, zone: 'Main Dining', seats: 4, status: 'Occupied', guests: 2, waiter: 'Jean', amount: 86, elapsedMin: 22 },
  { id: 't8', number: 8, zone: 'Main Dining', seats: 4, status: 'Cleaning' },
  { id: 't9', number: 9, zone: 'Main Dining', seats: 6, status: 'Available' },
  { id: 't10', number: 10, zone: 'Main Dining', seats: 8, status: 'Occupied', guests: 6, waiter: 'Claire', amount: 312, elapsedMin: 55 },
  { id: 't11', number: 11, zone: 'Main Dining', seats: 2, status: 'Payment Due', guests: 2, waiter: 'Jean', amount: 68, elapsedMin: 78 },
  { id: 't12', number: 12, zone: 'Main Dining', seats: 4, status: 'Occupied', guests: 4, waiter: 'Jean', amount: 184, elapsedMin: 42 },
  { id: 't13', number: 13, zone: 'Terrace', seats: 2, status: 'Available' },
  { id: 't14', number: 14, zone: 'Terrace', seats: 4, status: 'Occupied', guests: 3, waiter: 'Claire', amount: 128, elapsedMin: 28 },
  { id: 't15', number: 15, zone: 'Terrace', seats: 4, status: 'Available' },
  { id: 't16', number: 16, zone: 'Terrace', seats: 6, status: 'Reserved', reservation: 'Jean Dupont' },
  { id: 't17', number: 17, zone: 'Terrace', seats: 2, status: 'Available' },
  { id: 't18', number: 18, zone: 'Terrace', seats: 4, status: 'Occupied', guests: 4, waiter: 'Jean', amount: 196, elapsedMin: 35 },
  { id: 't19', number: 19, zone: 'Bar', seats: 1, status: 'Available' },
  { id: 't20', number: 20, zone: 'Bar', seats: 1, status: 'Occupied', guests: 1, waiter: 'Claire', amount: 24, elapsedMin: 15 },
  { id: 't21', number: 21, zone: 'Bar', seats: 2, status: 'Available' },
  { id: 't22', number: 22, zone: 'Bar', seats: 2, status: 'Available' },
  { id: 't23', number: 23, zone: 'Private Dining', seats: 10, status: 'Reserved', reservation: 'Sophie Laurent' },
  { id: 't24', number: 24, zone: 'Private Dining', seats: 12, status: 'Available' },
];

const customerNames = [
  'Claire Martin', 'Jean Dupont', 'Sophie Laurent', 'Thomas Bernard', 'Camille Moreau',
  'Lucas Petit', 'Manon Roux', 'Hugo Lefebvre', 'Léa Garnier', 'Antoine Fontaine',
  'Charlotte Mercier', 'Nathan Rousseau', 'Emma Vincent', 'Louis Blanc', 'Chloé Faure',
  'Gabriel Lemoine', 'Julie Morel', 'Maxime Dupuis', 'Sarah Leger', 'Paul Girard',
  'Marie Bonnet', 'Thomas Roux', 'Laura Henry', 'Julien Robert', 'Alice Dubois',
  'Romain Thomas', 'Claire Petit', 'Mathieu Leroy', 'Inès David', 'Hugo Bertrand',
  'Jade Martinez', 'Louis Bernard', 'Camille Robert', ' Nathan Moreau', 'Léa Laurent',
  'Antoine Durand', 'Charlotte Dubois', 'Lucas Lefevre', 'Manon Garnier', 'Hugo Mercier',
  'Sophie Roux', 'Thomas Faure', 'Emma Lemoine', 'Louis Morel', 'Chloé Vincent',
  'Gabriel Henry', 'Julie David', 'Maxime Bertrand', 'Sarah Martinez', 'Paul Durand',
];

const phoneNumbers = [
  '+33 6 12 34 56 78', '+33 6 23 45 67 89', '+33 6 34 56 78 90', '+33 6 45 67 89 01',
  '+33 6 56 78 90 12', '+33 6 67 89 01 23', '+33 6 78 90 12 34', '+33 6 89 01 23 45',
  '+33 6 90 12 34 56', '+33 6 01 23 45 67',
];

const preferences = ['Dine-in', 'Terrace seating', 'Quiet corner', 'Window seat', 'Bar seating', 'Private dining'];
const dishes = ['Steak Frites', 'Duck Confit', 'Bouillabaisse', 'Coq au Vin', 'Crème Brûlée', 'French Onion Soup', 'Escargots de Bourgogne', 'Tarte Tatin'];
const wines = ['Châteauneuf-du-Pape', 'Sancerre Blanc', 'Champagne Brut', 'Bordeaux Supérieur', 'Bourgogne Rouge'];
const allergies: string[][] = [[], ['Gluten'], ['Dairy'], ['Shellfish'], ['Nuts'], ['Gluten', 'Dairy'], []];

function generateCustomers(n: number): Customer[] {
  const loyaltyStatuses: Customer['loyaltyStatus'][] = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  return Array.from({ length: n }, (_, i) => {
    const name = customerNames[i % customerNames.length];
    const visits = Math.floor(Math.random() * 40) + 1;
    const totalSpend = Math.round(visits * (Math.random() * 40 + 35));
    const avgSpend = Math.round(totalSpend / visits);
    const loyaltyPoints = visits * 10 + Math.floor(Math.random() * 200);
    const loyalty: Customer['loyaltyStatus'] = loyaltyPoints > 500 ? 'Platinum' : loyaltyPoints > 300 ? 'Gold' : loyaltyPoints > 150 ? 'Silver' : 'Bronze';
    return {
      id: `c${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: phoneNumbers[i % phoneNumbers.length],
      visits,
      lastVisit: ['2026-08-19', '2026-08-18', '2026-08-15', '2026-08-12', '2026-08-10', '2026-08-05'][i % 6],
      totalSpend,
      averageSpend: avgSpend,
      preference: preferences[i % preferences.length],
      loyaltyStatus: loyalty,
      loyaltyPoints,
      favoriteDishes: [dishes[i % dishes.length], dishes[(i + 3) % dishes.length]],
      winePreferences: [wines[i % wines.length]],
      allergies: allergies[i % allergies.length],
      specialOccasions: i % 5 === 0 ? 'Birthday — 24 August' : undefined,
      notes: i % 4 === 0 ? 'Prefers quiet corner. Allergic to shellfish.' : undefined,
    };
  });
}

export const customers: Customer[] = generateCustomers(50);

function generateReservations(n: number): Reservation[] {
  const statuses: Reservation['status'][] = ['Confirmed', 'Seated', 'Completed', 'Cancelled', 'No-show'];
  const areas: Reservation['area'][] = ['Main Dining', 'Terrace', 'Bar', 'Private Dining'];
  const times = ['12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
  const requests = ['Window seat preferred', 'Anniversary dinner', 'Business meeting', 'Birthday celebration', 'Quiet corner', 'No special request', 'High chair needed', 'Wheelchair access'];
  return Array.from({ length: n }, (_, i) => {
    const name = customerNames[i % customerNames.length];
    const status = statuses[i % statuses.length];
    return {
      id: `r${i + 1}`,
      guest: name,
      phone: phoneNumbers[i % phoneNumbers.length],
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      date: ['2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23'][i % 5],
      time: times[i % times.length],
      guests: Math.floor(Math.random() * 6) + 1,
      table: status === 'Seated' || status === 'Completed' ? Math.floor(Math.random() * 24) + 1 : null,
      area: areas[i % areas.length],
      specialRequest: requests[i % requests.length],
      status,
    };
  });
}

export const reservations: Reservation[] = generateReservations(30);

function generateOrders(n: number): Order[] {
  const statuses: Order['status'][] = ['New', 'Preparing', 'Ready', 'Served', 'Delayed'];
  const channels: Order['channel'][] = ['Dine-in', 'Takeaway', 'Delivery'];
  const priorities: Order['priority'][] = ['Normal', 'High', 'VIP'];
  const stations: Order['station'][] = ['Hot Kitchen', 'Grill', 'Garde Manger', 'Pastry', 'Bar'];
  const waiters = ['Jean', 'Claire', 'Sophie', 'Manon'];
  const dishNames = menuItems.filter(m => m.category === 'Plats' || m.category === 'Entrées' || m.category === 'Desserts').map(m => m.name);
  return Array.from({ length: n }, (_, i) => {
    const channel = channels[i % channels.length];
    const status = statuses[i % statuses.length];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = Array.from({ length: itemCount }, (_, j) => {
      const dish = dishNames[(i + j) % dishNames.length];
      const menuItem = menuItems.find(m => m.name === dish)!;
      return {
        name: dish,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: menuItem.price,
        station: menuItem.station,
      };
    });
    const amount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    return {
      id: `o${1048 - i}`,
      table: channel === 'Dine-in' ? Math.floor(Math.random() * 24) + 1 : undefined,
      waiter: channel === 'Dine-in' ? waiters[i % waiters.length] : undefined,
      guests: channel === 'Dine-in' ? Math.floor(Math.random() * 6) + 1 : undefined,
      items,
      status,
      channel,
      priority: priorities[i % priorities.length],
      station: stations[i % stations.length],
      amount,
      createdAt: `${Math.floor(Math.random() * 3) + 19}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      elapsedMin: Math.floor(Math.random() * 45) + 2,
    };
  });
}

export const orders: Order[] = generateOrders(50);

export const kitchenOrders: Order[] = orders.filter(o => o.status === 'New' || o.status === 'Preparing' || o.status === 'Ready' || o.status === 'Delayed').slice(0, 20);

export const inventoryItems: InventoryItem[] = [
  { id: 'i1', name: 'Beef Tenderloin', category: 'Meat', currentStock: 12, unit: 'kg', minLevel: 8, costPerUnit: 42, status: 'In Stock' },
  { id: 'i2', name: 'Duck Breast', category: 'Meat', currentStock: 6, unit: 'kg', minLevel: 8, costPerUnit: 28, status: 'Low Stock' },
  { id: 'i3', name: 'Potatoes', category: 'Vegetables', currentStock: 80, unit: 'kg', minLevel: 30, costPerUnit: 1.20, status: 'In Stock' },
  { id: 'i4', name: 'Butter', category: 'Dairy', currentStock: 15, unit: 'kg', minLevel: 10, costPerUnit: 8.50, status: 'In Stock' },
  { id: 'i5', name: 'Heavy Cream', category: 'Dairy', currentStock: 4, unit: 'L', minLevel: 8, costPerUnit: 4.20, status: 'Low Stock' },
  { id: 'i6', name: 'Garlic', category: 'Vegetables', currentStock: 5, unit: 'kg', minLevel: 3, costPerUnit: 3.50, status: 'In Stock' },
  { id: 'i7', name: 'Black Truffle', category: 'Specialty', currentStock: 0.2, unit: 'kg', minLevel: 0.3, costPerUnit: 850, status: 'Critical' },
  { id: 'i8', name: 'Tomatoes', category: 'Vegetables', currentStock: 25, unit: 'kg', minLevel: 15, costPerUnit: 2.80, status: 'In Stock' },
  { id: 'i9', name: 'Onions', category: 'Vegetables', currentStock: 40, unit: 'kg', minLevel: 20, costPerUnit: 1.10, status: 'In Stock' },
  { id: 'i10', name: 'Red Wine (Cooking)', category: 'Beverages', currentStock: 18, unit: 'L', minLevel: 10, costPerUnit: 12, status: 'In Stock' },
  { id: 'i11', name: 'Flour', category: 'Dry Goods', currentStock: 35, unit: 'kg', minLevel: 20, costPerUnit: 0.90, status: 'In Stock' },
  { id: 'i12', name: 'Olive Oil', category: 'Oils', currentStock: 8, unit: 'L', minLevel: 5, costPerUnit: 15, status: 'In Stock' },
  { id: 'i13', name: 'Truffle Oil', category: 'Oils', currentStock: 0.3, unit: 'L', minLevel: 0.5, costPerUnit: 95, status: 'Critical' },
  { id: 'i14', name: 'Saffron', category: 'Spices', currentStock: 15, unit: 'g', minLevel: 10, costPerUnit: 25, status: 'In Stock' },
  { id: 'i15', name: 'Mussels', category: 'Seafood', currentStock: 0, unit: 'kg', minLevel: 10, costPerUnit: 12, status: 'Out of Stock' },
  { id: 'i16', name: 'Sole Fillet', category: 'Seafood', currentStock: 8, unit: 'kg', minLevel: 5, costPerUnit: 38, status: 'In Stock' },
  { id: 'i17', name: 'Eggs', category: 'Dairy', currentStock: 120, unit: 'pcs', minLevel: 60, costPerUnit: 0.30, status: 'In Stock' },
  { id: 'i18', name: 'Gruyère', category: 'Cheese', currentStock: 3, unit: 'kg', minLevel: 5, costPerUnit: 22, status: 'Low Stock' },
  { id: 'i19', name: 'Comté', category: 'Cheese', currentStock: 4, unit: 'kg', minLevel: 3, costPerUnit: 24, status: 'In Stock' },
  { id: 'i20', name: 'Baguette', category: 'Bakery', currentStock: 30, unit: 'pcs', minLevel: 15, costPerUnit: 1.20, status: 'In Stock' },
  { id: 'i21', name: 'Lamb Shoulder', category: 'Meat', currentStock: 7, unit: 'kg', minLevel: 5, costPerUnit: 32, status: 'In Stock' },
  { id: 'i22', name: 'Chicken', category: 'Meat', currentStock: 14, unit: 'kg', minLevel: 8, costPerUnit: 9.50, status: 'In Stock' },
  { id: 'i23', name: 'White Wine', category: 'Beverages', currentStock: 22, unit: 'L', minLevel: 12, costPerUnit: 8, status: 'In Stock' },
  { id: 'i24', name: 'Chocolate (Dark)', category: 'Specialty', currentStock: 5, unit: 'kg', minLevel: 3, costPerUnit: 18, status: 'In Stock' },
  { id: 'i25', name: 'Vanilla Pod', category: 'Spices', currentStock: 8, unit: 'pcs', minLevel: 10, costPerUnit: 4.50, status: 'Low Stock' },
];

export const suppliers: Supplier[] = [
  { id: 's1', name: 'Maison Fournier', category: 'Specialty & Truffle', contact: 'Pierre Fournier', phone: '+33 1 42 89 12 34', email: 'pierre@maisonfournier.fr', lastOrder: '2026-08-15', outstanding: 1240, status: 'Active' },
  { id: 's2', name: 'Paris Prime Meats', category: 'Meat & Poultry', contact: 'Marie Lecomte', phone: '+33 1 45 67 89 01', email: 'marie@parisprimemeats.fr', lastOrder: '2026-08-17', outstanding: 3850, status: 'Active' },
  { id: 's3', name: 'Bordeaux Wine Co.', category: 'Wine & Spirits', contact: 'Jacques Moreau', phone: '+33 5 56 12 34 56', email: 'jacques@bordeauxwine.fr', lastOrder: '2026-08-10', outstanding: 0, status: 'Active' },
  { id: 's4', name: 'Fresh Produce Paris', category: 'Vegetables & Fruit', contact: 'Sophie Renard', phone: '+33 1 48 90 12 34', email: 'sophie@freshproduceparis.fr', lastOrder: '2026-08-18', outstanding: 680, status: 'Active' },
  { id: 's5', name: 'Normandie Dairy', category: 'Dairy & Cheese', contact: 'Antoine Leclerc', phone: '+33 2 31 45 67 89', email: 'antoine@normandiedairy.fr', lastOrder: '2026-08-16', outstanding: 920, status: 'Active' },
  { id: 's6', name: 'Mediterr Seafood', category: 'Fish & Seafood', contact: 'Luc Pascal', phone: '+33 4 91 23 45 67', email: 'luc@mediterrseafood.fr', lastOrder: '2026-08-18', outstanding: 1450, status: 'Active' },
  { id: 's7', name: 'Provence Herbs', category: 'Spices & Herbs', contact: 'Claire Fontaine', phone: '+33 4 90 12 34 56', email: 'claire@provenceherbs.fr', lastOrder: '2026-08-12', outstanding: 0, status: 'Pending' },
  { id: 's8', name: 'Boulangerie Dupont', category: 'Bakery', contact: 'Henri Dupont', phone: '+33 1 43 56 78 90', email: 'henri@boulangeriedupont.fr', lastOrder: '2026-08-19', outstanding: 340, status: 'Active' },
  { id: 's9', name: 'Café du Monde', category: 'Coffee & Tea', contact: 'Nathalie Roux', phone: '+33 1 47 89 01 23', email: 'nathalie@cafedumonde.fr', lastOrder: '2026-08-14', outstanding: 0, status: 'Active' },
  { id: 's10', name: 'Olive Oil Provence', category: 'Oils & Vinegars', contact: 'Philippe Marin', phone: '+33 4 90 34 56 78', email: 'philippe@oliveoilprovence.fr', lastOrder: '2026-08-11', outstanding: 520, status: 'Active' },
  { id: 's11', name: 'Champagne House Bruno', category: 'Champagne', contact: 'Bruno Laurent', phone: '+33 3 26 56 78 90', email: 'bruno@champagnebruno.fr', lastOrder: '2026-08-08', outstanding: 0, status: 'Inactive' },
  { id: 's12', name: 'Lyon Charcuterie', category: 'Charcuterie', contact: 'Olivier Petit', phone: '+33 4 78 12 34 56', email: 'olivier@lyoncharcuterie.fr', lastOrder: '2026-08-13', outstanding: 890, status: 'Active' },
  { id: 's13', name: 'Brittany Salt Co.', category: 'Salt & Seasoning', contact: 'Yannick Morvan', phone: '+33 2 97 34 56 78', email: 'yannick@brittanysalt.fr', lastOrder: '2026-08-06', outstanding: 0, status: 'Active' },
  { id: 's14', name: 'Alsace Spirits', category: 'Spirits & Liqueurs', contact: 'Karl Wagner', phone: '+33 3 88 45 67 89', email: 'karl@alsacespirits.fr', lastOrder: '2026-08-09', outstanding: 1100, status: 'Active' },
  { id: 's15', name: 'Patisserie Belle', category: 'Pastry Supplies', contact: 'Isabelle Moreau', phone: '+33 1 42 56 78 90', email: 'isabelle@patisseriebelle.fr', lastOrder: '2026-08-15', outstanding: 450, status: 'Active' },
];

function generatePurchaseOrders(n: number): PurchaseOrder[] {
  const statuses: PurchaseOrder['status'][] = ['Draft', 'Sent', 'Partially Received', 'Received', 'Cancelled'];
  return Array.from({ length: n }, (_, i) => ({
    id: `po${i + 1}`,
    poNumber: `PO-2026-${(1000 + i).toString()}`,
    supplier: suppliers[i % suppliers.length].name,
    orderDate: `2026-08-${(19 - i % 10).toString().padStart(2, '0')}`,
    expectedDelivery: `2026-08-${(20 + i % 8).toString().padStart(2, '0')}`,
    items: Math.floor(Math.random() * 8) + 2,
    total: Math.round(Math.random() * 3000 + 500),
    status: statuses[i % statuses.length],
  }));
}

export const purchaseOrders: PurchaseOrder[] = generatePurchaseOrders(20);

export const recipes: Recipe[] = [
  {
    id: 'rec1', name: 'Steak Frites', sellingPrice: 32, servings: 1, prepTime: 18, station: 'Grill',
    ingredients: [
      { name: 'Beef Tenderloin', cost: 8.40, quantity: '200g' },
      { name: 'Potatoes', cost: 1.20, quantity: '300g' },
      { name: 'Butter', cost: 0.60, quantity: '20g' },
      { name: 'Béarnaise Sauce', cost: 1.10, quantity: '40ml' },
    ],
    totalFoodCost: 11.30, grossProfit: 20.70, foodCostPct: 35.3,
  },
  {
    id: 'rec2', name: 'Duck Confit', sellingPrice: 29, servings: 1, prepTime: 20, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Duck Leg', cost: 6.80, quantity: '1 pc' },
      { name: 'Potatoes', cost: 1.50, quantity: '250g' },
      { name: 'Duck Fat', cost: 1.00, quantity: '50g' },
      { name: 'Garlic', cost: 0.50, quantity: '10g' },
    ],
    totalFoodCost: 9.80, grossProfit: 19.20, foodCostPct: 33.8,
  },
  {
    id: 'rec3', name: 'Bouillabaisse', sellingPrice: 36, servings: 1, prepTime: 25, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Mixed Fish', cost: 9.50, quantity: '300g' },
      { name: 'Saffron', cost: 2.00, quantity: '0.1g' },
      { name: 'Tomatoes', cost: 1.20, quantity: '200g' },
      { name: 'Fennel', cost: 0.80, quantity: '50g' },
      { name: 'Rouille', cost: 0.70, quantity: '30g' },
    ],
    totalFoodCost: 14.20, grossProfit: 21.80, foodCostPct: 39.4,
  },
  {
    id: 'rec4', name: 'Coq au Vin', sellingPrice: 31, servings: 1, prepTime: 30, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Chicken', cost: 5.50, quantity: '300g' },
      { name: 'Red Wine', cost: 2.80, quantity: '150ml' },
      { name: 'Mushrooms', cost: 1.20, quantity: '80g' },
      { name: 'Lardons', cost: 1.00, quantity: '50g' },
    ],
    totalFoodCost: 10.50, grossProfit: 20.50, foodCostPct: 33.9,
  },
  {
    id: 'rec5', name: 'Crème Brûlée', sellingPrice: 10, servings: 1, prepTime: 8, station: 'Pastry',
    ingredients: [
      { name: 'Heavy Cream', cost: 1.20, quantity: '100ml' },
      { name: 'Vanilla Pod', cost: 0.80, quantity: '0.5 pc' },
      { name: 'Eggs', cost: 0.30, quantity: '2 pcs' },
      { name: 'Sugar', cost: 0.10, quantity: '30g' },
    ],
    totalFoodCost: 2.40, grossProfit: 7.60, foodCostPct: 24.0,
  },
  {
    id: 'rec6', name: 'Beef Bourguignon', sellingPrice: 34, servings: 1, prepTime: 35, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Beef Chuck', cost: 8.00, quantity: '250g' },
      { name: 'Red Wine', cost: 3.00, quantity: '200ml' },
      { name: 'Pearl Onions', cost: 0.80, quantity: '80g' },
      { name: 'Mushrooms', cost: 1.00, quantity: '60g' },
    ],
    totalFoodCost: 12.80, grossProfit: 21.20, foodCostPct: 37.6,
  },
  {
    id: 'rec7', name: 'Escargots de Bourgogne', sellingPrice: 18, servings: 1, prepTime: 12, station: 'Garde Manger',
    ingredients: [
      { name: 'Snails', cost: 3.20, quantity: '12 pcs' },
      { name: 'Butter', cost: 1.50, quantity: '50g' },
      { name: 'Garlic', cost: 0.30, quantity: '10g' },
      { name: 'Parsley', cost: 0.20, quantity: '5g' },
    ],
    totalFoodCost: 5.20, grossProfit: 12.80, foodCostPct: 28.9,
  },
  {
    id: 'rec8', name: 'French Onion Soup', sellingPrice: 14, servings: 1, prepTime: 10, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Onions', cost: 1.50, quantity: '300g' },
      { name: 'Beef Broth', cost: 1.20, quantity: '200ml' },
      { name: 'Gruyère', cost: 0.80, quantity: '30g' },
      { name: 'Baguette', cost: 0.30, quantity: '2 slices' },
    ],
    totalFoodCost: 3.80, grossProfit: 10.20, foodCostPct: 27.1,
  },
  {
    id: 'rec9', name: 'Tarte Tatin', sellingPrice: 11, servings: 1, prepTime: 10, station: 'Pastry',
    ingredients: [
      { name: 'Apples', cost: 1.20, quantity: '3 pcs' },
      { name: 'Puff Pastry', cost: 0.80, quantity: '100g' },
      { name: 'Sugar', cost: 0.40, quantity: '50g' },
      { name: 'Butter', cost: 0.40, quantity: '20g' },
    ],
    totalFoodCost: 2.80, grossProfit: 8.20, foodCostPct: 25.5,
  },
  {
    id: 'rec10', name: 'Ratatouille', sellingPrice: 24, servings: 1, prepTime: 22, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Tomatoes', cost: 1.50, quantity: '200g' },
      { name: 'Eggplant', cost: 1.20, quantity: '150g' },
      { name: 'Zucchini', cost: 1.00, quantity: '150g' },
      { name: 'Bell Peppers', cost: 1.30, quantity: '150g' },
      { name: 'Olive Oil', cost: 1.50, quantity: '30ml' },
    ],
    totalFoodCost: 6.50, grossProfit: 17.50, foodCostPct: 27.1,
  },
  {
    id: 'rec11', name: 'Soufflé au Fromage', sellingPrice: 16, servings: 1, prepTime: 15, station: 'Pastry',
    ingredients: [
      { name: 'Gruyère', cost: 2.00, quantity: '60g' },
      { name: 'Eggs', cost: 0.60, quantity: '3 pcs' },
      { name: 'Flour', cost: 0.30, quantity: '30g' },
      { name: 'Butter', cost: 0.80, quantity: '30g' },
      { name: 'Milk', cost: 0.50, quantity: '150ml' },
    ],
    totalFoodCost: 4.20, grossProfit: 11.80, foodCostPct: 26.3,
  },
  {
    id: 'rec12', name: 'Sole Meunière', sellingPrice: 38, servings: 1, prepTime: 18, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Sole Fillet', cost: 12.00, quantity: '200g' },
      { name: 'Butter', cost: 2.00, quantity: '60g' },
      { name: 'Lemon', cost: 0.80, quantity: '0.5 pc' },
      { name: 'Flour', cost: 0.20, quantity: '20g' },
      { name: 'Parsley', cost: 1.00, quantity: '10g' },
    ],
    totalFoodCost: 16.00, grossProfit: 22.00, foodCostPct: 42.1,
  },
  {
    id: 'rec13', name: 'Magret de Canard', sellingPrice: 35, servings: 1, prepTime: 22, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Duck Breast', cost: 9.50, quantity: '250g' },
      { name: 'Cherries', cost: 2.00, quantity: '80g' },
      { name: 'Red Wine', cost: 1.50, quantity: '100ml' },
      { name: 'Parsnips', cost: 0.50, quantity: '100g' },
    ],
    totalFoodCost: 13.50, grossProfit: 21.50, foodCostPct: 38.6,
  },
  {
    id: 'rec14', name: 'Moules Marinières', sellingPrice: 26, servings: 1, prepTime: 15, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Mussels', cost: 5.00, quantity: '500g' },
      { name: 'White Wine', cost: 1.50, quantity: '100ml' },
      { name: 'Shallots', cost: 0.80, quantity: '30g' },
      { name: 'Butter', cost: 0.90, quantity: '30g' },
    ],
    totalFoodCost: 8.20, grossProfit: 17.80, foodCostPct: 31.5,
  },
  {
    id: 'rec15', name: 'Lamb Provençal', sellingPrice: 36, servings: 1, prepTime: 28, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Lamb Shoulder', cost: 10.50, quantity: '250g' },
      { name: 'Tomatoes', cost: 1.50, quantity: '150g' },
      { name: 'Olives', cost: 1.50, quantity: '50g' },
      { name: 'White Wine', cost: 1.00, quantity: '100ml' },
    ],
    totalFoodCost: 14.50, grossProfit: 21.50, foodCostPct: 40.3,
  },
  {
    id: 'rec16', name: 'Foie Gras Terrine', sellingPrice: 22, servings: 1, prepTime: 8, station: 'Garde Manger',
    ingredients: [
      { name: 'Goose Liver', cost: 7.50, quantity: '80g' },
      { name: 'Brioche', cost: 1.20, quantity: '2 slices' },
      { name: 'Fig Compote', cost: 1.10, quantity: '30g' },
    ],
    totalFoodCost: 9.80, grossProfit: 12.20, foodCostPct: 44.5,
  },
  {
    id: 'rec17', name: 'Tarte Tatin', sellingPrice: 11, servings: 1, prepTime: 10, station: 'Pastry',
    ingredients: [
      { name: 'Apples', cost: 1.20, quantity: '3 pcs' },
      { name: 'Puff Pastry', cost: 0.80, quantity: '100g' },
      { name: 'Sugar', cost: 0.40, quantity: '50g' },
      { name: 'Butter', cost: 0.40, quantity: '20g' },
    ],
    totalFoodCost: 2.80, grossProfit: 8.20, foodCostPct: 25.5,
  },
  {
    id: 'rec18', name: 'Carpaccio de Bœuf', sellingPrice: 20, servings: 1, prepTime: 8, station: 'Garde Manger',
    ingredients: [
      { name: 'Beef Tenderloin', cost: 6.50, quantity: '120g' },
      { name: 'Parmesan', cost: 1.20, quantity: '20g' },
      { name: 'Truffle Oil', cost: 0.50, quantity: '5ml' },
      { name: 'Arugula', cost: 0.30, quantity: '20g' },
    ],
    totalFoodCost: 8.50, grossProfit: 11.50, foodCostPct: 42.5,
  },
  {
    id: 'rec19', name: 'Quenelle de Brochet', sellingPrice: 28, servings: 1, prepTime: 25, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Pike', cost: 6.50, quantity: '150g' },
      { name: 'Cream', cost: 1.50, quantity: '50ml' },
      { name: 'Flour', cost: 0.80, quantity: '40g' },
      { name: 'Nantua Sauce', cost: 1.40, quantity: '40ml' },
    ],
    totalFoodCost: 10.20, grossProfit: 17.80, foodCostPct: 36.4,
  },
  {
    id: 'rec20', name: 'Profiteroles', sellingPrice: 12, servings: 1, prepTime: 10, station: 'Pastry',
    ingredients: [
      { name: 'Choux Pastry', cost: 1.20, quantity: '60g' },
      { name: 'Vanilla Cream', cost: 1.20, quantity: '50ml' },
      { name: 'Chocolate', cost: 0.80, quantity: '30g' },
    ],
    totalFoodCost: 3.20, grossProfit: 8.80, foodCostPct: 26.7,
  },
  {
    id: 'rec21', name: 'Pissaladière', sellingPrice: 14, servings: 1, prepTime: 12, station: 'Pastry',
    ingredients: [
      { name: 'Dough', cost: 1.50, quantity: '100g' },
      { name: 'Onions', cost: 1.50, quantity: '150g' },
      { name: 'Anchovies', cost: 1.20, quantity: '20g' },
    ],
    totalFoodCost: 4.20, grossProfit: 9.80, foodCostPct: 30.0,
  },
  {
    id: 'rec22', name: 'Salade Niçoise', sellingPrice: 15, servings: 1, prepTime: 10, station: 'Garde Manger',
    ingredients: [
      { name: 'Tuna', cost: 3.20, quantity: '100g' },
      { name: 'Green Beans', cost: 0.80, quantity: '60g' },
      { name: 'Eggs', cost: 0.30, quantity: '1 pc' },
      { name: 'Olives', cost: 0.80, quantity: '30g' },
      { name: 'Tomatoes', cost: 0.50, quantity: '60g' },
    ],
    totalFoodCost: 5.60, grossProfit: 9.40, foodCostPct: 37.3,
  },
  {
    id: 'rec23', name: 'Mousse au Chocolat', sellingPrice: 8, servings: 1, prepTime: 6, station: 'Pastry',
    ingredients: [
      { name: 'Dark Chocolate', cost: 1.20, quantity: '60g' },
      { name: 'Eggs', cost: 0.50, quantity: '2 pcs' },
      { name: 'Butter', cost: 0.20, quantity: '10g' },
    ],
    totalFoodCost: 1.90, grossProfit: 6.10, foodCostPct: 23.8,
  },
  {
    id: 'rec24', name: 'Cheese Board', sellingPrice: 19, servings: 1, prepTime: 5, station: 'Garde Manger',
    ingredients: [
      { name: 'Comté', cost: 3.00, quantity: '50g' },
      { name: 'Brie', cost: 2.50, quantity: '50g' },
      { name: 'Roquefort', cost: 2.00, quantity: '30g' },
      { name: 'Fig Jam', cost: 0.50, quantity: '20g' },
      { name: 'Walnuts', cost: 0.50, quantity: '20g' },
    ],
    totalFoodCost: 7.50, grossProfit: 11.50, foodCostPct: 39.5,
  },
  {
    id: 'rec25', name: 'Pain Perdu', sellingPrice: 11, servings: 1, prepTime: 10, station: 'Pastry',
    ingredients: [
      { name: 'Brioche', cost: 1.50, quantity: '80g' },
      { name: 'Eggs', cost: 0.50, quantity: '1 pc' },
      { name: 'Cream', cost: 0.50, quantity: '50ml' },
      { name: 'Apples', cost: 0.50, quantity: '1 pc' },
    ],
    totalFoodCost: 3.00, grossProfit: 8.00, foodCostPct: 27.3,
  },
  {
    id: 'rec26', name: 'Mousse au Chocolat', sellingPrice: 8, servings: 1, prepTime: 6, station: 'Pastry',
    ingredients: [
      { name: 'Dark Chocolate', cost: 1.20, quantity: '60g' },
      { name: 'Eggs', cost: 0.50, quantity: '2 pcs' },
      { name: 'Butter', cost: 0.20, quantity: '10g' },
    ],
    totalFoodCost: 1.90, grossProfit: 6.10, foodCostPct: 23.8,
  },
  {
    id: 'rec27', name: 'Croque Monsieur', sellingPrice: 18, servings: 1, prepTime: 8, station: 'Hot Kitchen',
    ingredients: [
      { name: 'Ham', cost: 2.00, quantity: '60g' },
      { name: 'Gruyère', cost: 1.50, quantity: '40g' },
      { name: 'Béchamel', cost: 1.00, quantity: '40ml' },
      { name: 'Bread', cost: 1.00, quantity: '2 slices' },
    ],
    totalFoodCost: 5.50, grossProfit: 12.50, foodCostPct: 30.6,
  },
  {
    id: 'rec28', name: 'Gaspacho Provençal', sellingPrice: 12, servings: 1, prepTime: 5, station: 'Garde Manger',
    ingredients: [
      { name: 'Tomatoes', cost: 2.00, quantity: '300g' },
      { name: 'Bell Peppers', cost: 0.80, quantity: '80g' },
      { name: 'Cucumber', cost: 0.40, quantity: '50g' },
      { name: 'Olive Oil', cost: 0.30, quantity: '10ml' },
    ],
    totalFoodCost: 3.50, grossProfit: 8.50, foodCostPct: 29.2,
  },
  {
    id: 'rec29', name: 'Pâté de Campagne', sellingPrice: 13, servings: 1, prepTime: 6, station: 'Garde Manger',
    ingredients: [
      { name: 'Pork', cost: 2.50, quantity: '100g' },
      { name: 'Pork Liver', cost: 0.80, quantity: '30g' },
      { name: 'Cornichons', cost: 0.40, quantity: '20g' },
      { name: 'Baguette', cost: 0.30, quantity: '2 slices' },
    ],
    totalFoodCost: 4.00, grossProfit: 9.00, foodCostPct: 30.8,
  },
  {
    id: 'rec30', name: 'Lavender Honey Crème', sellingPrice: 10, servings: 1, prepTime: 8, station: 'Pastry',
    ingredients: [
      { name: 'Heavy Cream', cost: 1.50, quantity: '100ml' },
      { name: 'Lavender Honey', cost: 0.60, quantity: '20g' },
      { name: 'Eggs', cost: 0.40, quantity: '2 pcs' },
    ],
    totalFoodCost: 2.50, grossProfit: 7.50, foodCostPct: 25.0,
  },
];

function generatePayments(n: number): Payment[] {
  const methods: Payment['method'][] = ['Cash', 'Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Online'];
  const statuses: Payment['status'][] = ['Completed', 'Completed', 'Completed', 'Pending', 'Failed', 'Refunded'];
  return Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    transactionId: `P${2084 - i}`,
    order: `#O${1048 - i}`,
    table: i % 7 === 0 ? null : Math.floor(Math.random() * 24) + 1,
    amount: Math.round(Math.random() * 200 + 30),
    method: methods[i % methods.length],
    tip: Math.round(Math.random() * 20),
    status: statuses[i % statuses.length],
    time: `${Math.floor(Math.random() * 4) + 19}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  }));
}

export const payments: Payment[] = generatePayments(50);

function generateDeliveryOrders(n: number): DeliveryOrder[] {
  const statuses: DeliveryOrder['status'][] = ['New', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const types: DeliveryOrder['type'][] = ['Pickup', 'Delivery'];
  const dishNames = menuItems.filter(m => m.category !== 'Wine').map(m => m.name);
  return Array.from({ length: n }, (_, i) => {
    const type = types[i % 2];
    const itemCount = Math.floor(Math.random() * 3) + 1;
    return {
      id: `d${i + 1}`,
      orderId: `#D${3024 - i}`,
      customer: customerNames[i % customerNames.length],
      phone: phoneNumbers[i % phoneNumbers.length],
      address: type === 'Delivery' ? `${i + 5} Rue de Rivoli, 75001 Paris` : undefined,
      items: Array.from({ length: itemCount }, (_, j) => ({
        name: dishNames[(i + j) % dishNames.length],
        quantity: Math.floor(Math.random() * 3) + 1,
      })),
      amount: Math.round(Math.random() * 80 + 20),
      type,
      scheduledTime: `${Math.floor(Math.random() * 3) + 19}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      status: statuses[i % statuses.length],
    };
  });
}

export const deliveryOrders: DeliveryOrder[] = generateDeliveryOrders(20);

export const employees: Employee[] = [
  { id: 'e1', name: 'Antoine Laurent', role: 'Manager', department: 'Management', todayShift: '10:00 - 22:00', attendance: 'Present', status: 'Active', phone: '+33 6 12 34 56 78', email: 'antoine@maisoneetoile.com', hireDate: '2019-03-15' },
  { id: 'e2', name: 'Claire Dubois', role: 'Waiter', department: 'Front of House', todayShift: '11:00 - 19:00', attendance: 'Present', status: 'Active', phone: '+33 6 23 45 67 89', email: 'claire@maisoneetoile.com', hireDate: '2020-06-01' },
  { id: 'e3', name: 'Louis Bernard', role: 'Chef', department: 'Kitchen', todayShift: '09:00 - 23:00', attendance: 'Present', status: 'Active', phone: '+33 6 34 56 78 90', email: 'louis@maisoneetoile.com', hireDate: '2018-01-10' },
  { id: 'e4', name: 'Sophie Moreau', role: 'Pastry Chef', department: 'Kitchen', todayShift: '08:00 - 16:00', attendance: 'Present', status: 'Active', phone: '+33 6 45 67 89 01', email: 'sophie@maisoneetoile.com', hireDate: '2021-02-20' },
  { id: 'e5', name: 'Jean Martin', role: 'Head Waiter', department: 'Front of House', todayShift: '11:00 - 23:00', attendance: 'Present', status: 'Active', phone: '+33 6 56 78 90 12', email: 'jean@maisoneetoile.com', hireDate: '2019-09-05' },
  { id: 'e6', name: 'Manon Roux', role: 'Waiter', department: 'Front of House', todayShift: '12:00 - 20:00', attendance: 'Present', status: 'On Break', phone: '+33 6 67 89 01 23', email: 'manon@maisoneetoile.com', hireDate: '2022-04-12' },
  { id: 'e7', name: 'Hugo Lefebvre', role: 'Sous Chef', department: 'Kitchen', todayShift: '10:00 - 22:00', attendance: 'Present', status: 'Active', phone: '+33 6 78 90 12 34', email: 'hugo@maisoneetoile.com', hireDate: '2020-10-15' },
  { id: 'e8', name: 'Léa Garnier', role: 'Hostess', department: 'Front of House', todayShift: '11:00 - 19:00', attendance: 'Present', status: 'Active', phone: '+33 6 89 01 23 45', email: 'lea@maisoneetoile.com', hireDate: '2023-01-08' },
  { id: 'e9', name: 'Antoine Fontaine', role: 'Bartender', department: 'Bar', todayShift: '16:00 - 00:00', attendance: 'Late', status: 'Off Duty', phone: '+33 6 90 12 34 56', email: 'antoine.f@maisoneetoile.com', hireDate: '2021-07-20' },
  { id: 'e10', name: 'Charlotte Mercier', role: 'Sommelier', department: 'Front of House', todayShift: '16:00 - 23:00', attendance: 'Present', status: 'Active', phone: '+33 6 01 23 45 67', email: 'charlotte@maisoneetoile.com', hireDate: '2020-03-18' },
  { id: 'e11', name: 'Nathan Rousseau', role: 'Line Cook', department: 'Kitchen', todayShift: '15:00 - 23:00', attendance: 'Present', status: 'Active', phone: '+33 6 12 34 56 79', email: 'nathan@maisoneetoile.com', hireDate: '2022-08-01' },
  { id: 'e12', name: 'Emma Vincent', role: 'Cashier', department: 'Front of House', todayShift: '10:00 - 18:00', attendance: 'Present', status: 'Active', phone: '+33 6 23 45 67 80', email: 'emma@maisoneetoile.com', hireDate: '2023-05-10' },
  { id: 'e13', name: 'Louis Blanc', role: 'Dishwasher', department: 'Kitchen', todayShift: '14:00 - 22:00', attendance: 'Absent', status: 'Off Duty', phone: '+33 6 34 56 78 91', email: 'louis.b@maisoneetoile.com', hireDate: '2021-11-15' },
  { id: 'e14', name: 'Chloé Faure', role: 'Waiter', department: 'Front of House', todayShift: 'Off', attendance: 'On Leave', status: 'Off Duty', phone: '+33 6 45 67 89 02', email: 'chloe@maisoneetoile.com', hireDate: '2022-06-20' },
  { id: 'e15', name: 'Gabriel Lemoine', role: 'Inventory Manager', department: 'Management', todayShift: '08:00 - 16:00', attendance: 'Present', status: 'Active', phone: '+33 6 56 78 90 13', email: 'gabriel@maisoneetoile.com', hireDate: '2020-01-05' },
  { id: 'e16', name: 'Julie Morel', role: 'Pastry Assistant', department: 'Kitchen', todayShift: '06:00 - 14:00', attendance: 'Present', status: 'Off Duty', phone: '+33 6 67 89 01 24', email: 'julie@maisoneetoile.com', hireDate: '2023-03-01' },
  { id: 'e17', name: 'Maxime Dupuis', role: 'Bar Back', department: 'Bar', todayShift: '17:00 - 01:00', attendance: 'Present', status: 'Off Duty', phone: '+33 6 78 90 12 35', email: 'maxime@maisoneetoile.com', hireDate: '2022-10-10' },
  { id: 'e18', name: 'Sarah Leger', role: 'Hostess', department: 'Front of House', todayShift: '18:00 - 23:00', attendance: 'Present', status: 'Off Duty', phone: '+33 6 89 01 23 46', email: 'sarah@maisoneetoile.com', hireDate: '2023-06-15' },
  { id: 'e19', name: 'Paul Girard', role: 'Line Cook', department: 'Kitchen', todayShift: '10:00 - 18:00', attendance: 'Present', status: 'On Break', phone: '+33 6 90 12 34 57', email: 'paul@maisoneetoile.com', hireDate: '2021-09-01' },
  { id: 'e20', name: 'Marie Bonnet', role: 'Waiter', department: 'Front of House', todayShift: '16:00 - 00:00', attendance: 'Present', status: 'Off Duty', phone: '+33 6 01 23 45 68', email: 'marie@maisoneetoile.com', hireDate: '2022-02-14' },
];

export const shifts: Shift[] = [
  { id: 'sh1', employeeId: 'e5', employeeName: 'Jean Martin', date: '2026-08-19', startTime: '11:00', endTime: '23:00', role: 'Head Waiter', station: 'Main Dining' },
  { id: 'sh2', employeeId: 'e2', employeeName: 'Claire Dubois', date: '2026-08-19', startTime: '11:00', endTime: '19:00', role: 'Waiter', station: 'Terrace' },
  { id: 'sh3', employeeId: 'e3', employeeName: 'Louis Bernard', date: '2026-08-19', startTime: '09:00', endTime: '23:00', role: 'Chef', station: 'Kitchen' },
  { id: 'sh4', employeeId: 'e4', employeeName: 'Sophie Moreau', date: '2026-08-19', startTime: '08:00', endTime: '16:00', role: 'Pastry Chef', station: 'Pastry' },
  { id: 'sh5', employeeId: 'e1', employeeName: 'Antoine Laurent', date: '2026-08-19', startTime: '10:00', endTime: '22:00', role: 'Manager', station: 'Office' },
  { id: 'sh6', employeeId: 'e6', employeeName: 'Manon Roux', date: '2026-08-19', startTime: '12:00', endTime: '20:00', role: 'Waiter', station: 'Main Dining' },
  { id: 'sh7', employeeId: 'e7', employeeName: 'Hugo Lefebvre', date: '2026-08-19', startTime: '10:00', endTime: '22:00', role: 'Sous Chef', station: 'Kitchen' },
  { id: 'sh8', employeeId: 'e8', employeeName: 'Léa Garnier', date: '2026-08-19', startTime: '11:00', endTime: '19:00', role: 'Hostess', station: 'Entrance' },
  { id: 'sh9', employeeId: 'e10', employeeName: 'Charlotte Mercier', date: '2026-08-19', startTime: '16:00', endTime: '23:00', role: 'Sommelier', station: 'Bar' },
  { id: 'sh10', employeeId: 'e11', employeeName: 'Nathan Rousseau', date: '2026-08-19', startTime: '15:00', endTime: '23:00', role: 'Line Cook', station: 'Kitchen' },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'low_stock', title: 'Low stock', message: 'Truffle Oil is below minimum stock.', time: '2 min ago', read: false, link: '/inventory' },
  { id: 'n2', type: 'reservation', title: 'Reservation', message: 'Claire Martin arrives in 15 minutes.', time: '5 min ago', read: false, link: '/reservations' },
  { id: 'n3', type: 'kitchen', title: 'Kitchen', message: 'Order #1048 has exceeded preparation time.', time: '8 min ago', read: false, link: '/kitchen' },
  { id: 'n4', type: 'payment', title: 'Payment', message: 'Payment #P2084 failed.', time: '12 min ago', read: true, link: '/payments' },
  { id: 'n5', type: 'low_stock', title: 'Low stock', message: 'Duck Breast is running low (6kg remaining).', time: '20 min ago', read: true, link: '/inventory' },
  { id: 'n6', type: 'reservation', title: 'Reservation', message: 'New reservation from Jean Dupont for 4 guests.', time: '35 min ago', read: true, link: '/reservations' },
  { id: 'n7', type: 'system', title: 'System', message: 'Daily sales report is ready to view.', time: '1 hour ago', read: true, link: '/reports' },
];

export const hourlySales: HourlySale[] = [
  { hour: '11:00', sales: 320, orders: 8 },
  { hour: '12:00', sales: 1240, orders: 28 },
  { hour: '13:00', sales: 1850, orders: 42 },
  { hour: '14:00', sales: 980, orders: 22 },
  { hour: '15:00', sales: 420, orders: 10 },
  { hour: '16:00', sales: 280, orders: 6 },
  { hour: '17:00', sales: 540, orders: 12 },
  { hour: '18:00', sales: 1120, orders: 26 },
  { hour: '19:00', sales: 1980, orders: 44 },
  { hour: '20:00', sales: 2240, orders: 48 },
  { hour: '21:00', sales: 1680, orders: 36 },
  { hour: '22:00', sales: 820, orders: 18 },
  { hour: '23:00', sales: 272, orders: 6 },
];

export const salesByDay: { day: string; today: number; yesterday: number; lastWeek: number }[] = [
  { day: 'Mon', today: 6200, yesterday: 5800, lastWeek: 5400 },
  { day: 'Tue', today: 7100, yesterday: 6500, lastWeek: 6200 },
  { day: 'Wed', today: 8742, yesterday: 7800, lastWeek: 7100 },
  { day: 'Thu', today: 0, yesterday: 8200, lastWeek: 7500 },
  { day: 'Fri', today: 0, yesterday: 9500, lastWeek: 8800 },
  { day: 'Sat', today: 0, yesterday: 11200, lastWeek: 10400 },
  { day: 'Sun', today: 0, yesterday: 7600, lastWeek: 6900 },
];

export const revenueBreakdown = [
  { name: 'Dine-in', value: 5840, color: 'hsl(var(--chart-1))' },
  { name: 'Takeaway', value: 1680, color: 'hsl(var(--chart-2))' },
  { name: 'Delivery', value: 1222, color: 'hsl(var(--chart-3))' },
];

export const topDishes = [
  { name: 'Steak Frites', quantity: 48, revenue: 1536 },
  { name: 'Duck Confit', quantity: 36, revenue: 1044 },
  { name: 'Bouillabaisse', quantity: 24, revenue: 864 },
  { name: 'Coq au Vin', quantity: 28, revenue: 868 },
  { name: 'Crème Brûlée', quantity: 42, revenue: 420 },
];

function generateSalesHistory(n: number): SalesRecord[] {
  const channels: SalesRecord['channel'][] = ['Dine-in', 'Takeaway', 'Delivery'];
  return Array.from({ length: n }, (_, i) => ({
    date: `2026-08-${(19 - Math.floor(i / 5)).toString().padStart(2, '0')}`,
    sales: Math.round(Math.random() * 3000 + 4000),
    orders: Math.floor(Math.random() * 80 + 100),
    channel: channels[i % 3],
  }));
}

export const salesHistory: SalesRecord[] = generateSalesHistory(105);

export const expenses: Expense[] = [
  { id: 'ex1', date: '2026-08-19', category: 'Meat', supplier: 'Paris Prime Meats', description: 'Weekly meat order', amount: 1850, vat: 370, status: 'Paid' },
  { id: 'ex2', date: '2026-08-18', category: 'Seafood', supplier: 'Mediterr Seafood', description: 'Fresh fish delivery', amount: 920, vat: 184, status: 'Pending' },
  { id: 'ex3', date: '2026-08-17', category: 'Vegetables', supplier: 'Fresh Produce Paris', description: 'Produce order', amount: 680, vat: 136, status: 'Paid' },
  { id: 'ex4', date: '2026-08-16', category: 'Dairy', supplier: 'Normandie Dairy', description: 'Cheese and cream', amount: 920, vat: 184, status: 'Paid' },
  { id: 'ex5', date: '2026-08-15', category: 'Specialty', supplier: 'Maison Fournier', description: 'Truffle order', amount: 1240, vat: 248, status: 'Pending' },
  { id: 'ex6', date: '2026-08-14', category: 'Beverages', supplier: 'Café du Monde', description: 'Coffee beans', amount: 340, vat: 68, status: 'Paid' },
  { id: 'ex7', date: '2026-08-13', category: 'Bakery', supplier: 'Boulangerie Dupont', description: 'Daily bread order', amount: 340, vat: 68, status: 'Paid' },
  { id: 'ex8', date: '2026-08-12', category: 'Wine', supplier: 'Bordeaux Wine Co.', description: 'Wine restock', amount: 2200, vat: 440, status: 'Overdue' },
  { id: 'ex9', date: '2026-08-11', category: 'Oils', supplier: 'Olive Oil Provence', description: 'Olive oil restock', amount: 520, vat: 104, status: 'Pending' },
  { id: 'ex10', date: '2026-08-10', category: 'Charcuterie', supplier: 'Lyon Charcuterie', description: 'Pâté and cured meats', amount: 890, vat: 178, status: 'Paid' },
];

export const invoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2026-045', supplier: 'Paris Prime Meats', date: '2026-08-19', dueDate: '2026-09-02', amount: 1850, status: 'Pending' },
  { id: 'inv2', invoiceNumber: 'INV-2026-044', supplier: 'Mediterr Seafood', date: '2026-08-18', dueDate: '2026-09-01', amount: 920, status: 'Pending' },
  { id: 'inv3', invoiceNumber: 'INV-2026-043', supplier: 'Fresh Produce Paris', date: '2026-08-17', dueDate: '2026-08-31', amount: 680, status: 'Paid' },
  { id: 'inv4', invoiceNumber: 'INV-2026-042', supplier: 'Normandie Dairy', date: '2026-08-16', dueDate: '2026-08-30', amount: 920, status: 'Paid' },
  { id: 'inv5', invoiceNumber: 'INV-2026-041', supplier: 'Maison Fournier', date: '2026-08-15', dueDate: '2026-08-29', amount: 1240, status: 'Pending' },
  { id: 'inv6', invoiceNumber: 'INV-2026-040', supplier: 'Bordeaux Wine Co.', date: '2026-08-12', dueDate: '2026-08-26', amount: 2200, status: 'Overdue' },
  { id: 'inv7', invoiceNumber: 'INV-2026-039', supplier: 'Boulangerie Dupont', date: '2026-08-13', dueDate: '2026-08-27', amount: 340, status: 'Paid' },
  { id: 'inv8', invoiceNumber: 'INV-2026-038', supplier: 'Lyon Charcuterie', date: '2026-08-10', dueDate: '2026-08-24', amount: 890, status: 'Paid' },
  { id: 'inv9', invoiceNumber: 'INV-2026-037', supplier: 'Olive Oil Provence', date: '2026-08-11', dueDate: '2026-08-25', amount: 520, status: 'Pending' },
  { id: 'inv10', invoiceNumber: 'INV-2026-036', supplier: 'Alsace Spirits', date: '2026-08-09', dueDate: '2026-08-23', amount: 1100, status: 'Overdue' },
];

export const waiterTables = [
  { number: 4, guests: 4, amount: 184, elapsedMin: 42, status: 'Occupied' as const },
  { number: 7, guests: 2, amount: 86, elapsedMin: 22, status: 'Occupied' as const },
  { number: 12, guests: 4, amount: 184, elapsedMin: 42, status: 'Occupied' as const },
  { number: 18, guests: 4, amount: 196, elapsedMin: 35, status: 'Occupied' as const },
];
