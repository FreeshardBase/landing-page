/* Diamond lattice behind the hero.
 *
 * Rhombi at the logo's 2:1 edge slope (63.4°), packed edge to edge, so at rest the field reads as two
 * families of faint parallel lines. Near the pointer each diamond is enlarged about its own centre with a
 * Gaussian fall-off, and the enlarged outlines shimmer in the logomark's facet colours. Lines stay parallel;
 * enlarged diamonds overlap their neighbours. The render loop stops once the effect has faded out, so the
 * field is perfectly still at rest. Touch screens have no pointer to follow, so there a point drifts across
 * the hero on its own and bounces off its edges, only while the hero is on screen. With reduced motion the
 * lattice stays still. Colours come from --border-cool on the canvas. */

const SETTINGS = {
  cellWidth: 30,        // px; cell height is twice this (2:1 slope)
  gain: 1.0,            // peak enlargement of one diamond is 1 + gain
  sigma: 120,           // Gaussian fall-off of the effect, px
  idleAlpha: 0.12,      // opacity of the resting lattice
  idleWidth: 0.6,       // line width of the resting lattice, px
  colorStrength: 1,     // multiplies the outline opacity of enlarged diamonds
  saturation: 1,        // 0 = grey, 1 = logo colours
  highlightWidth: 0.8,  // extra line width at the centre of the effect, px
  shimmerSpeed: 1.1,    // hue drift speed, 0 = frozen
  twinkle: 0.3,         // per-cell brightness flicker depth
  spread: 1.7,          // hue bands across the effect
  driftSpeed: 70,       // touch screens: speed of the drifting point, px/s
  // Narrow screens (the site's 768 px breakpoint): finer lattice and a smaller effect, scaled to the screen.
  narrowCellWidth: 18,
  narrowSigma: 60,
};

// The logomark's facet colours, sampled from Freeshard_logomark_color.png.
const PALETTE = ['#1fdcdc', '#6cbcf4', '#3d78cf', '#4040bf', '#0b8a8a', '#058a5c', '#1d93c4'].map(h =>
  [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));

interface Cell { x: number; y: number; seed: number }

/** Draws the lattice on `canvas` (which covers `hero`) and keeps it faint behind `copy`. */
export function mountDiamondLattice(canvas: HTMLCanvasElement, hero: HTMLElement, copy: HTMLElement) {
  const S = SETTINGS;
  const narrow = matchMedia('(max-width: 768px)');
  let CELL_W = S.cellWidth, CELL_H = CELL_W * 2, sigma = S.sigma;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const drifting = !reduced && matchMedia('(hover: none)').matches;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let W = 0, H = 0, base = '', cells: Cell[] = [];
  const mask = { cx: 0, cy: 0, rx: 1, ry: 1 };

  function readTheme() {
    base = getComputedStyle(canvas).getPropertyValue('--border-cool').trim();
  }

  function build() {
    const dpr = devicePixelRatio || 1;
    W = canvas.clientWidth; H = canvas.clientHeight;
    CELL_W = narrow.matches ? S.narrowCellWidth : S.cellWidth; CELL_H = CELL_W * 2;
    sigma = narrow.matches ? S.narrowSigma : S.sigma;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    cells = [];
    for (let j = -2; j * CELL_H / 2 < H + CELL_H; j++)
      for (let i = -2; i * CELL_W < W + CELL_W; i++) {
        const x = i * CELL_W + (j & 1 ? CELL_W / 2 : 0), y = j * CELL_H / 2;
        cells.push({ x, y, seed: Math.sin(i * 12.9898 + j * 78.233) * 43758.5453 % 1 });
      }
    // The copy block, as an ellipse slightly larger than its box, in canvas coordinates.
    const c = canvas.getBoundingClientRect(), r = copy.getBoundingClientRect();
    mask.cx = r.left - c.left + r.width / 2; mask.cy = r.top - c.top + r.height / 2;
    mask.rx = Math.max(1, r.width * 0.55); mask.ry = Math.max(1, r.height * 0.6);
  }

  // Keep the copy readable: the lattice fades to 25 % behind the copy block.
  function copyMask(x: number, y: number) {
    const ex = (x - mask.cx) / mask.rx, ey = (y - mask.cy) / mask.ry;
    const k = ex * ex + ey * ey;
    return k < 1 ? 0.25 + 0.75 * k * k : 1;
  }

  // The effect's centre glides after the pointer and fades in and out, critically damped (no overshoot).
  const lens = { x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0 };
  const target = { x: 0, y: 0, tracking: false, on: 0 };

  function influence(x: number, y: number) {
    const dx = x - lens.x, dy = y - lens.y;
    return lens.a * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
  }

  // A cell's outline, scaled about its own centre. Scaling keeps every edge at the 2:1 slope.
  function outline(c: Cell, scale: number) {
    const hw = CELL_W / 2 * scale, hh = CELL_H / 2 * scale;
    ctx!.beginPath();
    ctx!.moveTo(c.x, c.y - hh); ctx!.lineTo(c.x + hw, c.y); ctx!.lineTo(c.x, c.y + hh); ctx!.lineTo(c.x - hw, c.y);
    ctx!.closePath();
  }

  function mix(t: number) {
    t = ((t % 1) + 1) % 1 * PALETTE.length;
    const a = PALETTE[Math.floor(t)], b = PALETTE[(Math.floor(t) + 1) % PALETTE.length], u = t % 1;
    const c = a.map((v, i) => v + (b[i] - v) * u);
    const grey = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return c.map(v => Math.round(Math.min(255, Math.max(0, grey + (v - grey) * S.saturation))));
  }

  function draw(time: number) {
    ctx!.clearRect(0, 0, W, H);
    const lit: { c: Cell; f: number; m: number }[] = [];
    // Pass 1: the resting lattice. Cells under the effect are left to pass 2.
    ctx!.lineWidth = S.idleWidth;
    ctx!.strokeStyle = base;
    for (const c of cells) {
      const f = influence(c.x, c.y);
      if (f > 0.04) { lit.push({ c, f, m: copyMask(c.x, c.y) }); continue; }
      ctx!.globalAlpha = S.idleAlpha * copyMask(c.x, c.y);
      outline(c, 1);
      ctx!.stroke();
    }
    // Pass 2: enlarged cells, smallest first so the largest (nearest the pointer) land on top.
    lit.sort((p, q) => p.f - q.f);
    const phase = reduced ? 0 : time / 2600 * S.shimmerSpeed;
    for (const { c, f, m } of lit) {
      outline(c, 1 + S.gain * f);
      const [r, g, b] = mix(phase + (c.x * 0.0016 + c.y * 0.0009) * S.spread + c.seed * 0.18);
      const twinkle = reduced ? 1 : 1 - S.twinkle + S.twinkle * Math.sin(time / 380 + c.seed * 40);
      ctx!.globalAlpha = Math.min(1, Math.max(S.idleAlpha, Math.min(1, f * 1.15) * twinkle * S.colorStrength) * m);
      ctx!.strokeStyle = `rgb(${r},${g},${b})`;
      ctx!.lineWidth = S.idleWidth + S.highlightWidth * f;
      ctx!.stroke();
    }
    ctx!.globalAlpha = 1;
  }

  // Touch screens: the point the effect follows moves in a straight line and bounces off the hero's
  // edges, kept one sigma inside them so the effect never leaves the hero.
  const drift = { x: 0, y: 0, vx: 0, vy: 0, last: 0 };
  function startDrift() {
    const angle = 0.6 + Math.random() * 0.4;
    drift.x = W * 0.25; drift.y = H * 0.7;
    drift.vx = Math.cos(angle) * S.driftSpeed; drift.vy = -Math.sin(angle) * S.driftSpeed;
    lens.x = target.x = drift.x; lens.y = target.y = drift.y;
  }
  function stepDrift(time: number) {
    const dt = drift.last ? Math.min(0.1, (time - drift.last) / 1000) : 0;
    drift.last = time;
    const m = Math.min(sigma, W / 2, H / 2);
    drift.x += drift.vx * dt; drift.y += drift.vy * dt;
    if (drift.x < m || drift.x > W - m) { drift.vx = -drift.vx; drift.x = Math.min(W - m, Math.max(m, drift.x)); }
    if (drift.y < m || drift.y > H - m) { drift.vy = -drift.vy; drift.y = Math.min(H - m, Math.max(m, drift.y)); }
    target.x = drift.x; target.y = drift.y;
  }

  let running = false;
  function frame(time: number) {
    const w = 9, dt = 1 / 60;
    if (drifting && target.on) stepDrift(time);
    if (target.tracking) {
      if (reduced) { lens.x = target.x; lens.y = target.y; }
      else {
        lens.vx += (w * w * (target.x - lens.x) - 2 * w * lens.vx) * dt; lens.x += lens.vx * dt;
        lens.vy += (w * w * (target.y - lens.y) - 2 * w * lens.vy) * dt; lens.y += lens.vy * dt;
      }
    }
    lens.va += (w * w * (target.on - lens.a) - 2 * w * lens.va) * dt; lens.a += lens.va * dt;
    draw(time);
    // Animate only while the effect is visible; otherwise the field is perfectly still.
    running = lens.a > 0.003 || target.on > 0;
    if (running) requestAnimationFrame(frame);
  }
  function wake() { if (!running) { running = true; requestAnimationFrame(frame); } }

  readTheme();
  build();
  draw(0);
  if (drifting) {
    startDrift();
    target.tracking = true;
    // Run only while the hero is visible; scrolling it away fades the effect out and stops the loop.
    new IntersectionObserver(([entry]) => {
      target.on = entry.isIntersecting ? 1 : 0;
      drift.last = 0;
      wake();
    }).observe(hero);
  }
  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    // An effect that has fully faded reappears under the pointer instead of gliding in from where it left.
    if (lens.a < 0.01) { lens.x = x; lens.y = y; lens.vx = lens.vy = 0; }
    target.x = x; target.y = y; target.tracking = true; target.on = 1; wake();
  });
  hero.addEventListener('pointerleave', e => {
    // A finger lifting off also fires pointerleave; only a mouse or pen leaving ends the effect.
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    target.on = 0; wake();
  });
  addEventListener('resize', () => { build(); draw(performance.now()); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { readTheme(); draw(performance.now()); });
}
