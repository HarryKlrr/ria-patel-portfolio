// Builds a project page from projects.js, using project.html#<id> in the address.
// (#, not ?query, because static hosts redirect project.html -> /project and can drop the query.)
history.scrollRestoration = 'manual';
addEventListener('hashchange', () => location.reload());
(() => {
  const list = window.PROJECTS.filter((p) => !p.draft);
  const id = decodeURIComponent(location.hash.slice(1));
  const index = Math.max(0, list.findIndex((p) => p.id === id));
  const p = list[index];
  if (!p) { location.replace('index.html#work'); return; }

  const $ = (sel) => document.querySelector(sel);
  document.title = `${p.title} | Ria Patel`;
  $('[data-crumb]').textContent = p.title;
  $('[data-field]').textContent = [p.field, p.year].filter(Boolean).join(' · ');
  $('[data-title]').textContent = p.title;
  $('[data-summary]').textContent = p.summary;
  $('[data-tags]').innerHTML = (p.tags || []).map((t) => `<li class="pill">${t}</li>`).join('');
  $('[data-facts]').innerHTML = Object.entries(p.facts || {})
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  if (p.status) {
    $('[data-facts]').insertAdjacentHTML('afterend',
      `<p class="notice"><span class="pill pill--accent">${p.status}</span>This project is still to come. The page sets out the plan and how it will be tested; results will be added as the work is done.</p>`);
  }

  const stage = $('[data-stage]');
  if (p.fusion) {
    stage.hidden = false;
    $('[data-stage-bar]').innerHTML =
      `<span><b>${p.title}</b> · interactive 3D model</span><a href="${p.fusion}" target="_blank" rel="noopener">Open in Fusion ↗</a>`;
    $('[data-stage-body]').innerHTML =
      `<div class="viewer" data-src="${window.fusionEmbed(p.fusion)}" data-title="${p.title}, interactive 3D model"></div>`;
  } else if (p.stl) {
    stage.hidden = false;
    $('[data-stage-bar]').innerHTML = `<span><b>${p.shortTitle || p.title}</b> · interactive 3D model</span><span>${(p.facts && p.facts.Software) || ''}</span>`;
    $('[data-stage-body]').innerHTML =
      `<div class="viewer" data-stl="${p.stl}" data-title="${p.title}, interactive 3D model"></div>`;
    // if the 3D viewer can't start on this device, show the render instead of an empty box
    setTimeout(() => {
      const v = document.querySelector('.viewer[data-stl]');
      if (v && !v.classList.contains('viewer--stl')) {
        v.innerHTML = p.image
          ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:contain;background:#eceef1">`
          : '<div class="viewer__status">The 3D model couldn’t load on this device.</div>';
      }
    }, 8000);
  } else if (p.image) {
    stage.hidden = false;
    $('[data-stage-bar]').innerHTML = `<span><b>${p.shortTitle || p.title}</b>${p.imageCaption ? ` · ${p.imageCaption}` : ''}</span>`;
    $('[data-stage-body]').innerHTML = `<img src="${p.image}" alt="${p.title}">`;
  }

  $('[data-stats]').innerHTML = (p.stats || []).map((s) =>
    `<div class="stat"><b>${s.value}</b><span>${s.label}</span></div>`).join('');

  $('[data-story]').innerHTML = (p.story || []).map((s) => {
    const fig = s.figure
      ? `<figure class="story__fig"><img src="${s.figure.src}" alt="${s.figure.caption || ''}" loading="lazy">${s.figure.caption ? `<figcaption>${s.figure.caption}</figcaption>` : ''}</figure>`
      : '';
    const callouts = s.callouts
      ? `<div class="callouts">${s.callouts.map((c) => `<div class="callout"><b>${c.value}</b><span>${c.label}</span></div>`).join('')}</div>`
      : '';
    const table = s.table
      ? `<div class="compare"><table>
          <thead><tr>${s.table.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
          <tbody>${s.table.rows.map((r, i) => `<tr${i === 0 ? ' class="is-best"' : ''}>
            <th scope="row">${r[0]}</th><td><span class="verdict verdict--${i}">${r[1]}</span></td><td>${r[2]}</td></tr>`).join('')}</tbody>
        </table></div>`
      : '';
    return `<section><h2>${s.heading}</h2><div>${s.paragraphs.map((t) => `<p>${t}</p>`).join('')}${callouts}${table}${fig}</div></section>`;
  }).join('');

  $('[data-gallery]').innerHTML = (p.gallery || []).map((g) =>
    `<figure><img src="${g.src}" alt="${g.caption || ''}" loading="lazy">${g.caption ? `<figcaption>${g.caption}</figcaption>` : ''}</figure>`).join('');

  if (list.length > 1) {
    const next = list[(index + 1) % list.length];
    $('[data-next]').innerHTML = `
      <a href="project.html#${encodeURIComponent(next.id)}">
        <div><p class="label">Next project</p><p class="next__title">${next.title}</p></div>
        <span class="card__arrow"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></span>
      </a>`;
  }
})();
