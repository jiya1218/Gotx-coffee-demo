/* ==========================================================================
   Gotx Coffee — Photorealistic Drink Illustrations & Smooth Physics Engine
   Crafted with realistic glass optics, 3D faceted ice, organic convective
   espresso plumes, effervescent fizzy carbonation, and luxury gold finishes.
   ========================================================================== */
(function () {
  let uid = 0;
  const seed = (i) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  function easeOutQuad(x) { return 1 - (1 - x) * (1 - x); }
  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  // 6 organic billowing convective espresso plumes
  const plumePaths = [
    'M62 108 C60 135 73 150 71 185 C69 205 64 216 66 226 C68 234 74 233 76 225 C78 205 77 180 82 155 C86 135 84 118 80 108 Z',
    'M82 108 C80 145 92 175 88 215 C85 245 81 268 85 278 C88 285 95 282 96 270 C99 240 96 205 102 170 C106 140 103 120 98 108 Z',
    'M98 108 C96 138 108 160 105 195 C103 218 97 232 101 242 C104 248 111 245 113 234 C116 210 114 185 119 155 C122 130 118 115 114 108 Z',
    'M118 108 C116 148 128 185 125 228 C122 265 117 292 122 304 C126 312 133 308 134 294 C137 260 134 220 140 180 C144 145 140 120 135 108 Z',
    'M136 108 C134 140 146 168 143 205 C141 230 135 248 139 258 C143 266 149 262 151 250 C154 225 151 195 156 165 C160 138 156 118 152 108 Z',
    'M153 108 C151 135 163 155 160 188 C158 208 154 220 157 228 C160 234 166 232 167 223 C170 200 167 175 171 150 C174 130 171 116 168 108 Z'
  ];

  const cubeData = [
    { x: 80, y: 122, size: 34, rot: -12, bobDl: 0, pile: 206 },
    { x: 122, y: 94, size: 36, rot: 14, bobDl: 1.1, pile: 238 },
    { x: 96, y: 174, size: 32, rot: 8, bobDl: 2.2, pile: 120 },
    { x: 132, y: 166, size: 30, rot: -9, bobDl: 0.6, pile: 132 },
    { x: 84, y: 224, size: 30, rot: 16, bobDl: 1.7, pile: 104 }
  ];

  /**
   * glassSVG(options)
   * General SVG generator used for customizer / builder
   */
  window.glassSVG = function (opt) {
    const o = Object.assign(
      {
        build: false, crown: false, straw: true, bubbles: 12, ice: true,
        top: '#F4EFE6', bottom: '#D9C5A0',
        espresso: true, drips: true, fruit: null, garnish: null, fast: false
      },
      opt || {}
    );
    const id = 'gx' + ++uid;
    const vb = o.crown ? '0 -105 240 525' : '20 -6 200 420';

    const drips = o.espresso && o.drips
      ? plumePaths.map((d, i) =>
          `<path class="drip" style="--i:${i}" d="${d}" fill="url(#${id}-e${i})"/>`
        ).join('')
      : '';

    const bubbles = Array.from({ length: o.bubbles }, (_, i) => {
      const cx = 76 + seed(i + 1) * 90;
      const r = 1.6 + seed(i + 7) * 2.2;
      const dur = 3.2 + seed(i + 3) * 3.0;
      const dl = -seed(i + 11) * 6;
      const hx = (cx - r * 0.32).toFixed(1);
      const hy = (360 - r * 0.32).toFixed(1);
      const hr = (r * 0.3).toFixed(1);
      return `<g class="bub" style="--dur:${dur.toFixed(1)}s;--dl:${dl.toFixed(1)}s">
        <circle cx="${cx.toFixed(1)}" cy="360" r="${r.toFixed(1)}" fill="url(#${id}-bub)" stroke="rgba(255,255,255,0.7)" stroke-width="0.5"/>
        <circle cx="${hx}" cy="${hy}" r="${hr}" fill="#fff" opacity="0.9"/>
      </g>`;
    }).join('');

    const cubes = o.ice
      ? cubeData.map((c, i) => {
          const s = c.size;
          const cx = c.x + s / 2;
          const cy = c.y + s / 2;
          return `<g class="cube" style="--pile:${c.pile}px;--k:${i}">
            <g class="bob" style="--dl:${-c.bobDl}s">
              <g transform="rotate(${c.rot} ${cx} ${cy})">
                <rect x="${c.x}" y="${c.y}" width="${s}" height="${s}" rx="6" fill="url(#${id}-ice-body)" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"/>
                <polygon points="${c.x + 3},${c.y + 3} ${c.x + s - 3},${c.y + 3} ${c.x + s - 7},${c.y + 10} ${c.x + 7},${c.y + 10}" fill="rgba(255,255,255,0.4)"/>
                <polygon points="${c.x + s - 3},${c.y + 3} ${c.x + s - 3},${c.y + s - 3} ${c.x + s - 8},${c.y + s - 7} ${c.x + s - 7},${c.y + 10}" fill="rgba(255,255,255,0.18)"/>
                <path d="M${c.x + 8} ${c.y + 12} L${c.x + 18} ${c.y + 18} L${c.x + 24} ${c.y + 14}" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="${c.x + 5}" cy="${c.y + 5}" r="1.2" fill="#fff" opacity="0.9"/>
              </g>
            </g>
          </g>`;
        }).join('')
      : '';

    let garnish = '';
    if (o.garnish) {
      const pulpSegs = Array.from({ length: 8 }, (_, i) => {
        const a1 = (i * Math.PI) / 4 + 0.08;
        const a2 = ((i + 1) * Math.PI) / 4 - 0.08;
        const rIn = 6;
        const rOut = 19;
        const x1 = (Math.cos(a1) * rIn).toFixed(1);
        const y1 = (Math.sin(a1) * rIn).toFixed(1);
        const x2 = (Math.cos(a1) * rOut).toFixed(1);
        const y2 = (Math.sin(a1) * rOut).toFixed(1);
        const x3 = (Math.cos(a2) * rOut).toFixed(1);
        const y3 = (Math.sin(a2) * rOut).toFixed(1);
        const x4 = (Math.cos(a2) * rIn).toFixed(1);
        const y4 = (Math.sin(a2) * rIn).toFixed(1);
        return `<path d="M${x1} ${y1} L${x2} ${y2} A${rOut} ${rOut} 0 0 1 ${x3} ${y3} L${x4} ${y4} A${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z" fill="url(#${id}-pulp)" opacity="0.88"/>`;
      }).join('');

      garnish = `<g class="g-garnish">
        <g transform="translate(186 40) rotate(-18)">
          <g class="g-garnish-in">
            <ellipse cx="-4" cy="18" rx="8" ry="4" fill="rgba(0,0,0,0.3)" filter="url(#${id}-sh)"/>
            <circle r="25" fill="${o.garnish.o}"/>
            <circle r="22.5" fill="#FFF8EB"/>
            <circle r="20" fill="${o.garnish.i}" opacity="0.4"/>
            ${pulpSegs}
            <circle r="5" fill="#FFFBF2"/>
            <circle r="2.2" fill="${o.garnish.o}" opacity="0.5"/>
            <circle cx="16" cy="-14" r="1.4" fill="#fff" opacity="0.9"/>
          </g>
        </g>
      </g>`;
    }

    const crown = o.crown
      ? `<g class="g-crown"><g class="crown-bob">
          <ellipse cx="120" cy="-2" rx="44" ry="5" fill="rgba(0,0,0,0.28)" filter="url(#${id}-sh)"/>
          <rect x="68" y="-16" width="104" height="14" rx="3.5" fill="url(#${id}-cr)"/>
          <rect x="68" y="-16" width="104" height="14" rx="3.5" fill="none" stroke="url(#${id}-cr-edge)" stroke-width="1"/>
          <path d="M70 -14 L78 -58 L99 -34 L120 -72 L141 -34 L162 -58 L170 -14 Z" fill="url(#${id}-cr)"/>
          <path d="M120 -72 L120 -16" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M78 -58 L85 -16" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linecap="round"/>
          <path d="M162 -58 L155 -16" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linecap="round"/>
          <circle cx="78" cy="-60" r="4.5" fill="url(#${id}-cr)"/>
          <circle cx="76.8" cy="-61.2" r="1.4" fill="#fff" opacity="0.95"/>
          <circle cx="120" cy="-74" r="5.2" fill="url(#${id}-cr)"/>
          <circle cx="118.5" cy="-75.5" r="1.6" fill="#fff" opacity="0.95"/>
          <circle cx="162" cy="-60" r="4.5" fill="url(#${id}-cr)"/>
          <circle cx="160.8" cy="-61.2" r="1.4" fill="#fff" opacity="0.95"/>
          <circle cx="92" cy="-9" r="2.8" fill="#FFF9E6"/><circle cx="91.2" cy="-9.8" r="0.9" fill="#fff"/>
          <circle cx="120" cy="-9" r="3.2" fill="#FFF9E6"/><circle cx="119" cy="-10" r="1" fill="#fff"/>
          <circle cx="148" cy="-9" r="2.8" fill="#FFF9E6"/><circle cx="147.2" cy="-9.8" r="0.9" fill="#fff"/>
        </g></g>
        <g class="sparks">
          <g transform="translate(52 -66)"><path class="spark" style="--dl:0s" d="M0 -9 Q1 -2 8 0 Q1 2 0 9 Q-1 2 -8 0 Q-1 -2 0 -9Z" fill="#FFF5D6" filter="url(#${id}-glow)"/></g>
          <g transform="translate(190 -40)"><path class="spark" style="--dl:.8s" d="M0 -7 Q1 -1.5 6 0 Q1 1.5 0 7 Q-1 1.5 -6 0 Q-1 -1.5 0 -7Z" fill="#FFF5D6" filter="url(#${id}-glow)"/></g>
          <g transform="translate(168 -92)"><path class="spark" style="--dl:1.5s" d="M0 -6 Q0.8 -1.2 5 0 Q0.8 1.2 0 6 Q-0.8 1.2 -5 0 Q-0.8 -1.2 0 -6Z" fill="#FFF5D6" filter="url(#${id}-glow)"/></g>
        </g>`
      : '';

    const straw = o.straw
      ? `<g class="g-straw">
          <rect x="124" y="10" width="8" height="300" rx="4" transform="rotate(-9 128 150)" fill="url(#${id}-s)"/>
          <rect x="125.8" y="10" width="2" height="300" rx="1" transform="rotate(-9 128 150)" fill="#fff" opacity="0.55"/>
          <ellipse cx="128" cy="14" rx="4" ry="2" transform="rotate(-9 128 150)" fill="#68471A"/>
        </g>`
      : '';

    const fruit = o.fruit
      ? `<g class="g-fruit"><rect x="40" y="272" width="170" height="120" fill="url(#${id}-f)"/></g>`
      : '';

    const espresso = o.espresso
      ? `<g class="g-espresso">
          <g filter="url(#${id}-b)">
            <path class="e-top" d="M46 100 Q120 106 194 100 L194 126 Q160 134 130 128 Q95 136 46 125 Z" fill="url(#${id}-crema)"/>
            ${drips}
          </g>
          <ellipse cx="120" cy="100.5" rx="63" ry="4.5" fill="none" stroke="rgba(223,178,110,0.6)" stroke-width="1.4"/>
        </g>
        <rect class="g-stream" x="113" y="-120" width="14" height="236" rx="7" fill="url(#${id}-stream)"/>`
      : '';

    const plumeGrads = plumePaths.map((_, i) =>
      `<linearGradient id="${id}-e${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#180903"/><stop offset="55%" stop-color="#552410"/><stop offset="90%" stop-color="#9C5220"/><stop offset="100%" stop-color="#9C5220" stop-opacity="0"/></linearGradient>`
    ).join('');

    return `<svg class="glass${o.build ? ' glass--build' : ''}${o.fast ? ' glass--fast' : ''}" width="${o.crown ? 240 : 200}" height="${o.crown ? 525 : 420}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <clipPath id="${id}-c"><path d="M58 46 L182 46 L169.5 366 Q169 376 158 376 L82 376 Q71 376 70.5 366 Z"/></clipPath>
    <linearGradient id="${id}-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${o.top}" stop-opacity="0.95"/><stop offset="45%" stop-color="${o.top}" stop-opacity="0.82"/><stop offset="100%" stop-color="${o.bottom}" stop-opacity="0.92"/></linearGradient>
    <linearGradient id="${id}-crema" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1B0C06"/><stop offset="25%" stop-color="#4B210F"/><stop offset="65%" stop-color="#975727"/><stop offset="100%" stop-color="#CF8E4A"/></linearGradient>
    <linearGradient id="${id}-stream" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#241006"/><stop offset="40%" stop-color="#5E2A12"/><stop offset="80%" stop-color="#241006"/><stop offset="100%" stop-color="#150803"/></linearGradient>
    ${plumeGrads}
    <linearGradient id="${id}-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${o.fruit || '#fff'}" stop-opacity="0"/><stop offset="35%" stop-color="${o.fruit || '#fff'}" stop-opacity="0.75"/><stop offset="100%" stop-color="${o.fruit || '#fff'}" stop-opacity="0.95"/></linearGradient>
    <linearGradient id="${id}-ice-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.32)"/><stop offset="50%" stop-color="rgba(255,255,255,0.14)"/><stop offset="100%" stop-color="rgba(255,255,255,0.24)"/></linearGradient>
    <radialGradient id="${id}-bub" cx="30%" cy="30%" r="70%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="30%" stop-color="#ffffff" stop-opacity="0.32"/><stop offset="80%" stop-color="rgba(255,255,255,0.06)"/><stop offset="100%" stop-color="rgba(200,162,101,0.35)"/></radialGradient>
    <linearGradient id="${id}-s" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#DFC187"/><stop offset="30%" stop-color="#FFF5D6"/><stop offset="70%" stop-color="#C5A059"/><stop offset="100%" stop-color="#7A5A24"/></linearGradient>
    <linearGradient id="${id}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF6D8"/><stop offset="35%" stop-color="#E5C175"/><stop offset="70%" stop-color="#C59C45"/><stop offset="100%" stop-color="#8A651D"/></linearGradient>
    <linearGradient id="${id}-cr-edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#FFF9E6" stop-opacity="0.9"/><stop offset="50%" stop-color="#E5C175" stop-opacity="0.4"/><stop offset="100%" stop-color="#FFF9E6" stop-opacity="0.8"/></linearGradient>
    <radialGradient id="${id}-pulp" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFF1D0" stop-opacity="0.95"/><stop offset="60%" stop-color="${(o.garnish && o.garnish.i) || '#E8A348'}" stop-opacity="0.88"/><stop offset="100%" stop-color="${(o.garnish && o.garnish.o) || '#C87820'}" stop-opacity="0.95"/></radialGradient>
    <linearGradient id="${id}-glass-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#fff" stop-opacity="0.38"/><stop offset="10%" stop-color="#fff" stop-opacity="0.12"/><stop offset="45%" stop-color="#fff" stop-opacity="0.03"/><stop offset="85%" stop-color="#fff" stop-opacity="0.08"/><stop offset="100%" stop-color="#fff" stop-opacity="0.25"/></linearGradient>
    <linearGradient id="${id}-thick-base" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.06)"/><stop offset="40%" stop-color="rgba(255,255,255,0.18)"/><stop offset="100%" stop-color="rgba(255,255,255,0.36)"/></linearGradient>
    <filter id="${id}-b" x="-25%" y="-20%" width="150%" height="150%"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="${id}-sh" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="5.5"/></filter>
    <filter id="${id}-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>

  <ellipse cx="120" cy="392" rx="66" ry="7" fill="#000" opacity="0.38" filter="url(#${id}-sh)"/>
  <g clip-path="url(#${id}-c)">
    <g class="g-tonic">
      <rect x="40" y="100" width="170" height="290" fill="url(#${id}-t)"/>
      <ellipse cx="120" cy="100" rx="63" ry="4.5" fill="#fff" opacity="0.4"/>
    </g>
    ${fruit}
    ${espresso}
    <g class="g-ice">${cubes}</g>
    <g class="bubbles">${bubbles}</g>
  </g>
  ${straw}
  <path d="M52 40 L188 40 L174 372 Q173 384 160 384 L80 384 Q67 384 66 372 Z" fill="url(#${id}-glass-wall)" stroke="rgba(255,255,255,0.78)" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M68 358 Q120 370 172 358 L174 372 Q173 384 160 384 L80 384 Q67 384 66 372 Z" fill="url(#${id}-thick-base)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
  <ellipse cx="120" cy="40" rx="68" ry="7" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.75)" stroke-width="1.6"/>
  <ellipse cx="120" cy="40" rx="66" ry="6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  <path d="M66 54 L76 348" stroke="rgba(255,255,255,0.6)" stroke-width="4.2" stroke-linecap="round"/>
  <path d="M72 70 L80 320" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/>
  <path d="M174 60 L166 260" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M76 372 Q120 384 164 372" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.8"/>
  <g fill="rgba(255,255,255,0.7)" opacity="0.85">
    <circle cx="63" cy="142" r="1.6"/><circle cx="62.5" cy="141.5" r="0.6" fill="#fff"/>
    <circle cx="65" cy="178" r="1.8"/><circle cx="64.5" cy="177.5" r="0.7" fill="#fff"/>
    <circle cx="64" cy="225" r="1.5"/><circle cx="63.5" cy="224.5" r="0.6" fill="#fff"/>
    <circle cx="173" cy="190" r="1.7"/><circle cx="172.5" cy="189.5" r="0.7" fill="#fff"/>
    <circle cx="171" cy="245" r="2.0"/><circle cx="170.5" cy="244.5" r="0.8" fill="#fff"/>
    <circle cx="168" cy="285" r="1.6"/><circle cx="167.5" cy="284.5" r="0.6" fill="#fff"/>
  </g>
  ${garnish}
  ${crown}
</svg>`;
  };

  /**
   * initSmoothAnatomyGlass(container)
   * Builds high-fidelity, scroll-driven interactive glass with ZERO transition lag
   * Returns a function: update(progress) where progress is 0.0 to 1.0
   */
  window.initSmoothAnatomyGlass = function (container) {
    if (!container) return null;
    const id = 'anat' + ++uid;

    const pulpSegs = Array.from({ length: 8 }, (_, i) => {
      const a1 = (i * Math.PI) / 4 + 0.08;
      const a2 = ((i + 1) * Math.PI) / 4 - 0.08;
      const rIn = 6;
      const rOut = 19;
      const x1 = (Math.cos(a1) * rIn).toFixed(1);
      const y1 = (Math.sin(a1) * rIn).toFixed(1);
      const x2 = (Math.cos(a1) * rOut).toFixed(1);
      const y2 = (Math.sin(a1) * rOut).toFixed(1);
      const x3 = (Math.cos(a2) * rOut).toFixed(1);
      const y3 = (Math.sin(a2) * rOut).toFixed(1);
      const x4 = (Math.cos(a2) * rIn).toFixed(1);
      const y4 = (Math.sin(a2) * rIn).toFixed(1);
      return `<path d="M${x1} ${y1} L${x2} ${y2} A${rOut} ${rOut} 0 0 1 ${x3} ${y3} L${x4} ${y4} A${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z" fill="url(#${id}-pulp)" opacity="0.9"/>`;
    }).join('');

    const bubbles = Array.from({ length: 16 }, (_, i) => {
      const cx = 74 + seed(i + 3) * 92;
      const r = 1.6 + seed(i + 8) * 2.2;
      const dur = 3.0 + seed(i + 5) * 2.6;
      const dl = -seed(i + 13) * 5;
      const hx = (cx - r * 0.32).toFixed(1);
      const hy = (360 - r * 0.32).toFixed(1);
      const hr = (r * 0.3).toFixed(1);
      return `<g class="bub" style="--dur:${dur.toFixed(1)}s;--dl:${dl.toFixed(1)}s">
        <circle cx="${cx.toFixed(1)}" cy="360" r="${r.toFixed(1)}" fill="url(#${id}-bub)" stroke="rgba(255,255,255,0.7)" stroke-width="0.5"/>
        <circle cx="${hx}" cy="${hy}" r="${hr}" fill="#fff" opacity="0.92"/>
      </g>`;
    }).join('');

    const cubesHtml = cubeData.map((c, i) => {
      const s = c.size;
      const cx = c.x + s / 2;
      const cy = c.y + s / 2;
      return `<g id="${id}-cube-${i}" class="anat-cube" style="transform-origin: ${cx}px ${cy}px; transform: translate(0px, -200px); opacity: 0; will-change: transform, opacity;">
        <g transform="rotate(${c.rot} ${cx} ${cy})">
          <rect x="${c.x}" y="${c.y}" width="${s}" height="${s}" rx="6" fill="url(#${id}-ice-body)" stroke="rgba(255,255,255,0.75)" stroke-width="1.3"/>
          <polygon points="${c.x + 3},${c.y + 3} ${c.x + s - 3},${c.y + 3} ${c.x + s - 7},${c.y + 10} ${c.x + 7},${c.y + 10}" fill="rgba(255,255,255,0.45)"/>
          <polygon points="${c.x + s - 3},${c.y + 3} ${c.x + s - 3},${c.y + s - 3} ${c.x + s - 8},${c.y + s - 7} ${c.x + s - 7},${c.y + 10}" fill="rgba(255,255,255,0.2)"/>
          <path d="M${c.x + 8} ${c.y + 12} L${c.x + 18} ${c.y + 18} L${c.x + 24} ${c.y + 14}" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.3" stroke-linecap="round"/>
          <circle cx="${c.x + 5}" cy="${c.y + 5}" r="1.3" fill="#fff" opacity="0.95"/>
        </g>
      </g>`;
    }).join('');

    const plumeGrads = plumePaths.map((_, i) =>
      `<linearGradient id="${id}-e${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#140602"/><stop offset="55%" stop-color="#4E200E"/><stop offset="90%" stop-color="#994F1E"/><stop offset="100%" stop-color="#994F1E" stop-opacity="0"/></linearGradient>`
    ).join('');

    const plumesHtml = plumePaths.map((d, i) =>
      `<path id="${id}-plume-${i}" class="anat-plume" d="${d}" fill="url(#${id}-e${i})" style="transform-origin: 120px 108px; transform: scaleY(0); will-change: transform, opacity;"/>`
    ).join('');

    container.innerHTML = `
<svg class="glass glass--smooth" width="240" height="525" viewBox="0 -105 240 525" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <clipPath id="${id}-c"><path d="M58 46 L182 46 L169.5 366 Q169 376 158 376 L82 376 Q71 376 70.5 366 Z"/></clipPath>
    <linearGradient id="${id}-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F6EFE2" stop-opacity="0.96"/><stop offset="50%" stop-color="#EAD9BC" stop-opacity="0.88"/><stop offset="100%" stop-color="#D4BA8C" stop-opacity="0.94"/></linearGradient>
    <linearGradient id="${id}-crema" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1B0C06"/><stop offset="25%" stop-color="#4B210F"/><stop offset="65%" stop-color="#975727"/><stop offset="100%" stop-color="#CF8E4A"/></linearGradient>
    <linearGradient id="${id}-stream" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#241006"/><stop offset="40%" stop-color="#5E2A12"/><stop offset="80%" stop-color="#241006"/><stop offset="100%" stop-color="#150803"/></linearGradient>
    ${plumeGrads}
    <linearGradient id="${id}-ice-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.4)"/><stop offset="50%" stop-color="rgba(255,255,255,0.18)"/><stop offset="100%" stop-color="rgba(255,255,255,0.28)"/></linearGradient>
    <radialGradient id="${id}-bub" cx="30%" cy="30%" r="70%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="30%" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="80%" stop-color="rgba(255,255,255,0.06)"/><stop offset="100%" stop-color="rgba(200,162,101,0.35)"/></radialGradient>
    <linearGradient id="${id}-s" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#DFC187"/><stop offset="30%" stop-color="#FFF5D6"/><stop offset="70%" stop-color="#C5A059"/><stop offset="100%" stop-color="#7A5A24"/></linearGradient>
    <linearGradient id="${id}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF8E0"/><stop offset="35%" stop-color="#E8C57C"/><stop offset="70%" stop-color="#C9A148"/><stop offset="100%" stop-color="#8C671F"/></linearGradient>
    <linearGradient id="${id}-cr-edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.95"/><stop offset="50%" stop-color="#E5C175" stop-opacity="0.45"/><stop offset="100%" stop-color="#FFFBEB" stop-opacity="0.85"/></linearGradient>
    <radialGradient id="${id}-pulp" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFF3D4" stop-opacity="0.96"/><stop offset="60%" stop-color="#E8A348" stop-opacity="0.9"/><stop offset="100%" stop-color="#C87820" stop-opacity="0.96"/></radialGradient>
    <linearGradient id="${id}-glass-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#fff" stop-opacity="0.45"/><stop offset="10%" stop-color="#fff" stop-opacity="0.14"/><stop offset="45%" stop-color="#fff" stop-opacity="0.04"/><stop offset="85%" stop-color="#fff" stop-opacity="0.1"/><stop offset="100%" stop-color="#fff" stop-opacity="0.32"/></linearGradient>
    <linearGradient id="${id}-thick-base" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.08)"/><stop offset="40%" stop-color="rgba(255,255,255,0.22)"/><stop offset="100%" stop-color="rgba(255,255,255,0.4)"/></linearGradient>
    <filter id="${id}-b" x="-25%" y="-20%" width="150%" height="150%"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="${id}-sh" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="5.5"/></filter>
    <filter id="${id}-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>

  <ellipse cx="120" cy="392" rx="66" ry="7" fill="#000" opacity="0.38" filter="url(#${id}-sh)"/>

  <!-- Liquid inside glass clipped to interior walls -->
  <g clip-path="url(#${id}-c)">
    <!-- Base Tonic Layer (Smoothly rises from bottom) -->
    <g id="${id}-tonic-grp">
      <rect id="${id}-tonic" x="40" y="376" width="170" height="0" fill="url(#${id}-t)"/>
      <ellipse id="${id}-meniscus" cx="120" cy="376" rx="63" ry="4.5" fill="#fff" opacity="0"/>
    </g>

    <!-- Espresso Cascade -->
    <g id="${id}-espresso" opacity="0" style="will-change: opacity;">
      <g filter="url(#${id}-b)">
        <path id="${id}-crema" class="e-top" d="M46 100 Q120 106 194 100 L194 126 Q160 134 130 128 Q95 136 46 125 Z" fill="url(#${id}-crema)" style="transform-origin: 120px 100px; transform: scaleY(0);"/>
        ${plumesHtml}
      </g>
      <ellipse id="${id}-crema-sheen" cx="120" cy="100.5" rx="63" ry="4.5" fill="none" stroke="rgba(223,178,110,0.65)" stroke-width="1.4" opacity="0"/>
    </g>

    <!-- 3D Ice Cubes -->
    <g id="${id}-ice-grp">
      ${cubesHtml}
    </g>

    <!-- Bubbles -->
    <g id="${id}-bubbles" class="bubbles" opacity="0" style="will-change: opacity;">
      ${bubbles}
    </g>
  </g>

  <!-- Pouring stream -->
  <rect id="${id}-stream" class="g-stream" x="114" y="-120" width="12" height="230" rx="6" fill="url(#${id}-stream)" opacity="0" style="transform-origin: 120px 108px; transform: scaleY(0); will-change: transform, opacity;"/>

  <!-- Glass Straw -->
  <g class="g-straw">
    <rect x="124" y="10" width="8" height="300" rx="4" transform="rotate(-9 128 150)" fill="url(#${id}-s)"/>
    <rect x="125.8" y="10" width="2" height="300" rx="1" transform="rotate(-9 128 150)" fill="#fff" opacity="0.6"/>
    <ellipse cx="128" cy="14" rx="4" ry="2" transform="rotate(-9 128 150)" fill="#68471A"/>
  </g>

  <!-- Tumbler Glass Body & Optics -->
  <path d="M52 40 L188 40 L174 372 Q173 384 160 384 L80 384 Q67 384 66 372 Z" fill="url(#${id}-glass-wall)" stroke="rgba(255,255,255,0.82)" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M68 358 Q120 370 172 358 L174 372 Q173 384 160 384 L80 384 Q67 384 66 372 Z" fill="url(#${id}-thick-base)" stroke="rgba(255,255,255,0.55)" stroke-width="1"/>
  <ellipse cx="120" cy="40" rx="68" ry="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.8)" stroke-width="1.6"/>
  <ellipse cx="120" cy="40" rx="66" ry="6" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
  <path d="M66 54 L76 348" stroke="rgba(255,255,255,0.65)" stroke-width="4.2" stroke-linecap="round"/>
  <path d="M72 70 L80 320" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/>
  <path d="M174 60 L166 260" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M76 372 Q120 384 164 372" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.8"/>

  <!-- External Condensation -->
  <g fill="rgba(255,255,255,0.75)" opacity="0.9">
    <circle cx="63" cy="142" r="1.6"/><circle cx="62.5" cy="141.5" r="0.6" fill="#fff"/>
    <circle cx="65" cy="178" r="1.8"/><circle cx="64.5" cy="177.5" r="0.7" fill="#fff"/>
    <circle cx="64" cy="225" r="1.5"/><circle cx="63.5" cy="224.5" r="0.6" fill="#fff"/>
    <circle cx="173" cy="190" r="1.7"/><circle cx="172.5" cy="189.5" r="0.7" fill="#fff"/>
    <circle cx="171" cy="245" r="2.0"/><circle cx="170.5" cy="244.5" r="0.8" fill="#fff"/>
    <circle cx="168" cy="285" r="1.6"/><circle cx="167.5" cy="284.5" r="0.6" fill="#fff"/>
  </g>

  <!-- Citrus Garnish -->
  <g id="${id}-garnish" class="g-garnish" transform="translate(186 40) rotate(-90) scale(0)" style="transform-origin: 186px 40px; will-change: transform;">
    <ellipse cx="-4" cy="18" rx="8" ry="4" fill="rgba(0,0,0,0.3)" filter="url(#${id}-sh)"/>
    <circle r="25" fill="#C87820"/>
    <circle r="22.5" fill="#FFF8EB"/>
    <circle r="20" fill="#E8A348" opacity="0.45"/>
    ${pulpSegs}
    <circle r="5" fill="#FFFBF2"/>
    <circle r="2.2" fill="#C87820" opacity="0.5"/>
    <circle cx="16" cy="-14" r="1.4" fill="#fff" opacity="0.95"/>
  </g>

  <!-- Gold Crown & Embers -->
  <g id="${id}-crown" class="g-crown" transform="translate(0 -130)" opacity="0" style="will-change: transform, opacity;">
    <g class="crown-bob">
      <ellipse cx="120" cy="-2" rx="44" ry="5" fill="rgba(0,0,0,0.28)" filter="url(#${id}-sh)"/>
      <rect x="68" y="-16" width="104" height="14" rx="3.5" fill="url(#${id}-cr)"/>
      <rect x="68" y="-16" width="104" height="14" rx="3.5" fill="none" stroke="url(#${id}-cr-edge)" stroke-width="1"/>
      <path d="M70 -14 L78 -58 L99 -34 L120 -72 L141 -34 L162 -58 L170 -14 Z" fill="url(#${id}-cr)"/>
      <path d="M120 -72 L120 -16" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M78 -58 L85 -16" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linecap="round"/>
      <path d="M162 -58 L155 -16" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linecap="round"/>
      <circle cx="78" cy="-60" r="4.5" fill="url(#${id}-cr)"/>
      <circle cx="76.8" cy="-61.2" r="1.4" fill="#fff" opacity="0.95"/>
      <circle cx="120" cy="-74" r="5.2" fill="url(#${id}-cr)"/>
      <circle cx="118.5" cy="-75.5" r="1.6" fill="#fff" opacity="0.95"/>
      <circle cx="162" cy="-60" r="4.5" fill="url(#${id}-cr)"/>
      <circle cx="160.8" cy="-61.2" r="1.4" fill="#fff" opacity="0.95"/>
      <circle cx="92" cy="-9" r="2.8" fill="#FFF9E6"/><circle cx="91.2" cy="-9.8" r="0.9" fill="#fff"/>
      <circle cx="120" cy="-9" r="3.2" fill="#FFF9E6"/><circle cx="119" cy="-10" r="1" fill="#fff"/>
      <circle cx="148" cy="-9" r="2.8" fill="#FFF9E6"/><circle cx="147.2" cy="-9.8" r="0.9" fill="#fff"/>
    </g>
  </g>
  <g id="${id}-sparks" class="sparks" opacity="0" style="will-change: opacity;">
    <g transform="translate(52 -66)"><path class="spark" style="--dl:0s" d="M0 -9 Q1 -2 8 0 Q1 2 0 9 Q-1 2 -8 0 Q-1 -2 0 -9Z" fill="#FFF5D6" filter="url(#${id}-glow)"/></g>
    <g transform="translate(190 -40)"><path class="spark" style="--dl:.8s" d="M0 -7 Q1 -1.5 6 0 Q1 1.5 0 7 Q-1 1.5 -6 0 Q-1 -1.5 0 -7Z" fill="#FFF5D6" filter="url(#${id}-glow)"/></g>
    <g transform="translate(168 -92)"><path class="spark" style="--dl:1.5s" d="M0 -6 Q0.8 -1.2 5 0 Q0.8 1.2 0 6 Q-0.8 1.2 -5 0 Q-0.8 -1.2 0 -6Z" fill="#FFF5D6" filter="url(#${id}-glow)"/></g>
  </g>
</svg>`;

    const tonic = container.querySelector('#' + id + '-tonic');
    const meniscus = container.querySelector('#' + id + '-meniscus');
    const cubes = [0, 1, 2, 3, 4].map(i => container.querySelector('#' + id + '-cube-' + i));
    const stream = container.querySelector('#' + id + '-stream');
    const espresso = container.querySelector('#' + id + '-espresso');
    const crema = container.querySelector('#' + id + '-crema');
    const cremaSheen = container.querySelector('#' + id + '-crema-sheen');
    const plumes = [0, 1, 2, 3, 4, 5].map(i => container.querySelector('#' + id + '-plume-' + i));
    const bubblesGrp = container.querySelector('#' + id + '-bubbles');
    const garnish = container.querySelector('#' + id + '-garnish');
    const crown = container.querySelector('#' + id + '-crown');
    const sparks = container.querySelector('#' + id + '-sparks');

    return function updateProgress(p) {
      p = clamp(p, 0, 1);

      // --- STEP 1: ICE CUBES (p: 0.00 -> 0.25) ---
      const s1 = clamp(p / 0.22, 0, 1);
      cubes.forEach((cube, i) => {
        if (!cube) return;
        const c_k = clamp((s1 - i * 0.08) / 0.65, 0, 1);
        const e_k = easeOutQuad(c_k);
        const startY = -180;
        const pileY = cubeData[i].pile;
        let curY = startY + (pileY - startY) * e_k;

        // Buoyancy when tonic liquid fills in step 2
        if (p > 0.22) {
          const s2Float = clamp((p - 0.22) / 0.26, 0, 1);
          curY -= 20 * easeOutQuad(s2Float);
        }
        cube.style.transform = `translate(0px, ${curY.toFixed(1)}px)`;
        cube.style.opacity = clamp(c_k * 3.5, 0, 1).toFixed(2);
      });

      // --- STEP 2: SPARKLING TONIC (p: 0.22 -> 0.50) ---
      const s2 = clamp((p - 0.22) / 0.26, 0, 1);
      const e2 = easeOutQuad(s2);
      const baseY = 376;
      const targetY = 100;
      const tonicY = baseY - (baseY - targetY) * e2;
      const tonicH = baseY - tonicY;

      if (tonic) {
        tonic.setAttribute('y', tonicY.toFixed(1));
        tonic.setAttribute('height', tonicH.toFixed(1));
      }
      if (meniscus) {
        meniscus.setAttribute('cy', tonicY.toFixed(1));
        meniscus.setAttribute('opacity', s2 > 0.01 ? (0.6 * s2).toFixed(2) : '0');
      }
      if (bubblesGrp) {
        bubblesGrp.setAttribute('opacity', s2.toFixed(2));
      }

      // --- STEP 3: ESPRESSO CASCADE (p: 0.48 -> 0.76) ---
      const s3 = clamp((p - 0.48) / 0.26, 0, 1);

      // Pouring Stream from above
      if (stream) {
        if (s3 > 0.02 && s3 < 0.95) {
          const streamOp = Math.sin(s3 * Math.PI) * 0.95;
          const streamScale = clamp(s3 * 3, 0, 1);
          stream.setAttribute('opacity', streamOp.toFixed(2));
          stream.style.transform = `scaleY(${streamScale.toFixed(2)})`;
        } else {
          stream.setAttribute('opacity', '0');
        }
      }

      // Crema head expansion
      if (crema) {
        const cremaScale = clamp(s3 * 1.5, 0, 1);
        crema.style.transform = `scaleY(${cremaScale.toFixed(2)})`;
      }
      if (espresso) {
        espresso.setAttribute('opacity', clamp(s3 * 2, 0, 1).toFixed(2));
      }
      if (cremaSheen) {
        cremaSheen.setAttribute('opacity', clamp((s3 - 0.4) * 2, 0, 1).toFixed(2));
      }

      // Convective plumes penetration
      plumes.forEach((plume, i) => {
        if (!plume) return;
        const plumeProgress = clamp((s3 - i * 0.06) / 0.68, 0, 1);
        const plumeScale = easeOutCubic(plumeProgress);
        plume.style.transform = `scaleY(${plumeScale.toFixed(3)})`;
        plume.setAttribute('opacity', clamp(plumeProgress * 2.2, 0, 1).toFixed(2));
      });

      // --- STEP 4: CITRUS GARNISH & GOLD CROWN (p: 0.74 -> 1.00) ---
      const s4 = clamp((p - 0.74) / 0.24, 0, 1);

      // Garnish slips onto the rim
      if (garnish) {
        const gScale = clamp(s4 * 1.15, 0, 1);
        const gRot = -90 + (90 - 18) * easeOutBack(clamp(s4 * 1.05, 0, 1));
        garnish.setAttribute('transform', `translate(186 40) rotate(${gRot.toFixed(1)}) scale(${gScale.toFixed(2)})`);
      }

      // Gold Crown descends with glow
      if (crown) {
        const crownEase = easeOutCubic(s4);
        const crownY = -120 * (1 - crownEase);
        crown.setAttribute('transform', `translate(0 ${crownY.toFixed(1)})`);
        crown.setAttribute('opacity', clamp(s4 * 2.2, 0, 1).toFixed(2));
      }

      // Twinkling golden embers
      if (sparks) {
        const sparksOp = clamp((s4 - 0.5) * 2, 0, 1);
        sparks.setAttribute('opacity', sparksOp.toFixed(2));
      }
    };
  };

  /** Espresso cup demitasse for single shots */
  window.cupSVG = function () {
    const id = 'cx' + ++uid;
    return `<svg class="glass cup" width="200" height="420" viewBox="20 -6 200 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${id}-cup" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2A221D"/><stop offset="50%" stop-color="#1B1512"/><stop offset="100%" stop-color="#120E0C"/></linearGradient>
    <linearGradient id="${id}-crema" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3A1C0E"/><stop offset="35%" stop-color="#8D4C20"/><stop offset="70%" stop-color="#C8853C"/><stop offset="100%" stop-color="#E8B568"/></linearGradient>
    <linearGradient id="${id}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF6D8"/><stop offset="50%" stop-color="#E5C175"/><stop offset="100%" stop-color="#9C7324"/></linearGradient>
  </defs>
  <g fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="2.5" stroke-linecap="round">
    <path class="steam" style="--dl:0s" d="M100 238 q-10 -22 0 -42 t0 -42"/>
    <path class="steam" style="--dl:.9s" d="M122 238 q-10 -22 0 -42 t0 -42"/>
    <path class="steam" style="--dl:1.8s" d="M144 238 q-10 -22 0 -42 t0 -42"/>
  </g>
  <ellipse cx="120" cy="380" rx="88" ry="14" fill="url(#${id}-cup)" stroke="rgba(197,160,89,0.35)" stroke-width="1.5"/>
  <ellipse cx="120" cy="378" rx="82" ry="11" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
  <ellipse cx="120" cy="372" rx="52" ry="8" fill="rgba(0,0,0,0.45)"/>
  <path d="M174 276 Q214 274 210 306 Q206 336 168 330" fill="none" stroke="url(#${id}-cup)" stroke-width="11" stroke-linecap="round"/>
  <path d="M174 276 Q214 274 210 306 Q206 336 168 330" fill="none" stroke="rgba(197,160,89,0.3)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M60 256 L180 256 Q180 360 120 368 Q60 360 60 256 Z" fill="url(#${id}-cup)" stroke="rgba(197,160,89,0.3)" stroke-width="1.2"/>
  <ellipse cx="120" cy="256" rx="60" ry="12" fill="#241C17" stroke="rgba(197,160,89,0.7)" stroke-width="1.6"/>
  <ellipse cx="120" cy="257" rx="53" ry="8.5" fill="#200E06"/>
  <ellipse cx="120" cy="256" rx="48" ry="6.5" fill="url(#${id}-crema)"/>
  <ellipse cx="114" cy="255" rx="18" ry="2.6" fill="#F0C788" opacity="0.85"/>
  <ellipse cx="128" cy="256" rx="10" ry="1.8" fill="#F0C788" opacity="0.6"/>
  <g transform="translate(120 312) scale(.42)">
    <path d="M-50 12 L-42 -30 L-21 -6 L0 -44 L21 -6 L42 -30 L50 12 Z" fill="url(#${id}-cr)"/>
    <rect x="-52" y="10" width="104" height="12" rx="4" fill="url(#${id}-cr)"/>
  </g>
</svg>`;
  };
})();
