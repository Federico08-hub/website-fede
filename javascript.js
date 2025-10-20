(function(){
  const ul = document.querySelector('.card-list');
  if(!ul) return;
  ul.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mouseenter', ()=> ul.classList.add('paused'));
    card.addEventListener('mouseleave', ()=> ul.classList.remove('paused'));
    // accessibility: pause on keyboard focus
    card.addEventListener('focusin', ()=> ul.classList.add('paused'));
    card.addEventListener('focusout', ()=> ul.classList.remove('paused'));
  });
})();
document.addEventListener('DOMContentLoaded', () => {
  const ul = document.querySelector('.card-list');
  const descriptions = document.querySelectorAll('.card-desc');
  console.log('JS loaded, card-list found?', !!ul, 'descriptions:', descriptions.length);

  if (!ul) {
    console.error('Nessun .card-list trovato. Verifica il selettore e che lo script sia caricato dopo il DOM.');
    return;
  }

  function hideAll() {
    descriptions.forEach(d => {
      d.classList.remove('visible');
      d.setAttribute('aria-hidden', 'true');
    });
  }

 // ...existing code...
ul.addEventListener('click', (e) => {
  // trova la card o il link che è stato cliccato
  const card = e.target.closest('.card');
  const link = e.target.closest('a');

  // cerca data-target prima sulla card, poi sull'a (fallback)
  const id = (card && card.dataset.target) || (link && link.dataset.target);

  if (!id) {
    // nessun target: lascia comportamento di default (es. link normale)
    return;
  }

  // evita che l'hash cambi nella URL quando gestiamo l'apertura via JS
  e.preventDefault();

  const target = document.getElementById(id);
  if (!target) {
    console.warn('Nessun elemento trovato con id:', id);
    return;
  }

  // toggle: mostra solo il box corrispondente
  const already = target.classList.contains('visible');
  descriptions.forEach(d => { d.classList.remove('visible'); d.setAttribute('aria-hidden','true'); });
  if (!already) {
    target.classList.add('visible');
    target.setAttribute('aria-hidden','false');
    target.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
});
// ...existing code...

  // nascondi quando la descrizione è completamente fuori viewport
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (el.classList.contains('visible') && entry.intersectionRatio === 0) {
          el.classList.remove('visible');
          el.setAttribute('aria-hidden', 'true');
          console.log('Descrizione nascosta da IntersectionObserver:', el.id);
        }
      });
    }, { threshold: [0, 0.01] });
    descriptions.forEach(d => io.observe(d));
  } else {
    window.addEventListener('scroll', () => {
      descriptions.forEach(d => {
        if (!d.classList.contains('visible')) return;
        const r = d.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) {
          d.classList.remove('visible');
          d.setAttribute('aria-hidden', 'true');
          console.log('Descrizione nascosta da scroll fallback:', d.id);
        }
      });
    });
  }
});



let data={
  italian:{
    titoloEducazione: "EDUCAZIONE",
    titoloCompetenze: "COMPETENZE",
    titoloProgetti: "PROGETTI",
    titoloCertificati: "CERTIFICATI",
    titoloDocumenti: "DOCUMENTI",
    titoloSuDiMe: "SU DI ME",
    educazione: "Testo lungo della descrizione per EDUCAZIONE...",
    competenze: "Testo lungo della descrizione per COMPETENZE...",
    progetti: "Testo lungo della descrizione per PROGETTI...",
    certificati: "Testo lungo della descrizione per CERTIFICATI...",
    documenti: "Testo lungo della descrizione per DOCUMENTI...",
    su_di_me: "Testo lungo della descrizione per SU DI ME..."
  },

  english:{
    titoloEducazione: "EDUCATION",
    titoloCompetenze: "SKILLS",
    titoloProgetti: "PROJECTS",
    titoloCertificati: "CERTIFICATES",
    titoloDocumenti: "DOCUMENTS",
    titoloSuDiMe: "ABOUT ME",
    educazione: "Long text description for EDUCATION...",
    competenze: "Long text description for SKILLS...",
    progetti: "Long text description for PROJECTS...",
    certificati: "Long text description for CERTIFICATES...",
    documenti: "Long text description for DOCUMENTS...",
    su_di_me: "Long text description for ABOUT ME..."
  }
}
function cambiaLingua(lang) {
  console.log(`Cambiando lingua a: ${lang}`);

  // Aggiorna tutti gli elementi con classi tipo .titoloEducazione, .titoloCompetenze, ecc.
  for (let key in data[lang]) {
    const el = document.querySelector(`.${key}`);
    if (el) {
      const span = el.querySelector("span");
      if (span) {
        span.textContent = data[lang][key];
      }
    }
  }

  // Aggiorna i titoli nei <h2> e nei link <a>
  const titoloElements = document.querySelectorAll('[class^="titolo"]');
  titoloElements.forEach(el => {
    const span = el.querySelector("span");
    const className = el.className;
    if (span && data[lang][className]) {
      span.textContent = data[lang][className];
    }
  });

  // Aggiorna le descrizioni nei <p> usando data-key
  const descrizioni = document.querySelectorAll('p[data-key]');
  descrizioni.forEach(p => {
    const key = p.dataset.key;
    if (key && data[lang][key]) {
      p.textContent = data[lang][key];
    }
  });

  console.log(`Lingua cambiata a: ${lang}`);
}


let currentLang = 'italian'; // lingua iniziale

document.getElementById('language-toggle').addEventListener('click', () => {
  // Alterna tra italiano e inglese
  currentLang = currentLang === 'italian' ? 'english' : 'italian';

  // Cambia il testo del bottone
  document.getElementById('language-toggle').textContent = currentLang === 'italian' ? 'ITA' : 'ENG';

  // Applica la lingua
  cambiaLingua(currentLang);
});

