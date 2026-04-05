import { Dish } from '../types';

export const DISHES: Dish[] = [
  // Breakfast
  {
    id: 'b1',
    name: 'Aloo Paratha',
    type: ['breakfast'],
    isVegetarian: true,
    ingredients: ['Whole wheat flour', 'Potatoes', 'Green chilies', 'Ginger', 'Coriander leaves', 'Ghee', 'Spices'],
    instructions: [
      'Boil and mash potatoes, mix with spices and herbs.',
      'Prepare a soft dough from wheat flour.',
      'Stuff the potato mixture into dough balls and roll into parathas.',
      'Cook on a hot tawa with ghee until golden brown on both sides.',
      'Serve hot with curd or pickle.'
    ],
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb01793?auto=format&fit=crop&q=80&w=400',
    description: 'Classic North Indian stuffed flatbread with spiced potatoes.'
  },
  {
    id: 'b2',
    name: 'Chole Bhature',
    type: ['breakfast', 'lunch'],
    isVegetarian: true,
    ingredients: ['Chickpeas', 'All-purpose flour', 'Yogurt', 'Onions', 'Tomatoes', 'Ginger-garlic paste', 'Spices'],
    instructions: [
      'Soak chickpeas overnight and pressure cook with spices.',
      'Prepare a spicy gravy with onions, tomatoes, and chole masala.',
      'Knead a soft dough for bhature with flour and yogurt, let it ferment.',
      'Deep fry rolled bhature until puffed and golden.',
      'Serve hot with spicy chickpeas and onions.'
    ],
    image: 'https://images.unsplash.com/photo-1589113103503-496da04206b5?auto=format&fit=crop&q=80&w=400',
    description: 'Spicy chickpeas served with fried leavened bread.'
  },
  {
    id: 'b3',
    name: 'Poha',
    type: ['breakfast'],
    isVegetarian: true,
    ingredients: ['Flattened rice', 'Onions', 'Potatoes', 'Peanuts', 'Curry leaves', 'Mustard seeds', 'Turmeric'],
    instructions: [
      'Wash and drain poha, keep aside.',
      'Sauté mustard seeds, peanuts, curry leaves, and onions.',
      'Add potatoes and turmeric, cook until soft.',
      'Mix in poha and salt, steam for a few minutes.',
      'Garnish with lemon juice and fresh coriander.'
    ],
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400',
    description: 'Light and nutritious flattened rice tempered with spices.'
  },
  {
    id: 'b4',
    name: 'Paneer Paratha',
    type: ['breakfast'],
    isVegetarian: true,
    ingredients: ['Whole wheat flour', 'Paneer (Cottage cheese)', 'Green chilies', 'Coriander', 'Ghee', 'Spices'],
    instructions: [
      'Grate paneer and mix with spices and chopped coriander.',
      'Stuff into wheat dough and roll out.',
      'Cook on tawa with ghee until crisp.',
      'Serve with butter and yogurt.'
    ],
    image: 'https://images.unsplash.com/photo-1593759608142-e9b18c0dbe86?auto=format&fit=crop&q=80&w=400',
    description: 'Delicious flatbread stuffed with spiced crumbled paneer.'
  },
  {
    id: 'b5',
    name: 'Bread Pakora',
    type: ['breakfast'],
    isVegetarian: true,
    ingredients: ['Bread slices', 'Gram flour (Besan)', 'Potatoes', 'Spices', 'Oil for frying'],
    instructions: [
      'Make a spiced potato filling and sandwich between bread slices.',
      'Dip in a seasoned gram flour batter.',
      'Deep fry until golden and crispy.',
      'Serve with mint chutney.'
    ],
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=400',
    description: 'Deep-fried bread fritters stuffed with spiced potatoes.'
  },
  {
    id: 'b6',
    name: 'Vermicelli Upma (Seviyan)',
    type: ['breakfast'],
    isVegetarian: true,
    ingredients: ['Vermicelli', 'Onions', 'Peas', 'Carrots', 'Mustard seeds', 'Curry leaves', 'Spices'],
    instructions: [
      'Roast vermicelli until golden brown.',
      'Sauté mustard seeds, curry leaves, and vegetables.',
      'Add water and bring to a boil, then add roasted vermicelli.',
      'Cook until water is absorbed and vermicelli is soft.',
      'Garnish with lemon and coriander.'
    ],
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=400',
    description: 'Savory roasted vermicelli cooked with mixed vegetables and spices.'
  },
  {
    id: 'b7',
    name: 'Rava Upma',
    type: ['breakfast'],
    isVegetarian: true,
    ingredients: ['Semolina (Rava)', 'Onions', 'Green chilies', 'Ginger', 'Curry leaves', 'Mustard seeds', 'Ghee'],
    instructions: [
      'Roast rava until aromatic.',
      'Sauté mustard seeds, urad dal, curry leaves, and onions.',
      'Add boiling water and salt, then slowly stir in the roasted rava.',
      'Cover and cook on low heat for a few minutes.',
      'Serve hot with coconut chutney.'
    ],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400',
    description: 'Traditional savory semolina porridge with tempered spices.'
  },
  {
    id: 'b8',
    name: 'Medu Vada',
    type: ['breakfast'],
    isVegetarian: true,
    ingredients: ['Urad dal', 'Peppercorns', 'Curry leaves', 'Green chilies', 'Ginger', 'Oil for frying'],
    instructions: [
      'Soak urad dal and grind to a thick, fluffy batter.',
      'Mix in spices and herbs.',
      'Shape into donuts and deep fry until golden brown.',
      'Serve hot with sambar and coconut chutney.'
    ],
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb01793?auto=format&fit=crop&q=80&w=400',
    description: 'Crispy deep-fried savory donuts made from black gram batter.'
  },
  {
    id: 'b9',
    name: 'Masala Dosa',
    type: ['breakfast', 'dinner'],
    isVegetarian: true,
    ingredients: ['Rice and lentil batter', 'Potatoes', 'Onions', 'Mustard seeds', 'Turmeric', 'Ghee'],
    instructions: [
      'Prepare a spiced potato filling.',
      'Spread dosa batter thinly on a hot tawa.',
      'Add ghee and cook until crisp.',
      'Place potato filling in the center and fold.',
      'Serve with sambar and chutney.'
    ],
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=400',
    description: 'Thin, crispy fermented rice crepe stuffed with spiced potatoes.'
  },
  {
    id: 'b10',
    name: 'Idli Sambar',
    type: ['breakfast'],
    isVegetarian: true,
    ingredients: ['Rice and lentil batter', 'Toor dal', 'Mixed vegetables', 'Sambar powder', 'Tamarind'],
    instructions: [
      'Steam fermented batter in idli molds.',
      'Prepare sambar with lentils, vegetables, and spices.',
      'Serve soft idlis dipped in hot sambar.'
    ],
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=400',
    description: 'Soft, fluffy steamed rice cakes served with lentil vegetable stew.'
  },

  // Lunch/Dinner
  {
    id: 'l1',
    name: 'Butter Chicken',
    type: ['lunch', 'dinner'],
    isVegetarian: false,
    ingredients: ['Chicken', 'Butter', 'Cream', 'Tomatoes', 'Ginger-garlic paste', 'Kashmiri red chili', 'Kasuri methi'],
    instructions: [
      'Marinate chicken in yogurt and spices, then grill or roast.',
      'Prepare a smooth tomato gravy with butter and spices.',
      'Add grilled chicken to the gravy and simmer with cream.',
      'Finish with a pinch of kasuri methi for aroma.',
      'Serve with Naan or Jeera Rice.'
    ],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400',
    description: 'Creamy, mildly spiced tomato-based chicken curry.'
  },
  {
    id: 'l2',
    name: 'Dal Makhani',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Black lentils (Urad dal)', 'Kidney beans (Rajma)', 'Butter', 'Cream', 'Tomatoes', 'Spices'],
    instructions: [
      'Soak lentils and beans overnight, pressure cook until soft.',
      'Simmer on low heat for hours with tomato puree and spices.',
      'Add generous amounts of butter and cream for richness.',
      'Finish with a charcoal smoke (dhungar) for authentic flavor.',
      'Serve with Garlic Naan.'
    ],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400',
    description: 'Slow-cooked creamy black lentils, a North Indian staple.'
  },
  {
    id: 'l3',
    name: 'Palak Paneer',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Spinach', 'Paneer', 'Onions', 'Garlic', 'Cream', 'Spices'],
    instructions: [
      'Blanch spinach and puree it.',
      'Sauté onions and garlic, add spinach puree and spices.',
      'Add paneer cubes and simmer for a few minutes.',
      'Finish with a swirl of cream.',
      'Serve with Roti or Paratha.'
    ],
    image: 'https://images.unsplash.com/photo-1601050690294-397f37964085?auto=format&fit=crop&q=80&w=400',
    description: 'Paneer cubes in a smooth, spiced spinach gravy.'
  },
  {
    id: 'l4',
    name: 'Chicken Biryani',
    type: ['lunch', 'dinner'],
    isVegetarian: false,
    ingredients: ['Basmati rice', 'Chicken', 'Onions', 'Yogurt', 'Saffron', 'Whole spices', 'Mint'],
    instructions: [
      'Marinate chicken in yogurt and spices.',
      'Par-cook basmati rice with whole spices.',
      'Layer chicken and rice in a heavy-bottomed pot.',
      'Add saffron milk and fried onions, seal and cook on low heat (Dum).',
      'Serve with Raita.'
    ],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400',
    description: 'Fragrant long-grain rice layered with spiced chicken.'
  },
  {
    id: 'l5',
    name: 'Rajma Chawal',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Kidney beans', 'Basmati rice', 'Onions', 'Tomatoes', 'Ginger-garlic', 'Spices'],
    instructions: [
      'Soak rajma overnight and pressure cook.',
      'Make a thick onion-tomato gravy and add cooked rajma.',
      'Simmer until the gravy thickens and flavors meld.',
      'Serve with steamed basmati rice and ghee.'
    ],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=400',
    description: 'Comforting kidney bean curry served with steamed rice.'
  },
  {
    id: 'l6',
    name: 'Mutton Rogan Josh',
    type: ['lunch', 'dinner'],
    isVegetarian: false,
    ingredients: ['Mutton', 'Yogurt', 'Kashmiri chilies', 'Fennel powder', 'Ginger powder', 'Whole spices'],
    instructions: [
      'Sauté mutton in oil with whole spices.',
      'Add yogurt and a paste of Kashmiri chilies.',
      'Slow cook until meat is tender and oil separates.',
      'Garnish with fresh coriander.'
    ],
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=400',
    description: 'Aromatic Kashmiri mutton curry with a rich red gravy.'
  },
  {
    id: 'l7',
    name: 'Kadai Paneer',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Paneer', 'Bell peppers', 'Onions', 'Tomatoes', 'Kadai masala', 'Ginger'],
    instructions: [
      'Roast and grind spices for Kadai masala.',
      'Sauté paneer, peppers, and onions in the masala.',
      'Add tomato puree and cook until thick.',
      'Serve hot with Naan.'
    ],
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400',
    description: 'Paneer and bell peppers tossed in a spicy kadai masala.'
  },
  {
    id: 'l8',
    name: 'Shahi Paneer',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Paneer', 'Cashews', 'Onions', 'Yogurt', 'Cream', 'Saffron', 'Spices'],
    instructions: [
      'Make a paste of boiled onions and cashews.',
      'Cook the paste with spices, yogurt, and saffron.',
      'Add paneer cubes and finish with cream.',
      'Serve with Sheermal or Naan.'
    ],
    image: 'https://images.unsplash.com/photo-1596797038530-2c39bb050b12?auto=format&fit=crop&q=80&w=400',
    description: 'Royal paneer curry in a rich, creamy cashew-onion gravy.'
  },
  {
    id: 'l9',
    name: 'Aloo Gobi',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Potatoes', 'Cauliflower', 'Ginger', 'Green chilies', 'Turmeric', 'Cumin'],
    instructions: [
      'Sauté cumin and ginger.',
      'Add potatoes and cauliflower florets with spices.',
      'Cook on low heat until tender.',
      'Garnish with plenty of fresh coriander.'
    ],
    image: 'https://images.unsplash.com/photo-1633383718081-22ac93e3dbf1?auto=format&fit=crop&q=80&w=400',
    description: 'Classic dry vegetable dish with potatoes and cauliflower.'
  },
  {
    id: 'l10',
    name: 'Matar Paneer',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Paneer', 'Green peas', 'Onions', 'Tomatoes', 'Ginger-garlic', 'Spices'],
    instructions: [
      'Prepare onion-tomato gravy.',
      'Add peas and paneer cubes.',
      'Simmer until peas are cooked.',
      'Serve with Roti.'
    ],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
    description: 'Paneer and green peas in a spiced tomato gravy.'
  },
  {
    id: 'l11',
    name: 'Chicken Tikka Masala',
    type: ['lunch', 'dinner'],
    isVegetarian: false,
    ingredients: ['Chicken', 'Yogurt', 'Tomatoes', 'Cream', 'Onions', 'Spices'],
    instructions: [
      'Grill marinated chicken tikka.',
      'Simmer in a rich, spiced tomato-cream sauce.',
      'Serve with Garlic Naan.'
    ],
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400',
    description: 'Roasted marinated chicken chunks in a spiced creamy sauce.'
  },
  {
    id: 'l12',
    name: 'Malai Kofta',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Paneer', 'Potatoes', 'Cashews', 'Cream', 'Tomatoes', 'Spices'],
    instructions: [
      'Make balls (koftas) of paneer and potato, deep fry them.',
      'Prepare a rich white or red gravy with cashews and cream.',
      'Add koftas just before serving.',
      'Serve with Jeera Rice.'
    ],
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=400',
    description: 'Fried paneer and potato balls in a rich, creamy gravy.'
  },
  {
    id: 'l13',
    name: 'Baingan Bharta',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Eggplant', 'Onions', 'Tomatoes', 'Garlic', 'Green chilies', 'Spices'],
    instructions: [
      'Roast eggplant over an open flame until charred.',
      'Peel and mash the smoky flesh.',
      'Sauté with onions, tomatoes, and spices.',
      'Serve with hot Phulkas.'
    ],
    image: 'https://images.unsplash.com/photo-1601050690692-008687700688?auto=format&fit=crop&q=80&w=400',
    description: 'Smoky mashed eggplant cooked with onions and tomatoes.'
  },
  {
    id: 'l14',
    name: 'Bhindi Masala',
    type: ['lunch', 'dinner'],
    isVegetarian: true,
    ingredients: ['Okra (Bhindi)', 'Onions', 'Tomatoes', 'Amchur (Mango powder)', 'Spices'],
    instructions: [
      'Sauté okra until crisp.',
      'Add sliced onions and cook until translucent.',
      'Mix in spices and amchur for tanginess.',
      'Serve with Roti.'
    ],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97eb4?auto=format&fit=crop&q=80&w=400',
    description: 'Stir-fried okra with onions and tangy spices.'
  }
];
