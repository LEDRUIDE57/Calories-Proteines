const STORAGE_KEY = 'caloriesV1State';

const ACTIVITY_TYPES = ['Course', 'Gym', 'Machine musculation', 'Marche', 'Natation', 'Randonnée', 'Vélo', 'Vélo appart'];
const DEFAULT_ACTIVITY_SOURCES = {
  'Course': '',
  'Gym': '',
  'Machine musculation': '',
  'Marche': 'Samsung Health',
  'Natation': '',
  'Randonnée': '',
  'Vélo': 'eFlow',
  'Vélo appart': 'David Douillet'
};


const FOOD_DB = {
  apple: { name: 'Pomme', kcal100: 52, protein100: 0.3, unitName: 'pomme', unitWeightG: 150 },
  banana: { name: 'Banane', kcal100: 89, protein100: 1.1, unitName: 'banane', unitWeightG: 120 },
  bread: { name: 'Pain', kcal100: 265, protein100: 9, unitName: 'tranche', unitWeightG: 30 },
  carrot: { name: 'Carottes', kcal100: 41, protein100: 0.9 },
  cheese: { name: 'Fromage type emmental', kcal100: 380, protein100: 28 },
  chicken: { name: 'Poulet cuit', kcal100: 165, protein100: 31 },
  egg: { name: 'Œuf', kcal100: 143, protein100: 13, unitName: 'œuf', unitWeightG: 55 },
  fries: { name: 'Frites', kcal100: 312, protein100: 3.4 },
  ham: { name: 'Jambon blanc', kcal100: 116, protein100: 20, unitName: 'tranche', unitWeightG: 40 },
  pasta: { name: 'Pâtes cuites', kcal100: 158, protein100: 5.8 },
  potato: { name: 'Pommes de terre cuites', kcal100: 87, protein100: 1.9 },
  rice: { name: 'Riz cuit', kcal100: 130, protein100: 2.7 },
  salad: { name: 'Salade verte', kcal100: 15, protein100: 1.4 },
  salmon: { name: 'Saumon cuit', kcal100: 206, protein100: 22 },
  steak: { name: 'Steak haché', kcal100: 250, protein100: 26, unitName: 'steak', unitWeightG: 100 },
  tuna: { name: 'Thon au naturel', kcal100: 116, protein100: 26 },
  watermelon: { name: 'Pastèque', kcal100: 30, protein100: 0.6 },
  yogurt: { name: 'Yaourt nature', kcal100: 63, protein100: 4, unitName: 'pot', unitWeightG: 125 }
};

const FOOD_ALIASES = {
  apple: ['pomme'], banana: ['banane'], bread: ['pain'], carrot: ['carotte', 'carottes'],
  cheese: ['fromage type emmental', 'emmental'], chicken: ['poulet', 'poulet cuit'], egg: ['oeuf', 'œuf'],
  fries: ['frite', 'frites'], ham: ['jambon blanc'], pasta: ['pates', 'pâtes', 'pates cuites', 'pâtes cuites'],
  potato: ['pomme de terre', 'pommes de terre', 'pommes de terre cuites'], rice: ['riz', 'riz cuit'],
  salad: ['salade', 'salade verte'], salmon: ['saumon', 'saumon cuit'], steak: ['steak hache', 'steak haché'],
  tuna: ['thon', 'thon au naturel'], watermelon: ['pasteque', 'pastèque'], yogurt: ['yaourt', 'yaourt nature']
};

const PERSONAL_FOOD_SEED_VERSION = 1;
const BUNDLED_PERSONAL_FOODS = [
  {
    "id": "import-20260909-u01",
    "name": "Banane",
    "aliases": [
      "banane"
    ],
    "referenceMode": "perUnit",
    "unitName": "banane",
    "unitKcal": 70,
    "unitProtein": 1.3,
    "kcal100": 90,
    "protein100": 1.671,
    "unitWeightG": 77.778,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u02",
    "name": "Biscotte",
    "aliases": [
      "biscotte"
    ],
    "referenceMode": "perUnit",
    "unitName": "biscotte",
    "unitKcal": 38,
    "unitProtein": 1.0,
    "kcal100": 383,
    "protein100": 10.079,
    "unitWeightG": 9.922,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u03",
    "name": "Boîte sardine huile Odyssée",
    "aliases": [
      "boite sardine huile odyssee",
      "sardine huile odyssee"
    ],
    "referenceMode": "perUnit",
    "unitName": "boîte",
    "unitKcal": 110,
    "unitProtein": 23.0,
    "kcal100": 229,
    "protein100": 47.882,
    "unitWeightG": 48.035,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u04",
    "name": "Bouchée chocolat Lindor",
    "aliases": [
      "bouchee chocolat lindor"
    ],
    "referenceMode": "perUnit",
    "unitName": "bouchée",
    "unitKcal": 40,
    "unitProtein": 0.3,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u05",
    "name": "Carreau chocolat Lindor",
    "aliases": [
      "carreau chocolat lindor"
    ],
    "referenceMode": "perUnit",
    "unitName": "carreau",
    "unitKcal": 78,
    "unitProtein": 1.0,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u06",
    "name": "Carreau chocolat link (15 g)",
    "aliases": [
      "carreau chocolat link",
      "carreau chocolat link 15g"
    ],
    "referenceMode": "perUnit",
    "unitName": "carreau",
    "unitKcal": 75,
    "unitProtein": 1.2,
    "kcal100": 500,
    "protein100": 8.0,
    "unitWeightG": 15.0,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u07",
    "name": "Croque monsieur maison",
    "aliases": [
      "croque monsieur maison"
    ],
    "referenceMode": "perUnit",
    "unitName": "croque-monsieur",
    "unitKcal": 340,
    "unitProtein": 19.0,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u08",
    "name": "Datte",
    "aliases": [
      "datte"
    ],
    "referenceMode": "perUnit",
    "unitName": "datte",
    "unitKcal": 22,
    "unitProtein": 0.2,
    "kcal100": 280,
    "protein100": 2.545,
    "unitWeightG": 7.857,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u09",
    "name": "Fromage chèvre raclette 1 tranche",
    "aliases": [
      "fromage chevre raclette",
      "chevre raclette"
    ],
    "referenceMode": "perUnit",
    "unitName": "tranche",
    "unitKcal": 91,
    "unitProtein": 6.0,
    "kcal100": 354,
    "protein100": 23.341,
    "unitWeightG": 25.706,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u10",
    "name": "Fromage portion Kiri",
    "aliases": [
      "kiri",
      "fromage kiri",
      "fromage portion kiri"
    ],
    "referenceMode": "perUnit",
    "unitName": "portion",
    "unitKcal": 50,
    "unitProtein": 2.0,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u11",
    "name": "Fromage raclette 1 tranche",
    "aliases": [
      "fromage raclette",
      "raclette"
    ],
    "referenceMode": "perUnit",
    "unitName": "tranche",
    "unitKcal": 82,
    "unitProtein": 6.0,
    "kcal100": 328,
    "protein100": 24.0,
    "unitWeightG": 25.0,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u12",
    "name": "Kiwi",
    "aliases": [
      "kiwi"
    ],
    "referenceMode": "perUnit",
    "unitName": "kiwi",
    "unitKcal": 60,
    "unitProtein": 1.0,
    "kcal100": 60,
    "protein100": 1.0,
    "unitWeightG": 100.0,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u13",
    "name": "Lot de 3 petits beurre",
    "aliases": [
      "lot de 3 petits beurre",
      "3 petits beurre",
      "petits beurre"
    ],
    "referenceMode": "perUnit",
    "unitName": "lot",
    "unitKcal": 111,
    "unitProtein": 1.8,
    "kcal100": 445,
    "protein100": 7.216,
    "unitWeightG": 24.944,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u14",
    "name": "Mi-cho-ko",
    "aliases": [
      "mi cho ko",
      "michoko"
    ],
    "referenceMode": "perUnit",
    "unitName": "pièce",
    "unitKcal": 32,
    "unitProtein": 1.0,
    "kcal100": 480,
    "protein100": 15.0,
    "unitWeightG": 6.667,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u15",
    "name": "Œuf à la coque",
    "aliases": [
      "oeuf",
      "œuf",
      "oeuf a la coque",
      "œuf à la coque"
    ],
    "referenceMode": "perUnit",
    "unitName": "œuf",
    "unitKcal": 70,
    "unitProtein": 6.0,
    "kcal100": 155,
    "protein100": 13.286,
    "unitWeightG": 45.161,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u16",
    "name": "Petit Fruité Yoplait",
    "aliases": [
      "petit fruite yoplait",
      "petit fruité yoplait"
    ],
    "referenceMode": "perUnit",
    "unitName": "pot",
    "unitKcal": 42,
    "unitProtein": 2.7,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u17",
    "name": "Portion St Moret",
    "aliases": [
      "st moret",
      "saint moret",
      "portion st moret"
    ],
    "referenceMode": "perUnit",
    "unitName": "portion",
    "unitKcal": 45,
    "unitProtein": 1.5,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u18",
    "name": "Pot de riz au lait sur caramel",
    "aliases": [
      "riz au lait caramel",
      "pot de riz au lait sur caramel"
    ],
    "referenceMode": "perUnit",
    "unitName": "pot",
    "unitKcal": 150,
    "unitProtein": 3.7,
    "kcal100": 130,
    "protein100": 3.207,
    "unitWeightG": 115.385,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u19",
    "name": "Pot gâteau riz caramel",
    "aliases": [
      "pot gateau riz caramel",
      "gateau de riz caramel"
    ],
    "referenceMode": "perUnit",
    "unitName": "pot",
    "unitKcal": 131,
    "unitProtein": 3.4,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u20",
    "name": "Petit suisse fruité",
    "aliases": [
      "pt suisse fruite",
      "petit suisse fruite",
      "petit suisse fruité"
    ],
    "referenceMode": "perUnit",
    "unitName": "pot",
    "unitKcal": 60,
    "unitProtein": 3.0,
    "kcal100": 95,
    "protein100": 4.75,
    "unitWeightG": 63.158,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u21",
    "name": "Tartelette Pastel de Nata",
    "aliases": [
      "pastel de nata",
      "tartelette pastel de nata"
    ],
    "referenceMode": "perUnit",
    "unitName": "tartelette",
    "unitKcal": 200,
    "unitProtein": 3.5,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u22",
    "name": "Tranche fromage Leerdammer",
    "aliases": [
      "leerdammer",
      "tranche fromage leerdammer"
    ],
    "referenceMode": "perUnit",
    "unitName": "tranche",
    "unitKcal": 88,
    "unitProtein": 6.5,
    "kcal100": 350,
    "protein100": 25.852,
    "unitWeightG": 25.143,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u23",
    "name": "Yaourt entier",
    "aliases": [
      "yaourt entier"
    ],
    "referenceMode": "perUnit",
    "unitName": "pot",
    "unitKcal": 118,
    "unitProtein": 4.0,
    "kcal100": 95,
    "protein100": 3.22,
    "unitWeightG": 124.211,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u24",
    "name": "Beurre",
    "aliases": [
      "beurre"
    ],
    "referenceMode": "perUnit",
    "unitName": "cuillère à café",
    "unitKcal": 37,
    "unitProtein": 0.0,
    "kcal100": 750,
    "protein100": 0.0,
    "unitWeightG": 4.933,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u25",
    "name": "Confiture",
    "aliases": [
      "confiture"
    ],
    "referenceMode": "perUnit",
    "unitName": "cuillère à café",
    "unitKcal": 17,
    "unitProtein": 0.0,
    "kcal100": 250,
    "protein100": 0.0,
    "unitWeightG": 6.8,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u26",
    "name": "Miel",
    "aliases": [
      "miel"
    ],
    "referenceMode": "perUnit",
    "unitName": "cuillère à café",
    "unitKcal": 21,
    "unitProtein": 0.0,
    "kcal100": 320,
    "protein100": 0.0,
    "unitWeightG": 6.562,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u27",
    "name": "Huile",
    "aliases": [
      "huile"
    ],
    "referenceMode": "perUnit",
    "unitName": "cuillère à soupe",
    "unitKcal": 110,
    "unitProtein": 0.0,
    "kcal100": 900,
    "protein100": 0.0,
    "unitWeightG": 12.222,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-u28",
    "name": "Twix",
    "aliases": [
      "twix"
    ],
    "referenceMode": "perUnit",
    "unitName": "barre",
    "unitKcal": 99,
    "unitProtein": 0.9,
    "kcal100": null,
    "protein100": null,
    "unitWeightG": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true
  },
  {
    "id": "import-20260909-g01",
    "name": "Baguette",
    "aliases": [
      "baguette"
    ],
    "referenceMode": "per100g",
    "kcal100": 270,
    "protein100": 8.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 27,
    "sourceProtein": 0.8
  },
  {
    "id": "import-20260909-g02",
    "name": "Chips Lay's cuites au four",
    "aliases": [
      "chipos lays cuite au four",
      "chips lays cuite au four",
      "chips lay's cuites au four"
    ],
    "referenceMode": "per100g",
    "kcal100": 430,
    "protein100": 7.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 43,
    "sourceProtein": 0.7
  },
  {
    "id": "import-20260909-g03",
    "name": "Compote de pommes maison",
    "aliases": [
      "compotes de pommes maison",
      "compote de pommes maison"
    ],
    "referenceMode": "per100g",
    "kcal100": 80,
    "protein100": 0.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 8,
    "sourceProtein": 0.0
  },
  {
    "id": "import-20260909-g04",
    "name": "Crème entière",
    "aliases": [
      "creme entiere",
      "crème entière"
    ],
    "referenceMode": "per100g",
    "kcal100": 300,
    "protein100": 2.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 30,
    "sourceProtein": 0.2
  },
  {
    "id": "import-20260909-g05",
    "name": "Frites Actifree",
    "aliases": [
      "frites actifree"
    ],
    "referenceMode": "per100g",
    "kcal100": 150,
    "protein100": 3.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 15,
    "sourceProtein": 0.3
  },
  {
    "id": "import-20260909-g06",
    "name": "Fromage blanc faisselle",
    "aliases": [
      "fromage blanc faisselle"
    ],
    "referenceMode": "per100g",
    "kcal100": 76,
    "protein100": 4.3,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 8,
    "sourceProtein": 4.3
  },
  {
    "id": "import-20260909-g07",
    "name": "Fromage Brin de Paille",
    "aliases": [
      "fromage brin de paille",
      "brin de paille"
    ],
    "referenceMode": "per100g",
    "kcal100": 334,
    "protein100": 16.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 34,
    "sourceProtein": 1.6
  },
  {
    "id": "import-20260909-g08",
    "name": "Fromage Caprice des Dieux",
    "aliases": [
      "fromage caprice des dieux",
      "caprice des dieux"
    ],
    "referenceMode": "per100g",
    "kcal100": 300,
    "protein100": 12.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 30,
    "sourceProtein": 1.2
  },
  {
    "id": "import-20260909-g09",
    "name": "Fromage Emmental",
    "aliases": [
      "emmental",
      "fromage emmental",
      "fromage type emmental"
    ],
    "referenceMode": "per100g",
    "kcal100": 400,
    "protein100": 28.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 40,
    "sourceProtein": 2.8
  },
  {
    "id": "import-20260909-g10",
    "name": "Fromage Gouda",
    "aliases": [
      "gouda",
      "fromage gouda"
    ],
    "referenceMode": "per100g",
    "kcal100": 360,
    "protein100": 23.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 36,
    "sourceProtein": 2.3
  },
  {
    "id": "import-20260909-g11",
    "name": "Fromage Loupérac",
    "aliases": [
      "louperac",
      "loupérac",
      "fromage louperac",
      "fromage loupérac"
    ],
    "referenceMode": "per100g",
    "kcal100": 305,
    "protein100": 17.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 30,
    "sourceProtein": 1.7
  },
  {
    "id": "import-20260909-g12",
    "name": "Fromage Pavé d'Affinois Gourmand",
    "aliases": [
      "pave d affinoy gourmand",
      "pavé d'affinois gourmand",
      "fromage pave d affinoy gourmand",
      "fromage pavé d'affinois gourmand"
    ],
    "referenceMode": "per100g",
    "kcal100": 312,
    "protein100": 18.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 75,
    "sourceProtein": 18.0
  },
  {
    "id": "import-20260909-g13",
    "name": "Fromage Roucouloux noix",
    "aliases": [
      "roucouloux noix",
      "fromage roucouloux noix"
    ],
    "referenceMode": "per100g",
    "kcal100": 345,
    "protein100": 12.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 35,
    "sourceProtein": 1.2
  },
  {
    "id": "import-20260909-g14",
    "name": "Gâteau apéro salés Belein",
    "aliases": [
      "gateau apero sales belein",
      "gâteau apéro salés belein"
    ],
    "referenceMode": "per100g",
    "kcal100": 518,
    "protein100": 10.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 51,
    "sourceProtein": 1.0
  },
  {
    "id": "import-20260909-g15",
    "name": "Gâteau yaourt maison",
    "aliases": [
      "gateau yaourt maison",
      "gâteau yaourt maison"
    ],
    "referenceMode": "per100g",
    "kcal100": 380,
    "protein100": 6.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 38,
    "sourceProtein": 0.6
  },
  {
    "id": "import-20260909-g16",
    "name": "Gruyère",
    "aliases": [
      "gruyere",
      "gruyère"
    ],
    "referenceMode": "per100g",
    "kcal100": 350,
    "protein100": 28.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 35,
    "sourceProtein": 2.8
  },
  {
    "id": "import-20260909-g17",
    "name": "Jambon blanc cuit",
    "aliases": [
      "jambon blanc",
      "jambon blanc cuit"
    ],
    "referenceMode": "per100g",
    "kcal100": 120,
    "protein100": 20.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 12,
    "sourceProtein": 2.0
  },
  {
    "id": "import-20260909-g18",
    "name": "Lardons grillés à la poêle",
    "aliases": [
      "lardons grilles a la poele",
      "lardons grillés à la poêle"
    ],
    "referenceMode": "per100g",
    "kcal100": 239,
    "protein100": 16.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 24,
    "sourceProtein": 16.0
  },
  {
    "id": "import-20260909-g19",
    "name": "Pâtes cuites",
    "aliases": [
      "pates cuites",
      "pâtes cuites",
      "pates",
      "pâtes"
    ],
    "referenceMode": "per100g",
    "kcal100": 130,
    "protein100": 5.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 13,
    "sourceProtein": 0.5
  },
  {
    "id": "import-20260909-g20",
    "name": "Pistaches",
    "aliases": [
      "pistache",
      "pistaches"
    ],
    "referenceMode": "per100g",
    "kcal100": 610,
    "protein100": 20.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 61,
    "sourceProtein": 2.0
  },
  {
    "id": "import-20260909-g21",
    "name": "Poulet cuisse",
    "aliases": [
      "poulet cuisse",
      "cuisse de poulet"
    ],
    "referenceMode": "per100g",
    "kcal100": 165,
    "protein100": 26.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 16,
    "sourceProtein": 2.6
  },
  {
    "id": "import-20260909-g22",
    "name": "Poulet escalope",
    "aliases": [
      "poulet escalope",
      "escalope de poulet"
    ],
    "referenceMode": "per100g",
    "kcal100": 110,
    "protein100": 23.0,
    "unitName": "",
    "unitWeightG": null,
    "unitKcal": null,
    "unitProtein": null,
    "packageWeightG": null,
    "units": null,
    "origin": "user-table-2026-09-09",
    "seeded": true,
    "sourceQuantity": "10 g",
    "sourceKcal": 11,
    "sourceProtein": 2.3
  }
];


const defaultState = {
  personalFoodSeedVersion: 0,
  profile: {
    setupDone: false,
    age: 73,
    sex: 'male',
    heightCm: null,
    currentWeightKg: 74,
    startWeightKg: 74,
    goalWeightKg: 72.5,
    activityFactor: 1.375,
    deficitKcal: 225,
    proteinFactor: 1.0,
    apiUrl: '',
    activitySources: { ...DEFAULT_ACTIVITY_SOURCES }
  },
  meals: [],
  activities: [],
  personalFoods: [],
  weights: [{ id: 'initial-weight', date: new Date().toISOString(), dateKey: localDateKey(), kg: 74 }]
};

let state = loadState();
applyBundledPersonalFoodSeed();
let selectedImageData = null;
let currentAnalysis = null;
let selectedDateKey = localDateKey();
let editingMealId = null;
let editingPersonalFoodId = null;

const $ = id => document.getElementById(id);
const round = (n, d = 0) => Number(Number(n).toFixed(d));
function makeId() { return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`; }

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dateFromKey(key) {
  return new Date(`${key}T12:00:00`);
}

function timestampForDateKey(key) {
  const d = dateFromKey(key);
  const now = new Date();
  d.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  return d.toISOString();
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function formatShortDateKey(key) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dateFromKey(key));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

function migratePersonalFood(food = {}) {
  const migrated = { ...food };
  const packageWeightG = Number(migrated.packageWeightG || 0) || null;
  const units = Number(migrated.units || 0) || null;
  const derivedUnitWeight = packageWeightG && units ? packageWeightG / units : null;
  migrated.referenceMode = migrated.referenceMode === 'perUnit' ? 'perUnit' : 'per100g';
  migrated.unitName = String(migrated.unitName || '').trim();
  migrated.unitWeightG = Number(migrated.unitWeightG || derivedUnitWeight || 0) || null;
  if (migrated.referenceMode === 'perUnit') {
    migrated.unitKcal = Number(migrated.unitKcal ?? migrated.kcalPerUnit ?? 0);
    migrated.unitProtein = Number(migrated.unitProtein ?? migrated.proteinPerUnit ?? 0);
    if (migrated.unitWeightG && (!Number.isFinite(Number(migrated.kcal100)) || Number(migrated.kcal100) <= 0)) {
      migrated.kcal100 = migrated.unitKcal / migrated.unitWeightG * 100;
    }
    if (migrated.unitWeightG && (!Number.isFinite(Number(migrated.protein100)) || Number(migrated.protein100) < 0)) {
      migrated.protein100 = migrated.unitProtein / migrated.unitWeightG * 100;
    }
  }
  return migrated;
}


function normalizedFoodNames(food = {}) {
  return [food.name, ...(Array.isArray(food.aliases) ? food.aliases : [])]
    .map(normalizeFoodName)
    .filter(Boolean);
}

function foodsOverlap(a = {}, b = {}) {
  const aNames = new Set(normalizedFoodNames(a));
  return normalizedFoodNames(b).some(name => aNames.has(name));
}

function generalFoodIsShadowed(key, food) {
  const generalRef = { name: food.name, aliases: FOOD_ALIASES[key] || [] };
  return (state?.personalFoods || []).some(personal => foodsOverlap(personal, generalRef));
}

function dedupedGeneralFoodEntries() {
  return Object.entries(FOOD_DB).filter(([key, food]) => !generalFoodIsShadowed(key, food));
}

function applyBundledPersonalFoodSeed() {
  const currentVersion = Number(state.personalFoodSeedVersion || 0);
  if (currentVersion >= PERSONAL_FOOD_SEED_VERSION) return false;

  let foods = Array.isArray(state.personalFoods) ? state.personalFoods.map(migratePersonalFood) : [];
  for (const bundled of BUNDLED_PERSONAL_FOODS) {
    foods = foods.filter(existing => !foodsOverlap(existing, bundled));
    foods.push({
      ...bundled,
      createdAt: bundled.createdAt || '2026-09-09T00:00:00.000Z',
      updatedAt: new Date().toISOString()
    });
  }
  state.personalFoods = foods;
  state.personalFoodSeedVersion = PERSONAL_FOOD_SEED_VERSION;
  saveState();
  return true;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    const weights = Array.isArray(parsed.weights) ? parsed.weights : structuredClone(defaultState.weights);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      profile: {
        ...structuredClone(defaultState.profile),
        ...(parsed.profile || {}),
        activitySources: { ...DEFAULT_ACTIVITY_SOURCES, ...((parsed.profile || {}).activitySources || {}) }
      },
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      personalFoods: Array.isArray(parsed.personalFoods) ? parsed.personalFoods.map(migratePersonalFood) : [],
      weights: weights.map(w => {
        const date = w.date || new Date().toISOString();
        return { ...w, id: w.id || makeId(), date, dateKey: w.dateKey || localDateKey(new Date(date)) };
      })
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculateTargets() {
  const p = state.profile;
  if (!p.heightCm || !p.currentWeightKg) return { maintenance: null, target: null, protein: null };
  const sexConstant = p.sex === 'female' ? -161 : 5;
  const bmr = 10 * p.currentWeightKg + 6.25 * p.heightCm - 5 * p.age + sexConstant;
  const maintenance = Math.round(bmr * Number(p.activityFactor));
  const target = Math.max(1200, maintenance - Number(p.deficitKcal || 0));
  const protein = Math.round(p.currentWeightKg * Number(p.proteinFactor || 1));
  return { maintenance, target, protein };
}

function mealsForDate(key) { return state.meals.filter(m => m.dateKey === key); }
function activitiesForDate(key) { return state.activities.filter(a => a.dateKey === key); }
function weightsForDate(key) { return state.weights.filter(w => (w.dateKey || localDateKey(new Date(w.date))) === key); }

function foodTotalsForDate(key) {
  return mealsForDate(key).reduce((acc, meal) => {
    acc.calories += Number(meal.calories || 0);
    acc.protein += Number(meal.protein || 0);
    return acc;
  }, { calories: 0, protein: 0 });
}

function activityTotalsForDate(key) {
  return activitiesForDate(key).reduce((sum, activity) => sum + Number(activity.calories || 0), 0);
}

function energyTotalsForDate(key) {
  const food = foodTotalsForDate(key);
  const activity = activityTotalsForDate(key);
  return { calories: food.calories, protein: food.protein, activity, net: food.calories - activity };
}

function hasDataForDate(key) {
  return mealsForDate(key).length || activitiesForDate(key).length || weightsForDate(key).length;
}

function progressClass(ratio) {
  if (ratio > 1) return 'over';
  if (ratio >= 0.9) return 'warn';
  return '';
}

function renderEnergyChart(net, target, food, activity) {
  const safeNet = Math.max(0, Number(net || 0));
  const safeTarget = Math.max(1, Number(target || 1));
  const scaleMax = Math.max(safeTarget, safeNet, 1);
  const greenValue = Math.min(safeNet, safeTarget);
  const redValue = Math.max(0, safeNet - safeTarget);
  const greenPct = greenValue / scaleMax * 100;
  const redPct = redValue / scaleMax * 100;
  const targetPct = safeTarget / scaleMax * 100;

  $('chart-food-calories').textContent = `${Math.round(food)} kcal`;
  $('chart-activity-calories').textContent = `−${Math.round(activity)} kcal`;
  $('chart-net-calories').textContent = `${Math.round(net)} kcal`;
  $('energy-green').style.height = `${greenPct}%`;
  $('energy-red').style.height = `${redPct}%`;
  $('energy-red').style.bottom = `${greenPct}%`;
  $('energy-target-line').style.bottom = `${Math.min(100, targetPct)}%`;
  $('energy-target-label').textContent = `Objectif ${Math.round(target)} kcal`;
  $('energy-scale-max').textContent = `${Math.round(scaleMax)} kcal`;
}

function updateSelectedDateControls() {
  const today = localDateKey();
  const isToday = selectedDateKey === today;
  $('dashboard-date').value = selectedDateKey;
  $('dashboard-date').max = today;
  $('day-next').disabled = isToday;
  $('day-today').disabled = isToday;
  $('delete-day').disabled = !hasDataForDate(selectedDateKey);
  $('today-title').textContent = isToday ? 'Aujourd’hui' : 'Journée';
  $('today-date').textContent = formatDate(dateFromKey(selectedDateKey));
}

function updateToday() {
  const key = selectedDateKey;
  const meals = mealsForDate(key).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const activities = activitiesForDate(key).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const total = energyTotalsForDate(key);
  const targets = calculateTargets();
  updateSelectedDateControls();

  $('cal-consumed').textContent = Math.round(total.calories);
  $('protein-consumed').textContent = round(total.protein, 1);
  $('activity-deducted').textContent = `−${Math.round(total.activity)} kcal`;
  $('net-calories').textContent = `${Math.round(total.net)} kcal`;

  if (!targets.target) {
    $('cal-target').textContent = 'à définir';
    $('cal-remaining').textContent = '—';
    $('maintenance-cal').textContent = '—';
    $('maintenance-gap').textContent = '—';
    $('protein-target').textContent = '—';
    $('protein-remaining').textContent = '—';
    renderEnergyChart(total.net, 1, total.calories, total.activity);
  } else {
    $('cal-target').textContent = `${targets.target} kcal`;
    const remaining = targets.target - total.net;
    $('cal-remaining').textContent = remaining >= 0 ? `${Math.round(remaining)} kcal` : `+${Math.abs(Math.round(remaining))} kcal`;
    $('maintenance-cal').textContent = targets.maintenance;
    const maintGap = total.net - targets.maintenance;
    $('maintenance-gap').textContent = `${maintGap > 0 ? '+' : ''}${Math.round(maintGap)}`;

    const calRatio = Math.max(0, total.net) / targets.target;
    $('cal-progress').style.width = `${Math.min(calRatio * 100, 100)}%`;
    $('cal-progress').className = `progress-bar ${progressClass(calRatio)}`;

    $('protein-target').textContent = targets.protein;
    const proteinRemaining = targets.protein - total.protein;
    $('protein-remaining').textContent = proteinRemaining > 0 ? `${round(proteinRemaining, 1)} g` : 'Objectif atteint';
    const proteinRatio = targets.protein ? total.protein / targets.protein : 0;
    $('protein-percent').textContent = `${Math.round(proteinRatio * 100)} %`;
    $('protein-progress').style.width = `${Math.min(proteinRatio * 100, 100)}%`;
    renderEnergyChart(total.net, targets.target, total.calories, total.activity);
  }

  $('meal-count').textContent = `${meals.length} ${meals.length > 1 ? 'entrées' : 'entrée'}`;
  $('today-meals').className = meals.length ? 'meal-list' : 'meal-list empty-state';
  $('today-meals').innerHTML = meals.length ? meals.map(meal => `
    <div class="meal-item">
      <div>
        <div class="meal-name">${escapeHtml(meal.type)} · ${escapeHtml(meal.name || 'Repas')}</div>
        <div class="meal-meta">${new Date(meal.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div class="meal-nutrition">${Math.round(meal.calories)} kcal<br><span class="muted">${round(meal.protein, 1)} g prot.</span></div>
      <div class="meal-actions">
        <button class="meal-edit" data-edit-meal="${meal.id}">Modifier</button>
        <button class="meal-delete" data-delete-meal="${meal.id}">Supprimer</button>
      </div>
    </div>`).join('') : 'Aucun repas enregistré.';

  $('today-activities').className = activities.length ? 'activity-list' : 'activity-list empty-state';
  $('today-activities').innerHTML = activities.length ? activities.map(activity => `
    <div class="activity-item">
      <div>
        <div class="meal-name">${escapeHtml(activity.name)}</div>
        <div class="meal-meta">${new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}${activity.source ? ` · Source : ${escapeHtml(activity.source)}` : ''}</div>
      </div>
      <div class="activity-kcal">−${Math.round(activity.calories)} kcal</div>
      <button class="meal-delete" data-delete-activity="${activity.id}">Supprimer</button>
    </div>`).join('') : 'Aucune activité déduite pour cette journée.';
}

function setEntryDates(key = selectedDateKey) {
  const today = localDateKey();
  ['photo-date', 'manual-date', 'activity-date', 'weight-date'].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.max = today;
    el.value = key <= today ? key : today;
  });
}

function selectDate(key) {
  const today = localDateKey();
  if (!key || key > today) key = today;
  selectedDateKey = key;
  setEntryDates(key);
  updateToday();
}

function shiftSelectedDate(days) {
  const d = dateFromKey(selectedDateKey);
  d.setDate(d.getDate() + days);
  const next = localDateKey(d);
  selectDate(next > localDateKey() ? localDateKey() : next);
}

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${name}`));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  if (name === 'today') updateToday();
  if (name === 'photo') setEntryDates(selectedDateKey);
  if (name === 'history') renderHistory();
  if (name === 'weight') { setEntryDates(selectedDateKey); renderWeight(); }
  if (name === 'settings') fillSettings();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addMeal({ type, name, calories, protein, items = [], source = 'manual', dateKey = selectedDateKey }) {
  const timestamp = timestampForDateKey(dateKey);
  state.meals.push({ id: makeId(), timestamp, dateKey, type, name, calories: Number(calories), protein: Number(protein), items, source });
  saveState();
  if (dateKey === selectedDateKey) updateToday();
}

function addActivity(name, calories, dateKey = selectedDateKey, source = '') {
  const timestamp = timestampForDateKey(dateKey);
  state.activities.push({ id: makeId(), timestamp, dateKey, name, calories: Number(calories), source: String(source || '').trim() });
  saveState();
  if (dateKey === selectedDateKey) updateToday();
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
  $('quick-add').addEventListener('click', () => { $('photo-date').value = selectedDateKey; $('manual-date').value = selectedDateKey; showView('photo'); });
  $('day-prev').addEventListener('click', () => shiftSelectedDate(-1));
  $('day-next').addEventListener('click', () => shiftSelectedDate(1));
  $('day-today').addEventListener('click', () => selectDate(localDateKey()));
  $('dashboard-date').addEventListener('change', () => selectDate($('dashboard-date').value));
}

function setupFirstRun() {
  if (!state.profile.setupDone) $('setup-dialog').showModal();
  $('setup-form').addEventListener('submit', event => {
    event.preventDefault();
    const height = Number($('setup-height').value);
    if (!height) return;
    state.profile.sex = $('setup-sex').value;
    state.profile.heightCm = height;
    state.profile.activityFactor = Number($('setup-activity').value);
    state.profile.setupDone = true;
    saveState();
    $('setup-dialog').close();
    updateToday();
    fillSettings();
  });
}

async function resizeImage(file, maxSide = 1280, quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

function setStatus(message, type = '') {
  const el = $('analysis-status');
  el.hidden = false;
  el.className = `notice ${type}`.trim();
  el.textContent = message;
}

function normalizeFoodName(value = '') {
  return String(value)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

function findLocalFoodReference(name) {
  const wanted = normalizeFoodName(name);
  if (!wanted) return null;

  // Priorité 1 : références personnelles saisies par l'utilisateur.
  const personal = (state.personalFoods || []).find(food => normalizedFoodNames(food).includes(wanted));
  if (personal) return { ...migratePersonalFood(personal), key: `personal:${personal.id}`, dbType: 'personal' };

  // Priorité 2 : petite base générale intégrée.
  for (const [key, food] of Object.entries(FOOD_DB)) {
    const candidates = [food.name, ...(FOOD_ALIASES[key] || [])].map(normalizeFoodName);
    if (candidates.includes(wanted)) return { ...food, key, dbType: 'general', referenceMode: 'per100g' };
  }
  return null;
}

function personalFoodById(id) {
  return (state.personalFoods || []).find(food => food.id === id) || null;
}

function manualFoodReference(selectKey) {
  if (!selectKey || selectKey === 'custom') return null;
  if (selectKey.startsWith('personal:')) {
    const food = personalFoodById(selectKey.slice('personal:'.length));
    return food ? { ...migratePersonalFood(food), key: selectKey, dbType: 'personal' } : null;
  }
  const food = FOOD_DB[selectKey];
  return food ? { ...food, key: selectKey, dbType: 'general', referenceMode: 'per100g' } : null;
}

function pluralizeUnit(unitName, quantity) {
  const unit = String(unitName || 'unité').trim() || 'unité';
  if (Number(quantity) <= 1 || unit.endsWith('s')) return unit;
  if (unit === 'œuf') return 'œufs';
  if (unit === 'verre') return 'verres';
  if (unit === 'part') return 'parts';
  if (unit === 'pot') return 'pots';
  if (unit === 'tranche') return 'tranches';
  if (unit === 'cuillère à soupe') return 'cuillères à soupe';
  if (unit === 'cuillère à café') return 'cuillères à café';
  return `${unit}s`;
}

function foodReferenceQuantityMeta(food) {
  if (!food) return { mode: 'grams', unitName: 'g' };
  const referenceMode = food.referenceMode === 'perUnit' ? 'perUnit' : 'per100g';
  let unitName = String(food.unitName || '').trim();
  let unitWeightG = Number(food.unitWeightG || 0) || null;
  // Une référence personnelle déjà saisie en /100 g peut réutiliser l'unité moyenne
  // de la base générale (ex. Œuf, Banane, Pomme) sans perdre ses propres kcal/protéines.
  if (referenceMode === 'per100g' && (!unitName || !unitWeightG) && (food.dbType === 'personal' || food.id)) {
    const fallback = Object.values(FOOD_DB).find(item => normalizeFoodName(item.name) === normalizeFoodName(food.name));
    if (fallback?.unitName && fallback?.unitWeightG) {
      unitName = unitName || fallback.unitName;
      unitWeightG = unitWeightG || Number(fallback.unitWeightG);
    }
  }
  if (referenceMode === 'perUnit' && unitName) {
    return {
      mode: 'unit', unitName, unitWeightG,
      unitKcal: Math.max(0, Number(food.unitKcal || 0)),
      unitProtein: Math.max(0, Number(food.unitProtein || 0))
    };
  }
  if (unitName && unitWeightG && Number.isFinite(Number(food.kcal100)) && Number.isFinite(Number(food.protein100))) {
    return {
      mode: 'unit', unitName, unitWeightG,
      unitKcal: Math.max(0, Number(food.kcal100 || 0)) * unitWeightG / 100,
      unitProtein: Math.max(0, Number(food.protein100 || 0)) * unitWeightG / 100
    };
  }
  return {
    mode: 'grams', unitName: 'g',
    kcal100: Math.max(0, Number(food.kcal100 || 0)),
    protein100: Math.max(0, Number(food.protein100 || 0))
  };
}

function personalFoodMeta(food) {
  const migrated = migratePersonalFood(food);
  const parts = [];
  const meta = foodReferenceQuantityMeta(migrated);
  if (migrated.referenceMode === 'perUnit') {
    parts.push(`1 ${meta.unitName} = ${round(meta.unitKcal, 1)} kcal · ${round(meta.unitProtein, 1)} g prot.`);
    if (meta.unitWeightG) parts.push(`≈ ${round(meta.unitWeightG, 1)} g`);
    return parts.join(' · ');
  }
  parts.push(`${round(Number(migrated.kcal100 || 0), 1)} kcal · ${round(Number(migrated.protein100 || 0), 1)} g prot. / 100 g`);
  if (meta.mode === 'unit') parts.push(`1 ${meta.unitName} ≈ ${round(meta.unitWeightG, 1)} g`);
  const packageWeightG = Number(migrated.packageWeightG || 0);
  const units = Number(migrated.units || 0);
  if (packageWeightG > 0 && units > 0) parts.push(`${round(packageWeightG, 1)} g / ${round(units, 1)} unités`);
  return parts.join(' · ');
}

function niceUnitQuantity(raw) {
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  return Math.max(0.5, Math.round(raw * 2) / 2);
}

function foodReferenceByKey(key) {
  if (!key) return null;
  if (key.startsWith('personal:')) return manualFoodReference(key);
  if (key.startsWith('general:')) return manualFoodReference(key.slice('general:'.length));
  return null;
}

function needsQuantityConfirmation(name = '') {
  return /(huile|sauce|beurre|mayonnaise|vinaigrette|assaisonnement|crème|creme|matière grasse|matiere grasse|fromage)/i.test(name);
}

function prepareAnalysis(analysis) {
  const items = (Array.isArray(analysis.items) ? analysis.items : []).map(item => {
    const grams = Math.max(1, Number(item.estimated_grams || 1));
    const calories = Math.max(0, Number(item.calories || 0));
    const protein = Math.max(0, Number(item.protein_g || 0));
    const name = String(item.name || 'Aliment');
    return {
      name,
      photoName: name,
      estimated_grams: grams,
      photoEstimatedGrams: grams,
      quantityMode: 'grams',
      quantity: grams,
      quantityUnit: 'g',
      calories,
      protein_g: protein,
      kcalPerGram: calories / grams,
      proteinPerGram: protein / grams,
      photoKcalPerGram: calories / grams,
      photoProteinPerGram: protein / grams,
      kcalPerUnit: null,
      proteinPerUnit: null,
      unitWeightG: null,
      referenceKey: 'photo',
      customNameMode: false,
      nutritionSource: 'photo-ai',
      nutritionStatus: '',
      nutritionNote: '',
      nutritionError: false,
      nutritionRequestId: 0
    };
  });
  return { ...analysis, items, total_calories: items.reduce((sum, item) => sum + item.calories, 0), total_protein_g: items.reduce((sum, item) => sum + item.protein_g, 0) };
}

function sourceForReference(ref) {
  return ref?.dbType === 'personal' ? 'personal-db' : 'local-db';
}

function referenceDisplayNote(ref) {
  if (!ref) return '';
  if (ref.dbType === 'personal') return `Ma base : ${personalFoodMeta(ref)}.`;
  const meta = foodReferenceQuantityMeta(ref);
  if (meta.mode === 'unit') return `Base générale : 1 ${meta.unitName} ≈ ${round(meta.unitWeightG, 1)} g · ${round(meta.unitKcal, 1)} kcal · ${round(meta.unitProtein, 1)} g prot.`;
  return `Base générale : ${round(ref.kcal100, 1)} kcal et ${round(ref.protein100, 1)} g protéines / 100 g.`;
}

function applyFoodReference(index, ref, { preserveGrams = true } = {}) {
  if (!currentAnalysis?.items?.[index] || !ref) return;
  const item = currentAnalysis.items[index];
  const previousGrams = Math.max(1, Number(item.estimated_grams || item.photoEstimatedGrams || 1));
  const previousQuantity = Number(item.quantity || 0);
  const previousMode = item.quantityMode;
  const previousReferenceKey = item.referenceKey;
  const meta = foodReferenceQuantityMeta(ref);
  item.name = ref.name;
  item.referenceKey = ref.dbType === 'personal' ? `personal:${ref.id}` : `general:${ref.key}`;
  item.customNameMode = false;
  item.nutritionSource = sourceForReference(ref);
  item.nutritionStatus = ref.dbType === 'personal' ? 'Référence personnelle appliquée.' : 'Référence générale appliquée.';
  item.nutritionNote = referenceDisplayNote(ref);
  item.nutritionError = false;

  if (meta.mode === 'unit') {
    item.quantityMode = 'unit';
    item.quantityUnit = meta.unitName;
    item.unitWeightG = meta.unitWeightG || null;
    item.kcalPerUnit = Number(meta.unitKcal || 0);
    item.proteinPerUnit = Number(meta.unitProtein || 0);
    let quantity = 1;
    const nextReferenceKey = ref.dbType === 'personal' ? `personal:${ref.id}` : `general:${ref.key}`;
    if (previousMode === 'unit' && previousQuantity > 0 && previousReferenceKey === nextReferenceKey) quantity = previousQuantity;
    else if (preserveGrams && meta.unitWeightG) quantity = niceUnitQuantity(previousGrams / meta.unitWeightG);
    item.quantity = quantity;
    item.estimated_grams = meta.unitWeightG ? quantity * meta.unitWeightG : previousGrams;
    item.calories = item.kcalPerUnit * quantity;
    item.protein_g = item.proteinPerUnit * quantity;
    item.kcalPerGram = meta.unitWeightG ? item.kcalPerUnit / meta.unitWeightG : 0;
    item.proteinPerGram = meta.unitWeightG ? item.proteinPerUnit / meta.unitWeightG : 0;
  } else {
    const grams = preserveGrams ? previousGrams : Math.max(1, previousQuantity || 100);
    item.quantityMode = 'grams';
    item.quantityUnit = 'g';
    item.quantity = grams;
    item.estimated_grams = grams;
    item.unitWeightG = null;
    item.kcalPerUnit = null;
    item.proteinPerUnit = null;
    item.kcalPerGram = Number(meta.kcal100 || 0) / 100;
    item.proteinPerGram = Number(meta.protein100 || 0) / 100;
    item.calories = item.kcalPerGram * grams;
    item.protein_g = item.proteinPerGram * grams;
  }
}

function applyKnownNutritionReferences() {
  if (!currentAnalysis?.items) return;
  currentAnalysis.items.forEach((item, index) => {
    const local = findLocalFoodReference(item.name);
    if (local) applyFoodReference(index, local, { preserveGrams: true });
  });
}

function recalcAnalysisTotals() {
  if (!currentAnalysis) return;
  currentAnalysis.total_calories = currentAnalysis.items.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  currentAnalysis.total_protein_g = currentAnalysis.items.reduce((sum, item) => sum + Number(item.protein_g || 0), 0);
  $('analysis-calories').textContent = Math.round(currentAnalysis.total_calories);
  $('analysis-protein').textContent = round(currentAnalysis.total_protein_g, 1);
  const pending = currentAnalysis.items.some(item => item.nutritionStatus === 'loading');
  const invalid = currentAnalysis.items.some(item => item.nutritionError);
  $('save-analysis').disabled = pending || invalid || !currentAnalysis.items.length;
}

function applyTextNutritionReference(index, kcal100, protein100, note = '') {
  if (!currentAnalysis?.items?.[index]) return;
  const item = currentAnalysis.items[index];
  const grams = Math.max(1, Number(item.estimated_grams || item.photoEstimatedGrams || 100));
  item.quantityMode = 'grams';
  item.quantityUnit = 'g';
  item.quantity = grams;
  item.estimated_grams = grams;
  item.kcalPerGram = Math.max(0, Number(kcal100 || 0)) / 100;
  item.proteinPerGram = Math.max(0, Number(protein100 || 0)) / 100;
  item.kcalPerUnit = null;
  item.proteinPerUnit = null;
  item.unitWeightG = null;
  item.calories = item.kcalPerGram * grams;
  item.protein_g = item.proteinPerGram * grams;
  item.referenceKey = 'text-ai';
  item.customNameMode = true;
  item.nutritionSource = 'text-ai';
  item.nutritionStatus = 'Recalculé pour le nouvel aliment.';
  item.nutritionNote = String(note || 'Valeurs moyennes estimées pour 100 g.');
  item.nutritionError = false;
}

function applyPhotoReference(index) {
  if (!currentAnalysis?.items?.[index]) return;
  const item = currentAnalysis.items[index];
  item.name = item.photoName || item.name;
  item.referenceKey = 'photo';
  item.customNameMode = false;
  item.quantityMode = 'grams';
  item.quantityUnit = 'g';
  item.quantity = Math.max(1, Number(item.photoEstimatedGrams || 1));
  item.estimated_grams = item.quantity;
  item.kcalPerGram = Number(item.photoKcalPerGram || 0);
  item.proteinPerGram = Number(item.photoProteinPerGram || 0);
  item.kcalPerUnit = null;
  item.proteinPerUnit = null;
  item.unitWeightG = null;
  item.calories = item.kcalPerGram * item.quantity;
  item.protein_g = item.proteinPerGram * item.quantity;
  item.nutritionSource = 'photo-ai';
  item.nutritionStatus = '';
  item.nutritionNote = '';
  item.nutritionError = false;
}

async function recalculateNutritionForName(index) {
  if (!currentAnalysis?.items?.[index]) return;
  const item = currentAnalysis.items[index];
  const foodName = String(item.name || '').trim();
  if (!foodName) return;
  const requestId = Number(item.nutritionRequestId || 0) + 1;
  item.nutritionRequestId = requestId;

  const local = findLocalFoodReference(foodName);
  if (local) {
    applyFoodReference(index, local, { preserveGrams: true });
    renderAnalysisEditor();
    return;
  }

  item.nutritionStatus = 'loading';
  item.nutritionNote = '';
  item.nutritionError = false;
  renderAnalysisEditor();

  const configured = state.profile.apiUrl?.trim();
  const endpoint = configured || '/api/analyze';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName })
    });
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) throw new Error(data.error || `Erreur ${response.status}`);
    if (!currentAnalysis?.items?.[index] || currentAnalysis.items[index].nutritionRequestId !== requestId) return;
    applyTextNutritionReference(index, data.kcal_per_100g, data.protein_per_100g, data.notes || 'Valeurs moyennes estimées pour 100 g.');
  } catch (error) {
    if (!currentAnalysis?.items?.[index] || currentAnalysis.items[index].nutritionRequestId !== requestId) return;
    const current = currentAnalysis.items[index];
    current.nutritionStatus = 'error';
    current.nutritionError = true;
    current.nutritionNote = `Recalcul impossible : ${error.message}. Corrigez le nom ou appuyez sur « Recalculer ».`;
  }
  renderAnalysisEditor();
}

function updateAnalysisItemQuantity(index, quantity, rerender = false) {
  if (!currentAnalysis?.items?.[index]) return;
  const item = currentAnalysis.items[index];
  const min = item.quantityMode === 'unit' ? 0.5 : 1;
  const safeQuantity = Math.max(min, Number(quantity || min));
  item.quantity = safeQuantity;
  if (item.quantityMode === 'unit') {
    item.calories = Number(item.kcalPerUnit || 0) * safeQuantity;
    item.protein_g = Number(item.proteinPerUnit || 0) * safeQuantity;
    if (item.unitWeightG) item.estimated_grams = safeQuantity * Number(item.unitWeightG);
  } else {
    item.estimated_grams = safeQuantity;
    item.calories = Number(item.kcalPerGram || 0) * safeQuantity;
    item.protein_g = Number(item.proteinPerGram || 0) * safeQuantity;
  }
  if (rerender) renderAnalysisEditor();
  else refreshAnalysisRowNumbers(index);
}

function nutritionSourceLabel(item) {
  if (item.nutritionSource === 'personal-db') return '<span class="nutrition-chip personal">Ma base</span>';
  if (item.nutritionSource === 'local-db') return '<span class="nutrition-chip local">Base générale</span>';
  if (item.nutritionSource === 'text-ai') return '<span class="nutrition-chip">Luna · recalcul</span>';
  return '<span class="nutrition-chip ai">Luna · photo</span>';
}

function analysisFoodSelectHtml(item, index) {
  const currentKey = item.customNameMode || item.referenceKey === 'text-ai' ? '__custom__' : (item.referenceKey || 'photo');
  const personal = [...(state.personalFoods || [])].map(migratePersonalFood).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  const general = dedupedGeneralFoodEntries().sort((a, b) => a[1].name.localeCompare(b[1].name, 'fr'));
  const photoLabel = `Luna : ${item.photoName || item.name}`;
  let html = `<select class="analysis-food-select" data-analysis-food-select="${index}" aria-label="Aliment"><option value="photo" ${currentKey === 'photo' ? 'selected' : ''}>${escapeHtml(photoLabel)}</option>`;
  if (personal.length) {
    html += '<optgroup label="Ma base personnelle">';
    html += personal.map(food => `<option value="personal:${food.id}" ${currentKey === `personal:${food.id}` ? 'selected' : ''}>${escapeHtml(food.name)}</option>`).join('');
    html += '</optgroup>';
  }
  html += '<optgroup label="Base générale">';
  html += general.map(([key, food]) => `<option value="general:${key}" ${currentKey === `general:${key}` ? 'selected' : ''}>${escapeHtml(food.name)}</option>`).join('');
  html += '</optgroup>';
  html += `<option value="__custom__" ${currentKey === '__custom__' ? 'selected' : ''}>Autre aliment…</option></select>`;
  if (currentKey === '__custom__') html += `<input class="analysis-custom-name-input" data-analysis-custom-name="${index}" type="text" value="${escapeHtml(item.name)}" placeholder="Nom de l’aliment" aria-label="Nom personnalisé" />`;
  return html;
}

function quantityDisplayLabel(item) {
  return item.quantityMode === 'unit' ? pluralizeUnit(item.quantityUnit, item.quantity) : 'g';
}

function renderAnalysisEditor() {
  if (!currentAnalysis) return;
  const rows = (currentAnalysis.items || []).map((item, index) => `
    <div class="analysis-table-row" data-analysis-index="${index}">
      <div class="analysis-cell analysis-food-cell" data-label="Aliment">
        <div class="analysis-food-control">${analysisFoodSelectHtml(item, index)}</div>
      </div>
      <div class="analysis-cell analysis-weight-cell" data-label="Quantité">
        <div class="table-quantity-input"><input aria-label="Quantité" data-analysis-quantity="${index}" type="number" inputmode="decimal" min="${item.quantityMode === 'unit' ? '0.5' : '1'}" step="${item.quantityMode === 'unit' ? '0.5' : '1'}" value="${round(item.quantity, item.quantityMode === 'unit' ? 1 : 0)}" /><span data-analysis-unit="${index}">${escapeHtml(quantityDisplayLabel(item))}</span></div>
      </div>
      <div class="analysis-cell analysis-value-cell" data-label="kcal"><strong data-analysis-kcal="${index}">${Math.round(item.calories)}</strong><span>kcal</span></div>
      <div class="analysis-cell analysis-value-cell" data-label="Protéines"><strong data-analysis-protein="${index}">${round(item.protein_g, 1)}</strong><span>g</span></div>
      <div class="analysis-row-tools">
        <div class="analysis-flags">
          ${nutritionSourceLabel(item)}
          ${needsQuantityConfirmation(item.name) ? '<span class="confirm-chip">Quantité à confirmer</span>' : ''}
        </div>
        ${item.nutritionStatus === 'loading' ? '<div class="nutrition-message loading">Recalcul des calories et protéines…</div>' : ''}
        ${item.nutritionNote ? `<div class="nutrition-message ${item.nutritionError ? 'error' : ''}">${escapeHtml(item.nutritionNote)}</div>` : ''}
        <div class="analysis-row-actions">
          <button type="button" class="recalc-nutrition" data-recalc-nutrition="${index}" ${item.nutritionStatus === 'loading' ? 'disabled' : ''}>↻ Recalculer</button>
          <button type="button" class="remove-analysis-item" data-remove-analysis="${index}">Retirer</button>
        </div>
      </div>
    </div>`).join('');

  $('analysis-items').innerHTML = `
    <div class="analysis-table" role="table" aria-label="Ingrédients estimés">
      <div class="analysis-table-header" role="row">
        <div role="columnheader">Aliment</div>
        <div role="columnheader">Quantité</div>
        <div role="columnheader">kcal</div>
        <div role="columnheader">Protéines</div>
      </div>
      ${rows || '<div class="empty-state">Aucun ingrédient.</div>'}
    </div>`;
  recalcAnalysisTotals();
}

function refreshAnalysisRowNumbers(index) {
  if (!currentAnalysis?.items?.[index]) return;
  const item = currentAnalysis.items[index];
  const kcal = document.querySelector(`[data-analysis-kcal="${index}"]`);
  const protein = document.querySelector(`[data-analysis-protein="${index}"]`);
  const unit = document.querySelector(`[data-analysis-unit="${index}"]`);
  if (kcal) kcal.textContent = Math.round(item.calories);
  if (protein) protein.textContent = round(item.protein_g, 1);
  if (unit) unit.textContent = quantityDisplayLabel(item);
  recalcAnalysisTotals();
}

function setupPhoto() {
  const handlePhotoSelection = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      selectedImageData = await resizeImage(file);
      $('photo-preview').src = selectedImageData;
      $('photo-preview').hidden = false;
      $('photo-placeholder').hidden = true;
      $('analyze-photo').disabled = false;
      $('analysis-panel').hidden = true;
      $('analysis-status').hidden = true;
    } catch {
      setStatus('Impossible de lire cette image. Essayez une autre photo.', 'error');
    } finally { event.target.value = ''; }
  };

  $('camera-input').addEventListener('change', handlePhotoSelection);
  $('gallery-input').addEventListener('change', handlePhotoSelection);
  $('analyze-photo').addEventListener('click', analyzePhoto);

  $('analysis-items').addEventListener('click', event => {
    const recalc = event.target.closest('[data-recalc-nutrition]');
    if (recalc) {
      recalculateNutritionForName(Number(recalc.dataset.recalcNutrition));
      return;
    }
    const remove = event.target.closest('[data-remove-analysis]');
    if (remove && currentAnalysis) {
      currentAnalysis.items.splice(Number(remove.dataset.removeAnalysis), 1);
      renderAnalysisEditor();
    }
  });

  $('analysis-items').addEventListener('input', event => {
    const quantityInput = event.target.closest('[data-analysis-quantity]');
    if (quantityInput) updateAnalysisItemQuantity(Number(quantityInput.dataset.analysisQuantity), Number(quantityInput.value));
  });

  $('analysis-items').addEventListener('change', event => {
    const quantityInput = event.target.closest('[data-analysis-quantity]');
    if (quantityInput) return updateAnalysisItemQuantity(Number(quantityInput.dataset.analysisQuantity), Number(quantityInput.value));

    const foodSelect = event.target.closest('[data-analysis-food-select]');
    if (foodSelect && currentAnalysis?.items?.[Number(foodSelect.dataset.analysisFoodSelect)]) {
      const index = Number(foodSelect.dataset.analysisFoodSelect);
      const value = foodSelect.value;
      const item = currentAnalysis.items[index];
      if (value === 'photo') {
        applyPhotoReference(index);
        renderAnalysisEditor();
        return;
      }
      if (value === '__custom__') {
        item.customNameMode = true;
        item.referenceKey = 'text-ai';
        item.name = item.name || item.photoName || '';
        renderAnalysisEditor();
        setTimeout(() => document.querySelector(`[data-analysis-custom-name="${index}"]`)?.focus(), 0);
        return;
      }
      const ref = foodReferenceByKey(value);
      if (ref) {
        applyFoodReference(index, ref, { preserveGrams: true });
        renderAnalysisEditor();
      }
      return;
    }

    const customName = event.target.closest('[data-analysis-custom-name]');
    if (customName && currentAnalysis?.items?.[Number(customName.dataset.analysisCustomName)]) {
      const index = Number(customName.dataset.analysisCustomName);
      const item = currentAnalysis.items[index];
      item.name = customName.value.trim() || item.photoName || 'Aliment';
      recalculateNutritionForName(index);
    }
  });

  $('save-analysis').addEventListener('click', () => {
    if (!currentAnalysis || !currentAnalysis.items?.length) return;
    recalcAnalysisTotals();
    const dateKey = $('photo-date').value || selectedDateKey;
    addMeal({
      type: $('analysis-meal-type').value,
      name: currentAnalysis.items.map(item => item.name).slice(0, 3).join(', ') || 'Repas analysé',
      calories: currentAnalysis.total_calories,
      protein: currentAnalysis.total_protein_g,
      items: currentAnalysis.items.map(({ kcalPerGram, proteinPerGram, kcalPerUnit, proteinPerUnit, nutritionStatus, nutritionError, nutritionRequestId, photoKcalPerGram, photoProteinPerGram, ...item }) => item),
      source: 'photo-ai',
      dateKey
    });
    currentAnalysis = null;
    $('analysis-panel').hidden = true;
    selectedDateKey = dateKey;
    setStatus(`Repas ajouté au ${formatShortDateKey(dateKey)}.`, 'success');
    showView('today');
  });
}

async function analyzePhoto() {
  if (!selectedImageData) return;
  const configured = state.profile.apiUrl?.trim();
  const endpoint = configured || '/api/analyze';
  $('analyze-photo').disabled = true;
  $('analysis-panel').hidden = true;
  setStatus('Analyse de la photo en cours…');
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageData: selectedImageData }) });
    if (!response.ok) {
      let msg = '';
      try { msg = (await response.json()).error || ''; } catch {}
      if (response.status === 404) throw new Error('API_NOT_CONFIGURED');
      throw new Error(msg || `Erreur ${response.status}`);
    }
    const analysis = await response.json();
    currentAnalysis = prepareAnalysis(analysis);
    // Dès la reconnaissance, utiliser d'abord les références connues. Ainsi,
    // une simple correction de poids recalcule avec la base personnelle/générale.
    applyKnownNutritionReferences();
    renderAnalysisEditor();
    $('analysis-confidence').textContent = analysis.confidence ? `Confiance ${analysis.confidence}` : 'Estimation';
    $('analysis-note').textContent = analysis.notes || 'Estimation visuelle : corrigez les quantités si nécessaire.';
    $('analysis-status').hidden = true;
    $('analysis-panel').hidden = false;
  } catch (error) {
    if (String(error.message).includes('API_NOT_CONFIGURED') || (!configured && location.hostname.includes('github.io'))) setStatus("L'analyse IA n'est pas reliée sur cette adresse. Vous pouvez utiliser l'ajout manuel.", 'info');
    else setStatus(`Analyse impossible : ${error.message}. Vous pouvez utiliser l'ajout manuel.`, 'error');
  } finally { $('analyze-photo').disabled = false; }
}

function populateFoodNameSuggestions() {
  const list = $('food-name-suggestions');
  if (!list) return;
  const names = [
    ...(state.personalFoods || []).map(food => food.name),
    ...dedupedGeneralFoodEntries().map(([, food]) => food.name)
  ];
  const unique = [...new Set(names.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
  list.innerHTML = unique.map(name => `<option value="${escapeHtml(name)}"></option>`).join('');
}

function populateManualFoodSelect(preferred = '') {
  populateFoodNameSuggestions();
  const select = $('manual-food');
  if (!select) return;
  const previous = preferred || select.value;
  select.innerHTML = '<option value="">Choisir un aliment…</option>';

  const personalFoods = [...(state.personalFoods || [])].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  if (personalFoods.length) {
    const group = document.createElement('optgroup');
    group.label = 'Ma base personnelle';
    personalFoods.forEach(food => {
      const option = document.createElement('option');
      option.value = `personal:${food.id}`;
      option.textContent = food.name;
      group.appendChild(option);
    });
    select.appendChild(group);
  }

  const general = document.createElement('optgroup');
  general.label = 'Base générale';
  dedupedGeneralFoodEntries().sort((a, b) => a[1].name.localeCompare(b[1].name, 'fr')).forEach(([key, food]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = food.name;
    general.appendChild(option);
  });
  select.appendChild(general);

  const custom = document.createElement('option');
  custom.value = 'custom';
  custom.textContent = 'Autre aliment…';
  select.appendChild(custom);
  if ([...select.options].some(o => o.value === previous)) select.value = previous;
}

function setupManualEntry() {
  let lastFoodKey = '';
  const updateManualFields = () => {
    const key = $('manual-food').value;
    const isCustom = key === 'custom';
    $('manual-custom-wrap').hidden = !isCustom;
    if (!key || isCustom) {
      $('manual-quantity-label').textContent = 'Quantité';
      $('manual-quantity').disabled = isCustom;
      if (isCustom) {
        $('manual-quantity').value = '';
        $('manual-reference').textContent = 'Pour un aliment personnalisé, saisissez directement les calories et protéines estimées.';
        $('manual-calories').value = '';
        $('manual-protein').value = '';
      } else {
        $('manual-reference').textContent = '';
        $('manual-quantity').disabled = false;
      }
      lastFoodKey = key;
      return;
    }

    const food = manualFoodReference(key);
    if (!food) return;
    const meta = foodReferenceQuantityMeta(food);
    $('manual-quantity').disabled = false;
    if (key !== lastFoodKey || !$('manual-quantity').value) {
      $('manual-quantity').value = meta.mode === 'unit' ? 1 : 100;
    }
    $('manual-quantity').min = meta.mode === 'unit' ? '0.5' : '1';
    $('manual-quantity').step = meta.mode === 'unit' ? '0.5' : '1';
    $('manual-quantity-label').textContent = meta.mode === 'unit' ? `Quantité (${pluralizeUnit(meta.unitName, 2)})` : 'Quantité (g)';
    const quantity = Math.max(meta.mode === 'unit' ? 0.5 : 1, Number($('manual-quantity').value || (meta.mode === 'unit' ? 1 : 100)));
    if (meta.mode === 'unit') {
      $('manual-calories').value = Math.round(Number(meta.unitKcal || 0) * quantity);
      $('manual-protein').value = round(Number(meta.unitProtein || 0) * quantity, 1);
    } else {
      $('manual-calories').value = Math.round(Number(meta.kcal100 || 0) * quantity / 100);
      $('manual-protein').value = round(Number(meta.protein100 || 0) * quantity / 100, 1);
    }
    const personal = key.startsWith('personal:');
    $('manual-reference').textContent = personal ? `Ma base : ${personalFoodMeta(food)}.` : (meta.mode === 'unit' ? `Base générale : 1 ${meta.unitName} ≈ ${round(meta.unitWeightG, 1)} g · ${round(meta.unitKcal, 1)} kcal · ${round(meta.unitProtein, 1)} g prot.` : `Base générale : ${food.kcal100} kcal et ${food.protein100} g protéines / 100 g.`);
    lastFoodKey = key;
  };

  populateManualFoodSelect();
  $('manual-food').addEventListener('change', updateManualFields);
  $('manual-quantity').addEventListener('input', () => {
    const key = $('manual-food').value;
    if (key && key !== 'custom') updateManualFields();
  });
  $('save-manual').addEventListener('click', () => {
    const key = $('manual-food').value;
    if (!key) return alert('Choisissez un aliment dans le menu.');
    const food = manualFoodReference(key);
    const name = key === 'custom' ? $('manual-name').value.trim() : food?.name;
    if (!name) return alert('Indiquez le nom de l’aliment.');
    const calories = Number($('manual-calories').value);
    const protein = Number($('manual-protein').value || 0);
    const dateKey = $('manual-date').value || selectedDateKey;
    if (!Number.isFinite(calories) || calories < 0) return alert('Indiquez les calories à ajouter.');

    let items = [];
    if (food && key !== 'custom') {
      const meta = foodReferenceQuantityMeta(food);
      const quantity = Number($('manual-quantity').value || (meta.mode === 'unit' ? 1 : 100));
      items = [{
        name,
        quantity,
        quantityMode: meta.mode,
        quantityUnit: meta.mode === 'unit' ? meta.unitName : 'g',
        estimated_grams: meta.mode === 'unit' && meta.unitWeightG ? quantity * meta.unitWeightG : (meta.mode === 'grams' ? quantity : null),
        calories,
        protein_g: protein,
        nutritionSource: key.startsWith('personal:') ? 'personal-db' : 'local-db'
      }];
    }

    addMeal({ type: $('manual-type').value, name, calories, protein, items, source: key.startsWith('personal:') ? 'manual-personal-db' : 'manual', dateKey });
    $('manual-food').value = '';
    $('manual-name').value = '';
    $('manual-quantity').value = '';
    $('manual-calories').value = '';
    $('manual-protein').value = '';
    $('manual-custom-wrap').hidden = true;
    $('manual-reference').textContent = '';
    lastFoodKey = '';
    selectedDateKey = dateKey;
    showView('today');
  });
}

function activitySourceMap() {
  if (!state.profile.activitySources || typeof state.profile.activitySources !== 'object') {
    state.profile.activitySources = { ...DEFAULT_ACTIVITY_SOURCES };
  }
  return state.profile.activitySources;
}

function allKnownActivitySources() {
  const configured = Object.values(activitySourceMap()).map(v => String(v || '').trim()).filter(Boolean);
  const historic = state.activities.map(a => String(a.source || '').trim()).filter(Boolean);
  return [...new Set([...configured, ...historic])].sort((a, b) => a.localeCompare(b, 'fr'));
}

function populateActivitySourceSelect(activityName, preferredSource = '') {
  const select = $('activity-source');
  if (!select) return;
  const mapping = activitySourceMap();
  const defaultSource = String(mapping[activityName] || '').trim();
  const sources = allKnownActivitySources();
  select.innerHTML = '';
  const none = document.createElement('option');
  none.value = '';
  none.textContent = 'Source non précisée';
  select.appendChild(none);
  sources.forEach(source => {
    const opt = document.createElement('option');
    opt.value = source;
    opt.textContent = source;
    select.appendChild(opt);
  });
  const other = document.createElement('option');
  other.value = '__other__';
  other.textContent = 'Autre…';
  select.appendChild(other);
  const wanted = preferredSource || defaultSource;
  if (wanted && !sources.includes(wanted)) {
    const opt = document.createElement('option');
    opt.value = wanted;
    opt.textContent = wanted;
    select.insertBefore(opt, other);
  }
  select.value = wanted || '';
  $('activity-source-custom-wrap').hidden = select.value !== '__other__';
}

function currentActivityName() {
  const type = $('activity-type').value;
  return type === 'Autre' ? $('activity-custom-name').value.trim() : type;
}

function setupActivity() {
  const syncActivitySource = () => {
    $('activity-custom-wrap').hidden = $('activity-type').value !== 'Autre';
    const name = currentActivityName();
    populateActivitySourceSelect(name);
  };

  $('activity-type').addEventListener('change', syncActivitySource);
  $('activity-custom-name').addEventListener('input', () => {
    if ($('activity-type').value === 'Autre') populateActivitySourceSelect($('activity-custom-name').value.trim());
  });
  $('activity-source').addEventListener('change', () => {
    $('activity-source-custom-wrap').hidden = $('activity-source').value !== '__other__';
    if ($('activity-source').value !== '__other__') $('activity-source-custom').value = '';
  });

  populateActivitySourceSelect('Vélo');

  $('save-activity').addEventListener('click', () => {
    const type = $('activity-type').value;
    const custom = $('activity-custom-name').value.trim();
    const name = type === 'Autre' ? custom : type;
    const calories = Number($('activity-calories').value);
    const sourceChoice = $('activity-source').value;
    const source = sourceChoice === '__other__' ? $('activity-source-custom').value.trim() : sourceChoice;
    const dateKey = $('activity-date').value || selectedDateKey;
    if (!name) return alert('Indiquez le nom de l’activité.');
    if (!Number.isFinite(calories) || calories <= 0) return alert('Indiquez les calories dépensées.');
    if (sourceChoice === '__other__' && !source) return alert('Indiquez le nom de la source.');
    addActivity(name, calories, dateKey, source);
    $('activity-calories').value = '';
    $('activity-custom-name').value = '';
    $('activity-source-custom').value = '';
    $('activity-type').value = 'Vélo';
    $('activity-custom-wrap').hidden = true;
    $('activity-source-custom-wrap').hidden = true;
    populateActivitySourceSelect('Vélo');
    selectedDateKey = dateKey;
    updateToday();
  });
}

function refreshCurrentWeightFromLog() {
  if (!state.weights.length) {
    state.profile.currentWeightKg = Number(state.profile.startWeightKg || 74);
    return;
  }
  const latest = [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  state.profile.currentWeightKg = Number(latest.kg);
}

function timestampWithDateKey(existingTimestamp, dateKey) {
  const base = dateFromKey(dateKey);
  const previous = existingTimestamp ? new Date(existingTimestamp) : new Date();
  base.setHours(previous.getHours(), previous.getMinutes(), previous.getSeconds(), previous.getMilliseconds());
  return base.toISOString();
}

function openMealEditor(mealId) {
  const meal = state.meals.find(m => m.id === mealId);
  if (!meal) return;
  editingMealId = mealId;
  $('meal-edit-name').textContent = meal.name || 'Repas';
  $('meal-edit-type').value = meal.type || 'Autre';
  $('meal-edit-date').value = meal.dateKey || localDateKey(new Date(meal.timestamp));
  $('meal-edit-date').max = localDateKey();
  $('meal-edit-dialog').showModal();
}

function saveMealEditor() {
  const meal = state.meals.find(m => m.id === editingMealId);
  if (!meal) { $('meal-edit-dialog').close(); editingMealId = null; return; }
  const newType = $('meal-edit-type').value;
  const newDateKey = $('meal-edit-date').value || meal.dateKey || selectedDateKey;
  if (newDateKey > localDateKey()) return alert('La date du repas ne peut pas être dans le futur.');
  meal.type = newType;
  if (newDateKey !== meal.dateKey) {
    meal.dateKey = newDateKey;
    meal.timestamp = timestampWithDateKey(meal.timestamp, newDateKey);
  }
  saveState();
  $('meal-edit-dialog').close();
  editingMealId = null;
  updateToday();
  renderHistory();
}

function setupMealEditing() {
  $('meal-edit-cancel').addEventListener('click', () => { editingMealId = null; $('meal-edit-dialog').close(); });
  $('meal-edit-save').addEventListener('click', saveMealEditor);
  $('meal-edit-dialog').addEventListener('cancel', () => { editingMealId = null; });
}

function updatePersonalFoodFormMode() {
  const mode = $('personal-food-reference-mode').value || 'per100g';
  $('personal-food-per100-fields').hidden = mode !== 'per100g';
  $('personal-food-perunit-fields').hidden = mode !== 'perUnit';
  const unitRequired = mode === 'perUnit';
  $('personal-food-unit-name').placeholder = unitRequired ? 'Ex. œuf, Kiri, pot, c. à soupe, part' : 'Facultatif : ex. tranche, pot…';
  updatePersonalFoodPackageHelper();
}

function updatePersonalFoodPackageHelper() {
  const packageWeightG = Number(String($('personal-food-package-weight')?.value || '').replace(',', '.')) || 0;
  const units = Number(String($('personal-food-units')?.value || '').replace(',', '.')) || 0;
  const result = $('personal-food-package-result');
  if (!result) return;
  if (packageWeightG > 0 && units > 0) {
    const weight = packageWeightG / units;
    result.textContent = `Poids moyen calculé : ${round(weight, 1)} g par unité. Il sera utilisé si le champ « poids moyen » est vide.`;
  } else result.textContent = '';
}

function clearPersonalFoodForm() {
  editingPersonalFoodId = null;
  ['personal-food-name', 'personal-food-kcal100', 'personal-food-protein100', 'personal-food-unit-name', 'personal-food-unit-weight', 'personal-food-unit-kcal', 'personal-food-unit-protein', 'personal-food-package-weight', 'personal-food-units'].forEach(id => { if ($(id)) $(id).value = ''; });
  $('personal-food-reference-mode').value = 'per100g';
  $('save-personal-food').textContent = 'Ajouter à ma base';
  $('cancel-personal-food-edit').hidden = true;
  $('personal-food-form-status').textContent = '';
  updatePersonalFoodFormMode();
}

function editPersonalFood(id) {
  const raw = personalFoodById(id);
  if (!raw) return;
  const food = migratePersonalFood(raw);
  editingPersonalFoodId = id;
  $('personal-food-name').value = food.name || '';
  $('personal-food-reference-mode').value = food.referenceMode || 'per100g';
  $('personal-food-kcal100').value = Number.isFinite(Number(food.kcal100)) ? round(food.kcal100, 2) : '';
  $('personal-food-protein100').value = Number.isFinite(Number(food.protein100)) ? round(food.protein100, 2) : '';
  $('personal-food-unit-name').value = food.unitName || '';
  $('personal-food-unit-weight').value = food.unitWeightG || '';
  $('personal-food-unit-kcal').value = food.referenceMode === 'perUnit' ? round(food.unitKcal || 0, 2) : '';
  $('personal-food-unit-protein').value = food.referenceMode === 'perUnit' ? round(food.unitProtein || 0, 2) : '';
  $('personal-food-package-weight').value = food.packageWeightG || '';
  $('personal-food-units').value = food.units || '';
  $('save-personal-food').textContent = 'Enregistrer la modification';
  $('cancel-personal-food-edit').hidden = false;
  $('personal-food-form-status').textContent = `Modification de « ${food.name} ».`;
  updatePersonalFoodFormMode();
  $('personal-food-name').focus();
}

function savePersonalFoodReference() {
  const name = $('personal-food-name').value.trim();
  const referenceMode = $('personal-food-reference-mode').value === 'perUnit' ? 'perUnit' : 'per100g';
  let kcal100 = Number(String($('personal-food-kcal100').value || '').replace(',', '.'));
  let protein100 = Number(String($('personal-food-protein100').value || '').replace(',', '.'));
  const unitName = $('personal-food-unit-name').value.trim();
  let unitWeightG = Number(String($('personal-food-unit-weight').value || '').replace(',', '.')) || null;
  const unitKcal = Number(String($('personal-food-unit-kcal').value || '').replace(',', '.'));
  const unitProtein = Number(String($('personal-food-unit-protein').value || '').replace(',', '.'));
  const packageWeightG = Number(String($('personal-food-package-weight').value || '').replace(',', '.')) || null;
  const units = Number(String($('personal-food-units').value || '').replace(',', '.')) || null;

  if (!name) return alert('Indiquez le nom du produit ou de l’aliment.');
  if (packageWeightG !== null && packageWeightG <= 0) return alert('Le poids du paquet doit être supérieur à 0.');
  if (units !== null && units <= 0) return alert('Le nombre d’unités doit être supérieur à 0.');
  if (!unitWeightG && packageWeightG && units) unitWeightG = packageWeightG / units;

  if (referenceMode === 'per100g') {
    if (!Number.isFinite(kcal100) || kcal100 < 0) return alert('Indiquez les kcal pour 100 g.');
    if (!Number.isFinite(protein100) || protein100 < 0) return alert('Indiquez les protéines pour 100 g.');
    if (unitWeightG && !unitName) return alert('Indiquez le nom de l’unité si vous renseignez un poids moyen par unité.');
  } else {
    if (!unitName) return alert('Indiquez le nom de l’unité ou de la portion (œuf, Kiri, pot, part…).');
    if (!Number.isFinite(unitKcal) || unitKcal < 0) return alert('Indiquez les kcal pour 1 unité / portion.');
    if (!Number.isFinite(unitProtein) || unitProtein < 0) return alert('Indiquez les protéines pour 1 unité / portion.');
    if (unitWeightG) {
      kcal100 = unitKcal / unitWeightG * 100;
      protein100 = unitProtein / unitWeightG * 100;
    } else {
      kcal100 = null;
      protein100 = null;
    }
  }

  state.personalFoods = Array.isArray(state.personalFoods) ? state.personalFoods : [];
  const duplicate = state.personalFoods.find(food => normalizeFoodName(food.name) === normalizeFoodName(name) && food.id !== editingPersonalFoodId);
  if (duplicate && !confirm(`Une référence « ${duplicate.name} » existe déjà. Ajouter quand même une nouvelle référence ?`)) return;

  const now = new Date().toISOString();
  const record = {
    name,
    referenceMode,
    kcal100: Number.isFinite(Number(kcal100)) ? Number(kcal100) : null,
    protein100: Number.isFinite(Number(protein100)) ? Number(protein100) : null,
    unitName,
    unitWeightG,
    unitKcal: referenceMode === 'perUnit' ? unitKcal : null,
    unitProtein: referenceMode === 'perUnit' ? unitProtein : null,
    packageWeightG,
    units,
    updatedAt: now,
    origin: 'label-user',
    aliases: editingPersonalFoodId ? (personalFoodById(editingPersonalFoodId)?.aliases || []) : []
  };
  if (editingPersonalFoodId) {
    const index = state.personalFoods.findIndex(food => food.id === editingPersonalFoodId);
    if (index >= 0) state.personalFoods[index] = { ...state.personalFoods[index], ...record };
  } else {
    state.personalFoods.push({ id: makeId(), ...record, createdAt: now });
  }
  saveState();
  clearPersonalFoodForm();
  renderLocalFoodDb();
  populateManualFoodSelect();
}

function deletePersonalFood(id) {
  const food = personalFoodById(id);
  if (!food) return;
  if (!confirm(`Supprimer « ${food.name} » de votre base personnelle ?\n\nLes repas déjà enregistrés ne seront pas modifiés.`)) return;
  state.personalFoods = state.personalFoods.filter(item => item.id !== id);
  saveState();
  if (editingPersonalFoodId === id) clearPersonalFoodForm();
  renderLocalFoodDb();
  populateManualFoodSelect();
}

function renderLocalFoodDb() {
  const personalEl = $('personal-food-list');
  if (personalEl) {
    const foods = [...(state.personalFoods || [])].map(migratePersonalFood).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    personalEl.innerHTML = foods.length ? foods.map(food => `
      <div class="personal-food-row">
        <div class="personal-food-main">
          <strong>${escapeHtml(food.name)}</strong>
          <span>${food.referenceMode === 'perUnit' ? `1 ${escapeHtml(food.unitName || 'unité')} = ${round(food.unitKcal || 0, 1)} kcal · ${round(food.unitProtein || 0, 1)} g prot.` : `${round(food.kcal100 || 0, 1)} kcal · ${round(food.protein100 || 0, 1)} g prot. / 100 g`}</span>
          ${personalFoodMeta(food) ? `<small>${escapeHtml(personalFoodMeta(food))}</small>` : ''}
        </div>
        <div class="personal-food-actions">
          <button type="button" data-edit-personal-food="${food.id}">Modifier</button>
          <button type="button" class="danger-link" data-delete-personal-food="${food.id}">Supprimer</button>
        </div>
      </div>`).join('') : '<div class="empty-state">Aucune référence personnelle. Ajoutez vos aliments en choisissant « pour 100 g » ou « par unité / portion ».</div>';
  }

  const el = $('food-db-list');
  if (!el) return;
  const foods = dedupedGeneralFoodEntries().map(([, food]) => food).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  el.innerHTML = `<div class="food-db-head"><span>Aliment</span><span>Référence</span><span>Protéines</span></div>` + foods.map(food => {
    const meta = foodReferenceQuantityMeta({ ...food, referenceMode: 'per100g' });
    const ref = meta.mode === 'unit' ? `1 ${meta.unitName} ≈ ${round(meta.unitWeightG, 0)} g` : `${round(food.kcal100, 1)} kcal/100 g`;
    const protein = meta.mode === 'unit' ? `${round(meta.unitProtein, 1)} g / ${meta.unitName}` : `${round(food.protein100, 1)} g/100 g`;
    return `<div class="food-db-row"><span>${escapeHtml(food.name)}</span><strong>${escapeHtml(ref)}</strong><strong>${escapeHtml(protein)}</strong></div>`;
  }).join('');
}

function setupPersonalFoodDb() {
  $('personal-food-reference-mode').addEventListener('change', updatePersonalFoodFormMode);
  ['personal-food-package-weight', 'personal-food-units'].forEach(id => $(id).addEventListener('input', updatePersonalFoodPackageHelper));
  $('save-personal-food').addEventListener('click', savePersonalFoodReference);
  $('cancel-personal-food-edit').addEventListener('click', clearPersonalFoodForm);
  $('personal-food-list').addEventListener('click', event => {
    const edit = event.target.closest('[data-edit-personal-food]');
    if (edit) return editPersonalFood(edit.dataset.editPersonalFood);
    const del = event.target.closest('[data-delete-personal-food]');
    if (del) return deletePersonalFood(del.dataset.deletePersonalFood);
  });
  updatePersonalFoodFormMode();
}

function deleteWholeDay(key) {
  if (!confirm(`Supprimer toutes les données du ${formatShortDateKey(key)} ?\n\nRepas, activités et pesées de cette date seront supprimés.`)) return;
  state.meals = state.meals.filter(m => m.dateKey !== key);
  state.activities = state.activities.filter(a => a.dateKey !== key);
  state.weights = state.weights.filter(w => (w.dateKey || localDateKey(new Date(w.date))) !== key);
  refreshCurrentWeightFromLog();
  saveState();
  updateToday();
  renderHistory();
  renderWeight();
  fillSettings();
}

function setupDeletion() {
  $('delete-day').addEventListener('click', () => deleteWholeDay(selectedDateKey));
  document.body.addEventListener('click', event => {
    const editMealId = event.target?.dataset?.editMeal;
    if (editMealId) { openMealEditor(editMealId); return; }
    const mealId = event.target?.dataset?.deleteMeal;
    if (mealId) {
      if (!confirm('Supprimer ce repas ?')) return;
      state.meals = state.meals.filter(m => m.id !== mealId);
      saveState(); updateToday(); renderHistory(); return;
    }
    const activityId = event.target?.dataset?.deleteActivity;
    if (activityId) {
      if (!confirm('Supprimer cette activité ?')) return;
      state.activities = state.activities.filter(a => a.id !== activityId);
      saveState(); updateToday(); renderHistory(); return;
    }
    const weightId = event.target?.dataset?.deleteWeight;
    if (weightId) {
      if (!confirm('Supprimer cette pesée ?')) return;
      state.weights = state.weights.filter(w => w.id !== weightId);
      refreshCurrentWeightFromLog();
      saveState(); renderWeight(); updateToday(); renderHistory(); fillSettings(); return;
    }
    const dayKey = event.target?.dataset?.deleteDay;
    if (dayKey) deleteWholeDay(dayKey);
  });
}

function renderHistory() {
  const targets = calculateTargets();
  const keys = [...new Set([
    ...state.meals.map(m => m.dateKey),
    ...state.activities.map(a => a.dateKey),
    ...state.weights.map(w => w.dateKey || localDateKey(new Date(w.date)))
  ])].sort().reverse();

  const last7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i); last7.push(energyTotalsForDate(localDateKey(d)));
  }
  const activeDays = last7.filter(t => t.calories > 0 || t.activity > 0);
  const avgFood = activeDays.length ? Math.round(activeDays.reduce((s, t) => s + t.calories, 0) / activeDays.length) : 0;
  const avgNet = activeDays.length ? Math.round(activeDays.reduce((s, t) => s + t.net, 0) / activeDays.length) : 0;
  const avgProtein = activeDays.length ? round(activeDays.reduce((s, t) => s + t.protein, 0) / activeDays.length, 1) : 0;
  $('history-summary').innerHTML = `
    <h3>7 derniers jours</h3>
    <div class="history-metrics">
      <div><span class="stat-label">Moy. alimentaire</span><strong>${avgFood || '—'}</strong> <span class="muted">kcal/j</span></div>
      <div><span class="stat-label">Moy. nette</span><strong>${avgNet || '—'}</strong> <span class="muted">kcal/j</span></div>
      <div><span class="stat-label">Moy. protéines</span><strong>${avgProtein || '—'}</strong> <span class="muted">g/j</span></div>
    </div>
    <p class="muted small">Calcul sur les jours comportant une entrée. Objectif actuel : ${targets.target || '—'} kcal nettes et ${targets.protein || '—'} g de protéines.</p>`;

  const recentActivities = [...state.activities].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 30);
  $('activity-history-list').innerHTML = recentActivities.length ? recentActivities.map(a => `
    <div class="activity-history-row">
      <div>
        <strong>${escapeHtml(a.name)}</strong>
        <span>${formatShortDateKey(a.dateKey)}${a.source ? ` · ${escapeHtml(a.source)}` : ' · source non précisée'}</span>
      </div>
      <strong>−${Math.round(a.calories)} kcal</strong>
    </div>`).join('') : '<div class="empty-state">Aucune activité enregistrée.</div>';

  if (!keys.length) { $('history-list').innerHTML = '<div class="empty-state">Aucun historique pour le moment.</div>'; return; }
  $('history-list').innerHTML = keys.map(key => {
    const meals = mealsForDate(key).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const activities = activitiesForDate(key).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const weights = weightsForDate(key).sort((a, b) => a.date.localeCompare(b.date));
    const total = energyTotalsForDate(key);
    return `<div class="history-day">
      <div class="history-day-header">
        <div><strong>${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(dateFromKey(key))}</strong><div class="history-total">${Math.round(total.calories)} − ${Math.round(total.activity)} = ${Math.round(total.net)} kcal net · ${round(total.protein, 1)} g prot.</div></div>
        <button class="button danger compact history-delete-day" data-delete-day="${key}">Supprimer la journée</button>
      </div>
      <div class="history-day-body">
        ${meals.map(m => `<div class="meal-item"><div><div class="meal-name">${escapeHtml(m.type)} · ${escapeHtml(m.name)}</div></div><div class="meal-nutrition">${Math.round(m.calories)} kcal<br><span class="muted">${round(m.protein, 1)} g prot.</span></div><div class="meal-actions"><button class="meal-edit" data-edit-meal="${m.id}">Modifier</button><button class="meal-delete" data-delete-meal="${m.id}">Supprimer</button></div></div>`).join('')}
        ${activities.map(a => `<div class="activity-item history-activity"><div><div class="meal-name">Sport · ${escapeHtml(a.name)}</div><div class="meal-meta">${a.source ? `Source : ${escapeHtml(a.source)}` : ''}</div></div><div class="activity-kcal">−${Math.round(a.calories)} kcal</div><button class="meal-delete" data-delete-activity="${a.id}">Supprimer</button></div>`).join('')}
        ${weights.map(w => `<div class="weight-log-row"><span>Poids</span><strong>${Number(w.kg).toFixed(1)} kg</strong><button class="meal-delete inline-delete" data-delete-weight="${w.id}">Supprimer</button></div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function renderWeight() {
  const weights = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const latest = weights.at(-1)?.kg ?? state.profile.currentWeightKg;
  $('weight-current').textContent = Number(latest).toFixed(1);
  $('weight-start').textContent = `${Number(state.profile.startWeightKg).toFixed(1)} kg`;
  $('weight-goal').textContent = `${Number(state.profile.goalWeightKg).toFixed(1)} kg`;
  renderWeightChart(weights);
  $('weight-log').innerHTML = '<h3>Mesures</h3>' + ([...weights].reverse().slice(0, 20).map(w => `
    <div class="weight-log-row"><span>${dateFromKey(w.dateKey || localDateKey(new Date(w.date))).toLocaleDateString('fr-FR')}</span><strong>${Number(w.kg).toFixed(1)} kg</strong><button class="meal-delete inline-delete" data-delete-weight="${w.id}">Supprimer</button></div>`).join('') || '<div class="empty-state">Aucune pesée.</div>');
}

function renderWeightChart(weights) {
  const canvas = $('weight-chart');
  const empty = $('weight-empty');
  if (weights.length < 2) { canvas.hidden = true; empty.hidden = false; return; }
  canvas.hidden = false; empty.hidden = true;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, rect.width) * dpr; canvas.height = 210 * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  const W = canvas.width / dpr, H = canvas.height / dpr, pad = { l: 42, r: 14, t: 18, b: 32 };
  const vals = weights.map(w => Number(w.kg)), goal = Number(state.profile.goalWeightKg);
  let min = Math.min(...vals, goal) - 0.4, max = Math.max(...vals, goal) + 0.4;
  if (max - min < 1) { max += 0.5; min -= 0.5; }
  ctx.clearRect(0, 0, W, H); ctx.strokeStyle = '#dfe6e1'; ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const y = pad.t + (H - pad.t - pad.b) * i / 3;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    const v = max - (max - min) * i / 3; ctx.fillStyle = '#68756e'; ctx.font = '11px system-ui'; ctx.fillText(v.toFixed(1), 4, y + 4);
  }
  const xAt = i => pad.l + (W - pad.l - pad.r) * (weights.length === 1 ? 0 : i / (weights.length - 1));
  const yAt = v => pad.t + (max - v) / (max - min) * (H - pad.t - pad.b);
  ctx.strokeStyle = '#1f6f4a'; ctx.lineWidth = 3; ctx.beginPath();
  weights.forEach((w, i) => { const x = xAt(i), y = yAt(Number(w.kg)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  ctx.fillStyle = '#1f6f4a'; weights.forEach((w, i) => { ctx.beginPath(); ctx.arc(xAt(i), yAt(Number(w.kg)), 4, 0, Math.PI * 2); ctx.fill(); });
  ctx.setLineDash([5, 5]); ctx.strokeStyle = '#b77712'; ctx.lineWidth = 1.5; const gy = yAt(goal); ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#68756e'; ctx.font = '11px system-ui'; ctx.fillText('Objectif', W - 58, Math.max(12, gy - 5));
  const first = dateFromKey(weights[0].dateKey || localDateKey(new Date(weights[0].date))).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  const last = dateFromKey(weights.at(-1).dateKey || localDateKey(new Date(weights.at(-1).date))).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  ctx.fillText(first, pad.l, H - 8); ctx.fillText(last, W - pad.r - 38, H - 8);
}

function setupWeight() {
  $('save-weight').addEventListener('click', () => {
    const kg = Number(String($('weight-input').value).replace(',', '.'));
    const dateKey = $('weight-date').value || selectedDateKey;
    if (!kg || kg < 30 || kg > 250) return alert('Indiquez un poids valide.');
    const timestamp = timestampForDateKey(dateKey);
    state.weights.push({ id: makeId(), date: timestamp, dateKey, kg });
    refreshCurrentWeightFromLog();
    saveState(); $('weight-input').value = ''; selectedDateKey = dateKey;
    renderWeight(); updateToday(); fillSettings();
  });
}

function fillSettings() {
  const p = state.profile;
  $('set-age').value = p.age; $('set-sex').value = p.sex; $('set-height').value = p.heightCm || ''; $('set-weight').value = p.currentWeightKg;
  $('set-goal-weight').value = p.goalWeightKg; $('set-activity').value = String(p.activityFactor); $('set-deficit').value = p.deficitKcal; $('set-protein-factor').value = p.proteinFactor; $('set-api-url').value = p.apiUrl || '';
  const sources = activitySourceMap();
  $('source-course').value = sources['Course'] || '';
  $('source-gym').value = sources['Gym'] || '';
  $('source-machine-musculation').value = sources['Machine musculation'] || '';
  $('source-marche').value = sources['Marche'] || '';
  $('source-natation').value = sources['Natation'] || '';
  $('source-randonnee').value = sources['Randonnée'] || '';
  $('source-velo').value = sources['Vélo'] || '';
  $('source-velo-appart').value = sources['Vélo appart'] || '';
  $('api-mode').textContent = !p.apiUrl ? 'Mode actuel : /api/analyze sur le même site (Vercel).' : `Mode actuel : service externe ${p.apiUrl}`;
}

function setupSettings() {
  $('save-activity-sources').addEventListener('click', () => {
    state.profile.activitySources = {
      'Course': $('source-course').value.trim(),
      'Gym': $('source-gym').value.trim(),
      'Machine musculation': $('source-machine-musculation').value.trim(),
      'Marche': $('source-marche').value.trim(),
      'Natation': $('source-natation').value.trim(),
      'Randonnée': $('source-randonnee').value.trim(),
      'Vélo': $('source-velo').value.trim(),
      'Vélo appart': $('source-velo-appart').value.trim()
    };
    saveState();
    populateActivitySourceSelect(currentActivityName() || 'Vélo');
    alert('Sources des activités enregistrées.');
  });

  $('save-settings').addEventListener('click', () => {
    const p = state.profile;
    p.age = Number($('set-age').value); p.sex = $('set-sex').value; p.heightCm = Number($('set-height').value); p.currentWeightKg = Number($('set-weight').value); p.goalWeightKg = Number($('set-goal-weight').value);
    p.activityFactor = Number($('set-activity').value); p.deficitKcal = Number($('set-deficit').value); p.proteinFactor = Number($('set-protein-factor').value); p.apiUrl = $('set-api-url').value.trim(); p.setupDone = Boolean(p.heightCm);
    saveState(); updateToday(); fillSettings(); alert('Réglages enregistrés.');
  });
  $('export-data').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `calories-${localDateKey()}.json`; a.click(); URL.revokeObjectURL(a.href);
  });
  $('clear-journal-data').addEventListener('click', () => {
    if (!confirm('Effacer les repas, activités et pesées enregistrés ?\n\nLe profil, les réglages et votre base alimentaire personnelle seront conservés.')) return;
    state.meals = [];
    state.activities = [];
    state.weights = [];
    state.profile.currentWeightKg = Number(state.profile.startWeightKg || state.profile.currentWeightKg || 74);
    saveState();
    selectedDateKey = localDateKey();
    updateToday(); renderHistory(); renderWeight(); fillSettings();
    alert('Journal effacé. Votre base alimentaire personnelle est conservée.');
  });
  $('reset-data').addEventListener('click', () => {
    if (!confirm('Réinitialiser complètement l’application ?\n\nLe journal, le profil, les réglages et les références personnelles ajoutées seront effacés. Les références intégrées du tableau V1.10 seront restaurées au redémarrage.')) return;
    localStorage.removeItem(STORAGE_KEY); state = structuredClone(defaultState); location.reload();
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

function init() {
  setupNavigation(); setupFirstRun(); setupPhoto(); setupManualEntry(); setupActivity(); setupDeletion(); setupMealEditing(); setupWeight(); setupSettings(); setupPersonalFoodDb();
  setEntryDates(selectedDateKey); updateToday(); fillSettings(); renderLocalFoodDb(); registerServiceWorker();
  window.addEventListener('resize', () => { if ($('view-weight').classList.contains('active')) renderWeight(); });
}

document.addEventListener('DOMContentLoaded', init);
