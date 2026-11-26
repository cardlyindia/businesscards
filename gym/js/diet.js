/* Cardly Gym — Indian meal database.
 * kcal / p (protein g) are approximate values for ONE serving as described.
 * t: 'veg' (lacto-vegetarian) | 'egg' | 'nonveg'; vg: vegan-friendly; r: region (n, s, w, e, a = any)
 */
(function (global) {
  'use strict';
  function M(id, n, kcal, p, t, vg, r) { return { id: id, n: n, kcal: kcal, p: p, t: t, vg: !!vg, r: r || 'a' }; }
  var MEALS = {
    early: [
      M('e1', 'Warm jeera or lemon water + 5 soaked almonds + 2 walnut halves', 90, 2.5, 'veg', 1),
      M('e2', 'Methi (fenugreek) water + 4 soaked almonds', 50, 1.5, 'veg', 1),
      M('e3', 'Green tea + 1 tbsp roasted flax / chia seeds', 60, 2, 'veg', 1),
      M('e4', '1 banana + black coffee (pre-workout)', 110, 1.3, 'veg', 1),
      M('e5', '1 glass tender coconut water + 6 almonds', 90, 2.5, 'veg', 1, 's'),
      M('e6', 'Ajwain water + 5 soaked raisins + 4 almonds', 70, 1.5, 'veg', 1)
    ],
    breakfast: [
      M('b1', 'Vegetable poha (1½ cups) with peanuts & lemon', 330, 8, 'veg', 1, 'w'),
      M('b2', 'Vegetable rava upma (1½ cups)', 320, 8, 'veg', 1, 's'),
      M('b3', '3 idli + 1 bowl sambar + 2 tbsp coconut chutney', 360, 12, 'veg', 1, 's'),
      M('b4', '2 plain dosa + 1 bowl sambar', 400, 11, 'veg', 1, 's'),
      M('b5', '2 moong dal chilla + mint chutney + 100 g curd', 350, 20, 'veg', 0, 'n'),
      M('b6', '2 besan chilla with vegetables + 100 g curd', 360, 18, 'veg', 0, 'n'),
      M('b7', 'Paneer bhurji (100 g paneer) + 2 multigrain rotis', 480, 26, 'veg', 0, 'n'),
      M('b8', 'Oats porridge (40 g oats, 250 ml milk) + banana + 5 almonds', 400, 16, 'veg', 0),
      M('b9', '2 ragi dosa + peanut chutney', 380, 11, 'veg', 1, 's'),
      M('b10', '2 pesarattu (green moong dosa) + ginger chutney', 340, 16, 'veg', 1, 's'),
      M('b11', '1 stuffed paneer / methi paratha (less ghee) + 100 g curd', 420, 18, 'veg', 0, 'n'),
      M('b12', 'Daliya (broken wheat) upma with vegetables + 1 glass buttermilk', 330, 11, 'veg', 0, 'n'),
      M('b13', 'Masala oats with vegetables + 1 bowl sprouts', 330, 15, 'veg', 1),
      M('b14', 'Tofu bhurji (150 g) + 2 rotis', 420, 24, 'veg', 1),
      M('b15', 'Masala omelette (3 eggs) + 2 slices whole-wheat toast', 420, 25, 'egg', 0),
      M('b16', 'Egg bhurji (3 eggs) + 2 rotis', 450, 24, 'egg', 0, 'n'),
      M('b17', '2 boiled eggs + 1 bowl vegetable poha', 420, 20, 'egg', 0, 'w'),
      M('b18', 'Egg dosa (2) + sambar', 450, 22, 'egg', 0, 's'),
      M('b19', 'Chicken sandwich (whole-wheat, 100 g grilled chicken)', 420, 32, 'nonveg', 0),
      M('b20', '2 thepla + 100 g curd', 360, 12, 'veg', 0, 'w')
    ],
    mid: [
      M('m1', '1 seasonal fruit (apple / guava / papaya bowl)', 80, 1, 'veg', 1),
      M('m2', 'Roasted chana (30 g)', 110, 6, 'veg', 1),
      M('m3', '1 glass chaas (buttermilk) + 1 fruit', 140, 4, 'veg', 0),
      M('m4', 'Sprouts chaat (1 cup) with onion, tomato & lemon', 140, 9, 'veg', 1),
      M('m5', 'Hung curd / Greek yogurt (150 g) with fruit', 150, 12, 'veg', 0),
      M('m6', 'Roasted makhana (25 g)', 90, 2.5, 'veg', 1),
      M('m7', 'Whey or plant protein shake (1 scoop in water)', 120, 24, 'veg', 0),
      M('m8', '2 boiled eggs with pepper', 140, 12, 'egg', 0),
      M('m9', 'Handful of peanuts (30 g)', 170, 7, 'veg', 1),
      M('m10', 'Soy milk (250 ml) + 1 fruit', 160, 8, 'veg', 1)
    ],
    lunch: [
      M('l1', '2 rotis + 1 bowl dal + 1 bowl sabzi + salad + 100 g curd', 520, 20, 'veg', 0, 'n'),
      M('l2', '1 cup rice + 1 bowl rajma + salad + 100 g curd', 560, 20, 'veg', 0, 'n'),
      M('l3', '1 cup rice + 1 bowl chole + salad', 540, 18, 'veg', 1, 'n'),
      M('l4', '2 rotis + palak paneer (100 g paneer) + salad', 580, 28, 'veg', 0, 'n'),
      M('l5', 'Sambar rice (1½ cups) + vegetable poriyal + 100 g curd', 520, 16, 'veg', 0, 's'),
      M('l6', '1 cup rice + rasam + kootu + 100 g curd', 500, 15, 'veg', 0, 's'),
      M('l7', 'Moong dal khichdi (1½ cups) + 100 g curd + salad', 480, 18, 'veg', 0),
      M('l8', '2 jowar / bajra rotis + dal + sabzi', 500, 18, 'veg', 1, 'w'),
      M('l9', 'Soya chunk curry (50 g dry) + 2 rotis + salad', 520, 32, 'veg', 1),
      M('l10', '2 rotis + mixed veg + tofu curry (100 g) + salad', 500, 24, 'veg', 1),
      M('l11', 'Egg curry (2 eggs) + 1 cup rice + salad', 550, 22, 'egg', 0),
      M('l12', 'Chicken curry (150 g) + 2 rotis + salad', 580, 40, 'nonveg', 0, 'n'),
      M('l13', 'Fish curry (150 g) + 1 cup rice + salad', 550, 36, 'nonveg', 0, 'e'),
      M('l14', 'Homestyle chicken biryani (1½ cups) + raita', 620, 32, 'nonveg', 0),
      M('l15', 'Dal-chawal (1 cup rice + 1 bowl dal) + sabzi + salad', 520, 18, 'veg', 1, 'e'),
      M('l16', 'Brown rice / millet + sambar + 2 boiled egg whites + poriyal', 520, 22, 'egg', 0, 's')
    ],
    evening: [
      M('s1', 'Masala chai (less sugar) + 2 multigrain khakhra', 160, 5, 'veg', 0, 'w'),
      M('s2', 'Sprouts bhel', 180, 9, 'veg', 1),
      M('s3', 'Roasted makhana + green tea', 120, 3, 'veg', 1),
      M('s4', 'Paneer tikka (75 g)', 200, 14, 'veg', 0, 'n'),
      M('s5', 'Moong dal dhokla (3 pieces) + chutney', 160, 8, 'veg', 1, 'w'),
      M('s6', 'Peanut chaat (40 g peanuts)', 200, 8, 'veg', 1),
      M('s7', '1 fruit + 10 almonds', 160, 4, 'veg', 1),
      M('s8', 'Boiled egg chaat (2 eggs)', 160, 12, 'egg', 0),
      M('s9', 'Chicken tikka (100 g)', 180, 25, 'nonveg', 0, 'n'),
      M('s10', 'Chana sundal (1 cup)', 180, 9, 'veg', 1, 's'),
      M('s11', 'Banana + 1 tbsp peanut butter (pre-workout)', 190, 5, 'veg', 1),
      M('s12', 'Corn & veg chaat (1 cup) + lemon', 150, 5, 'veg', 1)
    ],
    dinner: [
      M('d1', '2 rotis + 1 bowl dal + 1 bowl sabzi + salad', 450, 17, 'veg', 1, 'n'),
      M('d2', 'Vegetable daliya khichdi + 100 g curd', 400, 15, 'veg', 0),
      M('d3', 'Grilled paneer (100 g) + sautéed vegetables + 1 roti', 450, 26, 'veg', 0),
      M('d4', '2 ragi / jowar rotis + mixed veg + dal', 430, 16, 'veg', 1),
      M('d5', 'Moong dal soup + 2 besan chilla', 400, 22, 'veg', 0, 'n'),
      M('d6', '2 wheat dosa + sambar', 380, 12, 'veg', 1, 's'),
      M('d7', 'Tofu & vegetable stir-fry + 1 roti', 400, 24, 'veg', 1),
      M('d8', 'Egg curry (2 eggs) + 2 rotis', 450, 22, 'egg', 0),
      M('d9', 'Grilled chicken (150 g) + vegetables + 1 roti', 450, 45, 'nonveg', 0),
      M('d10', 'Fish curry (150 g) + 1 cup rice', 480, 34, 'nonveg', 0, 's'),
      M('d11', 'Chicken soup + 2 rotis + salad', 420, 30, 'nonveg', 0),
      M('d12', '3 idli + sambar + vegetable kootu', 380, 13, 'veg', 1, 's'),
      M('d13', 'Rajma / lobia salad bowl + 1 roti + 100 g curd', 420, 20, 'veg', 0)
    ],
    bed: [
      M('n1', 'Haldi milk (1 glass, toned milk)', 120, 8, 'veg', 0),
      M('n2', '1 glass warm toned milk', 110, 8, 'veg', 0),
      M('n3', 'Soy milk with a pinch of cinnamon', 100, 7, 'veg', 1),
      M('n4', 'Chamomile / tulsi tea + 4 almonds', 40, 1.2, 'veg', 1)
    ]
  };
  var SLOTS = [
    { id: 'early', name: 'Early morning', time: '6:30 AM', pct: 0.05 },
    { id: 'breakfast', name: 'Breakfast', time: '8:30 AM', pct: 0.24 },
    { id: 'mid', name: 'Mid-morning', time: '11:00 AM', pct: 0.08 },
    { id: 'lunch', name: 'Lunch', time: '1:30 PM', pct: 0.30 },
    { id: 'evening', name: 'Evening snack', time: '5:00 PM', pct: 0.10 },
    { id: 'dinner', name: 'Dinner', time: '8:00 PM', pct: 0.19 },
    { id: 'bed', name: 'Bedtime (optional)', time: '10:00 PM', pct: 0.04 }
  ];
  var TIPS = {
    common: [
      'Drink water through the day — keep a 1 litre bottle and refill it.',
      'Fill half your plate with sabzi and salad, a quarter with protein (dal, paneer, eggs, chicken), a quarter with roti or rice.',
      'Cook with 2–3 tsp of oil per meal; prefer mustard, groundnut or rice-bran oil and use ghee in small amounts.',
      'Limit maida, fried snacks (samosa, pakora), sweets and sugary chai or cold drinks.',
      'Combine dal with rice or roti — together they give complete protein.',
      'Eat your last meal 2–3 hours before sleeping.'
    ],
    fat_loss: ['Stay in a small calorie deficit — do not crash diet.', 'Prioritise protein at every meal to stay full.', 'Swap white rice for millets (ragi, jowar, bajra) a few times a week.'],
    muscle: ['Eat protein at every meal, ideally 20–30 g each time.', 'Have a carb + protein meal 1–2 hours before and after training.', 'Add a glass of milk or curd daily for extra protein.'],
    strength: ['Do not under-eat on training days — fuel the heavy sessions.', 'Include complex carbs like rice, oats and potatoes around workouts.'],
    maintain: ['Keep portions consistent and stay active on rest days.', 'Aim for 5 servings of fruits and vegetables daily.']
  };
  global.GYM_DIET = { MEALS: MEALS, SLOTS: SLOTS, TIPS: TIPS };
})(window);
