/* Cardly Gym — exercise library: how-to, body positioning, muscles and animation keyframes */
(function (global) {
  'use strict';
  function K(p, d, n, h) { return { p: p, d: d || 900, n: n || '', h: h || 0 }; }
  function X(o) { return o; }
  var AF = { x: 100, y: 180 };           // planted ankle for standing lifts
  var BENCH_FLAT = [['r', 55, 140, 105, 7], ['l', 65, 147, 65, 184, 4], ['l', 150, 147, 150, 184, 4]];

  var EX = [
    /* ───────────── CHEST ───────────── */
    X({ id: 'pushup', name: 'Push-up', part: 'chest', equip: [], lvl: 1, pri: 1, reps: '8-15', met: 8,
      prim: ['Chest (pectoralis major)'], sec: ['Triceps', 'Front shoulders', 'Core'],
      setup: 'Start in a high plank: hands slightly wider than shoulders, arms straight, body in one line from head to heels.',
      steps: ['Brace your core and squeeze your glutes so the hips do not sag.', 'Bend the elbows and lower your chest towards the floor, elbows about 45° from your body.', 'Stop when the chest is 2–5 cm from the floor.', 'Press the floor away and straighten the arms, keeping the body rigid.'],
      pos: [['Head', 'Neutral — look at the floor slightly ahead of your hands.'], ['Hands', 'Under or just outside the shoulders, fingers spread and pointing forward.'], ['Elbows', 'Tucked to about 45°, not flared out to 90°.'], ['Hips & core', 'In line with shoulders and heels; ribs down, glutes tight.'], ['Feet', 'Hip-width apart on the balls of your feet.']],
      err: ['Hips sagging or piking up', 'Elbows flared straight out to the sides', 'Half reps — not lowering the chest', 'Head dropping towards the floor'],
      breathe: 'Inhale as you lower, exhale as you push up.', tip: 'Too hard? Use knee or incline push-ups. Too easy? Slow the lowering to 3 seconds.',
      anim: { hl: ['chest', 'triceps', 'delts'], k: [
        K({ hip: [112.5, 144], t: 68.7, a1: { x: 159, y: 180 }, l1: { x: 38, y: 173 }, ft: 40 }, 1000, 'Lower the chest — inhale', 200),
        K({ hip: [117.6, 165], t: 84.3, a1: { x: 159, y: 180 }, l1: { x: 38, y: 173 }, ft: 40 }, 900, 'Push the floor away — exhale', 150)] } }),

    X({ id: 'kneepushup', name: 'Knee Push-up', part: 'chest', equip: [], lvl: 1, pri: 2, reps: '8-15', met: 6, beginner: true,
      prim: ['Chest'], sec: ['Triceps', 'Front shoulders'],
      setup: 'Kneel on a mat, hands under the shoulders, walk the knees back so the body is a straight line from head to knees.',
      steps: ['Cross your ankles and lift the feet off the floor.', 'Brace the core and lower the chest between your hands.', 'Keep the hips in line — do not bend at the waist.', 'Push back up until the arms are straight.'],
      pos: [['Head', 'Neutral, eyes to the floor.'], ['Hands', 'Slightly wider than shoulders.'], ['Hips', 'Straight line from knees to shoulders — no bending at the hips.'], ['Knees', 'On a folded mat or towel for comfort.']],
      err: ['Sticking the hips up in the air', 'Placing knees too close to the hands', 'Dropping the head'],
      breathe: 'Inhale down, exhale up.', tip: 'Great stepping stone to full push-ups — aim for 3×15 before progressing.',
      anim: { hl: ['chest', 'triceps', 'delts'], k: [
        K({ hip: [112.3, 155.4], t: 54, a1: { x: 157, y: 180 }, l1: [-53.8, -111], ft: -160 }, 1000, 'Lower the chest — inhale', 200),
        K({ hip: [118.9, 169.7], t: 76.5, a1: { x: 157, y: 180 }, l1: [-76.6, -111], ft: -160 }, 900, 'Press up — exhale', 150)] } }),

    X({ id: 'inclinepushup', name: 'Incline Push-up', part: 'chest', equip: [], lvl: 1, pri: 2, reps: '10-15', met: 6, beginner: true,
      prim: ['Lower chest', 'Chest'], sec: ['Triceps', 'Shoulders'],
      setup: 'Place hands on a sturdy bench, bed edge or kitchen counter, shoulder-width apart. Walk your feet back until your body is straight.',
      steps: ['Brace the core and keep the body in one straight line.', 'Lower your chest to the edge of the surface.', 'Keep elbows at about 45°.', 'Push back to straight arms.'],
      pos: [['Hands', 'Shoulder-width on a stable surface that will not slide.'], ['Body', 'Plank line from head to heels.'], ['Feet', 'On the balls of the feet, hip-width.'], ['Head', 'Neutral; do not reach with the chin.']],
      err: ['Using a surface that moves', 'Letting hips sag', 'Elbows flaring wide'],
      breathe: 'Inhale down, exhale up.', tip: 'The higher the surface, the easier it is. Lower it over weeks to progress.',
      anim: { hl: ['chest', 'triceps'], props: { shapes: [['r', 128, 140, 60, 8], ['l', 135, 148, 135, 184, 4], ['l', 180, 148, 180, 184, 4]] }, k: [
        K({ hip: [100.3, 123.1], t: 48.7, a1: { x: 145, y: 140 }, l1: { x: 40, y: 176 }, ft: 40 }, 1000, 'Lower to the edge — inhale', 200),
        K({ hip: [112.1, 141.6], t: 64.5, a1: { x: 145, y: 140 }, l1: { x: 40, y: 176 }, ft: 40 }, 900, 'Press away — exhale', 150)] } }),

    X({ id: 'benchpress', name: 'Barbell Bench Press', part: 'chest', equip: ['bb', 'bench'], lvl: 2, pri: 1, reps: '6-10', met: 6,
      prim: ['Chest'], sec: ['Triceps', 'Front shoulders'],
      setup: 'Lie on a flat bench with eyes under the bar. Feet flat on the floor, shoulder blades squeezed together and down.',
      steps: ['Grip the bar slightly wider than shoulder-width and unrack it over your shoulders.', 'Lower the bar with control to your lower chest / nipple line.', 'Keep forearms vertical and elbows about 45–70° from the body.', 'Drive the bar back up and slightly back over the shoulders.'],
      pos: [['Head', 'Flat on the bench throughout.'], ['Upper back', 'Shoulder blades pinched together and pulled down — keep a slight natural arch.'], ['Hips', 'Glutes stay on the bench.'], ['Feet', 'Flat on the floor, pushing gently into the ground.'], ['Wrists', 'Stacked over elbows, not bent back.']],
      err: ['Bouncing the bar off the chest', 'Lifting the hips off the bench', 'Elbows flared to 90°', 'Training heavy without a spotter or safety bars'],
      breathe: 'Inhale and brace before lowering; exhale as you press through the sticking point.', tip: 'Always use a spotter or safety pins when going heavy.',
      anim: { hl: ['chest', 'triceps', 'delts'], props: { bb: true, shapes: BENCH_FLAT }, k: [
        K({ hip: [78, 133], t: 90, a1: { x: 128, y: 79 }, l1: { x: 40, y: 180, b: 1 } }, 1100, 'Lower to the chest — inhale', 250),
        K({ hip: [78, 133], t: 90, a1: { x: 104, y: 120, b: -1 }, l1: { x: 40, y: 180, b: 1 } }, 900, 'Press up — exhale', 100)] } }),

    X({ id: 'dbpress', name: 'Dumbbell Bench Press', part: 'chest', equip: ['db', 'bench'], lvl: 1, pri: 1, reps: '8-12', met: 6,
      prim: ['Chest'], sec: ['Triceps', 'Front shoulders'],
      setup: 'Sit on a flat bench with dumbbells on your thighs, lie back and bring them to chest level, palms facing your feet.',
      steps: ['Press the dumbbells up until arms are straight over your chest.', 'Lower slowly until the dumbbells are beside your chest.', 'Keep elbows about 45° from the torso.', 'Press up and slightly together without clanging the weights.'],
      pos: [['Back', 'Shoulder blades squeezed back and down.'], ['Feet', 'Flat on the floor.'], ['Wrists', 'Straight, stacked over the elbows.'], ['Head', 'Resting on the bench.']],
      err: ['Lowering too fast', 'Wrists bent back', 'Dropping dumbbells carelessly at the end'],
      breathe: 'Inhale down, exhale up.', tip: 'Dumbbells allow a deeper stretch and fix left/right imbalances.',
      anim: { hl: ['chest', 'triceps'], props: { db: 2, shapes: BENCH_FLAT }, k: [
        K({ hip: [78, 133], t: 90, a1: { x: 128, y: 79 }, l1: { x: 40, y: 180, b: 1 } }, 1100, 'Lower beside the chest — inhale', 250),
        K({ hip: [78, 133], t: 90, a1: { x: 104, y: 120, b: -1 }, l1: { x: 40, y: 180, b: 1 } }, 900, 'Press up — exhale', 100)] } }),

    X({ id: 'inclinedb', name: 'Incline Dumbbell Press', part: 'chest', equip: ['db', 'bench'], lvl: 2, pri: 1, reps: '8-12', met: 6,
      prim: ['Upper chest'], sec: ['Front shoulders', 'Triceps'],
      setup: 'Set a bench to 30–45°. Sit back with dumbbells at shoulder level, palms forward.',
      steps: ['Press the dumbbells up over your upper chest.', 'Lower slowly to the sides of the upper chest.', 'Keep shoulder blades pinned to the bench.', 'Press back up without locking the elbows hard.'],
      pos: [['Bench', '30–45° — steeper shifts work to the shoulders.'], ['Back', 'Upper back flat on the pad, slight arch in the lower back.'], ['Feet', 'Flat and wide for stability.'], ['Elbows', 'Under the wrists, about 45–60° from the body.']],
      err: ['Bench too steep', 'Shoulders rolling forward at the top', 'Uneven pressing'],
      breathe: 'Inhale down, exhale up.', tip: 'Builds the upper chest for a fuller look.',
      anim: { hl: ['chest', 'delts', 'triceps'], props: { db: 2, shapes: [['l', 106, 143, 56, 94, 8], ['l', 100, 143, 140, 143, 8], ['l', 110, 147, 110, 184, 4], ['l', 70, 112, 62, 184, 4]] }, k: [
        K({ hip: [110, 136], t: -45, a1: { x: 80, y: 47 }, l1: { x: 150, y: 180 } }, 1100, 'Lower to upper chest — inhale', 250),
        K({ hip: [110, 136], t: -45, a1: { x: 98.6, y: 88 } , l1: { x: 150, y: 180 } }, 900, 'Press up — exhale', 100)] } }),

    X({ id: 'dbfly', name: 'Dumbbell Fly', part: 'chest', equip: ['db', 'bench'], lvl: 2, pri: 3, reps: '10-15', met: 5,
      prim: ['Chest (stretch)'], sec: ['Front shoulders'],
      setup: 'Lie on a flat bench holding dumbbells above your chest, palms facing each other, elbows slightly bent.',
      steps: ['Keeping the slight elbow bend fixed, open the arms out in a wide arc.', 'Lower until you feel a stretch across the chest (arms about level with the body).', 'Hug the dumbbells back up along the same arc.', 'Squeeze the chest at the top.'],
      pos: [['Elbows', 'Soft and fixed — this is a hug, not a press.'], ['Shoulders', 'Pinned back on the bench.'], ['Range', 'Stop at body level; do not overstretch.'], ['Feet', 'Flat on the floor.']],
      err: ['Going too heavy and turning it into a press', 'Dropping arms too low', 'Locking elbows straight'],
      breathe: 'Inhale as the arms open, exhale as you bring them together.', tip: 'Use light weights — it is a stretch-and-squeeze movement.',
      anim: { view: 'front', cap: 'Top view', hl: ['chest', 'delts'], noGround: true, props: { db: 2, shapes: [['r', 84, 40, 32, 120]] }, k: [
        K({ hip: [100, 135], t: 0, a1: [-55, -75], as: 0.45, l1: [16, 4] }, 1200, 'Open wide — inhale', 200),
        K({ hip: [100, 135], t: 0, a1: [88, 100], as: 1, l1: [16, 4] }, 1100, 'Hug together — exhale', 200)] } }),

    X({ id: 'dips', name: 'Parallel Bar Dips', part: 'chest', equip: ['dipbar'], lvl: 3, pri: 2, reps: '6-12', met: 8,
      prim: ['Lower chest', 'Triceps'], sec: ['Front shoulders'],
      setup: 'Grip parallel bars, jump up and lock your arms out with shoulders pressed down.',
      steps: ['Lean the torso slightly forward (more lean = more chest).', 'Bend the elbows and lower until the upper arms are about parallel to the floor.', 'Keep the shoulders away from the ears.', 'Press back up to straight arms.'],
      pos: [['Shoulders', 'Down and back — never shrugged.'], ['Torso', '10–30° forward lean.'], ['Legs', 'Knees bent, ankles crossed behind you.'], ['Elbows', 'Track back, not out.']],
      err: ['Going too deep with shoulder pain', 'Shrugging the shoulders', 'Swinging the legs'],
      breathe: 'Inhale down, exhale up.', tip: 'Use an assisted dip machine or band until you can do 6 clean reps.',
      anim: { hl: ['chest', 'triceps'], props: { shapes: [['l', 70, 112, 135, 112, 5], ['l', 75, 112, 75, 184, 4], ['l', 130, 112, 130, 184, 4]] }, k: [
        K({ hip: [87, 103], t: 15, a1: { x: 100, y: 110 }, l1: [20, -80] }, 1000, 'Lower with control — inhale', 150),
        K({ hip: [71, 123], t: 30, a1: { x: 100, y: 110 }, l1: [20, -80] }, 900, 'Press up — exhale', 150)] } }),

    /* ───────────── BACK ───────────── */
    X({ id: 'pullup', name: 'Pull-up', part: 'back', equip: ['bar'], lvl: 3, pri: 1, reps: '4-10', met: 8,
      prim: ['Lats (back width)'], sec: ['Biceps', 'Rear shoulders', 'Core'],
      setup: 'Hang from a bar with an overhand grip slightly wider than shoulders, arms fully straight.',
      steps: ['Pull the shoulder blades down and back to start the movement.', 'Drive the elbows down towards your ribs and pull your chest to the bar.', 'Get your chin above the bar without craning the neck.', 'Lower all the way down under control.'],
      pos: [['Grip', 'Overhand, a little wider than shoulders, thumbs around the bar.'], ['Shoulders', 'Pulled down away from the ears.'], ['Core', 'Tight, legs slightly in front to stop swinging.'], ['Chest', 'Proud, leading towards the bar.']],
      err: ['Kipping / swinging', 'Half reps without full hang', 'Craning the chin over the bar'],
      breathe: 'Exhale as you pull up, inhale as you lower.', tip: 'Can\'t do one yet? Use resistance bands or do slow negatives (jump up, lower in 5 s).',
      anim: { hl: ['back', 'biceps'], props: { shapes: [['l', 55, 12, 145, 12, 5], ['l', 57, 12, 57, -8, 4], ['l', 143, 12, 143, -8, 4]] }, noGround: true, k: [
        K({ hip: [104, 117.8], t: -5, a1: { x: 100, y: 14 }, l1: [15, -70] }, 1000, 'Pull elbows down — exhale', 250),
        K({ hip: [102.4, 88.9], t: -12, a1: { x: 100, y: 14 }, l1: [15, -70] }, 1100, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'latpulldown', name: 'Lat Pulldown', part: 'back', equip: ['machine'], lvl: 1, pri: 1, reps: '10-12', met: 5,
      prim: ['Lats'], sec: ['Biceps', 'Rear shoulders', 'Mid back'],
      setup: 'Sit with thighs locked under the pad. Grab the bar slightly wider than shoulder-width.',
      steps: ['Lean back slightly (10–15°) with a proud chest.', 'Pull the bar down to your upper chest by driving the elbows down.', 'Squeeze the shoulder blades at the bottom.', 'Let the bar rise slowly until arms are straight.'],
      pos: [['Torso', 'Slight lean back — not swinging.'], ['Chest', 'Up, meeting the bar.'], ['Elbows', 'Point down to the floor.'], ['Thighs', 'Snug under the knee pad.']],
      err: ['Pulling behind the neck', 'Leaning way back to use momentum', 'Letting the weight yank the arms up'],
      breathe: 'Exhale as you pull down, inhale as it returns.', tip: 'Think "elbows to back pockets".',
      anim: { hl: ['back', 'biceps'], props: { cable: [90, -6], shapes: [['r', 70, 142, 40, 8], ['l', 90, 150, 90, 184, 4], ['r', 112, 124, 16, 8]] }, k: [
        K({ hip: [90, 138], t: -10, a1: { x: 90, y: 36 }, l1: [90, 0] }, 1000, 'Pull to upper chest — exhale', 250),
        K({ hip: [90, 138], t: -10, a1: { x: 90, y: 93 }, l1: [90, 0] }, 1100, 'Control it up — inhale', 150)] } }),

    X({ id: 'bbrow', name: 'Bent-over Barbell Row', part: 'back', equip: ['bb'], lvl: 2, pri: 1, reps: '6-10', met: 6,
      prim: ['Mid back', 'Lats'], sec: ['Rear shoulders', 'Biceps', 'Lower back'],
      setup: 'Hold a barbell with an overhand grip, soften the knees and hinge at the hips until the torso is 30–45° from the floor.',
      steps: ['Keep the back flat and core braced.', 'Row the bar towards your lower ribs / belly button.', 'Squeeze the shoulder blades together at the top.', 'Lower the bar under control to straight arms.'],
      pos: [['Back', 'Flat, neutral spine — never rounded.'], ['Hips', 'Pushed back, knees slightly bent.'], ['Head', 'In line with the spine, eyes on the floor a metre ahead.'], ['Elbows', 'Drive back close to the body.']],
      err: ['Rounding the lower back', 'Standing up as you row', 'Jerking the weight'],
      breathe: 'Exhale as you row, inhale as you lower.', tip: 'If your lower back fatigues, use a chest-supported or dumbbell row.',
      anim: { hl: ['back', 'biceps', 'hams'], props: { bb: true }, k: [
        K({ hip: [82, 106], t: 72, a1: { x: 128, y: 145 }, l1: AF }, 900, 'Row to the belly — exhale', 200),
        K({ hip: [82, 106], t: 72, a1: { x: 112, y: 112 }, l1: AF }, 1000, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'dbrow', name: 'One-arm Dumbbell Row', part: 'back', equip: ['db'], lvl: 1, pri: 1, reps: '10-12 each', met: 5,
      prim: ['Lats', 'Mid back'], sec: ['Biceps', 'Rear shoulders'],
      setup: 'Place one knee and the same-side hand on a bench (or sturdy chair). Other foot on the floor, dumbbell hanging in the free hand.',
      steps: ['Flatten the back so it is nearly parallel to the floor.', 'Pull the dumbbell up towards your hip, elbow close to the body.', 'Squeeze the back at the top for one second.', 'Lower to a full stretch.'],
      pos: [['Support hand', 'Directly under the shoulder.'], ['Back', 'Flat like a table — no twisting.'], ['Elbow', 'Travels back towards the hip, not out wide.'], ['Standing leg', 'Slightly bent, foot planted.']],
      err: ['Twisting the torso to lift', 'Pulling with the biceps only', 'Shrugging the shoulder'],
      breathe: 'Exhale up, inhale down.', tip: 'Imagine starting a lawn-mower — but slowly.',
      anim: { hl: ['back', 'biceps'], props: { db: 1, shapes: [['r', 38, 140, 112, 8], ['l', 44, 148, 44, 184, 4], ['l', 144, 148, 144, 184, 4]] }, k: [
        K({ hip: [82, 100], t: 80, a1: { x: 133, y: 146 }, a2: { x: 131, y: 140 }, l1: { x: 96, y: 180 }, l2: [0, -90], ft2: -95 }, 900, 'Row to the hip — exhale', 250),
        K({ hip: [82, 100], t: 80, a1: { x: 114, y: 108 }, a2: { x: 131, y: 140 }, l1: { x: 96, y: 180 }, l2: [0, -90], ft2: -95 }, 1000, 'Lower to a stretch — inhale', 150)] } }),

    X({ id: 'cablerow', name: 'Seated Cable Row', part: 'back', equip: ['machine'], lvl: 1, pri: 2, reps: '10-12', met: 5,
      prim: ['Mid back', 'Lats'], sec: ['Biceps', 'Rear shoulders'],
      setup: 'Sit with feet on the platform, knees slightly bent, holding the handle with arms extended.',
      steps: ['Sit tall with a neutral spine.', 'Pull the handle to your lower ribs, driving the elbows back.', 'Squeeze shoulder blades together.', 'Extend the arms slowly, letting the shoulders reach forward slightly.'],
      pos: [['Torso', 'Upright at the end of each rep — avoid big rocking.'], ['Knees', 'Soft, not locked.'], ['Elbows', 'Close to the body.'], ['Chest', 'Proud and open.']],
      err: ['Rocking back and forth', 'Rounding the lower back', 'Shrugging'],
      breathe: 'Exhale as you pull, inhale as you return.', tip: 'Pause for a second at full contraction.',
      anim: { hl: ['back', 'biceps'], props: { cable: [192, 152], shapes: [['r', 40, 154, 60, 8], ['l', 70, 162, 70, 184, 4], ['l', 152, 140, 152, 178, 6]] }, k: [
        K({ hip: [70, 148], t: 22, a1: { x: 142, y: 118 }, l1: { x: 144, y: 158 }, ft: 175 }, 900, 'Pull to the ribs — exhale', 250),
        K({ hip: [70, 148], t: -6, a1: { x: 88, y: 118 }, l1: { x: 144, y: 158 }, ft: 175 }, 1000, 'Reach forward — inhale', 150)] } }),

    X({ id: 'deadlift', name: 'Deadlift', part: 'back', sub: 'posterior', equip: ['bb'], lvl: 3, pri: 1, reps: '4-6', met: 6,
      prim: ['Glutes', 'Hamstrings', 'Lower back'], sec: ['Lats', 'Traps', 'Forearms', 'Quads'],
      setup: 'Stand with mid-foot under the bar, feet hip-width. Hinge down and grip just outside the knees.',
      steps: ['Shins touch the bar, hips higher than knees, chest up, back flat.', 'Take a big breath and brace your core hard.', 'Push the floor away and stand up, keeping the bar against your legs.', 'Lock out by squeezing the glutes — do not lean back.', 'Hinge the hips back to lower the bar the same way.'],
      pos: [['Back', 'Neutral and flat from neck to tailbone — the most important cue.'], ['Bar path', 'Straight vertical line over mid-foot, touching the legs.'], ['Shoulders', 'Slightly in front of the bar at the start.'], ['Feet', 'Hip-width, toes slightly out.'], ['Head', 'Neutral — eyes 2 m ahead on the floor.']],
      err: ['Rounding the back', 'Bar drifting away from the legs', 'Jerking the bar off the floor', 'Hyper-extending at the top'],
      breathe: 'Breathe in and brace before each rep, exhale at the top.', tip: 'Learn with light weight or a coach first; form before load.',
      anim: { hl: ['back', 'glutes', 'hams'], props: { bb: 15 }, k: [
        K({ hip: [65, 140], t: 55, a1: { x: 104, y: 165 }, l1: AF }, 1100, 'Push the floor away — exhale at top', 250),
        K({ hip: [98, 101], t: 0, a1: { x: 100, y: 104 }, l1: AF }, 1200, 'Hips back, lower — inhale', 250)] } }),

    X({ id: 'superman', name: 'Superman', part: 'back', equip: [], lvl: 1, pri: 3, reps: '10-15', met: 3.5, beginner: true,
      prim: ['Lower back (erector spinae)'], sec: ['Glutes', 'Upper back'],
      setup: 'Lie face down on a mat, arms stretched overhead and legs straight.',
      steps: ['Squeeze your glutes.', 'Lift arms, chest and legs a few centimetres off the floor at the same time.', 'Hold for 2 seconds at the top.', 'Lower slowly.'],
      pos: [['Head', 'Neutral — look at the floor, do not crank the neck up.'], ['Arms', 'Long, reaching forward.'], ['Legs', 'Straight, reaching back.'], ['Lift', 'Small and controlled — length over height.']],
      err: ['Jerking up high', 'Looking up and straining the neck', 'Holding the breath'],
      breathe: 'Exhale as you lift, inhale as you lower.', tip: 'Excellent for posture if you sit all day.',
      anim: { vb: '-12 -12 224 200', hl: ['back', 'glutes'], k: [
        K({ hip: [95, 174], t: 90, a1: [90, 90], l1: [-90, -90], ft: -80 }, 900, 'Lift arms, chest and legs — exhale', 200),
        K({ hip: [95, 174], t: 78, a1: [102, 102], l1: [-99, -99], ft: -90 }, 900, 'Hold, then lower — inhale', 600)] } }),

    /* ───────────── SHOULDERS ───────────── */
    X({ id: 'ohpress', name: 'Dumbbell Shoulder Press', part: 'shoulders', equip: ['db'], lvl: 1, pri: 1, reps: '8-12', met: 5,
      prim: ['Shoulders (front & side delts)'], sec: ['Triceps', 'Upper chest', 'Core'],
      setup: 'Stand or sit tall holding dumbbells at shoulder height, palms forward, elbows under the wrists.',
      steps: ['Brace the core and squeeze the glutes.', 'Press the dumbbells overhead until arms are straight.', 'Bring them slightly together at the top (do not clang).', 'Lower slowly back to ear / shoulder level.'],
      pos: [['Torso', 'Ribs down — avoid arching the lower back.'], ['Elbows', 'Slightly in front of the body, under the wrists.'], ['Head', 'Neutral; move it slightly back as the weights pass.'], ['Feet', 'Hip-width, weight even.']],
      err: ['Arching the back to push', 'Pressing forward instead of up', 'Partial reps'],
      breathe: 'Exhale as you press, inhale as you lower.', tip: 'Seated with back support is easier for beginners.',
      anim: { view: 'front', hl: ['delts', 'triceps'], props: { db: 2 }, k: [
        K({ hip: [100, 100], t: 0, a1: [88, 176], l1: [6, 6], g: 1 }, 900, 'Press overhead — exhale', 200),
        K({ hip: [100, 100], t: 0, a1: [160, 178], l1: [6, 6], g: 1 }, 1000, 'Lower to the ears — inhale', 200)] } }),

    X({ id: 'lateralraise', name: 'Lateral Raise', part: 'shoulders', equip: ['db'], lvl: 1, pri: 2, reps: '12-15', met: 4,
      prim: ['Side delts (shoulder width)'], sec: ['Traps', 'Front delts'],
      setup: 'Stand tall, dumbbells by your sides, slight bend in the elbows.',
      steps: ['Raise the arms out to the sides, leading with the elbows.', 'Stop at shoulder height — arms parallel to the floor.', 'Pause for a moment.', 'Lower slowly over 2–3 seconds.'],
      pos: [['Elbows', 'Slightly bent and higher than the hands.'], ['Shoulders', 'Down — do not shrug.'], ['Torso', 'Upright, no swinging.'], ['Wrists', 'Neutral and in line with the forearm — lead with the elbows.']],
      err: ['Using heavy weights and swinging', 'Raising above shoulder height with shrugging', 'Bent wrists'],
      breathe: 'Exhale as you raise, inhale as you lower.', tip: 'Light weight + perfect form builds round shoulders.',
      anim: { view: 'front', hl: ['delts'], props: { db: 2 }, k: [
        K({ hip: [100, 100], t: 0, a1: [8, 6], l1: [5, 5], g: 1 }, 900, 'Raise to shoulder height — exhale', 200),
        K({ hip: [100, 100], t: 0, a1: [84, 92], l1: [5, 5], g: 1 }, 1100, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'frontraise', name: 'Front Raise', part: 'shoulders', equip: ['db'], lvl: 1, pri: 3, reps: '10-12', met: 4,
      prim: ['Front delts'], sec: ['Upper chest', 'Core'],
      setup: 'Stand tall holding dumbbells in front of your thighs, palms facing you.',
      steps: ['Brace the core.', 'Raise the dumbbells straight in front to shoulder height.', 'Pause briefly.', 'Lower under control.'],
      pos: [['Arms', 'Almost straight, soft elbows.'], ['Torso', 'Do not lean back.'], ['Shoulders', 'Relaxed and down.'], ['Feet', 'Hip-width.']],
      err: ['Swinging with the hips', 'Lifting too heavy', 'Going above eye level'],
      breathe: 'Exhale up, inhale down.', tip: 'Alternate arms to make it easier.',
      anim: { hl: ['delts'], props: { db: 2 }, k: [
        K({ hip: [100, 100], t: 0, a1: [6, 6], l1: [0, 0], g: 1 }, 900, 'Raise to shoulder height — exhale', 200),
        K({ hip: [100, 100], t: 0, a1: [92, 92], l1: [0, 0], g: 1 }, 1000, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'reardelt', name: 'Bent-over Rear Delt Fly', part: 'shoulders', equip: ['db'], lvl: 1, pri: 3, reps: '12-15', met: 4,
      prim: ['Rear delts'], sec: ['Upper back', 'Traps'],
      setup: 'Hold light dumbbells, hinge forward at the hips until your torso is near parallel to the floor, arms hanging.',
      steps: ['Keep a slight bend in the elbows.', 'Raise the arms out to the sides like wings.', 'Squeeze the shoulder blades at the top.', 'Lower slowly.'],
      pos: [['Back', 'Flat, hinged from the hips.'], ['Neck', 'Neutral — look at the floor.'], ['Arms', 'Move out to the side, not backwards.'], ['Knees', 'Softly bent.']],
      err: ['Standing up during the rep', 'Using momentum', 'Going too heavy'],
      breathe: 'Exhale as you raise, inhale as you lower.', tip: 'Great for posture and healthy shoulders.',
      anim: { view: 'front', cap: 'Front view — torso bent forward', hl: ['delts', 'back'], props: { db: 2 }, k: [
        K({ hip: [100, 100], t: 0, tl: 0.55, a1: [-6, -6], l1: [6, 6], g: 1 }, 900, 'Raise like wings — exhale', 200),
        K({ hip: [100, 100], t: 0, tl: 0.55, a1: [80, 86], l1: [6, 6], g: 1 }, 1000, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'pikepushup', name: 'Pike Push-up', part: 'shoulders', equip: [], lvl: 2, pri: 1, reps: '6-12', met: 6,
      prim: ['Shoulders'], sec: ['Triceps', 'Upper chest'],
      setup: 'Start in a push-up position, then walk your feet in and lift the hips high into an upside-down V.',
      steps: ['Hands shoulder-width, head between the arms.', 'Bend the elbows and lower the top of your head towards the floor in front of your hands.', 'Keep hips high.', 'Press back up to straight arms.'],
      pos: [['Hips', 'High — this makes the press vertical.'], ['Head', 'Travels slightly in front of the hands, forming a triangle.'], ['Elbows', 'Point back at about 45°.'], ['Legs', 'Straight or slightly bent.']],
      err: ['Dropping the hips', 'Elbows flaring out', 'Banging the head on the floor'],
      breathe: 'Inhale down, exhale up.', tip: 'Elevate your feet on a step to make it harder.',
      anim: { hl: ['delts', 'triceps'], k: [
        K({ hip: [80, 104], t: 115, a1: { x: 128, y: 180 }, l1: { x: 50, y: 176 }, ft: 40 }, 1000, 'Lower the head — inhale', 200),
        K({ hip: [80, 104], t: 145, a1: { x: 128, y: 180 }, l1: { x: 50, y: 176 }, ft: 40 }, 900, 'Press up — exhale', 150)] } }),

    X({ id: 'shrugs', name: 'Dumbbell Shrugs', part: 'shoulders', equip: ['db'], lvl: 1, pri: 3, reps: '12-15', met: 3.5,
      prim: ['Upper traps'], sec: ['Forearms (grip)'],
      setup: 'Stand tall with heavy-ish dumbbells at your sides, arms straight.',
      steps: ['Lift the shoulders straight up towards the ears.', 'Hold for 1–2 seconds.', 'Lower slowly to a full stretch.'],
      pos: [['Arms', 'Straight — no bending the elbows.'], ['Head', 'Neutral; do not push the chin forward.'], ['Motion', 'Straight up and down — do not roll the shoulders.']],
      err: ['Rolling the shoulders', 'Bending the elbows', 'Bouncing reps'],
      breathe: 'Exhale up, inhale down.', tip: 'Hold the top to really feel the traps.',
      anim: { view: 'front', hl: ['traps', 'delts'], props: { db: 2 }, k: [
        K({ hip: [100, 100], t: 0, a1: [4, 3], l1: [5, 5], g: 1, sh: 0 }, 700, 'Shrug up — exhale', 200),
        K({ hip: [100, 100], t: 0, a1: [4, 3], l1: [5, 5], g: 1, sh: 7 }, 800, 'Lower slowly — inhale', 600)] } }),

    /* ───────────── ARMS ───────────── */
    X({ id: 'curl', name: 'Dumbbell Biceps Curl', part: 'arms', sub: 'biceps', equip: ['db'], lvl: 1, pri: 1, reps: '10-12', met: 4,
      prim: ['Biceps'], sec: ['Forearms'],
      setup: 'Stand tall with dumbbells at your sides, palms facing forward.',
      steps: ['Pin your elbows to your sides.', 'Curl the weights up by bending only at the elbow.', 'Squeeze the biceps at the top.', 'Lower slowly until arms are straight.'],
      pos: [['Elbows', 'Fixed at your sides — they should not move forward.'], ['Torso', 'Upright, no swinging.'], ['Wrists', 'Straight and strong.'], ['Feet', 'Hip-width, knees soft.']],
      err: ['Swinging the body', 'Elbows drifting forward', 'Not straightening the arms fully'],
      breathe: 'Exhale as you curl, inhale as you lower.', tip: 'Take 3 seconds to lower for extra growth.',
      anim: { hl: ['biceps', 'forearm'], props: { db: 2 }, k: [
        K({ hip: [100, 100], t: 0, a1: [2, 4], l1: [0, 0], g: 1 }, 800, 'Curl up — exhale', 200),
        K({ hip: [100, 100], t: 0, a1: [-2, 150], l1: [0, 0], g: 1 }, 1100, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'hammercurl', name: 'Hammer Curl', part: 'arms', sub: 'biceps', equip: ['db'], lvl: 1, pri: 2, reps: '10-12', met: 4,
      prim: ['Brachialis', 'Forearms'], sec: ['Biceps'],
      setup: 'Stand holding dumbbells at your sides with palms facing your body (neutral grip).',
      steps: ['Keep elbows by your sides.', 'Curl the dumbbells up keeping palms facing in, like holding a hammer.', 'Squeeze at the top.', 'Lower under control.'],
      pos: [['Grip', 'Neutral — thumbs pointing up.'], ['Elbows', 'Fixed at the sides.'], ['Torso', 'Still and upright.']],
      err: ['Swinging', 'Rotating the wrists', 'Rushing the lowering'],
      breathe: 'Exhale up, inhale down.', tip: 'Builds thicker arms and a stronger grip.',
      anim: { hl: ['biceps', 'forearm'], props: { db: 2 }, k: [
        K({ hip: [100, 100], t: 0, a1: [2, 4], l1: [0, 0], g: 1 }, 800, 'Curl up — exhale', 200),
        K({ hip: [100, 100], t: 0, a1: [-2, 145], l1: [0, 0], g: 1 }, 1100, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'bbcurl', name: 'Barbell Curl', part: 'arms', sub: 'biceps', equip: ['bb'], lvl: 1, pri: 1, reps: '8-12', met: 4,
      prim: ['Biceps'], sec: ['Forearms'],
      setup: 'Stand holding a barbell with an underhand grip at shoulder-width, arms straight.',
      steps: ['Pin the elbows by your sides.', 'Curl the bar towards your shoulders.', 'Squeeze the biceps.', 'Lower all the way down slowly.'],
      pos: [['Elbows', 'Locked to your sides.'], ['Back', 'Neutral — do not lean back.'], ['Grip', 'Shoulder-width, palms up.']],
      err: ['Leaning back to lift', 'Elbows moving forward', 'Bouncing at the bottom'],
      breathe: 'Exhale up, inhale down.', tip: 'Use an EZ-bar if straight bars hurt your wrists.',
      anim: { hl: ['biceps', 'forearm'], props: { bb: 10 }, k: [
        K({ hip: [100, 100], t: 0, a1: [2, 4], l1: [0, 0], g: 1 }, 800, 'Curl up — exhale', 200),
        K({ hip: [100, 100], t: 0, a1: [-2, 148], l1: [0, 0], g: 1 }, 1100, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'ohtricep', name: 'Overhead Triceps Extension', part: 'arms', sub: 'triceps', equip: ['db'], lvl: 1, pri: 1, reps: '10-12', met: 4,
      prim: ['Triceps (long head)'], sec: ['Core'],
      setup: 'Stand or sit tall holding one dumbbell with both hands above your head, arms straight.',
      steps: ['Keep upper arms close to your ears.', 'Bend the elbows to lower the dumbbell behind your head.', 'Feel the stretch in the back of the arms.', 'Straighten the arms to return.'],
      pos: [['Upper arms', 'Vertical and still, elbows pointing forward.'], ['Core', 'Braced — do not arch the lower back.'], ['Head', 'Neutral, pushed slightly forward of the arms.']],
      err: ['Elbows flaring out wide', 'Arching the back', 'Going too heavy'],
      breathe: 'Inhale as you lower, exhale as you extend.', tip: 'Sit on a bench with back support to protect the lower back.',
      anim: { hl: ['triceps'], props: { db: 1 }, k: [
        K({ hip: [100, 100], t: 0, a1: [172, 178], l1: [0, 0], g: 1 }, 1100, 'Lower behind the head — inhale', 200),
        K({ hip: [100, 100], t: 0, a1: [172, 350], l1: [0, 0], g: 1 }, 900, 'Extend up — exhale', 200)] } }),

    X({ id: 'pushdown', name: 'Triceps Pushdown', part: 'arms', sub: 'triceps', equip: ['machine'], lvl: 1, pri: 1, reps: '10-15', met: 4,
      prim: ['Triceps'], sec: ['Forearms'],
      setup: 'Face a high cable pulley holding a bar or rope, elbows at your sides, forearms parallel to the floor.',
      steps: ['Lean very slightly forward with a braced core.', 'Push the handle down until arms are straight.', 'Squeeze the triceps.', 'Let the forearms rise back to parallel — elbows stay put.'],
      pos: [['Elbows', 'Glued to your sides.'], ['Torso', 'Slight forward lean, still.'], ['Wrists', 'Neutral.']],
      err: ['Elbows moving forward', 'Using body weight to push', 'Letting the stack slam'],
      breathe: 'Exhale down, inhale up.', tip: 'With a rope, spread the ends apart at the bottom.',
      anim: { hl: ['triceps'], props: { cable: [124, -8] }, k: [
        K({ hip: [100, 100], t: 8, a1: [-5, 100], l1: [0, 0], g: 1 }, 800, 'Push down — exhale', 200),
        K({ hip: [100, 100], t: 8, a1: [-5, 4], l1: [0, 0], g: 1 }, 1000, 'Return slowly — inhale', 200)] } }),

    X({ id: 'diamondpushup', name: 'Diamond Push-up', part: 'arms', sub: 'triceps', equip: [], lvl: 2, pri: 2, reps: '6-12', met: 8,
      prim: ['Triceps'], sec: ['Inner chest', 'Shoulders'],
      setup: 'High plank with hands together under the chest, thumbs and index fingers forming a diamond.',
      steps: ['Brace the core with a straight body.', 'Lower the chest towards your hands, elbows close to the body.', 'Touch or come close to the hands.', 'Press back up.'],
      pos: [['Hands', 'Under the sternum, forming a diamond.'], ['Elbows', 'Brush the ribs as you lower.'], ['Body', 'Plank line.']],
      err: ['Elbows flaring', 'Sagging hips', 'Hands too far forward'],
      breathe: 'Inhale down, exhale up.', tip: 'Do it on knees first if needed.',
      anim: { hl: ['triceps', 'chest'], k: [
        K({ hip: [112.5, 144], t: 68.7, a1: { x: 152, y: 180 }, l1: { x: 38, y: 173 }, ft: 40 }, 1000, 'Lower — inhale', 200),
        K({ hip: [117.6, 165], t: 84.3, a1: { x: 152, y: 180 }, l1: { x: 38, y: 173 }, ft: 40 }, 900, 'Press up — exhale', 150)] } }),

    X({ id: 'benchdips', name: 'Bench / Chair Dips', part: 'arms', sub: 'triceps', equip: [], lvl: 1, pri: 2, reps: '10-15', met: 5,
      prim: ['Triceps'], sec: ['Front shoulders', 'Chest'],
      setup: 'Sit on the edge of a sturdy bench or chair, hands next to your hips, fingers forward. Slide your hips off the edge.',
      steps: ['Keep your back close to the bench.', 'Bend the elbows straight back to lower your hips.', 'Stop when upper arms are parallel to the floor.', 'Press up to straight arms.'],
      pos: [['Elbows', 'Point straight back, not out.'], ['Shoulders', 'Down, chest open.'], ['Hips', 'Close to the bench.'], ['Feet', 'Knees bent = easier; legs straight = harder.']],
      err: ['Going too deep (shoulder strain)', 'Flaring elbows', 'Using a chair that can slide'],
      breathe: 'Inhale down, exhale up.', tip: 'Place the chair against a wall so it cannot move.',
      anim: { hl: ['triceps'], props: { shapes: [['r', 25, 132, 55, 8], ['l', 32, 140, 32, 184, 4], ['l', 73, 140, 73, 184, 4]] }, k: [
        K({ hip: [76, 128], t: 0, a1: { x: 74, y: 132 }, l1: { x: 132, y: 180 }, ft: 140 }, 1000, 'Lower the hips — inhale', 200),
        K({ hip: [79, 152], t: 5, a1: { x: 74, y: 132 }, l1: { x: 132, y: 180 }, ft: 140 }, 900, 'Press up — exhale', 150)] } }),

    /* ───────────── LEGS ───────────── */
    X({ id: 'squat', name: 'Bodyweight Squat', part: 'legs', sub: 'quads', equip: [], lvl: 1, pri: 1, reps: '12-20', met: 5,
      prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Core', 'Calves'],
      setup: 'Stand with feet shoulder-width apart, toes turned out 10–20°, arms in front for balance.',
      steps: ['Brace your core and keep the chest up.', 'Push the hips back and bend the knees as if sitting on a chair.', 'Lower until thighs are at least parallel to the floor.', 'Drive through the whole foot to stand up, squeezing the glutes.'],
      pos: [['Feet', 'Shoulder-width, flat; heels never lift.'], ['Knees', 'Track in line with the toes — do not cave in.'], ['Back', 'Neutral; chest proud.'], ['Hips', 'Back and down, to parallel or below.'], ['Head', 'Eyes forward.']],
      err: ['Knees collapsing inward', 'Heels lifting', 'Rounding the back', 'Only bending the knees'],
      breathe: 'Inhale on the way down, exhale as you stand.', tip: 'Squat to a chair to learn depth.',
      anim: { hl: ['quads', 'glutes'], k: [
        K({ hip: [98, 101], t: 3, a1: [10, 10], l1: AF }, 1100, 'Sit back & down — inhale', 200),
        K({ hip: [77, 143], t: 40, a1: [85, 90], l1: AF }, 1000, 'Drive up through heels — exhale', 200)] } }),

    X({ id: 'backsquat', name: 'Barbell Back Squat', part: 'legs', sub: 'quads', equip: ['bb'], lvl: 2, pri: 1, reps: '5-8', met: 6,
      prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Lower back', 'Core'],
      setup: 'Bar on your upper back (traps), hands just outside shoulders, feet shoulder-width, toes slightly out.',
      steps: ['Take a big breath and brace.', 'Sit down and back, keeping the bar over mid-foot.', 'Reach at least parallel depth.', 'Drive up, keeping the chest and hips rising together.'],
      pos: [['Bar', 'On the meaty part of the traps — not the neck.'], ['Elbows', 'Pulled down under the bar.'], ['Back', 'Tight and neutral.'], ['Knees', 'Push out over the toes.'], ['Feet', 'Flat, weight over mid-foot.']],
      err: ['Good-morning (hips shoot up first)', 'Knees caving', 'Losing the brace at the bottom'],
      breathe: 'Inhale and brace at the top, hold down, exhale through the top half.', tip: 'Always squat inside a rack with safety bars.',
      anim: { hl: ['quads', 'glutes', 'back'], props: { bb: true }, k: [
        K({ hip: [98, 101], t: 4, a1: { dx: -4, dy: -5 }, l1: AF }, 1100, 'Sit down — breathe & brace', 200),
        K({ hip: [77, 143], t: 44, a1: { dx: -4, dy: -5 }, l1: AF }, 1000, 'Drive up — exhale at top', 200)] } }),

    X({ id: 'gobletsquat', name: 'Goblet Squat', part: 'legs', sub: 'quads', equip: ['db'], lvl: 1, pri: 1, reps: '10-15', met: 5,
      prim: ['Quads', 'Glutes'], sec: ['Core', 'Upper back'],
      setup: 'Hold one dumbbell vertically against your chest with both hands. Feet slightly wider than shoulders.',
      steps: ['Keep the dumbbell glued to your chest.', 'Squat down between your knees, chest up.', 'Elbows go inside the knees at the bottom.', 'Stand up by pushing through the whole foot.'],
      pos: [['Weight', 'Close to the chest under the chin.'], ['Torso', 'Tall — the weight keeps you upright.'], ['Knees', 'Out, in line with toes.'], ['Heels', 'Down.']],
      err: ['Letting the weight drift away', 'Rounding forward', 'Heels lifting'],
      breathe: 'Inhale down, exhale up.', tip: 'The best way to learn a deep squat.',
      anim: { hl: ['quads', 'glutes'], props: { db: 1 }, k: [
        K({ hip: [98, 101], t: 2, a1: { dx: 12, dy: 8 }, l1: AF }, 1100, 'Squat down — inhale', 200),
        K({ hip: [78, 143], t: 35, a1: { dx: 12, dy: 8 }, l1: AF }, 1000, 'Stand tall — exhale', 200)] } }),

    X({ id: 'lunge', name: 'Lunge', part: 'legs', sub: 'quads', equip: [], knee: true, lvl: 1, pri: 1, reps: '10-12 each', met: 5,
      prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Calves', 'Balance'],
      setup: 'Stand tall, hands on hips. Take a big step forward into a split stance.',
      steps: ['Keep the torso upright.', 'Lower the back knee straight down towards the floor.', 'Front knee bends to about 90°, staying over the ankle.', 'Push through the front heel to rise.'],
      pos: [['Front foot', 'Flat; knee over the ankle, not past the toes much.'], ['Back foot', 'On the ball of the foot.'], ['Torso', 'Upright, core tight.'], ['Hips', 'Square to the front.']],
      err: ['Front knee caving in', 'Leaning forward', 'Steps too short'],
      breathe: 'Inhale down, exhale up.', tip: 'Hold dumbbells to make it harder.',
      anim: { hl: ['quads', 'glutes'], k: [
        K({ hip: [90, 106], t: 0, a1: { dx: 6, dy: 44 }, l1: { x: 122, y: 180 }, l2: { x: 58, y: 176 }, ft2: 40 }, 1000, 'Lower the back knee — inhale', 150),
        K({ hip: [88, 142], t: 2, a1: { dx: 6, dy: 44 }, l1: { x: 122, y: 180 }, l2: { x: 58, y: 176 }, ft2: 40 }, 900, 'Push through front heel — exhale', 150)] } }),

    X({ id: 'bulgarian', name: 'Bulgarian Split Squat', part: 'legs', sub: 'quads', equip: [], knee: true, lvl: 2, pri: 1, reps: '8-12 each', met: 6,
      prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Core'],
      setup: 'Stand about two steps in front of a bench or chair. Place the top of your back foot on it.',
      steps: ['Keep most of your weight on the front leg.', 'Lower straight down until the front thigh is near parallel.', 'Keep the chest up.', 'Drive through the front heel to stand.'],
      pos: [['Front foot', 'Far enough forward that the knee stays roughly over the ankle.'], ['Back foot', 'Laces down on the bench.'], ['Torso', 'Slight forward lean is fine for more glute.'], ['Hips', 'Square.']],
      err: ['Front foot too close to the bench', 'Pushing off the back leg', 'Wobbling knee'],
      breathe: 'Inhale down, exhale up.', tip: 'Hold a wall for balance at first.',
      anim: { hl: ['quads', 'glutes'], props: { db: 2, shapes: [['r', 15, 150, 48, 8], ['l', 20, 158, 20, 184, 4], ['l', 58, 158, 58, 184, 4]] }, k: [
        K({ hip: [98, 104], t: 5, a1: [5, 5], l1: { x: 122, y: 180 }, l2: { x: 46, y: 146 }, ft2: -80 }, 1000, 'Lower straight down — inhale', 150),
        K({ hip: [92, 138], t: 15, a1: [10, 8], l1: { x: 122, y: 180 }, l2: { x: 46, y: 146 }, ft2: -80 }, 900, 'Drive up — exhale', 150)] } }),

    X({ id: 'legpress', name: 'Leg Press', part: 'legs', sub: 'quads', equip: ['machine'], lvl: 1, pri: 1, reps: '10-15', met: 5,
      prim: ['Quads', 'Glutes'], sec: ['Hamstrings', 'Calves'],
      setup: 'Sit with your back flat against the pad, feet shoulder-width in the middle of the platform.',
      steps: ['Release the safety handles.', 'Lower the platform until knees are about 90°.', 'Keep your lower back on the pad.', 'Press through the heels without locking the knees.'],
      pos: [['Back & hips', 'Flat on the seat — do not let the hips roll up.'], ['Feet', 'Shoulder-width, whole foot on the platform.'], ['Knees', 'In line with toes; never snap-lock at the top.'], ['Hands', 'On the side handles.']],
      err: ['Locking the knees', 'Going so deep the lower back lifts', 'Heels lifting'],
      breathe: 'Inhale down, exhale as you press.', tip: 'Higher feet = more glutes; lower feet = more quads.',
      anim: { hl: ['quads', 'glutes'], props: { pf: [0.54, 0.84], shapes: [['l', 20, 95, 64, 146, 9], ['l', 55, 146, 95, 146, 9], ['l', 62, 150, 62, 184, 4], ['l', 96, 160, 186, 74, 3]] }, k: [
        K({ hip: [70, 140], t: -50, a1: [20, 60], l1: { x: 138, y: 96 }, ft: 150 }, 1100, 'Lower to 90° — inhale', 200),
        K({ hip: [70, 140], t: -50, a1: [20, 60], l1: { x: 108, y: 117 }, ft: 150 }, 900, 'Press through heels — exhale', 150)] } }),

    X({ id: 'rdl', name: 'Romanian Deadlift (Dumbbell)', part: 'legs', sub: 'hams', equip: ['db'], lvl: 2, pri: 1, reps: '8-12', met: 5,
      prim: ['Hamstrings', 'Glutes'], sec: ['Lower back', 'Forearms'],
      setup: 'Stand tall holding dumbbells in front of your thighs, feet hip-width, knees soft.',
      steps: ['Push the hips straight back, keeping the weights close to your legs.', 'Lower until you feel a strong stretch in the hamstrings (around mid-shin).', 'Keep the back flat the entire time.', 'Drive the hips forward to stand tall and squeeze the glutes.'],
      pos: [['Hips', 'Move back like closing a car door with your bum.'], ['Knees', 'Slightly bent and fixed.'], ['Back', 'Flat, chest proud.'], ['Weights', 'Slide along the thighs and shins.']],
      err: ['Rounding the back to reach lower', 'Squatting instead of hinging', 'Weights drifting forward'],
      breathe: 'Inhale down, exhale up.', tip: 'Range is limited by hamstring flexibility — that is fine.',
      anim: { hl: ['hams', 'glutes', 'back'], props: { db: 2 }, k: [
        K({ hip: [98, 101], t: 0, a1: { x: 100, y: 104 }, l1: AF }, 1200, 'Hips back — inhale', 200),
        K({ hip: [80, 104], t: 62, a1: { x: 112, y: 130 }, l1: AF }, 1000, 'Hips forward, squeeze glutes — exhale', 200)] } }),

    X({ id: 'calfraise', name: 'Standing Calf Raise', part: 'legs', sub: 'calves', equip: [], lvl: 1, pri: 3, reps: '15-20', met: 3.5,
      prim: ['Calves'], sec: ['Ankle stability'],
      setup: 'Stand tall with feet hip-width (on a step edge for more range). Hold a wall for balance.',
      steps: ['Rise up onto the balls of your feet as high as possible.', 'Pause and squeeze at the top.', 'Lower slowly, letting the heels drop below the step if using one.'],
      pos: [['Knees', 'Straight but not locked.'], ['Ankles', 'Rise straight — do not roll out.'], ['Body', 'Tall, weight over big toes.']],
      err: ['Bouncing', 'Partial range', 'Rolling onto the little toes'],
      breathe: 'Exhale up, inhale down.', tip: 'Hold dumbbells or do single-leg to progress.',
      anim: { hl: ['calves'], k: [
        K({ hip: [100, 100], t: 0, a1: [4, 4], l1: [0, 0], ft: 90, g: 1 }, 700, 'Rise up — exhale', 200),
        K({ hip: [100, 100], t: 0, a1: [4, 4], l1: [0, 0], ft: 30, g: 1 }, 900, 'Lower slowly — inhale', 500)] } }),

    X({ id: 'wallsit', name: 'Wall Sit', part: 'legs', sub: 'quads', equip: [], lvl: 1, pri: 3, type: 'time', reps: '30-60s', met: 4,
      prim: ['Quads'], sec: ['Glutes', 'Core'],
      setup: 'Stand with your back against a wall, feet about 60 cm in front of it.',
      steps: ['Slide down until your knees are bent at 90°.', 'Keep the whole back and head against the wall.', 'Hold the position.', 'Slide up to finish.'],
      pos: [['Back', 'Flat against the wall.'], ['Knees', '90°, directly over the ankles.'], ['Feet', 'Hip-width and flat.'], ['Arms', 'Relaxed by your sides — not pushing on the thighs.']],
      err: ['Knees past the toes', 'Hands pushing on thighs', 'Holding the breath'],
      breathe: 'Breathe slowly and steadily throughout.', tip: 'Add 10 seconds each week.',
      anim: { hl: ['quads'], props: { shapes: [['l', 58, 0, 58, 184, 5]] }, k: [
        K({ hip: [70, 140], t: 0, a1: [5, 5], l1: { x: 110, y: 180 } }, 1500, 'Hold — breathe steadily'),
        K({ hip: [70, 139], t: 0, a1: [5, 5], l1: { x: 110, y: 180 } }, 1500, 'Hold — breathe steadily')] } }),

    X({ id: 'stepup', name: 'Step-ups', part: 'legs', sub: 'quads', equip: [], lvl: 1, pri: 2, reps: '10-12 each', met: 6,
      prim: ['Quads', 'Glutes'], sec: ['Calves', 'Balance'],
      setup: 'Stand facing a sturdy step, stair or box at knee height or lower.',
      steps: ['Place one whole foot on the step.', 'Drive through that heel to stand up on the step.', 'Bring the other foot up.', 'Step down with control and repeat.'],
      pos: [['Lead foot', 'Whole foot on the step.'], ['Knee', 'Tracks over the toes.'], ['Torso', 'Tall, slight forward lean.'], ['Push', 'Come from the top leg, not a bounce from the bottom.']],
      err: ['Pushing off the back foot', 'Knee caving in', 'Unstable step'],
      breathe: 'Exhale as you step up, inhale down.', tip: 'Your home stairs work perfectly.',
      anim: { hl: ['quads', 'glutes'], props: { shapes: [['r', 108, 146, 52, 38]] }, k: [
        K({ hip: [90, 104], t: 4, a1: [-10, -5], a2: [15, 20], l1: { x: 124, y: 142 }, l2: { x: 88, y: 180 } }, 900, 'Drive up through the heel — exhale', 150),
        K({ hip: [118, 66], t: 0, a1: [5, 5], l1: { x: 124, y: 142 }, l2: { x: 114, y: 142 } }, 900, 'Step down slowly — inhale', 300)] } }),

    /* ───────────── GLUTES ───────────── */
    X({ id: 'glutebridge', name: 'Glute Bridge', part: 'glutes', equip: [], lvl: 1, pri: 1, reps: '12-20', met: 3.5, beginner: true,
      prim: ['Glutes'], sec: ['Hamstrings', 'Core'],
      setup: 'Lie on your back, knees bent, feet flat and hip-width, close to your bum. Arms by your sides.',
      steps: ['Press through your heels and squeeze the glutes.', 'Lift the hips until knees, hips and shoulders form a straight line.', 'Hold for 2 seconds.', 'Lower slowly.'],
      pos: [['Feet', 'Flat, under the knees at the top.'], ['Ribs', 'Down — do not over-arch the lower back.'], ['Knees', 'Hip-width, not falling in.'], ['Shoulders', 'Stay on the floor.']],
      err: ['Arching the lower back instead of using glutes', 'Pushing through the toes', 'Rushing'],
      breathe: 'Exhale up, inhale down.', tip: 'Single-leg bridges make it much harder.',
      anim: { hl: ['glutes', 'hams'], k: [
        K({ hip: [87, 174], t: 90, a1: [-92, -90], l1: { x: 55, y: 180, b: 1 } }, 900, 'Lift the hips — exhale', 200),
        K({ hip: [100, 140], t: 132.8, a1: [-92, -90], l1: { x: 55, y: 180, b: 1 } }, 1000, 'Hold, then lower — inhale', 600)] } }),

    X({ id: 'hipthrust', name: 'Hip Thrust', part: 'glutes', equip: [], lvl: 2, pri: 1, reps: '10-15', met: 4,
      prim: ['Glutes'], sec: ['Hamstrings', 'Quads'],
      setup: 'Sit with your upper back against a bench or sofa edge, knees bent, feet flat. Place a weight on your hips (optional).',
      steps: ['Tuck the chin slightly and brace.', 'Drive through the heels to lift the hips until the torso is parallel to the floor.', 'Squeeze the glutes hard at the top.', 'Lower with control.'],
      pos: [['Upper back', 'Bench edge just under the shoulder blades.'], ['Shins', 'Vertical at the top.'], ['Chin', 'Tucked — eyes forward, not at the ceiling.'], ['Pelvis', 'Slight tuck at the top.']],
      err: ['Overarching the lower back', 'Feet too far / too close', 'Not reaching full hip extension'],
      breathe: 'Exhale up, inhale down.', tip: 'One of the best exercises to build glutes.',
      anim: { hl: ['glutes', 'hams'], props: { hipbar: 1, shapes: [['r', 128, 140, 57, 10], ['l', 135, 150, 135, 184, 4], ['l', 178, 150, 178, 184, 4]] }, k: [
        K({ hip: [90, 165], t: 66, a1: [100, 30], l1: { x: 60, y: 180, b: 1 } }, 900, 'Drive the hips up — exhale', 200),
        K({ hip: [92, 130], t: 100, a1: [100, 30], l1: { x: 60, y: 180, b: 1 } }, 1000, 'Squeeze, lower — inhale', 500)] } }),

    X({ id: 'donkeykick', name: 'Donkey Kick', part: 'glutes', equip: [], lvl: 1, pri: 2, reps: '12-15 each', met: 3.5, beginner: true,
      prim: ['Glutes'], sec: ['Hamstrings', 'Core'],
      setup: 'Start on all fours: hands under shoulders, knees under hips.',
      steps: ['Keep the knee bent at 90°.', 'Kick one foot up towards the ceiling, sole facing up.', 'Squeeze the glute at the top.', 'Lower without touching the knee down.'],
      pos: [['Back', 'Flat like a table — do not arch.'], ['Hips', 'Level, not rotating open.'], ['Head', 'Neutral.'], ['Support arms', 'Straight under the shoulders.']],
      err: ['Arching the lower back', 'Swinging fast', 'Rotating the hip'],
      breathe: 'Exhale as you kick, inhale as you lower.', tip: 'Add an ankle weight or band to progress.',
      anim: { hl: ['glutes'], k: [
        K({ hip: [80, 140], t: 73.7, a1: { x: 128, y: 180 }, l1: [0, -90], l2: [0, -90], ft: -95, ft2: -95 }, 700, 'Kick up — exhale', 150),
        K({ hip: [80, 140], t: 73.7, a1: { x: 128, y: 180 }, l1: [-100, -182], l2: [0, -90], ft: -170, ft2: -95 }, 800, 'Lower — inhale', 300)] } }),

    X({ id: 'sumosquat', name: 'Sumo Squat', part: 'glutes', equip: ['db'], lvl: 1, pri: 1, reps: '12-15', met: 5,
      prim: ['Glutes', 'Inner thighs (adductors)'], sec: ['Quads', 'Core'],
      setup: 'Stand with feet wide (about 1.5× shoulder-width), toes pointing out 30–45°. Hold one dumbbell hanging between the legs.',
      steps: ['Keep the chest up.', 'Push the knees out and sit straight down.', 'Lower until thighs are parallel.', 'Drive up squeezing glutes and inner thighs.'],
      pos: [['Feet', 'Wide, toes out.'], ['Knees', 'Push out in the same direction as the toes.'], ['Torso', 'Upright.'], ['Weight', 'Hangs straight down.']],
      err: ['Knees collapsing inward', 'Leaning forward', 'Stance too narrow'],
      breathe: 'Inhale down, exhale up.', tip: 'Do it without weight at home to start.',
      anim: { view: 'front', hl: ['glutes', 'quads'], props: { kb: 1 }, k: [
        K({ hip: [100, 100], t: 0, a1: [-14, -14], l1: [20, 20], g: 1 }, 1000, 'Sit down, knees out — inhale', 150),
        K({ hip: [100, 100], t: 0, a1: [-14, -14], l1: [60, -12], g: 1 }, 900, 'Drive up — exhale', 150)] } }),

    /* ───────────── CORE ───────────── */
    X({ id: 'plank', name: 'Forearm Plank', part: 'core', equip: [], lvl: 1, pri: 1, type: 'time', reps: '30-60s', met: 3.8,
      prim: ['Abs (transverse & rectus)'], sec: ['Shoulders', 'Glutes', 'Lower back'],
      setup: 'Forearms on the floor with elbows under shoulders, legs straight back, on your toes.',
      steps: ['Lift the hips so the body forms a straight line.', 'Squeeze glutes and pull belly button towards the spine.', 'Push the floor away with the forearms.', 'Hold while breathing steadily.'],
      pos: [['Elbows', 'Directly under the shoulders.'], ['Hips', 'Level with shoulders — no sagging or piking.'], ['Head', 'Neutral, eyes on the floor.'], ['Feet', 'Hip-width.']],
      err: ['Hips sagging', 'Hips too high', 'Holding the breath', 'Looking up'],
      breathe: 'Slow, steady breathing through the hold.', tip: 'Quality over time — stop when form breaks.',
      anim: { hl: ['core', 'delts'], k: [
        K({ hip: [98.6, 159.2], t: 79.4, a1: [0, 90], l1: { x: 20, y: 174 }, ft: 40 }, 1500, 'Hold — brace & breathe'),
        K({ hip: [98.6, 158.4], t: 79.4, a1: [0, 90], l1: { x: 20, y: 174 }, ft: 40 }, 1500, 'Hold — brace & breathe')] } }),

    X({ id: 'crunch', name: 'Crunch', part: 'core', equip: [], lvl: 1, pri: 2, reps: '15-20', met: 3.8, beginner: true,
      prim: ['Upper abs (rectus abdominis)'], sec: ['Obliques'],
      setup: 'Lie on your back, knees bent, feet flat. Fingertips lightly behind your ears.',
      steps: ['Press the lower back into the floor.', 'Curl the shoulders off the floor using your abs.', 'Pause and squeeze.', 'Lower slowly.'],
      pos: [['Neck', 'Relaxed — keep a fist-sized gap between chin and chest.'], ['Hands', 'Support the head, do not pull it.'], ['Lower back', 'Stays on the floor.'], ['Feet', 'Flat.']],
      err: ['Yanking the neck', 'Using momentum', 'Lifting too high (becomes a sit-up)'],
      breathe: 'Exhale as you crunch, inhale as you lower.', tip: 'Slow and controlled beats fast and many.',
      anim: { hl: ['core'], k: [
        K({ hip: [88, 174], t: 90, a1: { dx: 12, dy: -6 }, l1: { x: 52, y: 180, b: 1 } }, 700, 'Curl up — exhale', 150),
        K({ hip: [88, 174], t: 64, hd: -8, a1: { dx: 12, dy: -6 }, l1: { x: 52, y: 180, b: 1 } }, 900, 'Lower slowly — inhale', 300)] } }),

    X({ id: 'legraise', name: 'Lying Leg Raise', part: 'core', equip: [], lvl: 2, pri: 1, reps: '10-15', met: 3.8,
      prim: ['Lower abs', 'Hip flexors'], sec: ['Obliques'],
      setup: 'Lie flat on your back, legs straight, hands by your sides or under your hips.',
      steps: ['Press the lower back into the floor.', 'Raise the legs together until they point to the ceiling.', 'Lower slowly, stopping just before the heels touch.', 'Repeat without letting the back arch.'],
      pos: [['Lower back', 'Flat on the floor the whole time.'], ['Legs', 'Straight or slightly bent.'], ['Head', 'Resting on the floor.'], ['Hands', 'Under the hips for support if needed.']],
      err: ['Lower back arching off the floor', 'Dropping the legs fast', 'Swinging'],
      breathe: 'Exhale as legs rise, inhale as they lower.', tip: 'Bend the knees to make it easier.',
      anim: { hl: ['core'], k: [
        K({ hip: [95, 174], t: 90, a1: [-92, -90], l1: [-95, -95], ft: 180 }, 1000, 'Raise legs — exhale', 150),
        K({ hip: [95, 174], t: 90, a1: [-92, -90], l1: [-178, -178], ft: 100 }, 1200, 'Lower slowly — inhale', 200)] } }),

    X({ id: 'mountainclimber', name: 'Mountain Climbers', part: 'core', sub: 'hiit', equip: [], lvl: 1, pri: 2, type: 'time', reps: '30-45s', met: 8,
      prim: ['Abs', 'Hip flexors'], sec: ['Shoulders', 'Cardio'],
      setup: 'High plank with hands under shoulders.',
      steps: ['Drive one knee towards the chest.', 'Switch legs quickly, like running.', 'Keep hips low and level.', 'Keep going for the set time.'],
      pos: [['Hands', 'Under the shoulders, arms straight.'], ['Hips', 'In line with the shoulders — not bouncing up.'], ['Core', 'Tight.'], ['Feet', 'Light and quick on the balls of the feet.']],
      err: ['Hips piking up', 'Shoulders drifting behind the hands', 'Short choppy range'],
      breathe: 'Quick rhythmic breaths.', tip: 'Go slower for core control, faster for cardio.',
      anim: { hl: ['core', 'thigh'], k: [
        K({ hip: [112.5, 144], t: 68.7, a1: { x: 159, y: 180 }, l1: [55, -80], l2: [-68.7, -68.7], ft: 40 }, 320, 'Drive knees in — quick breaths'),
        K({ hip: [112.5, 144], t: 68.7, a1: { x: 159, y: 180 }, l1: [-68.7, -68.7], l2: [55, -80], ft: 40 }, 320, 'Switch legs')] } }),

    X({ id: 'russiantwist', name: 'Russian Twist', part: 'core', equip: [], lvl: 2, pri: 2, reps: '20 (10 each side)', met: 4,
      prim: ['Obliques'], sec: ['Abs', 'Hip flexors'],
      setup: 'Sit with knees bent, lean back about 45° with a straight back. Hold your hands (or a weight) at the chest.',
      steps: ['Lift the feet slightly off the floor (optional).', 'Rotate the torso to one side, bringing the hands beside the hip.', 'Return through the centre.', 'Rotate to the other side.'],
      pos: [['Back', 'Long and straight — not rounded.'], ['Rotation', 'From the ribcage, not just swinging the arms.'], ['Feet', 'Down for beginners, raised for advanced.'], ['Head', 'Follows the hands.']],
      err: ['Rounding the back', 'Only moving the arms', 'Going too fast'],
      breathe: 'Exhale as you twist, inhale through the centre.', tip: 'Add a water bottle or dumbbell to progress.',
      anim: { view: 'front', hl: ['core'], props: { kb: 1 }, k: [
        K({ hip: [100, 156], t: -14, a1: { x: 72, y: 130 }, a2: { x: 78, y: 132 }, l1: [75, 15], ls: 0.55 }, 700, 'Twist — exhale', 120),
        K({ hip: [100, 156], t: 14, a1: { x: 122, y: 132 }, a2: { x: 128, y: 130 }, l1: [75, 15], ls: 0.55 }, 700, 'Twist other side — exhale', 120)] } }),

    X({ id: 'deadbug', name: 'Dead Bug', part: 'core', equip: [], lvl: 1, pri: 1, reps: '10 each side', met: 3, beginner: true,
      prim: ['Deep core (transverse abdominis)'], sec: ['Abs', 'Hip flexors'],
      setup: 'Lie on your back, arms pointing to the ceiling, hips and knees bent at 90° (tabletop).',
      steps: ['Press the lower back firmly into the floor.', 'Slowly extend the opposite arm and leg towards the floor.', 'Stop just above the floor without the back lifting.', 'Return and switch sides.'],
      pos: [['Lower back', 'Glued to the floor.'], ['Arms', 'Straight, reaching long.'], ['Legs', 'Tabletop at 90°.'], ['Head', 'Resting down, chin slightly tucked.']],
      err: ['Back arching off the floor', 'Moving too fast', 'Holding the breath'],
      breathe: 'Exhale as you extend, inhale as you return.', tip: 'Excellent safe core exercise for beginners and back pain.',
      anim: { hl: ['core'], k: [
        K({ hip: [90, 170], t: 90, a1: [180, 180], a2: [180, 180], l1: [180, -90], l2: [180, -90] }, 900, 'Extend opposite arm & leg — exhale', 150),
        K({ hip: [90, 170], t: 90, a1: [100, 100], a2: [180, 180], l1: [180, -90], l2: [265, -95] }, 900, 'Return — inhale', 300),
        K({ hip: [90, 170], t: 90, a1: [180, 180], a2: [180, 180], l1: [180, -90], l2: [180, -90] }, 900, 'Other side — exhale', 150),
        K({ hip: [90, 170], t: 90, a1: [180, 180], a2: [100, 100], l1: [265, -95], l2: [180, -90] }, 900, 'Return — inhale', 300)] } }),

    X({ id: 'birddog', name: 'Bird Dog', part: 'core', equip: [], lvl: 1, pri: 2, reps: '10 each side', met: 3, beginner: true,
      prim: ['Core', 'Lower back'], sec: ['Glutes', 'Shoulders'],
      setup: 'On all fours: hands under shoulders, knees under hips, back flat.',
      steps: ['Brace the core.', 'Reach one arm forward and the opposite leg back until both are level with the body.', 'Hold for 2 seconds without tilting the hips.', 'Return and switch sides.'],
      pos: [['Back', 'Flat — imagine a glass of water on it.'], ['Hips', 'Level, facing the floor.'], ['Arm & leg', 'Reach long, not high.'], ['Head', 'Neutral.']],
      err: ['Arching the back', 'Rotating the hips', 'Rushing'],
      breathe: 'Exhale as you extend, inhale as you return.', tip: 'Great for back health and balance.',
      anim: { hl: ['core', 'back', 'glutes'], k: [
        K({ hip: [80, 140], t: 73.7, a1: [0, 0], l1: [0, -90], ft: -95 }, 900, 'Reach arm & opposite leg — exhale', 150),
        K({ hip: [80, 140], t: 73.7, a1: [95, 95], l1: [0, -90], l2: [-95, -95], ft: -95, ft2: -90 }, 900, 'Return — inhale', 600),
        K({ hip: [80, 140], t: 73.7, a1: [0, 0], l1: [0, -90], ft: -95 }, 900, 'Other side — exhale', 150),
        K({ hip: [80, 140], t: 73.7, a1: [0, 0], a2: [95, 95], l1: [-95, -95], l2: [0, -90], ft: -90, ft2: -95 }, 900, 'Return — inhale', 600)] } }),

    /* ───────────── CARDIO / FULL BODY ───────────── */
    X({ id: 'jumpingjack', name: 'Jumping Jacks', part: 'cardio', sub: 'hiit', impact: 'high', equip: [], lvl: 1, pri: 1, type: 'time', reps: '30-60s', met: 8,
      prim: ['Full body', 'Heart & lungs'], sec: ['Calves', 'Shoulders'],
      setup: 'Stand tall, feet together, arms by your sides.',
      steps: ['Jump the feet out wide while raising the arms overhead.', 'Jump back to feet together, arms down.', 'Land softly on the balls of the feet.', 'Keep a steady rhythm.'],
      pos: [['Landing', 'Soft knees, on the balls of the feet.'], ['Arms', 'Straight, meet overhead.'], ['Core', 'Tall and braced.']],
      err: ['Landing flat-footed and stiff-legged', 'Half arm movement'],
      breathe: 'Breathe rhythmically.', tip: 'Low-impact option: step one foot out at a time.',
      anim: { view: 'front', hl: ['calves', 'delts'], k: [
        K({ hip: [100, 100], t: 0, a1: [8, 6], l1: [3, 3], g: 1 }, 380, 'Jump out, arms up'),
        K({ hip: [100, 100], t: 0, a1: [165, 172], l1: [20, 20], g: 1, up: 4 }, 380, 'Jump in, arms down')] } }),

    X({ id: 'highknees', name: 'High Knees', part: 'cardio', sub: 'hiit', impact: 'high', equip: [], lvl: 1, pri: 2, type: 'time', reps: '30-45s', met: 8,
      prim: ['Hip flexors', 'Heart & lungs'], sec: ['Quads', 'Calves', 'Core'],
      setup: 'Stand tall, feet hip-width.',
      steps: ['Run on the spot driving the knees up to hip height.', 'Pump the arms opposite to the legs.', 'Stay on the balls of the feet.', 'Keep the chest tall.'],
      pos: [['Knees', 'Up to hip height.'], ['Torso', 'Upright — do not lean back.'], ['Arms', 'Bent 90°, swing front to back.']],
      err: ['Leaning back', 'Knees too low', 'Landing heavily'],
      breathe: 'Quick rhythmic breaths.', tip: 'Low-impact option: march with high knees.',
      anim: { hl: ['thigh', 'core'], k: [
        K({ hip: [100, 100], t: 0, a1: [-35, 50], a2: [35, 120], l1: [95, 0], l2: [0, 0], g: 1 }, 280, 'Drive the knees up'),
        K({ hip: [100, 100], t: 0, a1: [35, 120], a2: [-35, 50], l1: [0, 0], l2: [95, 0], g: 1 }, 280, 'Switch')] } }),

    X({ id: 'buttkick', name: 'Butt Kicks', part: 'cardio', sub: 'hiit', impact: 'high', equip: [], lvl: 1, pri: 3, type: 'time', reps: '30-45s', met: 7,
      prim: ['Hamstrings', 'Heart & lungs'], sec: ['Calves'],
      setup: 'Stand tall, feet hip-width.',
      steps: ['Jog on the spot, kicking the heels up towards your glutes.', 'Keep the knees pointing down.', 'Pump the arms.', 'Stay light on your feet.'],
      pos: [['Knees', 'Point down to the floor.'], ['Torso', 'Upright.'], ['Feet', 'Land on the balls.']],
      err: ['Bending forward', 'Thighs swinging forward'],
      breathe: 'Quick rhythmic breaths.', tip: 'Good warm-up for running.',
      anim: { hl: ['hams'], k: [
        K({ hip: [100, 100], t: 0, a1: [-35, 50], a2: [35, 120], l1: [-8, -165], l2: [0, 0], g: 1 }, 280, 'Kick heel to glute'),
        K({ hip: [100, 100], t: 0, a1: [35, 120], a2: [-35, 50], l1: [0, 0], l2: [-8, -165], g: 1 }, 280, 'Switch')] } }),

    X({ id: 'skipping', name: 'Skipping Rope', part: 'cardio', sub: 'hiit', impact: 'high', equip: ['rope'], lvl: 1, pri: 1, type: 'time', reps: '45-60s', met: 11,
      prim: ['Calves', 'Heart & lungs'], sec: ['Shoulders', 'Forearms', 'Core'],
      setup: 'Hold the handles at hip height, elbows close to your sides, rope behind your heels.',
      steps: ['Turn the rope with your wrists, not your arms.', 'Jump just 2–3 cm off the floor as it passes.', 'Land softly on the balls of your feet.', 'Keep a steady rhythm.'],
      pos: [['Elbows', 'Close to the ribs.'], ['Wrists', 'Do the turning.'], ['Jump', 'Small and quiet.'], ['Knees', 'Slightly bent on landing.']],
      err: ['Jumping too high', 'Swinging the whole arms', 'Landing on the heels'],
      breathe: 'Steady breathing.', tip: 'Correct length: stand on the middle, handles reach your armpits.',
      anim: { hl: ['calves'], props: { rope: 1 }, k: [
        K({ hip: [100, 100], t: 0, a1: [18, 70], l1: [8, -10], g: 1 }, 300, 'Small bounce'),
        K({ hip: [100, 100], t: 0, a1: [18, 70], l1: [2, 2], ft: 40, g: 1, up: 10 }, 300, 'Rope under feet')] } }),

    X({ id: 'burpee', name: 'Burpee', part: 'cardio', sub: 'hiit', impact: 'high', equip: [], lvl: 2, pri: 1, reps: '8-15', met: 10,
      prim: ['Full body', 'Heart & lungs'], sec: ['Chest', 'Quads', 'Shoulders', 'Core'],
      setup: 'Stand tall, feet shoulder-width.',
      steps: ['Squat down and place hands on the floor.', 'Jump (or step) the feet back to a plank.', 'Optional: do a push-up.', 'Jump the feet back towards the hands.', 'Explode up with arms overhead.'],
      pos: [['Plank', 'Straight body, hips not sagging.'], ['Hands', 'Shoulder-width, flat.'], ['Landing', 'Soft knees.'], ['Back', 'Neutral when squatting down.']],
      err: ['Sagging hips in the plank', 'Landing stiff-legged', 'Rounding the back'],
      breathe: 'Exhale on the jump, breathe steadily otherwise.', tip: 'Step back instead of jumping for a low-impact version.',
      anim: { hl: ['chest', 'quads', 'core'], k: [
        K({ hip: [100, 101], t: 0, a1: { x: 101, y: 105 }, l1: AF, ft: 90 }, 500, 'Squat, hands down'),
        K({ hip: [85, 148], t: 60, a1: { x: 132, y: 178 }, l1: AF, ft: 90 }, 450, 'Jump back to plank'),
        K({ hip: [90.8, 143.2], t: 65, a1: { x: 132, y: 178 }, l1: { x: 16, y: 176 }, ft: 40 }, 450, 'Jump feet in', 120),
        K({ hip: [85, 148], t: 60, a1: { x: 132, y: 178 }, l1: AF, ft: 90 }, 420, 'Explode up!'),
        K({ hip: [100, 90], t: 0, a1: { x: 106, y: -6 }, l1: { x: 100, y: 168 }, ft: 30 }, 420, 'Land softly')] } }),

    X({ id: 'squatjump', name: 'Squat Jump', part: 'cardio', sub: 'hiit', impact: 'high', equip: [], lvl: 2, pri: 2, reps: '10-15', met: 9,
      prim: ['Quads', 'Glutes', 'Power'], sec: ['Calves', 'Heart & lungs'],
      setup: 'Stand with feet shoulder-width apart.',
      steps: ['Squat down to about parallel, arms swinging back.', 'Explode up, swinging the arms overhead.', 'Land softly back into the squat.', 'Repeat smoothly.'],
      pos: [['Landing', 'Soft — toes, then heels, knees bent.'], ['Knees', 'Track over toes on landing.'], ['Chest', 'Up throughout.']],
      err: ['Landing with straight legs', 'Knees caving on landing'],
      breathe: 'Exhale on the jump.', tip: 'Do regular squats if you have knee pain.',
      anim: { hl: ['quads', 'glutes', 'calves'], k: [
        K({ hip: [79, 140], t: 35, a1: [-40, -30], l1: AF, ft: 90 }, 420, 'Explode up — exhale', 150),
        K({ hip: [100, 86], t: 0, a1: [150, 160], l1: { x: 100, y: 166 }, ft: 30 }, 480, 'Land softly into the squat')] } }),

    X({ id: 'kbswing', name: 'Kettlebell Swing', part: 'cardio', sub: 'power', equip: ['kb'], lvl: 2, pri: 1, reps: '15-20', met: 9,
      prim: ['Glutes', 'Hamstrings'], sec: ['Core', 'Shoulders', 'Heart & lungs'],
      setup: 'Stand with feet a little wider than shoulders, kettlebell on the floor in front. Hinge and grab it with both hands.',
      steps: ['Hike the bell back between your legs.', 'Snap the hips forward to drive the bell up to chest height.', 'Let it fall, hinging the hips back as it swings down.', 'Repeat with rhythm — the hips do the work, not the arms.'],
      pos: [['Hinge', 'Hips back, slight knee bend, flat back.'], ['Arms', 'Relaxed like ropes.'], ['Top', 'Stand tall, glutes squeezed, bell at chest height.'], ['Feet', 'Planted.']],
      err: ['Squatting instead of hinging', 'Lifting with the arms', 'Leaning back at the top'],
      breathe: 'Exhale sharply at the top, inhale as it drops.', tip: 'A dumbbell held by one end works too.',
      anim: { hl: ['glutes', 'hams'], props: { kb: 1 }, k: [
        K({ hip: [78, 110], t: 62, a1: [-25, -25], l1: AF }, 550, 'Snap hips forward — exhale', 80),
        K({ hip: [98, 101], t: -3, a1: [88, 88], l1: AF }, 550, 'Hinge back as it drops — inhale', 80)] } }),

    X({ id: 'surya', name: 'Surya Namaskar (Sun Salutation)', part: 'cardio', sub: 'yoga', equip: [], lvl: 1, pri: 2, reps: '5-12 rounds', met: 4, beginner: true,
      prim: ['Full body flexibility'], sec: ['Shoulders', 'Hamstrings', 'Core', 'Spine'],
      setup: 'Stand at the front of a mat, feet together, palms joined at the chest (Pranamasana).',
      steps: ['Inhale: raise the arms overhead and gently arch back (Hasta Uttanasana).', 'Exhale: fold forward, hands beside the feet (Padahastasana).', 'Step back into plank, then lower into Bhujangasana (cobra) — inhale.', 'Exhale: lift hips into Adho Mukha Svanasana (mountain / downward dog).', 'Step forward, fold, rise up and return to prayer pose. Repeat leading with the other leg.'],
      pos: [['Spine', 'Long in every pose — bend knees in the fold if needed.'], ['Cobra', 'Hips on the floor, elbows soft, shoulders away from ears.'], ['Downward dog', 'Hips high, heels reaching towards the floor.'], ['Breath', 'Each movement follows a breath.']],
      err: ['Rushing without breath sync', 'Locking knees in the fold', 'Crunching the lower back in cobra'],
      breathe: 'Inhale on opening/back-bending poses, exhale on folding poses.', tip: 'Ideal morning routine or active-recovery day.',
      anim: { hl: ['back', 'hams', 'delts'], k: [
        K({ hip: [100, 101], t: 0, a1: { x: 108, y: 66 }, l1: AF, ft: 90 }, 1000, '1. Pranamasana — prayer pose', 400),
        K({ hip: [102, 101], t: -12, a1: { x: 86, y: -2 }, l1: AF, ft: 90 }, 1000, '2. Hasta Uttanasana — inhale, arms up', 400),
        K({ hip: [88, 100], t: 165, a1: { x: 124, y: 180 }, l1: AF, ft: 90 }, 1000, '3. Padahastasana — exhale, fold', 400),
        K({ hip: [82.5, 144.6], t: 64.7, a1: { x: 124, y: 180 }, l1: { x: 16, y: 176 }, ft: 40 }, 1000, '4. Plank — step back', 400),
        K({ hip: [98, 172], t: 58, hd: -20, a1: { x: 130, y: 180 }, l1: { x: 20, y: 178 }, ft: -95 }, 1000, '5. Bhujangasana — inhale, cobra', 400),
        K({ hip: [72, 104], t: 122, hd: 10, a1: { x: 130, y: 180 }, l1: { x: 40, y: 178 }, ft: 60 }, 1000, '6. Adho Mukha Svanasana — exhale', 400),
        K({ hip: [88, 100], t: 165, a1: { x: 124, y: 180 }, l1: AF, ft: 90 }, 1000, '7. Step forward — fold', 400),
        K({ hip: [102, 101], t: -12, a1: { x: 86, y: -2 }, l1: AF, ft: 90 }, 1000, '8. Rise up — inhale', 400)] } })
  ];

  var PARTS = [
    { id: 'chest', name: 'Chest', icon: '🫁' }, { id: 'back', name: 'Back', icon: '🔙' },
    { id: 'shoulders', name: 'Shoulders', icon: '🏋️' }, { id: 'arms', name: 'Arms', icon: '💪' },
    { id: 'legs', name: 'Legs', icon: '🦵' }, { id: 'glutes', name: 'Glutes', icon: '🍑' },
    { id: 'core', name: 'Core / Abs', icon: '🎯' }, { id: 'cardio', name: 'Cardio & Full body', icon: '🔥' }
  ];
  var EQUIP_NAMES = { db: 'Dumbbells', bb: 'Barbell', bench: 'Bench', bar: 'Pull-up bar', machine: 'Gym machine', kb: 'Kettlebell', rope: 'Skipping rope', dipbar: 'Dip bars' };

  var map = {};
  EX.forEach(function (e) { map[e.id] = e; if (!e.type) e.type = 'reps'; if (!e.impact) e.impact = 'low'; if (!e.sub) e.sub = ''; });
  global.GYM_DATA = { EX: EX, EXMAP: map, PARTS: PARTS, EQUIP_NAMES: EQUIP_NAMES };
})(window);
