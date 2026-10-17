'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('button.mobile-nav');
  if (menuButton) {
    const menu = document.createElement('nav');
    menu.className = 'border-b border-border bg-card px-6 py-5 flex flex-col gap-5';
    menu.setAttribute('aria-label', 'Navigation mobile');
    menu.hidden = true;
    document.querySelectorAll('.desktop-nav a.nav-link').forEach(link => menu.append(link.cloneNode(true)));
    document.querySelector('.site-header').after(menu);
    menuButton.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
      menuButton.setAttribute('aria-expanded', String(!menu.hidden));
      menuButton.setAttribute('aria-label', menu.hidden ? 'Ouvrir le menu' : 'Fermer le menu');
    });
  }
  document.querySelectorAll('.property-card button').forEach(button => {
    button.addEventListener('click', () => {
      const saved = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', saved ? 'Retirer des favoris' : 'Ajouter aux favoris');
      const icon = button.querySelector('svg');
      if (icon) { icon.classList.toggle('fill-primary', saved); icon.classList.toggle('text-primary', saved); }
    });
  });
  const search = document.querySelector('.search-box');
  if (search) search.addEventListener('submit', event => {
    event.preventDefault();
    const params = new URLSearchParams();
    ['operation', 'district', 'type'].forEach(key => params.set(key, document.getElementById(key).value));
    window.location.href = 'biens.html?' + params.toString();
  });
  const count = document.getElementById('result-count');
  if (count) {
    const params = new URLSearchParams(window.location.search);
    const keys = ['operation', 'district', 'type'];
    keys.forEach(key => {
      const select = document.getElementById(key);
      const value = params.get(key);
      if (value && Array.from(select.options).some(option => option.value === value)) select.value = value;
      select.addEventListener('change', filter);
    });
    function filter() {
      let visible = 0;
      document.querySelectorAll('.property-card').forEach(card => {
        const match = keys.every(key => {
          const value = document.getElementById(key).value;
          return value.startsWith('Tous les ') || value === card.dataset[key];
        });
        card.hidden = !match;
        if (match) visible++;
      });
      count.textContent = `${visible} inspiration${visible > 1 ? 's' : ''} immobilière${visible > 1 ? 's' : ''}`;
      document.getElementById('empty-results').hidden = visible !== 0;
    }
    filter();
  }
  const contact = document.querySelector('form:not(.search-box)');
  if (contact && document.getElementById('name')) contact.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const project = document.getElementById('project').value;
    const message = document.getElementById('message').value;
    const text = `Bonjour Caribi Group, je m’appelle ${name}. Mon projet : ${project}. ${message}`;
    window.open('https://wa.me/212661282641?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  });
});
