/* Cardly Gym — main application (vanilla JS, localStorage, hash routing) */
(function () {
  'use strict';
  var D = window.GYM_DATA, DIET = window.GYM_DIET;
  var STORE_KEY = 'cardlyGym.v1';
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var WD_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var WEEK = [1, 2, 3, 4, 5, 6, 0];

  var GOALS = { fat_loss: 'Lose fat', muscle: 'Build muscle', strength: 'Get stronger', fitness: 'Stay fit & healthy' };
  var LEVELS = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };
  var EQUIP = {
    home: { name: 'Home — no equipment', has: ['rope'] },
    homedb: { name: 'Home — dumbbells', has: ['rope', 'db'] },
    homeplus: { name: 'Home gym — dumbbells, bench, pull-up bar', has: ['rope', 'db', 'bench', 'bar', 'kb'] },
    gym: { name: 'Gym — full equipment', has: ['rope', 'db', 'bench', 'bar', 'kb', 'bb', 'machine', 'dipbar'] }
  };
  var FOCUS = { balanced: 'Balanced', upper: 'Upper body', lower: 'Legs & glutes', core: 'Core / abs' };
  var DIETS = { veg: 'Vegetarian', egg: 'Eggetarian', nonveg: 'Non-vegetarian', vegan: 'Vegan', jain: 'Jain' };
  var CUISINES = { a: 'Any', n: 'North Indian', s: 'South Indian', w: 'West Indian', e: 'East Indian' };
  var ACTIVITY = { sedentary: ['Sedentary (desk job, little walking)', 1.2], light: ['Lightly active', 1.375], moderate: ['Moderately active', 1.55], active: ['Very active (physical job)', 1.725] };

  /* ───────── storage ───────── */
  var memoryStore = null;
  function load() {
    try { var s = localStorage.getItem(STORE_KEY); if (s) return JSON.parse(s); } catch (e) { /* ignore */ }
    if (memoryStore) return memoryStore;
    return { v: 1, activeId: null, profiles: [], theme: 'dark' };
  }
  var state = load();
  if (!state.profiles) state.profiles = [];
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { memoryStore = state; toast('Could not save — storage unavailable (private mode?)'); }
  }
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* ignore */ }

  /* ───────── utils ───────── */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function r0(v) { return Math.round(v); }
  function todayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var s = seed || 1; return function () { s = (s + 0x6D2B79F5) | 0; var t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function prof() { for (var i = 0; i < state.profiles.length; i++) if (state.profiles[i].id === state.activeId) return state.profiles[i]; return state.profiles[0] || null; }
  function plan(p, id) { p = p || prof(); if (!p) return null; for (var i = 0; i < p.plans.length; i++) if (p.plans[i].id === id) return p.plans[i]; return null; }
  function activePlan(p) { p = p || prof(); return p ? (plan(p, p.activePlanId) || p.plans[0] || null) : null; }
  function exById(id) { return D.EXMAP[id]; }
  function frac(f) { var w = Math.floor(f), r = f - w, s = r === 0.25 ? '¼' : r === 0.5 ? '½' : r === 0.75 ? '¾' : ''; return (w ? w : (s ? '' : '0')) + s; }

  /* ───────── health maths ───────── */
  function stats(p) {
    var h = p.height / 100, bmi = p.weight / (h * h);
    var cat = bmi < 18.5 ? 'Underweight' : bmi < 23 ? 'Healthy' : bmi < 25 ? 'Overweight' : 'Obese';
    var gconst = p.gender === 'male' ? 5 : p.gender === 'female' ? -161 : -78;
    var bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + gconst;
    var tdee = bmr * (ACTIVITY[p.activity] || ACTIVITY.light)[1];
    var floor = p.gender === 'male' ? 1500 : p.gender === 'female' ? 1200 : 1350;
    var target = p.goal === 'fat_loss' ? Math.max(tdee - 500, floor) : p.goal === 'muscle' ? tdee + 300 : p.goal === 'strength' ? tdee + 200 : tdee;
    if (p.age < 18) target = Math.max(target, tdee);
    var refW = bmi > 25 ? 25 * h * h : p.weight;
    var ppk = { fat_loss: 1.6, muscle: 1.8, strength: 1.7, fitness: 1.2 }[p.goal] || 1.2;
    if (p.age < 18) ppk = Math.min(ppk, 1.2);
    var protein = refW * ppk, fat = target * 0.25 / 9, carbs = Math.max(0, (target - protein * 4 - fat * 9) / 4);
    return {
      bmi: bmi, cat: cat, bmr: bmr, tdee: tdee, target: Math.round(target / 10) * 10, protein: protein, fat: fat, carbs: carbs,
      water: Math.round((p.weight * 0.035 + 0.5) * 10) / 10, wLo: 18.5 * h * h, wHi: 22.9 * h * h,
      lowImpact: !!p.joint || p.age >= 50 || bmi >= 30
    };
  }

  /* ───────── workout plan engine ───────── */
  var TEMPLATES = {
    fullA: { name: 'Full Body A', slots: [['legs', 'quads'], ['chest'], ['back'], ['shoulders'], ['legs', 'hams'], ['core'], ['arms'], ['glutes']] },
    fullB: { name: 'Full Body B', slots: [['glutes'], ['back'], ['chest'], ['legs', 'quads'], ['shoulders'], ['core'], ['arms'], ['legs', 'calves']] },
    fullC: { name: 'Full Body C', slots: [['legs', 'quads'], ['back'], ['chest'], ['glutes'], ['arms'], ['core'], ['shoulders'], ['core']] },
    upper: { name: 'Upper Body', slots: [['chest'], ['back'], ['shoulders'], ['back'], ['chest'], ['arms', 'biceps'], ['arms', 'triceps'], ['shoulders', 'rear']] },
    lower: { name: 'Lower Body & Core', slots: [['legs', 'quads'], ['legs', 'hams'], ['glutes'], ['legs', 'quads'], ['core'], ['legs', 'calves'], ['core'], ['glutes']] },
    push: { name: 'Push — Chest, Shoulders, Triceps', slots: [['chest'], ['shoulders'], ['chest'], ['arms', 'triceps'], ['shoulders'], ['chest'], ['arms', 'triceps']] },
    pull: { name: 'Pull — Back & Biceps', slots: [['back'], ['back'], ['shoulders', 'rear'], ['arms', 'biceps'], ['back'], ['arms', 'biceps'], ['core']] },
    legs: { name: 'Legs, Glutes & Core', slots: [['legs', 'quads'], ['legs', 'hams'], ['glutes'], ['legs', 'quads'], ['core'], ['legs', 'calves'], ['core']] }
  };
  var SPLITS = {
    2: { wd: [1, 4], t: ['fullA', 'fullB'] },
    3: { wd: [1, 3, 5], t: ['fullA', 'fullB', 'fullC'] },
    4: { wd: [1, 2, 4, 5], t: ['upper', 'lower', 'upper', 'lower'] },
    5: { wd: [1, 2, 3, 5, 6], t: ['push', 'pull', 'legs', 'upper', 'lower'] },
    6: { wd: [1, 2, 3, 4, 5, 6], t: ['push', 'pull', 'legs', 'push', 'pull', 'legs'] }
  };
  var FOCUS_PARTS = { upper: [['shoulders'], ['arms'], ['chest']], lower: [['glutes'], ['legs', 'quads']], core: [['core'], ['core']] };

  function equipOk(ex, p) { var has = (EQUIP[p.equip] || EQUIP.home).has; return ex.equip.every(function (e) { return has.indexOf(e) >= 0; }); }
  function matches(ex, part, sub) {
    if (sub === 'hams') return ex.sub === 'hams' || ex.id === 'deadlift' || ex.id === 'glutebridge' || ex.id === 'kbswing';
    if (sub === 'rear') return ex.id === 'reardelt' || ex.id === 'shrugs';
    if (part === 'legs' && !sub) return ex.part === 'legs';
    if (ex.part !== part) return false;
    return !sub || ex.sub === sub;
  }
  function candidates(p, part, sub, usage) {
    var st = stats(p), lvl = +p.level;
    var list = D.EX.filter(function (ex) {
      if (!matches(ex, part, sub)) return false;
      if (!equipOk(ex, p)) return false;
      if (st.lowImpact && ex.impact === 'high') return false;
      if (p.joint && ex.knee) return false;
      if (ex.lvl > lvl + (st.lowImpact ? 0 : 1)) return false;
      return true;
    });
    var weighted = p.equip === 'gym' || p.equip === 'homeplus' || ((p.equip === 'homedb') && (p.goal === 'muscle' || p.goal === 'strength'));
    list.forEach(function (ex) {
      var s = ex.pri * 10;
      if (ex.lvl > lvl) s += 40;
      if (lvl === 1 && ex.beginner) s -= 4;
      if (st.lowImpact && ex.beginner) s -= 8;
      if (lvl >= 2 && ex.beginner) s += 4;
      if (weighted && !ex.equip.length && ex.part !== 'core' && ex.part !== 'cardio') s += 7;
      if (usage) s += (usage[ex.id] || 0) * 9;
      ex._s = s;
    });
    list.sort(function (a, b) { return a._s - b._s || (a.id < b.id ? -1 : 1); });
    if (!list.length && sub) return candidates(p, part === 'legs' && sub === 'hams' ? 'glutes' : part, null, usage);
    return list;
  }
  function prescribe(ex, p, idx) {
    var g = p.goal, L = +p.level, age = p.age, each = /each/.test(ex.reps) ? ' each' : '';
    var r;
    if (ex.type === 'time') {
      var sec = L === 1 ? 30 : L === 2 ? 45 : 60;
      if (ex.sub === 'hiit' || ex.part === 'cardio') sec = g === 'fat_loss' ? (L === 1 ? 30 : 45) : 30;
      r = { sets: L === 1 ? 2 : 3, reps: sec + 's', rest: 30 };
    } else if (ex.id === 'surya') r = { sets: 1, reps: (L === 1 ? 5 : L === 2 ? 8 : 12) + ' rounds', rest: 60 };
    else if (ex.part === 'cardio') r = { sets: 3, reps: ex.reps, rest: 45 };
    else {
      var main = idx < 2;
      if (g === 'strength') r = main ? { sets: L === 1 ? 3 : 5, reps: L === 1 ? '6-8' : '4-6', rest: 150 } : { sets: 3, reps: '8-10', rest: 90 };
      else if (g === 'muscle') r = main ? { sets: L === 1 ? 3 : 4, reps: '8-10', rest: 90 } : { sets: 3, reps: '10-12', rest: 60 };
      else if (g === 'fat_loss') r = { sets: 3, reps: '12-15', rest: 45 };
      else r = { sets: L === 1 ? 2 : 3, reps: '10-12', rest: 60 };
      if (ex.id === 'calfraise') r.reps = '15-20';
      if (!ex.equip.length && g !== 'strength') r.reps = ex.reps;
      else r.reps += each;
    }
    if (age >= 50) { r.rest += 15; if (r.reps === '4-6') r.reps = '6-8'; }
    if (age < 18 && g === 'strength') { r.reps = '8-12'; }
    return r;
  }
  function exCount(p) { var m = +p.minutes || 45; var n = m <= 30 ? 4 : m <= 45 ? 5 : m <= 60 ? 6 : 7; if (+p.level === 1) n = Math.min(n, 5); return n; }

  function generatePlan(p) {
    var days = clamp(+p.days || 3, 2, 6), sp = SPLITS[days], usage = {}, out = [], n = exCount(p), st = stats(p);
    sp.t.forEach(function (tk, di) {
      var T = TEMPLATES[tk], used = {}, items = [];
      var slots = T.slots.slice(), fp = FOCUS_PARTS[p.focus], extra = null;
      if (fp) {
        var groupOk = fp.some(function (f) { return T.slots.some(function (s) { return s[0] === f[0] || (f[0] === 'glutes' && s[0] === 'legs') || (f[0] === 'arms' && (s[0] === 'chest' || s[0] === 'back')); }); });
        if (groupOk) extra = fp[di % fp.length];
      }
      function addSlot(sl) {
        var c = candidates(p, sl[0], sl[1], usage).filter(function (ex) { return !used[ex.id]; });
        if (!c.length) return;
        var ex = c[0]; used[ex.id] = 1; usage[ex.id] = (usage[ex.id] || 0) + 1;
        var rx = prescribe(ex, p, items.length);
        items.push({ ex: ex.id, sets: rx.sets, reps: rx.reps, rest: rx.rest });
      }
      for (var si = 0; si < slots.length && items.length < n; si++) addSlot(slots[si]);
      if (extra) addSlot(extra);
      if (p.goal === 'fat_loss' || p.goal === 'fitness') {
        var cardio = candidates(p, 'cardio', null, usage).filter(function (ex) { return !used[ex.id] && ex.id !== 'kbswing'; });
        var nC = p.goal === 'fat_loss' ? 2 : 1;
        for (var i = 0; i < nC && i < cardio.length; i++) {
          usage[cardio[i].id] = (usage[cardio[i].id] || 0) + 1;
          var rx2 = prescribe(cardio[i], p, 9);
          items.push({ ex: cardio[i].id, sets: rx2.sets, reps: rx2.reps, rest: rx2.rest });
        }
      }
      out.push({ id: uid(), name: T.name, wd: sp.wd[di], items: items });
    });
    var eq = (EQUIP[p.equip] || EQUIP.home).name.split(' — ')[0];
    return {
      id: uid(), auto: true, created: Date.now(),
      name: GOALS[p.goal] + ' · ' + days + ' days/week · ' + eq,
      note: st.lowImpact ? 'Low-impact version (based on age, BMI or joint comfort).' : '',
      days: out
    };
  }
  function dayStats(day, p) {
    var secs = 0, met = 0, n = 0;
    day.items.forEach(function (it) {
      var ex = exById(it.ex); if (!ex) return;
      var work = /s$/.test(it.reps) ? parseInt(it.reps, 10) || 40 : 40;
      secs += it.sets * (work + (+it.rest || 60)); met += ex.met; n++;
    });
    var mins = Math.round(secs / 60) + (day.items.length ? 10 : 0);
    var avgMet = n ? met / n : 0;
    return { mins: mins, kcal: Math.round(avgMet * 0.75 * p.weight * mins / 60), n: n };
  }

  /* ───────── diet engine ───────── */
  function dietPool(slot, p) {
    var d = p.diet || 'veg';
    return DIET.MEALS[slot].filter(function (m) {
      if (d === 'vegan') return m.vg;
      if (d === 'veg' || d === 'jain') return m.t === 'veg';
      if (d === 'egg') return m.t !== 'nonveg';
      return true;
    });
  }
  function pickMeal(pool, p, seedStr, skip) {
    var R = rng(hash(seedStr)), tot = 0, w = pool.map(function (m) {
      var x = 1;
      if (p.cuisine && p.cuisine !== 'a') x = m.r === p.cuisine ? 4 : m.r === 'a' ? 2 : 0.6;
      if (p.diet === 'nonveg' && m.t === 'nonveg') x *= 1.6;
      if ((p.goal === 'muscle' || p.goal === 'strength') && m.p / m.kcal > 0.06) x *= 1.5;
      if (skip && skip.indexOf(m.id) >= 0) x *= 0.05;
      tot += x; return x;
    });
    var r = R() * tot;
    for (var i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }
  function dayDiet(p, wd) {
    var st = stats(p), useBed = p.goal === 'muscle' || p.goal === 'strength' || st.target >= 2300;
    var slots = DIET.SLOTS.filter(function (s) { return useBed || s.id !== 'bed'; });
    var scale = useBed ? 1 : 1 / (1 - 0.04);
    var prevDay = (wd + 6) % 7, out = [], tk = 0, tp = 0;
    slots.forEach(function (s) {
      var pool = dietPool(s.id, p), key = wd + '_' + s.id, sw = (p.dietSwap || {})[key], m = null;
      if (sw) pool.forEach(function (x) { if (x.id === sw) m = x; });
      if (!m) {
        var prev = pickMeal(pool, p, p.id + '|' + prevDay + '|' + s.id + '|' + (p.dietSeed || 0));
        m = pickMeal(pool, p, p.id + '|' + wd + '|' + s.id + '|' + (p.dietSeed || 0), [prev.id]);
      }
      var tgt = st.target * s.pct * scale, f = clamp(Math.round(tgt / m.kcal * 4) / 4, 0.5, 2.5);
      if (s.id === 'early' || s.id === 'bed') f = clamp(f, 0.75, 1.5);
      var kc = m.kcal * f, pr = m.p * f; tk += kc; tp += pr;
      out.push({ slot: s, meal: m, f: f, kcal: kc, p: pr });
    });
    return { meals: out, kcal: tk, p: tp, target: st.target, protein: st.protein };
  }

  /* ───────── UI helpers ───────── */
  var players = [];
  function killPlayers() { players.forEach(function (pl) { pl.destroy(); }); players = []; }
  function mountFigures(root) {
    $$('[data-thumb]', root).forEach(function (el) { var ex = exById(el.getAttribute('data-thumb')); if (ex) window.FigPlayer.thumb(el, ex.anim); });
    $$('[data-live]', root).forEach(function (el) {
      var ex = exById(el.getAttribute('data-live')); if (!ex) return;
      var lab = el.parentNode.querySelector('.phase');
      var pl = new window.FigPlayer(el, ex.anim, { label: ex.name + ' demonstration', onLabel: function (t) { if (lab) lab.textContent = t; } });
      el._player = pl; players.push(pl); pl.play();
    });
  }
  function toast(msg, ms) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, ms || 2400);
  }
  function sheet(html, opts) {
    closeSheet();
    var w = document.createElement('div');
    w.className = 'sheet-wrap'; w.innerHTML = '<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>' + html + '</div>';
    w.addEventListener('click', function (e) { if (e.target === w) closeSheet(); });
    document.body.appendChild(w);
    document.body.classList.add('noscroll');
    requestAnimationFrame(function () { w.classList.add('open'); });
    mountFigures(w);
    if (opts && opts.onMount) opts.onMount(w);
    return w;
  }
  function closeSheet() {
    var w = $('.sheet-wrap'); if (!w) return;
    $$('[data-live]', w).forEach(function (el) { if (el._player) el._player.destroy(); });
    w.parentNode.removeChild(w); document.body.classList.remove('noscroll');
  }
  function confirmBox(msg, okLabel, cb) {
    sheet('<h3>' + esc(msg) + '</h3><div class="row gap"><button class="btn ghost grow" data-act="close-sheet">Cancel</button><button class="btn danger grow" id="cfm-ok">' + esc(okLabel || 'OK') + '</button></div>',
      { onMount: function (w) { $('#cfm-ok', w).onclick = function () { closeSheet(); cb(); }; } });
  }
  function opt(obj, sel) { return Object.keys(obj).map(function (k) { var v = obj[k]; var lab = Array.isArray(v) ? v[0] : (v.name || v); return '<option value="' + k + '"' + (String(k) === String(sel) ? ' selected' : '') + '>' + esc(lab) + '</option>'; }).join(''); }
  function chips(name, obj, sel) {
    return '<div class="segc" data-seg="' + name + '">' + Object.keys(obj).map(function (k) {
      return '<button type="button" class="' + (String(k) === String(sel) ? 'on' : '') + '" data-val="' + k + '">' + esc(obj[k]) + '</button>';
    }).join('') + '</div>';
  }
  function exThumb(id, cls) { return '<div class="thumb ' + (cls || '') + '" data-thumb="' + id + '"></div>'; }
  function partName(id) { for (var i = 0; i < D.PARTS.length; i++) if (D.PARTS[i].id === id) return D.PARTS[i].name; return id; }
  function equipLabel(ex) { return ex.equip.length ? ex.equip.map(function (e) { return D.EQUIP_NAMES[e]; }).join(' + ') : 'No equipment'; }
  var ICON = {
    today: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    plans: '<svg viewBox="0 0 24 24"><path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z"/><rect x="4" y="6" width="16" height="15" rx="3"/><path d="M8 12h8M8 16h5"/></svg>',
    library: '<svg viewBox="0 0 24 24"><path d="M2 12h3M19 12h3M5 8v8M19 8v8M8 6v12M16 6v12M8 12h8"/></svg>',
    diet: '<svg viewBox="0 0 24 24"><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/></svg>',
    profile: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>'
  };

  /* ───────── routing ───────── */
  function route() { var h = location.hash.replace(/^#\/?/, ''); return h ? h.split('/') : ['today']; }
  function go(path) { if (location.hash === '#/' + path) render(); else location.hash = '#/' + path; }
  window.addEventListener('hashchange', function () { render(); window.scrollTo(0, 0); });

  function render() {
    killPlayers(); closeSheet();
    var p = prof(), r = route(), v = $('#view'), html = '';
    document.documentElement.setAttribute('data-theme', state.theme || 'dark');
    $('#who').innerHTML = p ? '<span class="av">' + esc(p.name.charAt(0).toUpperCase()) + '</span><span class="nm">' + esc(p.name) + '</span><span class="caret">▾</span>' : '';
    if (!p && r[0] !== 'newprofile') { r = ['welcome']; }
    var tab = r[0];
    $$('#nav a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-tab') === ({ plan: 'plans', workout: 'today', ex: 'library', edit: 'profile', newprofile: 'profile' }[tab] || tab)); });
    document.body.classList.toggle('no-nav', tab === 'welcome' || tab === 'newprofile' && !p);
    switch (tab) {
      case 'welcome': html = viewWelcome(); break;
      case 'newprofile': html = viewProfileForm(null); break;
      case 'edit': html = viewProfileForm(p); break;
      case 'plans': html = viewPlans(p); break;
      case 'plan': html = viewPlan(p, r[1]); break;
      case 'workout': html = viewWorkout(p, r[1], r[2]); break;
      case 'library': html = viewLibrary(p, r[1]); break;
      case 'ex': html = viewExercise(p, r[1]); break;
      case 'diet': html = viewDiet(p, r[1]); break;
      case 'profile': html = viewProfile(p); break;
      default: html = viewToday(p, r[1]);
    }
    v.innerHTML = html;
    mountFigures(v);
    if (tab === 'library') { var s = $('#search'); if (s && libQuery) { s.value = libQuery; } }
  }

  /* ───────── views ───────── */
  function viewWelcome() {
    return '<section class="hero"><div class="hero-fig" data-live="squat"></div><div class="phase muted small"></div>' +
      '<h1>Your pocket<br><span class="acc">gym coach</span></h1>' +
      '<p class="muted">Personal workout plans, animated form guides for every exercise, and Indian diet plans — all offline on your phone. Multiple family members can each have their own profile.</p>' +
      '<button class="btn big" data-act="nav" data-to="newprofile">Create my profile</button>' +
      '<label class="btn ghost big file">Restore a backup<input type="file" accept=".json,application/json" data-change="import"></label>' +
      '<p class="tiny muted">Your data stays on this device only (browser storage).</p></section>';
  }

  function viewProfileForm(p) {
    var isNew = !p;
    p = p || { name: '', age: 25, gender: 'male', height: 170, weight: 70, goal: 'fitness', level: 1, days: 3, minutes: 45, equip: 'home', focus: 'balanced', diet: 'veg', cuisine: 'a', activity: 'light', joint: false };
    var ft = Math.floor(p.height / 30.48), inch = Math.round((p.height / 2.54) - ft * 12);
    return '<form id="pform" class="card form" autocomplete="off">' +
      '<h2>' + (isNew ? 'Create profile' : 'Edit profile') + '</h2>' +
      '<label>Name<input name="name" required maxlength="30" value="' + esc(p.name) + '" placeholder="e.g. Priya"></label>' +
      '<div class="grid2"><label>Age<input name="age" type="number" inputmode="numeric" min="12" max="90" required value="' + p.age + '"></label>' +
      '<label>Gender<select name="gender">' + opt({ male: 'Male', female: 'Female', other: 'Other' }, p.gender) + '</select></label></div>' +
      '<div class="grid2"><label>Height (cm)<input name="height" type="number" inputmode="decimal" min="100" max="230" step="0.5" required value="' + p.height + '"></label>' +
      '<label>Weight (kg)<input name="weight" type="number" inputmode="decimal" min="25" max="250" step="0.1" required value="' + p.weight + '"></label></div>' +
      '<div class="ftin small muted">or height in feet: <input id="hft" type="number" min="3" max="7" value="' + ft + '"> ft <input id="hin" type="number" min="0" max="11" value="' + inch + '"> in</div>' +
      '<label>Main goal</label>' + chips('goal', GOALS, p.goal) +
      '<label>Experience</label>' + chips('level', LEVELS, p.level) +
      '<div class="grid2"><label>Workout days / week<select name="days">' + opt({ 2: '2 days', 3: '3 days', 4: '4 days', 5: '5 days', 6: '6 days' }, p.days) + '</select></label>' +
      '<label>Time per session<select name="minutes">' + opt({ 30: '30 min', 45: '45 min', 60: '60 min', 75: '75+ min' }, p.minutes) + '</select></label></div>' +
      '<label>Where do you train?<select name="equip">' + opt(EQUIP, p.equip) + '</select></label>' +
      '<label>Focus area</label>' + chips('focus', FOCUS, p.focus) +
      '<label>Daily activity (outside workouts)<select name="activity">' + opt(ACTIVITY, p.activity) + '</select></label>' +
      '<div class="grid2"><label>Food preference<select name="diet">' + opt(DIETS, p.diet) + '</select></label>' +
      '<label>Cuisine<select name="cuisine">' + opt(CUISINES, p.cuisine) + '</select></label></div>' +
      '<label class="check"><input type="checkbox" name="joint"' + (p.joint ? ' checked' : '') + '> Knee / back / joint issues — prefer low-impact exercises</label>' +
      '<div class="row gap">' + (isNew && state.profiles.length ? '<button type="button" class="btn ghost grow" data-act="back">Cancel</button>' : (!isNew ? '<button type="button" class="btn ghost grow" data-act="back">Cancel</button>' : '')) +
      '<button class="btn grow" type="submit">' + (isNew ? 'Create & build my plan' : 'Save') + '</button></div>' +
      (!isNew ? '<label class="check"><input type="checkbox" name="regen"> Also rebuild my suggested workout plan with these settings</label>' : '') +
      '<p class="tiny muted">Not medical advice. If you have a health condition, are pregnant, or are new to exercise after 40, check with a doctor first.</p>' +
      '</form>';
  }

  function viewToday(p, sel) {
    var st = stats(p), now = new Date(), wd = sel != null && sel !== '' ? +sel : now.getDay(), ap = activePlan(p);
    var hr = now.getHours(), greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    var h = '<div class="greet"><div><div class="muted small">' + WD_FULL[now.getDay()] + ', ' + now.getDate() + ' ' + now.toLocaleString('en-IN', { month: 'short' }) + '</div><h1>' + greet + ', ' + esc(p.name.split(' ')[0]) + '</h1></div></div>';
    h += '<div class="statrow">' +
      '<div class="stat"><b>' + st.bmi.toFixed(1) + '</b><span>BMI · ' + st.cat + '</span></div>' +
      '<div class="stat"><b>' + st.target + '</b><span>kcal / day</span></div>' +
      '<div class="stat"><b>' + r0(st.protein) + 'g</b><span>protein</span></div>' +
      '<div class="stat"><b>' + st.water + 'L</b><span>water</span></div></div>';
    if (!ap) {
      return h + '<div class="card cta"><h2>No workout plan yet</h2><p class="muted">Get a plan built for your age, body and goal in one tap.</p><button class="btn" data-act="gen">✨ Suggest my plan</button></div>';
    }
    // week strip
    h += '<div class="week">' + WEEK.map(function (d) {
      var day = ap.days.filter(function (x) { return x.wd === d; })[0];
      var done = doneOn(p, d);
      return '<button class="wd' + (d === wd ? ' on' : '') + (d === now.getDay() ? ' today' : '') + (day ? ' train' : '') + '" data-act="nav" data-to="today/' + d + '"><span>' + WD[d] + '</span><i>' + (done ? '✓' : day ? '●' : '·') + '</i></button>';
    }).join('') + '</div>';
    var day = ap.days.filter(function (x) { return x.wd === wd; })[0];
    var label = wd === now.getDay() ? "Today's workout" : WD_FULL[wd] + "'s workout";
    if (day) {
      var ds = dayStats(day, p);
      h += '<div class="card today"><div class="row between"><div><div class="muted small">' + label + '</div><h2>' + esc(day.name) + '</h2>' +
        '<div class="muted small">' + ds.n + ' exercises · ~' + ds.mins + ' min · ~' + ds.kcal + ' kcal</div></div>' +
        '<button class="btn" data-act="nav" data-to="workout/' + ap.id + '/' + day.id + '">Start ▶</button></div>' +
        '<div class="mini-list">' + day.items.map(function (it) {
          var ex = exById(it.ex); if (!ex) return '';
          return '<a class="mini" href="#/ex/' + ex.id + '">' + exThumb(ex.id, 'sm') + '<div><b>' + esc(ex.name) + '</b><span>' + it.sets + ' × ' + esc(it.reps) + '</span></div></a>';
        }).join('') + '</div></div>';
    } else {
      h += '<div class="card rest"><div class="muted small">' + label + '</div><h2>Rest & recover 🌿</h2>' +
        '<p class="muted">Muscles grow while you rest. Try active recovery: a 30–45 min brisk walk, light stretching, or a few rounds of Surya Namaskar.</p>' +
        '<a class="mini" href="#/ex/surya">' + exThumb('surya', 'sm') + '<div><b>Surya Namaskar</b><span>5–10 rounds, slow breathing</span></div></a></div>';
    }
    // meals
    var dd = dayDiet(p, wd);
    h += '<div class="card"><div class="row between"><h3>' + (wd === now.getDay() ? "Today's meals" : WD_FULL[wd] + "'s meals") + '</h3><a class="link" href="#/diet/' + wd + '">Full plan →</a></div>' +
      dd.meals.map(function (m) { return '<div class="meal-s"><span class="muted small">' + m.slot.name + '</span><span>' + esc(m.meal.n) + (m.f !== 1 ? ' <em>×' + frac(m.f) + '</em>' : '') + '</span></div>'; }).join('') +
      '<div class="muted small mt">≈ ' + r0(dd.kcal) + ' kcal · ' + r0(dd.p) + ' g protein</div></div>';
    var wk = weekCount(p);
    h += '<div class="card row between"><div><b>' + wk + ' / ' + ap.days.length + '</b> workouts this week<div class="muted small">' + (p.history || []).length + ' completed in total</div></div><a class="link" href="#/plan/' + ap.id + '">View plan →</a></div>';
    return h;
  }
  function doneOn(p, wd) {
    var now = new Date(), mon = new Date(now); mon.setHours(0, 0, 0, 0); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    var target = new Date(mon); target.setDate(mon.getDate() + ((wd + 6) % 7));
    var key = todayKey(target);
    return (p.history || []).some(function (h) { return h.date === key; });
  }
  function weekCount(p) {
    var now = new Date(), mon = new Date(now); mon.setHours(0, 0, 0, 0); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    var mk = todayKey(mon);
    var days = {};
    (p.history || []).forEach(function (h) { if (h.date >= mk) days[h.date] = 1; });
    return Object.keys(days).length;
  }

  function viewPlans(p) {
    var h = '<div class="pagehead"><h1>My plans</h1></div>' +
      '<div class="row gap"><button class="btn grow" data-act="gen">✨ Suggest a plan</button><button class="btn ghost grow" data-act="newplan">+ Create my own</button></div>' +
      '<label class="btn ghost small file mt">Import plan (.json)<input type="file" accept=".json,application/json" data-change="import"></label>';
    if (!p.plans.length) h += '<div class="card empty"><p class="muted">No plans yet. Let the app suggest one based on your profile, or build your own from 50+ exercises.</p></div>';
    p.plans.forEach(function (pl) {
      var act = pl.id === (activePlan(p) || {}).id;
      h += '<a class="card plan-card' + (act ? ' active' : '') + '" href="#/plan/' + pl.id + '"><div class="row between"><h3>' + esc(pl.name) + '</h3>' + (act ? '<span class="badge">Active</span>' : '') + '</div>' +
        '<div class="sched">' + WEEK.map(function (d) { var dd = pl.days.filter(function (x) { return x.wd === d; })[0]; return '<span class="' + (dd ? 'on' : '') + '">' + WD[d].charAt(0) + '</span>'; }).join('') + '</div>' +
        '<div class="muted small">' + pl.days.length + ' workout days · ' + pl.days.reduce(function (a, d) { return a + d.items.length; }, 0) + ' exercises' + (pl.auto ? ' · suggested' : ' · custom') + '</div></a>';
    });
    return h;
  }

  var editMode = false;
  function viewPlan(p, id) {
    var pl = plan(p, id); if (!pl) return '<div class="card">Plan not found. <a href="#/plans">Back</a></div>';
    var act = pl.id === (activePlan(p) || {}).id;
    var h = '<div class="pagehead"><a class="back" href="#/plans">‹ Plans</a><h1 class="title-edit" data-act="rename-plan" data-id="' + pl.id + '">' + esc(pl.name) + ' <small>✎</small></h1>' +
      (pl.note ? '<p class="muted small">' + esc(pl.note) + '</p>' : '') + '</div>' +
      '<div class="toolbar">' + (act ? '<span class="badge">Active plan</span>' : '<button class="btn small" data-act="activate" data-id="' + pl.id + '">Set active</button>') +
      '<button class="btn ghost small" data-act="toggle-edit">' + (editMode ? 'Done editing' : 'Edit') + '</button>' +
      '<button class="btn ghost small" data-act="export-plan" data-id="' + pl.id + '">Export ⤓</button>' +
      '<button class="btn ghost small" data-act="plan-more" data-id="' + pl.id + '">•••</button></div>';
    h += '<div class="sched big">' + WEEK.map(function (d) { var dd = pl.days.filter(function (x) { return x.wd === d; })[0]; return '<span class="' + (dd ? 'on' : '') + '"><b>' + WD[d] + '</b>' + (dd ? esc(dd.name.split(/[ —&]/)[0]) : 'Rest') + '</span>'; }).join('') + '</div>';
    pl.days.forEach(function (day, di) {
      var ds = dayStats(day, p);
      h += '<div class="card day"><div class="row between dayhead"><div><div class="muted small">' + (day.wd != null ? WD_FULL[day.wd] : 'Any day') + ' · ~' + ds.mins + ' min</div><h3>' + esc(day.name) + '</h3></div>' +
        (editMode ? '<button class="icon-btn" data-act="day-edit" data-p="' + pl.id + '" data-d="' + day.id + '" aria-label="Edit day">✎</button>' : '<button class="btn small" data-act="nav" data-to="workout/' + pl.id + '/' + day.id + '">Start ▶</button>') + '</div>';
      h += '<div class="warm muted small">🔥 Warm-up 5 min: march or jog on the spot, arm & hip circles, 10 easy squats.</div>';
      day.items.forEach(function (it, i) {
        var ex = exById(it.ex); if (!ex) return;
        h += '<div class="ex-row">' + '<a href="#/ex/' + ex.id + '">' + exThumb(ex.id, 'sm') + '</a><div class="grow"><a href="#/ex/' + ex.id + '"><b>' + esc(ex.name) + '</b></a><div class="muted small">' + it.sets + ' sets × ' + esc(it.reps) + ' · rest ' + it.rest + 's</div></div>' +
          (editMode ? '<div class="ed"><button class="icon-btn" data-act="item-up" data-p="' + pl.id + '" data-d="' + day.id + '" data-i="' + i + '" aria-label="Move up">↑</button><button class="icon-btn" data-act="item-edit" data-p="' + pl.id + '" data-d="' + day.id + '" data-i="' + i + '" aria-label="Edit sets">✎</button><button class="icon-btn" data-act="item-del" data-p="' + pl.id + '" data-d="' + day.id + '" data-i="' + i + '" aria-label="Remove">✕</button></div>' : '') + '</div>';
      });
      if (!day.items.length) h += '<p class="muted small">No exercises yet.</p>';
      if (editMode) h += '<button class="btn ghost small full" data-act="add-ex" data-p="' + pl.id + '" data-d="' + day.id + '">+ Add exercise</button>';
      h += '<div class="warm muted small">🧘 Cool-down 5 min: chest, hamstring & quad stretches, child\'s pose, slow breathing.</div></div>';
    });
    if (editMode) h += '<button class="btn ghost full" data-act="add-day" data-p="' + pl.id + '">+ Add workout day</button>';
    h += '<p class="muted small center mt">Rest days: 30–45 min walk, yoga or stretching keeps you moving.</p>';
    return h;
  }

  var session = null; // {key, done:{}}
  function viewWorkout(p, pid, did) {
    var pl = plan(p, pid), day = pl && pl.days.filter(function (d) { return d.id === did; })[0];
    if (!day) return '<div class="card">Workout not found.</div>';
    var key = todayKey() + '|' + pid + '|' + did;
    if (!p.session || p.session.key !== key) { p.session = { key: key, done: {}, start: Date.now() }; save(); }
    var s = p.session, total = 0, done = 0;
    day.items.forEach(function (it, i) { for (var k = 0; k < it.sets; k++) { total++; if (s.done[i + '-' + k]) done++; } });
    var h = '<div class="pagehead"><a class="back" href="#/today">‹ Today</a><h1>' + esc(day.name) + '</h1>' +
      '<div class="progress"><i style="width:' + (total ? done / total * 100 : 0) + '%"></i></div><div class="muted small">' + done + ' / ' + total + ' sets done</div></div>';
    h += '<div class="card warm-card"><b>Warm-up (5 min)</b><p class="muted small">March or jog on the spot 2 min · 10 arm circles each way · 10 hip circles · 10 bodyweight squats · 10 slow lunges.</p></div>';
    day.items.forEach(function (it, i) {
      var ex = exById(it.ex); if (!ex) return;
      var allDone = true; for (var k = 0; k < it.sets; k++) if (!s.done[i + '-' + k]) allDone = false;
      h += '<div class="card wo' + (allDone ? ' done' : '') + '" id="wo' + i + '"><div class="row gap wo-head" data-act="wo-expand" data-i="' + i + '">' + exThumb(ex.id, 'sm') +
        '<div class="grow"><b>' + (i + 1) + '. ' + esc(ex.name) + '</b><div class="muted small">' + it.sets + ' × ' + esc(it.reps) + ' · rest ' + it.rest + 's · ' + esc(ex.prim[0]) + '</div></div><span class="chev">⌄</span></div>' +
        '<div class="wo-body" hidden></div>' +
        '<div class="sets">' + Array.apply(null, Array(it.sets)).map(function (_, k) {
          return '<button class="set' + (s.done[i + '-' + k] ? ' on' : '') + '" data-act="set" data-i="' + i + '" data-k="' + k + '" data-rest="' + it.rest + '">' + (s.done[i + '-' + k] ? '✓' : 'Set ' + (k + 1)) + '</button>';
        }).join('') + '</div></div>';
    });
    h += '<div class="card warm-card"><b>Cool-down (5 min)</b><p class="muted small">Hold each stretch 20–30 s: chest stretch on a door frame, standing quad stretch, seated hamstring stretch, child\'s pose. Breathe slowly.</p></div>';
    h += '<button class="btn big full" data-act="finish" data-p="' + pid + '" data-d="' + did + '">Finish workout ✓</button>';
    return h;
  }

  var libQuery = '';
  function viewLibrary(p, part) {
    var h = '<div class="pagehead"><h1>Exercises</h1><p class="muted small">Tap any exercise for an animated demo and step-by-step form guide.</p></div>' +
      '<input id="search" class="search" type="search" placeholder="Search exercises or muscles…" data-input="search">' +
      '<div class="chips scroll"><a class="chip' + (!part ? ' on' : '') + '" href="#/library">All</a>' + D.PARTS.map(function (pt) { return '<a class="chip' + (part === pt.id ? ' on' : '') + '" href="#/library/' + pt.id + '">' + pt.icon + ' ' + pt.name + '</a>'; }).join('') + '</div>';
    if (part) {
      var rec = candidates(p, part, null, null).slice(0, part === 'cardio' ? 3 : 4);
      if (rec.length) {
        h += '<div class="card rec"><div class="row between"><div><div class="muted small">Recommended for you · ' + LEVELS[p.level] + ' · ' + EQUIP[p.equip].name.split(' — ')[0] + '</div><h3>' + partName(part) + ' routine</h3></div></div>' +
          rec.map(function (ex, i) { var rx = prescribe(ex, p, i); return '<a class="ex-row" href="#/ex/' + ex.id + '">' + exThumb(ex.id, 'sm') + '<div class="grow"><b>' + esc(ex.name) + '</b><div class="muted small">' + rx.sets + ' × ' + esc(rx.reps) + ' · rest ' + rx.rest + 's</div></div></a>'; }).join('') +
          '<button class="btn small full" data-act="save-part" data-part="' + part + '">+ Save as a workout day</button></div>';
      }
    } else {
      h += '<div class="parts">' + D.PARTS.map(function (pt) {
        var n = D.EX.filter(function (e) { return e.part === pt.id; }).length;
        return '<a class="part" href="#/library/' + pt.id + '"><span class="pi">' + pt.icon + '</span><b>' + pt.name + '</b><span class="muted small">' + n + ' exercises</span></a>';
      }).join('') + '</div><h3 class="mt">All exercises</h3>';
    }
    var list = D.EX.filter(function (e) { return !part || e.part === part; });
    h += '<div class="ex-grid" id="exlist">' + list.map(function (ex) { return exCard(ex, p); }).join('') + '</div>';
    return h;
  }
  function exCard(ex, p) {
    var ok = equipOk(ex, p);
    return '<a class="ex-card" href="#/ex/' + ex.id + '" data-name="' + esc((ex.name + ' ' + ex.prim.join(' ') + ' ' + ex.sec.join(' ') + ' ' + ex.part).toLowerCase()) + '">' + exThumb(ex.id) +
      '<b>' + esc(ex.name) + '</b><span class="muted small">' + esc(ex.prim[0]) + '</span>' +
      '<span class="tags"><i class="lv l' + ex.lvl + '">' + LEVELS[ex.lvl] + '</i>' + (ok ? '' : '<i class="need">' + esc(equipLabel(ex)) + '</i>') + '</span></a>';
  }

  function viewExercise(p, id) {
    var ex = exById(id); if (!ex) return '<div class="card">Exercise not found.</div>';
    var rx = prescribe(ex, p, 0);
    var h = '<div class="pagehead"><a class="back" href="#/library/' + ex.part + '">‹ ' + partName(ex.part) + '</a><h1>' + esc(ex.name) + '</h1>' +
      '<div class="tags"><i class="lv l' + ex.lvl + '">' + LEVELS[ex.lvl] + '</i><i>' + esc(equipLabel(ex)) + '</i>' + (ex.impact === 'high' ? '<i class="need">High impact</i>' : '') + '</div></div>';
    h += '<div class="player-card"><div class="stage" data-live="' + ex.id + '"></div><div class="phase"></div>' + (ex.anim.cap ? '<div class="cap">' + esc(ex.anim.cap) + '</div>' : '') +
      '<div class="pctl"><button class="icon-btn" data-act="pp" aria-label="Play / pause">❚❚</button>' +
      '<div class="segc small" data-seg="speed"><button data-val="0.5">0.5×</button><button class="on" data-val="1">1×</button><button data-val="1.5">1.5×</button></div></div>' +
      '<div class="legend"><span><i class="hl"></i>Target muscles</span><span><i class="eqd"></i>Equipment</span></div></div>';
    h += '<div class="card"><h3>Muscles worked</h3><div class="mus"><b>Primary:</b> ' + ex.prim.map(function (m) { return '<span class="pill hot">' + esc(m) + '</span>'; }).join('') +
      '</div><div class="mus"><b>Secondary:</b> ' + ex.sec.map(function (m) { return '<span class="pill">' + esc(m) + '</span>'; }).join('') + '</div></div>';
    h += '<div class="card rx"><div><div class="muted small">Suggested for you (' + GOALS[p.goal].toLowerCase() + ')</div><b class="big">' + rx.sets + ' sets × ' + esc(rx.reps) + '</b><div class="muted small">Rest ' + rx.rest + ' seconds between sets</div></div>' +
      '<button class="btn" data-act="add-to-plan" data-ex="' + ex.id + '">+ Add to plan</button></div>';
    h += '<div class="card"><h3>Starting position</h3><p>' + esc(ex.setup) + '</p><h3>How to do it</h3><ol class="steps">' + ex.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div>';
    h += '<div class="card"><h3>Body positioning</h3><dl class="pos">' + ex.pos.map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl></div>';
    h += '<div class="card"><h3>Common mistakes</h3><ul class="err">' + ex.err.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>';
    h += '<div class="card"><h3>Breathing</h3><p>' + esc(ex.breathe) + '</p><h3>Coach tip</h3><p>' + esc(ex.tip) + '</p>' +
      '<a class="link" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.name + ' exercise proper form') + '">▶ Watch real video demos (YouTube)</a></div>';
    return h;
  }

  function viewDiet(p, sel) {
    var st = stats(p), now = new Date(), wd = sel != null && sel !== '' ? +sel : now.getDay(), dd = dayDiet(p, wd);
    var h = '<div class="pagehead"><h1>Diet plan</h1><p class="muted small">Indian meals matched to your ' + st.target + ' kcal target (' + GOALS[p.goal].toLowerCase() + ').</p></div>';
    var pc = r0(st.protein * 4 / st.target * 100), fc = 25, cc = 100 - pc - fc;
    h += '<div class="card macro"><div class="kc"><b>' + st.target + '</b><span>kcal / day</span></div>' +
      '<div class="bars"><div><span>Protein</span><b>' + r0(st.protein) + ' g</b><i style="width:' + pc + '%" class="bp"></i></div>' +
      '<div><span>Carbs</span><b>' + r0(st.carbs) + ' g</b><i style="width:' + cc + '%" class="bc"></i></div>' +
      '<div><span>Fat</span><b>' + r0(st.fat) + ' g</b><i style="width:' + fc + '%" class="bf"></i></div>' +
      '<div><span>Water</span><b>' + st.water + ' L</b></div></div></div>';
    h += '<div class="row gap wrap"><select class="mini-sel" data-change="diet-pref" data-k="diet">' + opt(DIETS, p.diet) + '</select><select class="mini-sel" data-change="diet-pref" data-k="cuisine">' + opt(CUISINES, p.cuisine) + '</select>' +
      '<button class="btn ghost small" data-act="diet-shuffle">↻ New ideas</button><button class="btn ghost small" data-act="export-diet">Export ⤓</button></div>';
    if (p.diet === 'jain') h += '<p class="muted small">Jain: prepare all dishes without onion, garlic and root vegetables.</p>';
    h += '<div class="week">' + WEEK.map(function (d) { return '<button class="wd' + (d === wd ? ' on' : '') + (d === now.getDay() ? ' today' : '') + '" data-act="nav" data-to="diet/' + d + '"><span>' + WD[d] + '</span></button>'; }).join('') + '</div>';
    h += '<div class="card meals">' + dd.meals.map(function (m) {
      return '<div class="meal"><div class="mt-time"><b>' + m.slot.name + '</b><span>' + m.slot.time + '</span></div><div class="grow"><div>' + esc(m.meal.n) + '</div>' +
        '<div class="muted small">' + (m.f !== 1 ? 'Portion ×' + frac(m.f) + ' · ' : '') + r0(m.kcal) + ' kcal · ' + r0(m.p) + ' g protein</div></div>' +
        '<button class="icon-btn" data-act="swap" data-wd="' + wd + '" data-slot="' + m.slot.id + '" aria-label="Swap meal">↻</button></div>';
    }).join('') +
      '<div class="tot"><span>Day total</span><b>' + r0(dd.kcal) + ' kcal · ' + r0(dd.p) + ' g protein</b></div></div>';
    var tips = DIET.TIPS[p.goal === 'fitness' ? 'maintain' : p.goal] || [];
    h += '<div class="card"><h3>Tips for you</h3><ul class="tips">' + tips.concat(DIET.TIPS.common).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
    h += '<p class="tiny muted center">Calories are estimates. For diabetes, thyroid, PCOS, kidney issues or pregnancy, consult a doctor or dietitian.</p>';
    return h;
  }

  function viewProfile(p) {
    var st = stats(p);
    var h = '<div class="pagehead"><h1>Profile</h1></div>';
    h += '<div class="card prof"><div class="row gap"><span class="av big">' + esc(p.name.charAt(0).toUpperCase()) + '</span><div class="grow"><h2>' + esc(p.name) + '</h2><div class="muted small">' + p.age + ' yrs · ' + ({ male: 'Male', female: 'Female', other: 'Other' }[p.gender]) + ' · ' + p.height + ' cm · ' + p.weight + ' kg</div></div><button class="btn ghost small" data-act="nav" data-to="edit">Edit</button></div>' +
      '<div class="kv"><span>Goal</span><b>' + GOALS[p.goal] + '</b><span>Level</span><b>' + LEVELS[p.level] + '</b><span>Training</span><b>' + p.days + ' days · ' + p.minutes + ' min</b><span>Equipment</span><b>' + EQUIP[p.equip].name + '</b><span>Food</span><b>' + DIETS[p.diet] + ' · ' + CUISINES[p.cuisine] + '</b></div></div>';
    h += '<div class="card"><h3>Body stats</h3><div class="kv"><span>BMI</span><b>' + st.bmi.toFixed(1) + ' (' + st.cat + ', Asian-Indian scale)</b>' +
      '<span>Healthy weight</span><b>' + r0(st.wLo) + '–' + r0(st.wHi) + ' kg</b><span>BMR</span><b>' + r0(st.bmr) + ' kcal</b><span>Maintenance</span><b>' + r0(st.tdee) + ' kcal</b><span>Your target</span><b>' + st.target + ' kcal</b></div></div>';
    h += '<div class="card"><h3>Profiles on this device</h3>' + state.profiles.map(function (x) {
      return '<div class="row between prow"><button class="linkbtn" data-act="switch" data-id="' + x.id + '"><span class="av">' + esc(x.name.charAt(0).toUpperCase()) + '</span> ' + esc(x.name) + (x.id === p.id ? ' <span class="badge">Current</span>' : '') + '</button>' +
        '<button class="icon-btn" data-act="del-profile" data-id="' + x.id + '" aria-label="Delete profile">🗑</button></div>';
    }).join('') + '<button class="btn ghost small full" data-act="nav" data-to="newprofile">+ Add another person</button></div>';
    h += '<div class="card"><h3>Backup & data</h3><p class="muted small">Everything is stored on this device. Export a backup to move to a new phone.</p>' +
      '<div class="row gap wrap"><button class="btn ghost small" data-act="backup">Export backup</button><label class="btn ghost small file">Import backup / plan<input type="file" accept=".json,application/json" data-change="import"></label></div></div>';
    h += '<div class="card"><h3>App</h3><div class="row gap wrap"><button class="btn ghost small" data-act="theme">' + (state.theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode') + '</button>' +
      '<button class="btn small" data-act="install" id="installBtn">⤓ Install app</button></div>' +
      '<p class="muted small" id="installHint">' + installHint() + '</p></div>';
    h += '<p class="tiny muted center">Cardly Gym · works offline · not a substitute for professional medical advice.</p>';
    return h;
  }
  function installHint() {
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    if (standalone) return 'Installed ✓ — running as an app.';
    if (ios) return 'On iPhone/iPad: tap the Share button in Safari, then "Add to Home Screen".';
    return deferredPrompt ? 'Install for full-screen, offline use.' : 'Use your browser menu → "Install app" or "Add to Home screen".';
  }

  /* ───────── sheets ───────── */
  function profileSheet() {
    var p = prof();
    sheet('<h3>Switch profile</h3>' + state.profiles.map(function (x) {
      return '<button class="list-btn' + (x.id === p.id ? ' on' : '') + '" data-act="switch" data-id="' + x.id + '"><span class="av">' + esc(x.name.charAt(0).toUpperCase()) + '</span><span class="grow">' + esc(x.name) + '<small class="muted"> · ' + GOALS[x.goal] + '</small></span>' + (x.id === p.id ? '✓' : '') + '</button>';
    }).join('') + '<button class="btn ghost full mt" data-act="nav" data-to="newprofile">+ Add profile</button>');
  }
  function genSheet() {
    var p = prof();
    sheet('<h3>Suggest a workout plan</h3><p class="muted small">Built from your age (' + p.age + '), ' + p.gender + ', ' + p.height + ' cm, ' + p.weight + ' kg. Adjust if you like:</p>' +
      '<form id="gform"><label>Goal</label>' + chips('goal', GOALS, p.goal) + '<label>Experience</label>' + chips('level', LEVELS, p.level) +
      '<div class="grid2"><label>Days / week<select name="days">' + opt({ 2: '2 days', 3: '3 days', 4: '4 days', 5: '5 days', 6: '6 days' }, p.days) + '</select></label>' +
      '<label>Session<select name="minutes">' + opt({ 30: '30 min', 45: '45 min', 60: '60 min', 75: '75+ min' }, p.minutes) + '</select></label></div>' +
      '<label>Equipment<select name="equip">' + opt(EQUIP, p.equip) + '</select></label><label>Focus</label>' + chips('focus', FOCUS, p.focus) +
      '<button class="btn full mt" type="submit">✨ Build my plan</button></form>', {
        onMount: function (w) {
          $('#gform', w).onsubmit = function (e) {
            e.preventDefault(); var f = e.target;
            p.goal = segVal(f, 'goal'); p.level = +segVal(f, 'level'); p.focus = segVal(f, 'focus');
            p.days = +f.days.value; p.minutes = +f.minutes.value; p.equip = f.equip.value;
            var pl = generatePlan(p); p.plans.unshift(pl); p.activePlanId = pl.id; save(); closeSheet(); editMode = false;
            toast('Plan ready — set as active'); go('plan/' + pl.id);
          };
        }
      });
  }
  function segVal(root, name) { var b = root.querySelector('[data-seg="' + name + '"] .on'); return b ? b.getAttribute('data-val') : null; }
  function pickExSheet(cb, title) {
    var p = prof(), part = 'chest';
    function list() {
      return candidates(p, part, null, null).concat(D.EX.filter(function (e) { return e.part === part && !equipOk(e, p); }))
        .filter(function (e, i, a) { return a.indexOf(e) === i; })
        .map(function (ex) { return '<button class="list-btn" data-pick="' + ex.id + '">' + exThumb(ex.id, 'sm') + '<span class="grow"><b>' + esc(ex.name) + '</b><small class="muted"> ' + esc(ex.prim[0]) + (equipOk(ex, p) ? '' : ' · needs ' + esc(equipLabel(ex))) + '</small></span>+</button>'; }).join('');
    }
    var w = sheet('<h3>' + (title || 'Add exercise') + '</h3><div class="chips scroll" id="pparts">' + D.PARTS.map(function (pt) { return '<button class="chip' + (pt.id === part ? ' on' : '') + '" data-pp="' + pt.id + '">' + pt.name + '</button>'; }).join('') + '</div><div id="plist" class="plist">' + list() + '</div>', {
      onMount: function (w) {
        w.addEventListener('click', function (e) {
          var pp = e.target.closest('[data-pp]');
          if (pp) { part = pp.getAttribute('data-pp'); $$('[data-pp]', w).forEach(function (b) { b.classList.toggle('on', b === pp); }); $('#plist', w).innerHTML = list(); mountFigures($('#plist', w)); return; }
          var pk = e.target.closest('[data-pick]');
          if (pk) { cb(pk.getAttribute('data-pick')); }
        });
      }
    });
    return w;
  }
  function choosePlanDaySheet(onPick, allowNewPlan) {
    var p = prof();
    var html = '<h3>Add to which day?</h3>';
    p.plans.forEach(function (pl) {
      html += '<div class="muted small mt">' + esc(pl.name) + '</div>' + pl.days.map(function (d) {
        return '<button class="list-btn" data-pd="' + pl.id + '|' + d.id + '"><span class="grow">' + esc(d.name) + ' <small class="muted">' + (d.wd != null ? WD[d.wd] : '') + '</small></span>+</button>';
      }).join('') + '<button class="list-btn ghost" data-pd="' + pl.id + '|new">+ New day in this plan</button>';
    });
    if (allowNewPlan !== false) html += '<button class="btn ghost full mt" data-pd="newplan">+ Create a new plan</button>';
    sheet(html, { onMount: function (w) { w.addEventListener('click', function (e) { var b = e.target.closest('[data-pd]'); if (b) { closeSheet(); onPick(b.getAttribute('data-pd')); } }); } });
  }
  function resolvePlanDay(code, dayName) {
    var p = prof(), pl, day;
    if (code === 'newplan') {
      pl = { id: uid(), name: 'My plan', created: Date.now(), auto: false, days: [] }; p.plans.unshift(pl);
      if (!p.activePlanId) p.activePlanId = pl.id;
      day = { id: uid(), name: dayName || 'Day 1', wd: null, items: [] }; pl.days.push(day);
    } else {
      var parts = code.split('|'); pl = plan(p, parts[0]);
      if (parts[1] === 'new') { day = { id: uid(), name: dayName || ('Day ' + (pl.days.length + 1)), wd: freeWd(pl), items: [] }; pl.days.push(day); }
      else day = pl.days.filter(function (d) { return d.id === parts[1]; })[0];
    }
    return { pl: pl, day: day };
  }
  function freeWd(pl) { for (var i = 0; i < WEEK.length; i++) { var d = WEEK[i]; if (!pl.days.some(function (x) { return x.wd === d; })) return d; } return null; }

  function itemEditSheet(pl, day, i) {
    var it = day.items[i], ex = exById(it.ex);
    sheet('<h3>' + esc(ex.name) + '</h3><form id="iform"><div class="grid3"><label>Sets<input name="sets" type="number" min="1" max="10" value="' + it.sets + '"></label>' +
      '<label>Reps / time<input name="reps" value="' + esc(it.reps) + '"></label><label>Rest (s)<input name="rest" type="number" min="0" max="600" step="15" value="' + it.rest + '"></label></div>' +
      '<button class="btn full mt" type="submit">Save</button></form>', {
        onMount: function (w) { $('#iform', w).onsubmit = function (e) { e.preventDefault(); var f = e.target; it.sets = clamp(+f.sets.value || 1, 1, 10); it.reps = f.reps.value.slice(0, 20) || '10'; it.rest = clamp(+f.rest.value || 0, 0, 600); save(); render(); }; }
      });
  }
  function dayEditSheet(pl, day) {
    sheet('<h3>Edit day</h3><form id="dform"><label>Name<input name="name" maxlength="40" value="' + esc(day.name) + '"></label>' +
      '<label>Weekday<select name="wd"><option value="">Any day</option>' + WEEK.map(function (d) { return '<option value="' + d + '"' + (day.wd === d ? ' selected' : '') + '>' + WD_FULL[d] + '</option>'; }).join('') + '</select></label>' +
      '<div class="row gap mt"><button type="button" class="btn danger grow" id="ddel">Delete day</button><button class="btn grow" type="submit">Save</button></div></form>', {
        onMount: function (w) {
          $('#dform', w).onsubmit = function (e) { e.preventDefault(); var f = e.target; day.name = f.name.value || day.name; day.wd = f.wd.value === '' ? null : +f.wd.value; save(); render(); };
          $('#ddel', w).onclick = function () { pl.days = pl.days.filter(function (d) { return d !== day; }); save(); render(); };
        }
      });
  }

  /* ───────── export / import ───────── */
  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime || 'application/json' });
    try {
      var file = new File([blob], name, { type: mime || 'application/json' });
      if (navigator.canShare && /android|iphone|ipad|ipod/i.test(navigator.userAgent) && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: name }).catch(function () { dl(); });
        return;
      }
    } catch (e) { /* fall through */ }
    dl();
    function dl() {
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    }
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'plan'; }
  function planText(pl, p) {
    var t = pl.name + '\nFor: ' + p.name + ' (' + p.age + ' yrs, ' + p.height + ' cm, ' + p.weight + ' kg)\n';
    pl.days.forEach(function (d) {
      t += '\n== ' + (d.wd != null ? WD_FULL[d.wd] + ' — ' : '') + d.name + ' ==\n';
      d.items.forEach(function (it, i) { var ex = exById(it.ex); if (ex) t += (i + 1) + '. ' + ex.name + ' — ' + it.sets + ' × ' + it.reps + ' (rest ' + it.rest + 's)\n'; });
    });
    return t + '\nMade with Cardly Gym — cardly.in/gym';
  }
  function printHtml(title, body) {
    var pa = $('#print');
    pa.innerHTML = '<div class="pr-head"><b>Cardly Gym</b><span>' + esc(title) + '</span></div>' + body + '<div class="pr-foot">cardly.in/gym · generated ' + new Date().toLocaleDateString('en-IN') + '</div>';
    document.body.classList.add('printing');
    setTimeout(function () {
      window.print();
      setTimeout(function () { document.body.classList.remove('printing'); }, 800);
    }, 50);
  }
  function printPlan(pl, p) {
    var st = stats(p), b = '<h1>' + esc(pl.name) + '</h1><p>' + esc(p.name) + ' · ' + p.age + ' yrs · ' + p.height + ' cm · ' + p.weight + ' kg · BMI ' + st.bmi.toFixed(1) + ' · Goal: ' + GOALS[p.goal] + '</p>';
    pl.days.forEach(function (d) {
      b += '<h2>' + (d.wd != null ? WD_FULL[d.wd] + ' — ' : '') + esc(d.name) + '</h2><p class="pr-note">Warm-up 5 min · then:</p><table><tr><th>#</th><th>Exercise</th><th>Sets × Reps</th><th>Rest</th><th>Key form cue</th><th>✓</th></tr>' +
        d.items.map(function (it, i) { var ex = exById(it.ex); if (!ex) return ''; return '<tr><td>' + (i + 1) + '</td><td><b>' + esc(ex.name) + '</b><br><small>' + esc(ex.prim.join(', ')) + '</small></td><td>' + it.sets + ' × ' + esc(it.reps) + '</td><td>' + it.rest + 's</td><td><small>' + esc(ex.pos[0][0] + ': ' + ex.pos[0][1]) + ' ' + esc(ex.steps[1] || '') + '</small></td><td></td></tr>'; }).join('') + '</table>';
    });
    b += '<p class="pr-note">Rest days: walk, yoga or stretching. Cool down 5 min after every session.</p>';
    printHtml(pl.name, b);
  }
  function printDiet(p) {
    var st = stats(p), b = '<h1>Weekly diet plan — ' + esc(p.name) + '</h1><p>' + st.target + ' kcal/day · protein ' + r0(st.protein) + ' g · carbs ' + r0(st.carbs) + ' g · fat ' + r0(st.fat) + ' g · water ' + st.water + ' L · ' + DIETS[p.diet] + '</p>';
    WEEK.forEach(function (wd) {
      var dd = dayDiet(p, wd);
      b += '<h2>' + WD_FULL[wd] + '</h2><table>' + dd.meals.map(function (m) { return '<tr><td style="width:24%"><b>' + m.slot.name + '</b><br><small>' + m.slot.time + '</small></td><td>' + esc(m.meal.n) + (m.f !== 1 ? ' <b>(×' + frac(m.f) + ')</b>' : '') + '</td><td style="width:18%">' + r0(m.kcal) + ' kcal<br><small>' + r0(m.p) + ' g protein</small></td></tr>'; }).join('') + '</table>';
    });
    printHtml('Diet plan', b);
  }
  function exportPlanSheet(pl) {
    var p = prof();
    sheet('<h3>Export "' + esc(pl.name) + '"</h3>' +
      '<button class="list-btn" data-x="pdf"><span class="grow"><b>Print / Save as PDF</b><small class="muted"> — printable table with form cues</small></span>›</button>' +
      '<button class="list-btn" data-x="share"><span class="grow"><b>Share as text</b><small class="muted"> — WhatsApp, email, notes</small></span>›</button>' +
      '<button class="list-btn" data-x="csv"><span class="grow"><b>Download CSV</b><small class="muted"> — open in Excel / Sheets</small></span>›</button>' +
      '<button class="list-btn" data-x="json"><span class="grow"><b>Download plan file (.json)</b><small class="muted"> — import on another phone or profile</small></span>›</button>', {
        onMount: function (w) {
          w.addEventListener('click', function (e) {
            var b = e.target.closest('[data-x]'); if (!b) return; var x = b.getAttribute('data-x'); closeSheet();
            if (x === 'pdf') printPlan(pl, p);
            else if (x === 'share') shareText(pl.name, planText(pl, p));
            else if (x === 'csv') {
              var rows = [['Weekday', 'Day', '#', 'Exercise', 'Sets', 'Reps', 'Rest (s)', 'Primary muscles']];
              pl.days.forEach(function (d) { d.items.forEach(function (it, i) { var ex = exById(it.ex); if (ex) rows.push([d.wd != null ? WD_FULL[d.wd] : '', d.name, i + 1, ex.name, it.sets, it.reps, it.rest, ex.prim.join('; ')]); }); });
              download(slug(pl.name) + '.csv', '﻿' + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n'), 'text/csv');
            } else download(slug(pl.name) + '.json', JSON.stringify({ type: 'cardly-gym-plan', v: 1, plan: pl }, null, 2));
          });
        }
      });
  }
  function shareText(title, text) {
    if (navigator.share) { navigator.share({ title: title, text: text }).catch(function () { }); return; }
    copy(text);
  }
  function copy(text) {
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Copied to clipboard'); } catch (e) { toast('Copy failed'); } ta.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast('Copied to clipboard'); }, fallback); else fallback();
  }
  function importFile(file) {
    var fr = new FileReader();
    fr.onload = function () {
      var data; try { data = JSON.parse(fr.result); } catch (e) { toast('Not a valid file'); return; }
      if (data && data.type === 'cardly-gym-plan' && data.plan && data.plan.days) {
        var p = prof(); if (!p) { toast('Create a profile first'); return; }
        var pl = data.plan; pl.id = uid(); pl.days.forEach(function (d) { d.id = uid(); d.items = (d.items || []).filter(function (it) { return exById(it.ex); }); });
        p.plans.unshift(pl); save(); toast('Plan imported'); go('plan/' + pl.id);
      } else if (data && data.type === 'cardly-gym-backup' && data.state && data.state.profiles) {
        var doIt = function () {
          var ids = state.profiles.map(function (x) { return x.id; });
          data.state.profiles.forEach(function (x) { if (ids.indexOf(x.id) >= 0) state.profiles = state.profiles.filter(function (y) { return y.id !== x.id; }); state.profiles.push(x); });
          if (!state.activeId) state.activeId = data.state.activeId || state.profiles[0].id;
          save(); toast('Backup restored (' + data.state.profiles.length + ' profiles)'); go('today');
        };
        if (state.profiles.length) confirmBox('Restore backup? Profiles with the same ID will be replaced.', 'Restore', doIt); else doIt();
      } else toast('Unrecognised file');
    };
    fr.readAsText(file);
  }

  /* ───────── rest timer ───────── */
  var restT = null;
  function startRest(sec) {
    var el = $('#rest'); if (!sec) return;
    var end = Date.now() + sec * 1000;
    clearInterval(restT); el.hidden = false;
    function tick() {
      var left = Math.max(0, Math.round((end - Date.now()) / 1000));
      el.innerHTML = '<span>Rest</span><b>' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0') + '</b><button data-act="rest-add">+15s</button><button data-act="rest-skip">Skip</button>';
      if (left <= 0) { clearInterval(restT); el.hidden = true; beep(); try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { /* ignore */ } toast('Rest over — next set! 💪'); }
    }
    startRest.add = function (s) { end += s * 1000; tick(); };
    tick(); restT = setInterval(tick, 500);
  }
  function beep() {
    try {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      var c = beep.c || (beep.c = new C()), o = c.createOscillator(), g = c.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(c.destination); g.gain.setValueAtTime(0.15, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
      o.start(); o.stop(c.currentTime + 0.4);
    } catch (e) { /* ignore */ }
  }

  /* ───────── actions ───────── */
  var A = {
    nav: function (b) { go(b.getAttribute('data-to')); },
    back: function () { history.length > 1 ? history.back() : go('today'); },
    'close-sheet': closeSheet,
    who: function () { if (prof()) profileSheet(); },
    switch: function (b) { state.activeId = b.getAttribute('data-id'); save(); closeSheet(); toast('Switched to ' + prof().name); go('today'); },
    gen: genSheet,
    newplan: function () {
      var p = prof(), pl = { id: uid(), name: 'My plan ' + (p.plans.length + 1), created: Date.now(), auto: false, days: [{ id: uid(), name: 'Day 1', wd: 1, items: [] }] };
      p.plans.unshift(pl); if (!p.activePlanId) p.activePlanId = pl.id; save(); editMode = true; go('plan/' + pl.id);
    },
    activate: function (b) { var p = prof(); p.activePlanId = b.getAttribute('data-id'); save(); toast('Active plan updated'); render(); },
    'toggle-edit': function () { editMode = !editMode; render(); },
    'rename-plan': function (b) {
      var p = prof(), pl = plan(p, b.getAttribute('data-id'));
      sheet('<h3>Rename plan</h3><form id="rform"><input name="n" maxlength="60" value="' + esc(pl.name) + '"><button class="btn full mt">Save</button></form>', { onMount: function (w) { var f = $('#rform', w); f.n.focus(); f.onsubmit = function (e) { e.preventDefault(); pl.name = f.n.value.trim() || pl.name; save(); render(); }; } });
    },
    'export-plan': function (b) { exportPlanSheet(plan(null, b.getAttribute('data-id'))); },
    'plan-more': function (b) {
      var p = prof(), pl = plan(p, b.getAttribute('data-id'));
      sheet('<h3>' + esc(pl.name) + '</h3><button class="list-btn" id="dup">Duplicate plan</button><button class="list-btn danger" id="del">Delete plan</button>', {
        onMount: function (w) {
          $('#dup', w).onclick = function () { var c = JSON.parse(JSON.stringify(pl)); c.id = uid(); c.name = pl.name + ' (copy)'; c.days.forEach(function (d) { d.id = uid(); }); p.plans.unshift(c); save(); toast('Duplicated'); go('plan/' + c.id); };
          $('#del', w).onclick = function () { confirmBox('Delete "' + pl.name + '"?', 'Delete', function () { p.plans = p.plans.filter(function (x) { return x !== pl; }); if (p.activePlanId === pl.id) p.activePlanId = p.plans[0] ? p.plans[0].id : null; save(); go('plans'); }); };
        }
      });
    },
    'day-edit': function (b) { var pl = plan(null, b.getAttribute('data-p')); dayEditSheet(pl, pl.days.filter(function (d) { return d.id === b.getAttribute('data-d'); })[0]); },
    'add-day': function (b) { var pl = plan(null, b.getAttribute('data-p')); pl.days.push({ id: uid(), name: 'Day ' + (pl.days.length + 1), wd: freeWd(pl), items: [] }); save(); render(); },
    'add-ex': function (b) {
      var p = prof(), pl = plan(p, b.getAttribute('data-p')), day = pl.days.filter(function (d) { return d.id === b.getAttribute('data-d'); })[0];
      pickExSheet(function (id) { var rx = prescribe(exById(id), p, day.items.length); day.items.push({ ex: id, sets: rx.sets, reps: rx.reps, rest: rx.rest }); save(); toast(exById(id).name + ' added'); render(); });
    },
    'item-up': function (b) { var pl = plan(null, b.getAttribute('data-p')), day = pl.days.filter(function (d) { return d.id === b.getAttribute('data-d'); })[0], i = +b.getAttribute('data-i'); if (i > 0) { var t = day.items[i]; day.items[i] = day.items[i - 1]; day.items[i - 1] = t; save(); render(); } },
    'item-del': function (b) { var pl = plan(null, b.getAttribute('data-p')), day = pl.days.filter(function (d) { return d.id === b.getAttribute('data-d'); })[0]; day.items.splice(+b.getAttribute('data-i'), 1); save(); render(); },
    'item-edit': function (b) { var pl = plan(null, b.getAttribute('data-p')), day = pl.days.filter(function (d) { return d.id === b.getAttribute('data-d'); })[0]; itemEditSheet(pl, day, +b.getAttribute('data-i')); },
    'add-to-plan': function (b) {
      var p = prof(), id = b.getAttribute('data-ex');
      choosePlanDaySheet(function (code) { var r = resolvePlanDay(code); var rx = prescribe(exById(id), p, r.day.items.length); r.day.items.push({ ex: id, sets: rx.sets, reps: rx.reps, rest: rx.rest }); save(); toast('Added to ' + r.day.name); });
    },
    'save-part': function (b) {
      var p = prof(), part = b.getAttribute('data-part'), rec = candidates(p, part, null, null).slice(0, part === 'cardio' ? 3 : 4);
      choosePlanDaySheet(function (code) {
        var r = resolvePlanDay(code, partName(part) + ' day');
        rec.forEach(function (ex, i) { var rx = prescribe(ex, p, i); r.day.items.push({ ex: ex.id, sets: rx.sets, reps: rx.reps, rest: rx.rest }); });
        save(); toast(partName(part) + ' routine saved'); go('plan/' + r.pl.id);
      });
    },
    'wo-expand': function (b) {
      var i = b.getAttribute('data-i'), card = $('#wo' + i), body = $('.wo-body', card), p = prof();
      var ap = route(), pl = plan(p, ap[1]), day = pl.days.filter(function (d) { return d.id === ap[2]; })[0], ex = exById(day.items[+i].ex);
      if (!body.hidden) { $$('[data-live]', body).forEach(function (el) { el._player && el._player.destroy(); }); body.hidden = true; body.innerHTML = ''; card.classList.remove('open'); return; }
      body.innerHTML = '<div class="stage sm" data-live="' + ex.id + '"></div><div class="phase"></div><ol class="steps small">' + ex.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
        '<div class="small"><b>Body position:</b> ' + ex.pos.map(function (x) { return esc(x[0]) + ' — ' + esc(x[1]); }).join(' · ') + '</div><a class="link small" href="#/ex/' + ex.id + '">Full guide →</a>';
      body.hidden = false; card.classList.add('open'); mountFigures(body);
    },
    set: function (b) {
      var p = prof(), k = b.getAttribute('data-i') + '-' + b.getAttribute('data-k'), on = !p.session.done[k];
      p.session.done[k] = on; save();
      b.classList.toggle('on', on); b.textContent = on ? '✓' : 'Set ' + (+b.getAttribute('data-k') + 1);
      var card = b.closest('.wo'), all = $$('.set', card).every(function (x) { return x.classList.contains('on'); });
      card.classList.toggle('done', all);
      var tot = $$('.set').length, dn = $$('.set.on').length;
      $('.progress i').style.width = (dn / tot * 100) + '%'; $('.pagehead .muted.small').textContent = dn + ' / ' + tot + ' sets done';
      if (on) startRest(+b.getAttribute('data-rest'));
    },
    'rest-skip': function () { clearInterval(restT); $('#rest').hidden = true; },
    'rest-add': function () { if (startRest.add) startRest.add(15); },
    finish: function (b) {
      var p = prof(), pl = plan(p, b.getAttribute('data-p')), day = pl.days.filter(function (d) { return d.id === b.getAttribute('data-d'); })[0];
      var s = p.session || { done: {} }, done = Object.keys(s.done).filter(function (k) { return s.done[k]; }).length;
      p.history = p.history || [];
      p.history.push({ date: todayKey(), plan: pl.id, day: day.id, name: day.name, sets: done, mins: s.start ? Math.round((Date.now() - s.start) / 60000) : null });
      if (p.history.length > 500) p.history = p.history.slice(-500);
      p.session = null; save(); clearInterval(restT); $('#rest').hidden = true;
      sheet('<div class="center"><div class="big-emoji">🎉</div><h2>Workout complete!</h2><p class="muted">' + done + ' sets done · ' + weekCount(p) + ' workouts this week. Drink water and have a protein-rich meal.</p><button class="btn full" data-act="nav" data-to="today">Back to Today</button></div>');
    },
    swap: function (b) {
      var p = prof(), wd = +b.getAttribute('data-wd'), slot = b.getAttribute('data-slot');
      var cur = dayDiet(p, wd).meals.filter(function (m) { return m.slot.id === slot; })[0];
      var pool = dietPool(slot, p);
      sheet('<h3>Swap ' + esc(cur.slot.name.toLowerCase()) + '</h3><div class="plist">' + pool.map(function (m) {
        return '<button class="list-btn' + (m.id === cur.meal.id ? ' on' : '') + '" data-meal="' + m.id + '"><span class="grow">' + esc(m.n) + '<small class="muted"> · ' + m.kcal + ' kcal · ' + m.p + ' g protein</small></span>' + (m.id === cur.meal.id ? '✓' : '') + '</button>';
      }).join('') + '</div>', {
        onMount: function (w) { w.addEventListener('click', function (e) { var x = e.target.closest('[data-meal]'); if (!x) return; p.dietSwap = p.dietSwap || {}; p.dietSwap[wd + '_' + slot] = x.getAttribute('data-meal'); save(); render(); }); }
      });
    },
    'diet-shuffle': function () { var p = prof(); p.dietSeed = (p.dietSeed || 0) + 1; p.dietSwap = {}; save(); render(); toast('Fresh meal ideas for the week'); },
    'export-diet': function () {
      var p = prof();
      sheet('<h3>Export diet plan</h3><button class="list-btn" data-x="pdf"><span class="grow"><b>Print / Save as PDF</b><small class="muted"> — full week</small></span>›</button><button class="list-btn" data-x="share"><span class="grow"><b>Share as text</b></span>›</button>', {
        onMount: function (w) {
          w.addEventListener('click', function (e) {
            var b = e.target.closest('[data-x]'); if (!b) return; closeSheet();
            if (b.getAttribute('data-x') === 'pdf') printDiet(p);
            else {
              var t = 'Diet plan for ' + p.name + ' — ' + stats(p).target + ' kcal/day\n';
              WEEK.forEach(function (wd) { t += '\n== ' + WD_FULL[wd] + ' ==\n'; dayDiet(p, wd).meals.forEach(function (m) { t += m.slot.name + ': ' + m.meal.n + (m.f !== 1 ? ' (×' + frac(m.f) + ')' : '') + '\n'; }); });
              shareText('Diet plan', t + '\nMade with Cardly Gym — cardly.in/gym');
            }
          });
        }
      });
    },
    'del-profile': function (b) {
      var id = b.getAttribute('data-id'), x = state.profiles.filter(function (y) { return y.id === id; })[0];
      confirmBox('Delete ' + x.name + '\'s profile, plans and history? This cannot be undone.', 'Delete', function () {
        state.profiles = state.profiles.filter(function (y) { return y.id !== id; });
        if (state.activeId === id) state.activeId = state.profiles[0] ? state.profiles[0].id : null;
        save(); go(state.profiles.length ? 'profile' : 'welcome');
      });
    },
    backup: function () { download('cardly-gym-backup-' + todayKey() + '.json', JSON.stringify({ type: 'cardly-gym-backup', v: 1, date: new Date().toISOString(), state: state }, null, 1)); },
    theme: function () { state.theme = state.theme === 'light' ? 'dark' : 'light'; save(); render(); updateThemeColor(); },
    install: function () {
      if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then(function () { deferredPrompt = null; render(); }); }
      else toast(installHint(), 4000);
    },
    pp: function (b) { var st = $('.stage[data-live]'); if (st && st._player) { var on = st._player.toggle(); b.textContent = on ? '❚❚' : '▶'; } }
  };
  document.addEventListener('click', function (e) {
    var seg = e.target.closest('[data-seg] button');
    if (seg) {
      e.preventDefault();
      var grp = seg.parentNode; $$('button', grp).forEach(function (x) { x.classList.toggle('on', x === seg); });
      if (grp.getAttribute('data-seg') === 'speed') { var st = $('.stage[data-live]'); if (st && st._player) st._player.setSpeed(+seg.getAttribute('data-val')); }
      return;
    }
    var a = e.target.closest('[data-act]');
    if (a && A[a.getAttribute('data-act')]) { e.preventDefault(); A[a.getAttribute('data-act')](a, e); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target, c = t.getAttribute('data-change');
    if (c === 'import' && t.files && t.files[0]) { importFile(t.files[0]); t.value = ''; }
    if (c === 'diet-pref') { var p = prof(); p[t.getAttribute('data-k')] = t.value; p.dietSwap = {}; save(); render(); }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.getAttribute('data-input') === 'search') {
      libQuery = t.value.trim().toLowerCase();
      $$('#exlist .ex-card').forEach(function (c) { c.style.display = !libQuery || c.getAttribute('data-name').indexOf(libQuery) >= 0 ? '' : 'none'; });
    }
    if (t.id === 'hft' || t.id === 'hin') {
      var f = $('#pform'); var cm = ((+$('#hft').value || 0) * 12 + (+$('#hin').value || 0)) * 2.54;
      if (cm > 90) f.height.value = Math.round(cm * 2) / 2;
    }
  });
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'pform') return;
    e.preventDefault();
    var f = e.target, existing = route()[0] === 'edit' ? prof() : null;
    var data = {
      name: f.name.value.trim().slice(0, 30) || 'Me', age: clamp(+f.age.value || 25, 10, 100), gender: f.gender.value,
      height: clamp(+f.height.value || 170, 90, 240), weight: clamp(+f.weight.value || 70, 20, 300),
      goal: segVal(f, 'goal') || 'fitness', level: +(segVal(f, 'level') || 1), days: +f.days.value, minutes: +f.minutes.value,
      equip: f.equip.value, focus: segVal(f, 'focus') || 'balanced', activity: f.activity.value, diet: f.diet.value, cuisine: f.cuisine.value, joint: f.joint.checked
    };
    if (existing) {
      for (var k in data) existing[k] = data[k];
      existing.dietSwap = {};
      if (f.regen && f.regen.checked) { var pl = generatePlan(existing); existing.plans.unshift(pl); existing.activePlanId = pl.id; toast('Profile saved & new plan created'); }
      else toast('Profile saved');
      save(); go('profile');
    } else {
      var p = data; p.id = uid(); p.created = Date.now(); p.plans = []; p.history = []; p.dietSwap = {}; p.dietSeed = 0;
      var gp = generatePlan(p); p.plans.push(gp); p.activePlanId = gp.id;
      state.profiles.push(p); state.activeId = p.id; save();
      toast('Welcome, ' + p.name + '! Your plan is ready 💪'); go('today');
    }
  });

  /* ───────── PWA ───────── */
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredPrompt = e; var h = $('#installHint'); if (h) h.textContent = installHint(); });
  function updateThemeColor() { var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', state.theme === 'light' ? '#f6f7fb' : '#0e1015'); }
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        reg.addEventListener('updatefound', function () {
          var nw = reg.installing; if (!nw) return;
          nw.addEventListener('statechange', function () { if (nw.state === 'installed' && navigator.serviceWorker.controller) toast('App updated — reopen to get the latest version', 4000); });
        });
      }).catch(function () { /* ignore */ });
    });
  }

  // nav
  $('#nav').innerHTML = [['today', 'Today'], ['plans', 'Plans'], ['library', 'Exercises'], ['diet', 'Diet'], ['profile', 'Profile']].map(function (x) {
    return '<a href="#/' + x[0] + '" data-tab="' + x[0] + '">' + ICON[x[0]] + '<span>' + x[1] + '</span></a>';
  }).join('');
  updateThemeColor();
  render();

  // expose for testing
  window.CardlyGym = { state: state, generatePlan: generatePlan, stats: stats, dayDiet: dayDiet };
})();
