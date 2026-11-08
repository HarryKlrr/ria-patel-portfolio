const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const projects = (window.PROJECTS || []).filter((p) => !p.draft);
const link = (p) => `project.html#${encodeURIComponent(p.id)}`;
const media = (p) => p.image
  ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
  : '<span class="blank">Images coming soon</span>';
const pad = (n) => String(n).padStart(2, '0');

// ---------- Home: featured project switcher ----------
(() => {
  const tabs = document.querySelector('[data-tabs]');
  const feature = document.querySelector('[data-feature]');
  if (!tabs || !feature || !projects.length) return;

  document.querySelector('[data-count]').textContent = pad(projects.length);
  const $ = (k) => feature.querySelector(`[data-f-${k}]`);

  const fill = (p, i) => {
    $('name').textContent = p.shortTitle || p.title;
    $('index').textContent = `Project / ${pad(i + 1)}`;
    $('media').innerHTML = media(p);
    $('tool').textContent = p.status ? p.status : (p.fusion || p.stl) ? 'Live 3D model inside' : '';
    $('year').textContent = p.year;
    $('field').textContent = [p.field, p.year].filter(Boolean).join(' · ');
    $('title').textContent = p.title;
    $('summary').textContent = p.summary;
    $('tags').innerHTML = (p.tags || []).map((t) => `<li class="pill">${t}</li>`).join('');
    const parts = (p.story || []).map((s) => s.heading.replace(/^The /, '').toLowerCase());
    if (p.fusion || p.stl) parts.push('the live 3D model');
    const note = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts.join('');
    $('note').textContent = note.charAt(0).toUpperCase() + note.slice(1);
    $('link').href = link(p);
    $('cta').href = link(p);
  };

  let current = 0;
  const select = (i) => {
    if (i === current && feature.dataset.ready) return;
    tabs.querySelectorAll('.tab').forEach((t, j) => {
      t.setAttribute('aria-selected', j === i);
      t.tabIndex = j === i ? 0 : -1;
    });
    current = i;
    if (!feature.dataset.ready) { fill(projects[i], i); feature.dataset.ready = '1'; return; }
    feature.classList.add('is-swapping');
    setTimeout(() => { fill(projects[i], i); feature.classList.remove('is-swapping'); }, 220);
  };

  projects.forEach((p, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tab';
    tab.setAttribute('role', 'tab');
    tab.innerHTML = `<span class="tab__num">${pad(i + 1)}</span>${p.shortTitle || p.title}`;
    tab.addEventListener('click', () => select(i));
    tabs.append(tab);
  });

  // arrow keys move between tabs
  tabs.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const next = (current + step + projects.length) % projects.length;
    select(next);
    tabs.children[next].focus();
  });

  select(0);
})();

// ---------- Home: project grid ----------
(() => {
  const grid = document.querySelector('[data-cards]');
  if (!grid) return;
  projects.forEach((p, i) => {
    const card = document.createElement('a');
    card.className = 'card reveal';
    card.style.setProperty('--d', `${(i % 2) * 60}ms`);
    card.href = link(p);
    card.innerHTML = `
      <div class="card__media">
        ${media(p)}
        ${p.status ? `<span class="card__badge card__badge--status">${p.status}</span>` : (p.fusion || p.stl) ? '<span class="card__badge">3D model</span>' : ''}
        <span class="card__tag">${p.field}</span>
        <span class="card__arrow">${ARROW}</span>
      </div>
      <div class="card__meta"><h3>${p.title}</h3><span>${p.year}</span></div>
      <p class="card__summary">${p.summary}</p>`;
    grid.append(card);
  });
})();

// ---------- Fusion viewers ----------
document.querySelectorAll('.viewer[data-src]').forEach((viewer) => {
  const frame = document.createElement('iframe');
  frame.src = viewer.dataset.src;
  frame.title = viewer.dataset.title || '3D model';
  frame.allow = 'fullscreen';
  frame.allowFullscreen = true;

  // a cover so scrolling the page doesn't get caught zooming the model;
  // click to use the model, and the cover returns when the mouse leaves
  const shield = document.createElement('button');
  shield.type = 'button';
  shield.className = 'viewer__shield';
  shield.innerHTML = '<span>Click to rotate and zoom</span>';
  shield.addEventListener('click', () => { shield.hidden = true; frame.focus(); });
  viewer.addEventListener('mouseleave', () => { shield.hidden = false; });
  viewer.replaceChildren(frame, shield);
});

// ---------- Reveal on scroll ----------
(() => {
  document.querySelectorAll('.section__head, .tile, .cred, .cred-mini, .cta-panel, .story section, .next, .stage, .step, .stat, .compare')
    .forEach((el) => { el.classList.add('reveal'); });
  // stagger items that sit side by side
  document.querySelectorAll('.process, .stats, .creds, .bento').forEach((group) => {
    [...group.children].forEach((el, i) => el.style.setProperty('--d', `${i * 70}ms`));
  });
  // ?static shows everything at once (handy for screenshots and printing)
  if (!('IntersectionObserver' in window) || location.search.includes('static')) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
