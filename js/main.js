/* ==========================================================================
   Gotx Coffee — interactions
   ========================================================================== */
(function () {
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const D = window.GOTX;
  const wa = (text) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(text)}`;
  const root = document.documentElement;

  /* ---------- page load + page transitions ---------- */
  function start() {
    setTimeout(() => {
      root.classList.add('is-loaded');
      setTimeout(() => {
        document.body.classList.add('is-ready');
        $$('.page-hero [data-split]').forEach((el) => el.classList.add('in'));
      }, 450);
    }, 380);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  window.addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('is-leaving'); });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || /^(#|mailto:|tel:|https?:|javascript:)/i.test(href)) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    root.classList.add('is-leaving');
    setTimeout(() => { window.location.href = href; }, reduce ? 0 : 560);
  });

  /* ---------- header ---------- */
  const header = $('.site-header');
  if (header) {
    let lastY = window.scrollY, ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      if (!document.body.classList.contains('menu-open')) {
        if (y > lastY + 6 && y > 220) header.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 120) header.classList.remove('is-hidden');
      }
      lastY = y; ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }
  const burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  /* ---------- text split + reveal ---------- */
  $$('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
  });
  $$('[data-stagger]').forEach((el) => Array.from(el.children).forEach((c, i) => c.style.setProperty('--i', i)));

  const targets = $$('[data-reveal], [data-split], [data-stagger], .flow, .leave-out').filter((t) => !t.closest('.page-hero'));
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('in'));
  }

  /* ---------- hero showcase subtle tactile tilt ---------- */
  const heroFrame = $('.hero__frame');
  if (heroFrame && fine && !reduce) {
    const heroSec = $('.hero');
    if (heroSec) {
      heroSec.addEventListener('pointermove', (e) => {
        const r = heroFrame.getBoundingClientRect();
        const mx = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2;
        const my = ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 2;
        heroFrame.style.transform = `perspective(1000px) rotateY(${mx * 4}deg) rotateX(${-my * 4}deg) translateY(-3px)`;
      });
      heroSec.addEventListener('pointerleave', () => {
        heroFrame.style.transform = '';
      });
    }
  }

  /* ---------- floating bubbles ---------- */
  $$('.bubbles-bg').forEach((bg) => {
    if (reduce) return;
    const n = window.innerWidth < 700 ? 9 : 16;
    for (let i = 0; i < n; i++) {
      const b = document.createElement('span');
      const s = 6 + Math.random() * 26;
      b.className = 'bubble';
      b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 12}s;animation-delay:${-Math.random() * 18}s;--sway:${(Math.random() - 0.5) * 80}px`;
      bg.appendChild(b);
    }
  });

  /* ---------- open / closed status (Surat time, 10 AM – 11 PM) ---------- */
  function updateStatus() {
    const hour = parseInt(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Kolkata' }).format(new Date()), 10);
    const open = hour >= 10 && hour < 23;
    $$('[data-status]').forEach((el) => {
      el.classList.toggle('is-closed', !open);
      el.innerHTML = '<i></i>' + (open ? 'Open now, until 11 PM' : 'Closed now, opens at 10 AM');
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- home: favourites scroller (Photorealistic Drinks) ---------- */
  const fav = $('#fav');
  if (fav) {
    const colors = ['#1A1412', '#241C18', '#1E1714', '#29211C'];
    fav.innerHTML = D.favourites.map((id, i) => {
      const m = D.menu.find((x) => x.id === id);
      if (!m) return '';
      return `<article class="fav-card" style="--c:${colors[i % colors.length]}">
        <div class="fav-card__art">
          <div class="fav-card__img-wrap">
            <img src="${m.img}" alt="${m.name}" class="fav-card__img" loading="lazy" />
            <div class="fav-card__glow"></div>
          </div>
        </div>
        <h3>${m.name}</h3><p>${m.desc}</p>
        <div class="fav-card__foot"><span class="price">₹${m.price}</span><a class="btn btn--ghost btn--sm" href="${wa("Hi Gotx Coffee! I'd like to order a " + m.name + '.')}" target="_blank" rel="noopener">Order</a></div>
      </article>`;
    }).join('');

    const step = () => Math.min(320, fav.clientWidth * 0.8);
    $('#fav-prev').addEventListener('click', () => fav.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('#fav-next').addEventListener('click', () => fav.scrollBy({ left: step(), behavior: 'smooth' }));

    let down = false, sx = 0, sl = 0, moved = false;
    fav.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = fav.scrollLeft; });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; fav.classList.add('is-dragging'); }
      fav.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', () => { down = false; fav.classList.remove('is-dragging'); });
    fav.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
  }

  /* ---------- home: scroll-built espresso tonic (Smooth Scrubbed Physics) ---------- */
  const anatomy = $('#anatomy');
  if (anatomy) {
    const holder = $('#anatomy-glass');
    const updateGlass = window.initSmoothAnatomyGlass ? window.initSmoothAnatomyGlass(holder) : null;
    const steps = $$('.step', anatomy);
    const dots = $$('.dots i', anatomy);

    let targetProgress = 0;
    let currentProgress = 0;
    let ticking = false;

    const renderProgress = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0004) {
        currentProgress += diff * 0.22;
      } else {
        currentProgress = targetProgress;
      }

      const p = reduce ? 1 : currentProgress;
      if (updateGlass) {
        updateGlass(p);
      }

      let activeStep = 0;
      if (p >= 0.72) activeStep = 3;
      else if (p >= 0.48) activeStep = 2;
      else if (p >= 0.22) activeStep = 1;
      else activeStep = 0;

      steps.forEach((s, i) => s.classList.toggle('is-active', i === activeStep));
      dots.forEach((d, i) => d.classList.toggle('on', i === activeStep));

      if (Math.abs(targetProgress - currentProgress) > 0.0004) {
        requestAnimationFrame(renderProgress);
      } else {
        ticking = false;
      }
    };

    const onScroll = () => {
      const r = anatomy.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      targetProgress = Math.max(0, Math.min(1, -r.top / total));
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(renderProgress);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    const stepPositions = [0.10, 0.35, 0.60, 0.88];
    steps.forEach((s, i) => s.addEventListener('click', () => {
      if (window.innerWidth <= 1000) {
        targetProgress = stepPositions[i];
        currentProgress = targetProgress;
        if (updateGlass) updateGlass(targetProgress);
        steps.forEach((st, idx) => st.classList.toggle('is-active', idx === i));
      } else {
        const r = anatomy.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        window.scrollTo({
          top: window.scrollY + r.top + total * stepPositions[i],
          behavior: reduce ? 'auto' : 'smooth'
        });
      }
    }));
  }

  /* ---------- menu page: grid (Photorealistic Drinks) ---------- */
  const grid = $('#menu-grid');
  if (grid) {
    let group = 'all';
    const render = () => {
      const list = D.menu.filter((m) => group === 'all' || m.group === group);
      grid.innerHTML = list.map((m, i) => {
        return `<li class="mi" style="--i:${i}">
          <div class="mi__arch" aria-hidden="true">
            <div class="mi__img-wrap">
              <img src="${m.img}" alt="${m.name}" class="mi__img" loading="lazy" />
            </div>
          </div>
          <div>
            <div class="mi__top"><h3>${m.name}</h3><span class="mi__dots"></span><span class="mi__price">₹${m.price}</span></div>
            <p>${m.desc}</p>
            <div class="mi__foot"><span class="tag tag--gold">${m.tag}</span>
              <a class="mi__order" href="${wa("Hi Gotx Coffee! I'd like to order a " + m.name + '.')}" target="_blank" rel="noopener" aria-label="Order ${m.name} on WhatsApp">Order</a></div>
          </div></li>`;
      }).join('');
    };
    render();
    $$('.chip').forEach((chip) => chip.addEventListener('click', () => {
      if (chip.dataset.group === group) return;
      group = chip.dataset.group;
      $$('.chip').forEach((c) => c.setAttribute('aria-pressed', c === chip));
      if (reduce) { render(); return; }
      grid.classList.add('is-leaving');
      setTimeout(() => { render(); grid.classList.remove('is-leaving'); }, 260);
    }));
  }

  /* ---------- menu page: build your crown (Interactive Showcase) ---------- */
  const stage = $('#builder-glass');
  if (stage) {
    const plain = D.menu.find((m) => m.id === 'espresso-tonic');
    const options = [{ id: 'plain', label: 'No fruit', color: '#E5D6B8', m: plain, name: 'Espresso Tonic', desc: plain.desc, price: plain.price, img: plain.img }]
      .concat(D.menu.filter((m) => m.group === 'fruit').map((m) => ({ id: m.id, label: m.name.replace(' Tonic', ''), color: m.g.fruit, m, name: m.name, desc: m.desc, price: m.price, img: m.img })));
    const sw = $('#swatches');
    sw.innerHTML = options.map((o, i) => `<button class="swatch" role="radio" aria-checked="${i === 0}" data-id="${o.id}" style="--sw:${o.color}"><i></i>${o.label}</button>`).join('');

    const show = (o) => {
      stage.innerHTML = `
        <div class="builder-showcase">
          <img src="${o.img}" alt="${o.name}" class="builder-showcase__img" />
          <div class="builder-showcase__shine"></div>
          <div class="builder-showcase__tag">${o.id === 'plain' ? 'House Signature' : o.label + ' Infusion'}</div>
        </div>
      `;
      $('#b-name').textContent = o.name;
      $('#b-desc').textContent = o.desc;
      $('#b-price').textContent = '₹' + o.price;
      $('#b-order').href = wa("Hi Gotx Coffee! I'd like to order a " + o.name + '.');
    };
    show(options[0]);
    sw.addEventListener('click', (e) => {
      const b = e.target.closest('.swatch'); if (!b) return;
      $$('.swatch', sw).forEach((x) => x.setAttribute('aria-checked', x === b));
      show(options.find((o) => o.id === b.dataset.id));
    });
  }

  /* ---------- coming soon list ---------- */
  const soon = $('#soon-list');
  if (soon) {
    soon.innerHTML = D.soon.map((s, i) => `<div class="soon" style="--sd:${i * 0.7}s"><span class="tag">Coming soon</span><h3>${s.name}</h3><p>${s.desc}</p></div>`).join('');
    soon.setAttribute('data-stagger', '');
    Array.from(soon.children).forEach((c, i) => c.style.setProperty('--i', i));
    if ('IntersectionObserver' in window && !reduce) {
      const io2 = new IntersectionObserver((en) => { if (en[0].isIntersecting) { soon.classList.add('in'); io2.disconnect(); } }, { threshold: 0.15 });
      io2.observe(soon);
    } else soon.classList.add('in');
  }

  /* ---------- FAQ ---------- */
  $$('.faq__q').forEach((q) => q.addEventListener('click', () => {
    const item = q.closest('.faq__item');
    const open = item.classList.toggle('open');
    q.setAttribute('aria-expanded', open);
  }));

  /* ---------- contact form → WhatsApp ---------- */
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const lines = [`Hi Gotx Coffee! My name is ${f.get('name')}.`, `Topic: ${f.get('topic')}`, '', f.get('message')];
      if (f.get('phone')) lines.push('', `Phone: ${f.get('phone')}`);
      window.open(wa(lines.join('\n')), '_blank', 'noopener');
    });
  }

  /* ---------- magnetic buttons + tilt panels ---------- */
  if (fine && !reduce) {
    $$('.btn--mag').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
    $$('.channel').forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 8 + 'deg');
        c.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 8 + 'deg');
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
