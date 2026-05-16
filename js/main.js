/**
 * INMOPERU — JavaScript Principal
 * Archivo: js/main.js
 *
 * Funciones incluidas:
 * 1. Menú hamburguesa (móvil)
 * 2. Cerrar menú al hacer clic en un enlace
 * 3. Animación de aparición al hacer scroll (Intersection Observer)
 * 4. Navbar opaco al hacer scroll hacia abajo
 * 5. Contador animado de las cifras de confianza
 * 6. WhatsApp: mensaje personalizado según el lote
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────
     1. MENÚ HAMBURGUESA (para móvil)
     Abre/cierra el menú al pulsar el ícono ≡
  ────────────────────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('abierto');
      // Cambia ícono: ≡ / ✕
      menuToggle.textContent = navLinks.classList.contains('abierto') ? '✕' : '☰';
    });
  }


  /* ──────────────────────────────────────────
     2. CERRAR MENÚ AL NAVEGAR
     Cuando hacen clic en un enlace del menú,
     se cierra automáticamente en móvil
  ────────────────────────────────────────── */
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        navLinks.classList.remove('abierto');
        if (menuToggle) menuToggle.textContent = '☰';
      });
    });
  }


  /* ──────────────────────────────────────────
     3. ANIMACIÓN AL HACER SCROLL
     Los elementos aparecen suavemente cuando
     el usuario los ve en pantalla.
     
     CÓMO USAR: Agrega la clase "animar" a
     cualquier elemento en el HTML para que
     aparezca con animación al hacer scroll.
     Ejemplo: <div class="lote-card animar">
  ────────────────────────────────────────── */
  const elementosAnimados = document.querySelectorAll(
    '.lote-card, .bene-item, .test-card, .step-item, .hero-trust .trust-item'
  );

  // Agregar clase base de ocultamiento
  elementosAnimados.forEach(function (el, i) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease ' + (i % 3 * 0.1) + 's, transform 0.55s ease ' + (i % 3 * 0.1) + 's';
  });

  // Observer que activa la animación cuando el elemento entra en pantalla
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // solo anima una vez
      }
    });
  }, {
    threshold: 0.12, // activa cuando el 12% del elemento es visible
    rootMargin: '0px 0px -40px 0px'
  });

  elementosAnimados.forEach(function (el) {
    observer.observe(el);
  });


  /* ──────────────────────────────────────────
     4. NAVBAR: SE OSCURECE AL HACER SCROLL
     Cuando el usuario baja más de 60px,
     el navbar se vuelve más sólido y opaco.
  ────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        navbar.style.background = 'rgba(13, 17, 23, 0.98)';
        navbar.style.boxShadow  = '0 2px 20px rgba(0,0,0,0.4)';
      } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.94)';
        navbar.style.boxShadow  = 'none';
      }
    }, { passive: true });
  }


  /* ──────────────────────────────────────────
     5. CONTADOR ANIMADO
     Las cifras (500+, 12, 10 años) se animan
     contando desde 0 cuando entran en pantalla.
     
     EDITAR: si cambias los números en el HTML,
     el contador los leerá automáticamente.
  ────────────────────────────────────────── */
  function animarContador(elemento, destino, duracion) {
    var inicio = 0;
    var paso   = duracion / destino;
    var timer  = setInterval(function () {
      inicio += 1;
      elemento.textContent = inicio + (elemento.dataset.sufijo || '');
      if (inicio >= destino) {
        elemento.textContent = elemento.dataset.valor; // valor final exacto
        clearInterval(timer);
      }
    }, paso);
  }

  // Agregar atributos de datos a los contadores
  // (El HTML usa texto plano; JS lee el número y anima)
  document.querySelectorAll('.trust-n').forEach(function (el) {
    var texto = el.textContent.trim();
    el.dataset.valor = texto;

    // Extraer número y sufijo
    var numero = parseInt(texto.replace(/\D/g, ''), 10);
    if (!isNaN(numero) && numero > 0) {
      el.dataset.numero = numero;
      el.textContent    = '0';

      var contadorObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animarContador(el, numero, Math.min(1500, numero * 3));
          contadorObs.unobserve(el);
        }
      }, { threshold: 0.5 });

      contadorObs.observe(el);
    }
  });


  /* ──────────────────────────────────────────
     6. WHATSAPP — TRACKING DE CLICS
     Registra en la consola qué lote consultó
     el usuario (útil para analytics futuros).
     
     EDITAR: si integras Google Analytics,
     reemplaza console.log por gtag() aquí.
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lote = btn.closest('.lote-card');
      var nombre = lote ? lote.querySelector('.lote-name')?.textContent : 'general';
      console.log('[InmoPeru] Click WhatsApp — lote: ' + nombre);

      /* Google Analytics (descomenta si usas GA4):
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click_whatsapp', {
          event_category: 'conversion',
          event_label: nombre
        });
      }
      */
    });
  });


  /* ──────────────────────────────────────────
     LISTO — Todo cargado correctamente
  ────────────────────────────────────────── */
  console.log('[InmoPeru] Página cargada correctamente ✓');

});
