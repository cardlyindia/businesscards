/* Cardly Gym — stick-figure exercise animation engine (no dependencies)
 * Poses are described with a hip position, torso angle and limb specs.
 * Limb spec: [upperAngle, lowerAngle] (absolute, 0 = straight down, 90 = forward, 180 = up)
 *            or {x,y,b} / {dx,dy,b} inverse-kinematics target (absolute or relative to the limb root).
 */
(function (global) {
  'use strict';
  var L = { torso: 50, neck: 6, head: 10, uarm: 28, farm: 27, thigh: 40, shin: 40, foot: 11 };
  var GROUND = 180;
  var NS = 'http://www.w3.org/2000/svg';
  var VB = '0 -12 200 200';

  function rad(d) { return d * Math.PI / 180; }
  function add(p, v) { return [p[0] + v[0], p[1] + v[1]]; }
  function vec(a, len, m) { return [m * Math.sin(rad(a)) * len, Math.cos(rad(a)) * len]; }

  function ik(root, target, l1, l2, s) {
    var dx = target[0] - root[0], dy = target[1] - root[1];
    var d = Math.sqrt(dx * dx + dy * dy) || 0.001;
    var dd = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, d));
    var phi = Math.atan2(dy, dx);
    var c = (l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd);
    c = Math.max(-1, Math.min(1, c));
    var al = Math.acos(c);
    var j = [root[0] + l1 * Math.cos(phi + s * al), root[1] + l1 * Math.sin(phi + s * al)];
    var e = [root[0] + dx / d * dd, root[1] + dy / d * dd];
    return [j, e];
  }

  function limb(root, spec, l1, l2, defB, m) {
    if (!spec) spec = [0, 0];
    if (Object.prototype.toString.call(spec) === '[object Array]') {
      var j = add(root, vec(spec[0], l1, m));
      return [j, add(j, vec(spec[1], l2, m))];
    }
    var tx = spec.x != null ? spec.x : root[0] + (spec.dx || 0) * m;
    var ty = spec.y != null ? spec.y : root[1] + (spec.dy || 0);
    var b = spec.b != null ? spec.b : defB;
    return ik(root, [tx, ty], l1, l2, b * (m < 0 ? -1 : 1));
  }

  function solve(p, front) {
    var t = p.t || 0, H = p.hip.slice();
    var tl = L.torso * (p.tl || 1);
    var td = [Math.sin(rad(t)), -Math.cos(rad(t))];
    var S = [H[0] + td[0] * tl, H[1] + td[1] * tl];
    var ht = t + (p.hd || 0), hv = [Math.sin(rad(ht)), -Math.cos(rad(ht))];
    var N = [S[0] + hv[0] * L.neck, S[1] + hv[1] * L.neck];
    var C = [S[0] + hv[0] * (L.neck + L.head), S[1] + hv[1] * (L.neck + L.head)];
    var S1, S2, H1, H2, m1, m2;
    if (front) {
      var pp = [Math.cos(rad(t)), Math.sin(rad(t))], sh = p.sh || 0;
      S1 = [S[0] - pp[0] * 12, S[1] - pp[1] * 12 - sh]; S2 = [S[0] + pp[0] * 12, S[1] + pp[1] * 12 - sh];
      H1 = [H[0] - pp[0] * 8, H[1] - pp[1] * 8]; H2 = [H[0] + pp[0] * 8, H[1] + pp[1] * 8];
      m1 = -1; m2 = 1;
    } else { S1 = S2 = S; H1 = H2 = H; m1 = m2 = 1; }
    var as = p.as || 1, ls = p.ls || 1;
    var A1 = limb(S1, p.a1, L.uarm * as, L.farm * as, 1, m1);
    var A2 = limb(S2, p.a2 || p.a1, L.uarm * as, L.farm * as, 1, m2);
    var G1 = limb(H1, p.l1, L.thigh * ls, L.shin * ls, -1, m1);
    var G2 = limb(H2, p.l2 || p.l1, L.thigh * ls, L.shin * ls, -1, m2);
    var T1, T2;
    if (front) {
      T1 = add(G1[1], [-7, 1]); T2 = add(G2[1], [7, 1]);
    } else {
      var f1 = p.ft == null ? 90 : p.ft, f2 = p.ft2 == null ? f1 : p.ft2;
      T1 = add(G1[1], vec(f1, L.foot, 1)); T2 = add(G2[1], vec(f2, L.foot, 1));
    }
    var pts = { H: H, S: S, N: N, C: C, S1: S1, S2: S2, H1: H1, H2: H2,
      e1: A1[0], h1: A1[1], e2: A2[0], h2: A2[1], k1: G1[0], a1: G1[1], k2: G2[0], a2: G2[1], t1: T1, t2: T2 };
    var dy = 0;
    if (p.g) {
      var maxY = Math.max(pts.a1[1], pts.a2[1], T1[1], T2[1]);
      dy = GROUND - maxY;
    }
    dy -= (p.up || 0);
    if (dy) { for (var k in pts) pts[k] = [pts[k][0], pts[k][1] + dy]; }
    return pts;
  }

  function lerp(a, b, u) {
    if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * u;
    if (a && b && typeof a === 'object') {
      var isArr = Object.prototype.toString.call(a) === '[object Array]';
      var o = isArr ? [] : {};
      for (var k in a) { o[k] = (k in b) ? lerp(a[k], b[k], u) : a[k]; }
      if (!isArr) for (var k2 in b) { if (!(k2 in o)) o[k2] = b[k2]; }
      return o;
    }
    return u < 0.5 ? a : b;
  }
  function ease(u) { return 0.5 - 0.5 * Math.cos(Math.PI * u); }

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function setLine(l, a, b) {
    l.setAttribute('x1', a[0].toFixed(1)); l.setAttribute('y1', a[1].toFixed(1));
    l.setAttribute('x2', b[0].toFixed(1)); l.setAttribute('y2', b[1].toFixed(1));
  }

  // segment -> muscle highlight keys
  var HL = {
    torso: ['chest', 'back', 'core', 'torso'], neck: ['traps'], uarm: ['biceps', 'triceps', 'uarm'],
    farm: ['forearm'], thigh: ['quads', 'hams', 'thigh'], shin: ['calves'], glute: ['glutes'], delt: ['delts']
  };
  function isHl(seg, hl) {
    var keys = HL[seg] || [seg];
    for (var i = 0; i < hl.length; i++) if (keys.indexOf(hl[i]) >= 0) return true;
    return false;
  }

  function Player(container, anim, opts) {
    opts = opts || {};
    this.anim = anim; this.opts = opts;
    this.front = anim.view === 'front';
    this.speed = 1; this.playing = false; this.t = 0; this.last = 0; this.raf = 0;
    var hl = anim.hl || [];
    var svg = el('svg', { viewBox: anim.vb || VB, 'class': 'fig' + (this.front ? ' front' : ''), role: 'img', 'aria-label': opts.label || 'Exercise animation' });
    var defs = el('defs', {}, svg);
    var gl = el('filter', { id: 'glow' + Player.uid, filterUnits: 'userSpaceOnUse', x: -60, y: -60, width: 340, height: 340 }, defs);
    el('feGaussianBlur', { stdDeviation: '2.2', result: 'b' }, gl);
    var mg = el('feMerge', {}, gl); el('feMergeNode', { 'in': 'b' }, mg); el('feMergeNode', { 'in': 'SourceGraphic' }, mg);
    var glowId = 'url(#glow' + Player.uid + ')'; Player.uid++;
    if (!anim.noGround) el('line', { x1: -20, y1: 186, x2: 230, y2: 186, 'class': 'ground' }, svg);
    var shapes = (anim.props && anim.props.shapes) || [];
    for (var i = 0; i < shapes.length; i++) {
      var s = shapes[i];
      if (s[0] === 'r') el('rect', { x: s[1], y: s[2], width: s[3], height: s[4], rx: 2, 'class': 'eq' }, svg);
      else if (s[0] === 'l') el('line', { x1: s[1], y1: s[2], x2: s[3], y2: s[4], 'stroke-width': s[5] || 4, 'class': 'eqline' }, svg);
      else if (s[0] === 'c') el('circle', { cx: s[1], cy: s[2], r: s[3], 'class': 'eq' }, svg);
    }
    var gBack = el('g', {}, svg), gFar = el('g', { 'class': this.front ? '' : 'far' }, svg), gBody = el('g', {}, svg),
      gNear = el('g', {}, svg), gProps = el('g', {}, svg);
    var self = this;
    function seg(name, g) {
      var l = el('line', { 'class': 'seg' + (isHl(name, hl) ? ' hl' : '') }, g);
      if (isHl(name, hl)) l.setAttribute('filter', glowId);
      return l;
    }
    this.s = {
      cable: anim.props && anim.props.cable ? el('line', { 'class': 'cable' }, gBack) : null,
      rope: anim.props && anim.props.rope ? el('path', { 'class': 'rope' }, gBack) : null,
      farUarm: seg('uarm', gFar), farFarm: seg('farm', gFar),
      farThigh: seg('thigh', gFar), farShin: seg('shin', gFar), farFoot: seg('foot', gFar),
      torso: seg('torso', gBody), neck: seg('neck', gBody),
      hipLine: this.front ? seg('glute', gBody) : null, shLine: this.front ? seg('delt', gBody) : null,
      thigh: seg('thigh', gNear), shin: seg('shin', gNear), foot: seg('foot', gNear),
      uarm: seg('uarm', gNear), farm: seg('farm', gNear),
      head: el('circle', { r: L.head, 'class': 'head' }, gBody),
      glute: !this.front && isHl('glute', hl) ? el('circle', { r: 7, 'class': 'dot hl', filter: glowId }, gBody) : null,
      delt: !this.front && isHl('delt', hl) ? el('circle', { r: 6, 'class': 'dot hl', filter: glowId }, gNear) : null
    };
    var pr = anim.props || {};
    this.p = { db: [], bb: null, kb: null, pf: null, hipbar: null, grip: null };
    var nDb = pr.db || 0;
    for (var d = 0; d < nDb; d++) {
      if (this.front) { var gd = el('g', { 'class': 'dbf' }, gProps); el('line', { x1: -9, y1: 0, x2: 9, y2: 0, 'class': 'dbbar' }, gd); el('rect', { x: -12, y: -5, width: 5, height: 10, rx: 1.5, 'class': 'dbplate' }, gd); el('rect', { x: 7, y: -5, width: 5, height: 10, rx: 1.5, 'class': 'dbplate' }, gd); this.p.db.push(gd); }
      else this.p.db.push(el('rect', { width: 9, height: 13, rx: 3, 'class': 'dbplate' }, gProps));
    }
    if (pr.bb) {
      if (this.front) { var gb = el('g', {}, gProps); el('line', { x1: -60, y1: 0, x2: 60, y2: 0, 'class': 'dbbar' }, gb); el('rect', { x: -58, y: -11, width: 7, height: 22, rx: 2, 'class': 'dbplate' }, gb); el('rect', { x: 51, y: -11, width: 7, height: 22, rx: 2, 'class': 'dbplate' }, gb); this.p.bb = gb; }
      else { this.p.bb = el('g', {}, gProps); el('circle', { r: pr.bb === true || pr.bb === 1 ? 12 : pr.bb, 'class': 'plate' }, this.p.bb); el('circle', { r: 2.5, 'class': 'hub' }, this.p.bb); }
    }
    if (pr.kb) { this.p.kb = el('g', {}, gProps); el('circle', { cx: 0, cy: 8, r: 7.5, 'class': 'dbplate' }, this.p.kb); el('path', { d: 'M-4 2 Q0 -5 4 2', 'class': 'kbh' }, this.p.kb); }
    if (pr.hipbar) { this.p.hipbar = el('g', {}, gProps); el('circle', { r: 11, 'class': 'plate' }, this.p.hipbar); el('circle', { r: 2.5, 'class': 'hub' }, this.p.hipbar); }
    if (pr.pf) this.p.pf = el('line', { 'class': 'eqline', 'stroke-width': 6 }, gBack);
    if (pr.cable) { el('circle', { cx: pr.cable[0], cy: pr.cable[1], r: 4, 'class': 'eq' }, svg); this.p.grip = el('circle', { r: 3, 'class': 'hub' }, gProps); }
    this.svg = svg;
    container.innerHTML = '';
    container.appendChild(svg);
    this.total = 0;
    var k = anim.k;
    for (var q = 0; q < k.length; q++) this.total += (k[q].d || 900) + (k[q].h || 0);
    this.render(opts.at != null ? opts.at : 0);
  }
  Player.uid = 0;

  Player.prototype.poseAt = function (time) {
    var k = this.anim.k, n = k.length, tt = time % this.total, i = 0;
    for (i = 0; i < n; i++) {
      var h = k[i].h || 0, d = k[i].d || 900;
      if (tt < h) return { p: k[i].p, label: k[i].n, i: i };
      tt -= h;
      if (tt < d) { var nx = k[(i + 1) % n]; return { p: lerp(k[i].p, nx.p, ease(tt / d)), label: k[i].n, i: i }; }
      tt -= d;
    }
    return { p: k[0].p, label: k[0].n, i: 0 };
  };

  Player.prototype.render = function (time) {
    var r = this.poseAt(time), P = solve(r.p, this.front), s = this.s, p = this.p, pr = this.anim.props || {};
    setLine(s.farUarm, P.S2, P.e2); setLine(s.farFarm, P.e2, P.h2);
    setLine(s.farThigh, P.H2, P.k2); setLine(s.farShin, P.k2, P.a2); setLine(s.farFoot, P.a2, P.t2);
    setLine(s.torso, P.H, P.S); setLine(s.neck, P.S, P.N);
    if (s.hipLine) setLine(s.hipLine, P.H1, P.H2);
    if (s.shLine) setLine(s.shLine, P.S1, P.S2);
    setLine(s.thigh, P.H1, P.k1); setLine(s.shin, P.k1, P.a1); setLine(s.foot, P.a1, P.t1);
    setLine(s.uarm, P.S1, P.e1); setLine(s.farm, P.e1, P.h1);
    s.head.setAttribute('cx', P.C[0].toFixed(1)); s.head.setAttribute('cy', P.C[1].toFixed(1));
    if (s.glute) { s.glute.setAttribute('cx', P.H[0]); s.glute.setAttribute('cy', P.H[1]); }
    if (s.delt) { s.delt.setAttribute('cx', P.S[0]); s.delt.setAttribute('cy', P.S[1]); }
    var hands = [P.h1, P.h2];
    for (var i = 0; i < p.db.length; i++) {
      var h = hands[i];
      if (this.front) p.db[i].setAttribute('transform', 'translate(' + h[0].toFixed(1) + ',' + h[1].toFixed(1) + ')');
      else { p.db[i].setAttribute('x', (h[0] - 4.5).toFixed(1)); p.db[i].setAttribute('y', (h[1] - 6.5).toFixed(1)); }
    }
    if (p.bb) {
      var c = this.front ? [(P.h1[0] + P.h2[0]) / 2, (P.h1[1] + P.h2[1]) / 2] : P.h1;
      p.bb.setAttribute('transform', 'translate(' + c[0].toFixed(1) + ',' + c[1].toFixed(1) + ')');
    }
    if (p.kb) {
      var kc = [(P.h1[0] + P.h2[0]) / 2, (P.h1[1] + P.h2[1]) / 2];
      p.kb.setAttribute('transform', 'translate(' + kc[0].toFixed(1) + ',' + kc[1].toFixed(1) + ')');
    }
    if (p.hipbar) p.hipbar.setAttribute('transform', 'translate(' + P.H[0].toFixed(1) + ',' + (P.H[1] - 9).toFixed(1) + ')');
    if (p.pf) {
      var mid = [(P.a1[0] + P.t1[0]) / 2, (P.a1[1] + P.t1[1]) / 2], dv = pr.pf;
      setLine(p.pf, [mid[0] - dv[0] * 24 + 3, mid[1] - dv[1] * 24 + 3], [mid[0] + dv[0] * 24 + 3, mid[1] + dv[1] * 24 + 3]);
    }
    if (s.cable) { setLine(s.cable, pr.cable, P.h1); p.grip.setAttribute('cx', P.h1[0]); p.grip.setAttribute('cy', P.h1[1]); }
    if (s.rope) {
      var th = (time % this.total) / this.total * Math.PI * 2, cy = Math.cos(th);
      var off = cy > 0 ? 230 : 150;
      var cx = P.h1[0] + Math.sin(th) * 18, ccy = P.h1[1] - cy * off;
      s.rope.setAttribute('d', 'M' + P.h1[0].toFixed(1) + ' ' + P.h1[1].toFixed(1) + ' C' + (cx - 16).toFixed(1) + ' ' + ccy.toFixed(1) + ' ' + (cx + 16).toFixed(1) + ' ' + ccy.toFixed(1) + ' ' + P.h2[0].toFixed(1) + ' ' + P.h2[1].toFixed(1));
    }
    if (this.opts.onLabel && r.label !== this._lab) { this._lab = r.label; this.opts.onLabel(r.label || '', r.i); }
  };

  Player.prototype.play = function () {
    if (this.playing) return;
    this.playing = true; this.last = 0;
    var self = this;
    function tick(ts) {
      if (!self.playing) return;
      if (!self.svg.isConnected && self.svg.ownerDocument && !document.body.contains(self.svg)) { self.playing = false; return; }
      if (self.last) self.t += (ts - self.last) * self.speed;
      self.last = ts;
      if (!document.hidden) self.render(self.t);
      self.raf = requestAnimationFrame(tick);
    }
    this.raf = requestAnimationFrame(tick);
  };
  Player.prototype.pause = function () { this.playing = false; cancelAnimationFrame(this.raf); };
  Player.prototype.toggle = function () { if (this.playing) this.pause(); else this.play(); return this.playing; };
  Player.prototype.setSpeed = function (s) { this.speed = s; };
  Player.prototype.destroy = function () { this.pause(); };

  // render a static thumbnail of the key pose
  Player.thumb = function (container, anim) {
    var k = anim.k, idx = anim.thumb != null ? anim.thumb : (k.length > 1 ? 1 : 0), t = 0;
    for (var i = 0; i < idx; i++) t += (k[i].d || 900) + (k[i].h || 0);
    var pl = new Player(container, anim, { at: t + (k[idx].h || 0) * 0.5 });
    try { // crop the thumbnail to the figure (+ equipment) so it reads at small sizes
      var g = pl.svg.querySelector('.ground'); if (g) g.style.display = 'none';
      var b = pl.svg.getBBox();
      if (b && b.width > 10) {
        var size = Math.max(b.width, b.height) + 22, cx = b.x + b.width / 2, cy = b.y + b.height / 2;
        pl.svg.setAttribute('viewBox', (cx - size / 2).toFixed(1) + ' ' + (cy - size / 2).toFixed(1) + ' ' + size.toFixed(1) + ' ' + size.toFixed(1));
      }
      if (g) g.style.display = '';
    } catch (e) { /* not rendered yet — keep full view */ }
    return pl;
  };

  Player.solve = solve;
  global.FigPlayer = Player;
})(window);
