/**
 * ============================================================================
 * GRUPO AAA S.A.S - CONDOMINIO CAMPESTRE CORALES DEL VIENTO
 * Master Plan Interactivo, Inspector de Lotes & Conversión WhatsApp
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initParallaxAndVideo();
  initScrollReveal();
  initMasterPlanInspector();
  initFeaturedCardsSync();
});

/* --------------------------------------------------------------------------
   1. MENÚ MOBILE RESPONSIVE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   2. CONTROL DE VIDEO ACTIVADO POR SCROLL & PARALLAX HERO
   -------------------------------------------------------------------------- */
function initParallaxAndVideo() {
  const header = document.getElementById('header');
  const parallaxBg = document.getElementById('heroParallaxBg');
  const heroSection = document.getElementById('hero');
  const heroVideo = document.getElementById('heroVideo');

  let scrollStopTimer = null;

  if (heroVideo) {
    heroVideo.pause();
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header sombra dinámica
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Parallax suave
    if (parallaxBg && scrollY < 800) {
      parallaxBg.style.transform = `translate3d(0, ${scrollY * 0.45}px, 0)`;
    }

    // Activación del Video por Scroll
    if (heroVideo) {
      const heroHeight = heroSection ? heroSection.offsetHeight : 600;

      if (scrollY < heroHeight + 100) {
        if (heroVideo.paused) {
          const playPromise = heroVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }

        // Si se detiene el scroll por más de 1.2 segundos, pausar
        clearTimeout(scrollStopTimer);
        scrollStopTimer = setTimeout(() => {
          if (!heroVideo.paused) {
            heroVideo.pause();
          }
        }, 1200);
      } else {
        // Fuera de vista: pausar
        if (!heroVideo.paused) {
          heroVideo.pause();
        }
      }
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. MASTER PLAN INTERACTIVO (Base de Datos & Inspector de Lotes)
   -------------------------------------------------------------------------- */
const lotsInventory = {
  '03': {
    code: 'LOTE #03',
    name: 'Bahía Coral · 800 m²',
    desc: 'Ubicación privilegiada en la primera franja de acceso a la playa de San Bernardo del Viento. Topografía 100% plana y lista para construir tu casa de descanso.',
    dims: '25m frente x 32m fondo',
    dist: '150 metros (2 min a pie)',
    price: '$98.000.000 COP',
    sep: '$10.000.000 COP',
    badge: '🌊 Frente a Sendero de Playa',
    image: 'assets/images/lote-mar.jpg'
  },
  '07': {
    code: 'LOTE #07',
    name: 'Brisa del Mar · 850 m²',
    desc: 'Parcela con excelente elevación natural y brisa marina constante. Vista abierta hacia la puesta de sol caribeña.',
    dims: '25m frente x 34m fondo',
    dist: '180 metros de la playa',
    price: '$112.000.000 COP',
    sep: '$12.000.000 COP',
    badge: '⭐ Vista Panorámica Abierta',
    image: 'assets/images/hero.jpg'
  },
  '12': {
    code: 'LOTE #12',
    name: 'Arrecife Dorado · 980 m²',
    desc: 'Lote esquinero VIP sobre el boulevard principal arbolado. Doble frente de acceso ideal para diseño arquitectónico de lujo.',
    dims: '28m frente x 35m fondo (Esquinero)',
    dist: '210 metros de la playa',
    price: '$128.000.000 COP',
    sep: '$15.000.000 COP',
    badge: '💎 Esquinero Exclusivo VIP',
    image: 'assets/images/lote-campestre.jpg'
  },
  '18': {
    code: 'LOTE #18',
    name: 'Club Real · 920 m²',
    desc: 'Ubicación estratégica a solo pasos del Club Social, la piscina infinita y los gazebos BBQ. Máxima comodidad para la familia.',
    dims: '26m frente x 35.3m fondo',
    dist: '240 metros (Junto al Club House)',
    price: '$119.000.000 COP',
    sep: '$12.000.000 COP',
    badge: '🏊 Junto a Piscina & Club Social',
    image: 'assets/images/amenities.jpg'
  },
  '24': {
    code: 'LOTE #24',
    name: 'Palmera Paraíso · 1.150 m²',
    desc: 'Parcela campestre de gran extensión rodeada de vegetación nativa y palmeras. Perfecta para quinta vacacional con jardín privado.',
    dims: '30m frente x 38.3m fondo',
    dist: '270 metros de la playa',
    price: '$155.000.000 COP',
    sep: '$15.000.000 COP',
    badge: '🌳 Parcela Campestre XL',
    image: 'assets/images/lifestyle.jpg'
  },
  '31': {
    code: 'LOTE #31',
    name: 'Reserva del Viento · 1.250 m²',
    desc: 'La parcela de mayor metraje y exclusividad del condominio. Máxima privacidad, silencio y vista franca a la naturaleza protegida.',
    dims: '32m frente x 39m fondo',
    dist: '190 metros de la playa',
    price: '$172.000.000 COP',
    sep: '$20.000.000 COP',
    badge: '👑 Parcela Presidencial VIP',
    image: 'assets/images/lote-mar.jpg'
  }
};

function initMasterPlanInspector() {
  const lotButtons = document.querySelectorAll('.lot-interactive-btn:not(.btn-sold)');
  const filterChips = document.querySelectorAll('.map-filter-chip');

  const inspectorImg = document.getElementById('inspectorImg');
  const inspectorBadge = document.getElementById('inspectorFloatingBadge');
  const inspectorCode = document.getElementById('inspectorLotCode');
  const inspectorName = document.getElementById('inspectorLotName');
  const inspectorDesc = document.getElementById('inspectorLotDesc');
  const inspectorDims = document.getElementById('inspectorDims');
  const inspectorDist = document.getElementById('inspectorDist');
  const inspectorPrice = document.getElementById('inspectorPrice');
  const inspectorSep = document.getElementById('inspectorSep');
  const inspectorWaBtn = document.getElementById('inspectorWaBtn');
  const inspectorPdfBtn = document.getElementById('inspectorPdfBtn');

  // Función para actualizar el visor
  window.seleccionarLote = function(lotId) {
    const lot = lotsInventory[lotId];
    if (!lot) return;

    // Resaltar en el mapa
    document.querySelectorAll('.lot-interactive-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-lot-id') === lotId) {
        btn.classList.add('active');
      }
    });

    // Actualizar imagen con suave transición
    if (inspectorImg) {
      inspectorImg.style.opacity = '0';
      setTimeout(() => {
        inspectorImg.src = lot.image;
        inspectorImg.style.opacity = '1';
      }, 150);
    }

    // Actualizar datos textuales
    if (inspectorBadge) inspectorBadge.textContent = lot.badge;
    if (inspectorCode) inspectorCode.textContent = lot.code;
    if (inspectorName) inspectorName.textContent = lot.name;
    if (inspectorDesc) inspectorDesc.textContent = lot.desc;
    if (inspectorDims) inspectorDims.textContent = lot.dims;
    if (inspectorDist) inspectorDist.textContent = lot.dist;
    if (inspectorPrice) inspectorPrice.innerHTML = `${lot.price} <small>COP</small>`;
    if (inspectorSep) inspectorSep.textContent = lot.sep;

    // Actualizar enlaces dinámicos de WhatsApp
    const waPhone = '573122384172';
    if (inspectorWaBtn) {
      const msgSep = `Hola Grupo AAA S.A.S, he revisado el Master Plan de Corales del Viento y deseo apartar el ${lot.code} - ${lot.name} (${lot.price}, separación ${lot.sep}). ¿Cuáles son los pasos a seguir con el equipo legal?`;
      inspectorWaBtn.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgSep)}`;
    }

    if (inspectorPdfBtn) {
      const msgPdf = `Hola Grupo AAA S.A.S, deseo recibir la ficha técnica oficial con plano y coordenadas del ${lot.code} - ${lot.name} en Corales del Viento.`;
      inspectorPdfBtn.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgPdf)}`;
    }
  };

  // Event listeners para cada botón de lote en el plano
  lotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lotId = btn.getAttribute('data-lot-id');
      window.seleccionarLote(lotId);
    });
  });

  // Filtros de categoría del mapa
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterType = chip.getAttribute('data-map-filter');

      lotButtons.forEach(btn => {
        const cat = btn.getAttribute('data-cat') || '';
        if (filterType === 'all' || cat.includes(filterType)) {
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        } else {
          btn.style.opacity = '0.35';
          btn.style.pointerEvents = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. SINCRONIZACIÓN DE TARJETAS DESTACADAS CON EL PLANO
   -------------------------------------------------------------------------- */
function initFeaturedCardsSync() {
  const inspectBtns = document.querySelectorAll('.btn-card-inspect');

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLot = btn.getAttribute('data-inspect-lot');
      if (targetLot && window.seleccionarLote) {
        window.seleccionarLote(targetLot);

        // Desplazar suavemente hasta el Master Plan
        const mapSection = document.getElementById('master-plan-section');
        if (mapSection) {
          mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
