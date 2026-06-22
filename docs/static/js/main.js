/* ===== GSAP 플러그인 등록 ===== */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ===== 로딩 애니메이션 ===== */
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.querySelector('.loader-fill');
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) { progress = 100; clearInterval(tick); }
    fill.style.width = progress + '%';

    if (progress === 100) {
      setTimeout(() => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => { loader.remove(); initAll(); }
        });
      }, 300);
    }
  }, 60);
})();

/* ===== 전체 초기화 ===== */
function initAll() {
  initCursor();
  initHeader();
  initHero();
  initWorksHorizontal();
  initParallax();
  initSplitText();
  initReveal();
  initAboutStats();
  initContact();
  initNavScroll();
  initToast();
  initLabParticles();
  initLabTyped();
  initLabVanta();
  initLabCanvas();
  initLabThree();
  ScrollTrigger.refresh();
}

/* ===== 커스텀 커서 ===== */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
  });

  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .work-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ===== 헤더 스크롤 ===== */
function initHeader() {
  const header = document.getElementById('header');
  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: (self) => {
      header.classList.toggle('scrolled', self.progress > 0);
    }
  });
}

/* ===== 히어로: 입장 애니메이션 + 워터 필 스크롤 ===== */
function initHero() {
  // 1) 로더 직후 입장 - stroke 텍스트가 위로 슬라이드 인
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('#heroTitleWrap', { y: 70, opacity: 0, duration: 1.1 })
    .to('.hero-sub',  { opacity: 1, duration: 0.6 }, '-=0.55')
    .to('.hero-desc', { opacity: 1, duration: 0.6 }, '-=0.3')
    .to('.hero-cta',  { opacity: 1, duration: 0.6 }, '-=0.3')
    .to('.scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.2');

  // 2) 스크롤 시 히어로 핀 + 아래서부터 물 차오르는 fill
  const fillAnim = gsap.to('#heroFill', {
    clipPath: 'inset(0% 0 0 0)',
    ease: 'none',
  });

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: '+=180%',
    pin: true,
    pinSpacing: true,
    scrub: 1.4,
    animation: fillAnim,
  });
}

/* ===== 패럴렉스 배경 ===== */
function initParallax() {
  gsap.to('#heroBg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  gsap.to('#contactBg', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    }
  });
}

/* ===== 텍스트 스플릿 리빌 (IntersectionObserver) ===== */
function initSplitText() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const charEls = entry.target.querySelectorAll('.split-char-inner');
      gsap.fromTo(charEls,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.035, ease: 'power3.out' }
      );
      io.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.split-text').forEach(el => {
    const text = el.innerHTML;
    const lines = text.split('<br>');
    el.innerHTML = lines.map(line => {
      const chars = [...line].map(ch =>
        ch === ' '
          ? ' '
          : `<span class="split-char"><span class="split-char-inner">${ch}</span></span>`
      ).join('');
      return `<span class="line-block" style="display:block;overflow:hidden">${chars}</span>`;
    }).join('');

    gsap.set(el.querySelectorAll('.split-char-inner'), { yPercent: 110 });
    io.observe(el);
  });
}

/* ===== 범용 리빌 (reveal-up, reveal-line) ===== */
function initReveal() {
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });

  gsap.utils.toArray('.reveal-line').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      duration: 0.6,
      delay: i * 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });
  });

  gsap.utils.toArray('.skill-item').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.5,
      delay: i * 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skill-list',
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });
}

/* ===== 숫자 카운트업 ===== */
function initAboutStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });
}

/* ===== 작품 갤러리 수평 스크롤 ===== */
function initWorksHorizontal() {
  const track = document.getElementById('worksTrack');
  const cards = gsap.utils.toArray('.work-card');

  if (!cards.length) return;

  /* 트랙 전체 너비 계산 */
  const getScrollWidth = () => {
    const gap = 32;
    const cardW = cards[0].offsetWidth;
    const totalW = cardW * cards.length + gap * (cards.length - 1) + 96; /* 좌우 패딩 */
    return totalW - window.innerWidth;
  };

  let st = ScrollTrigger.create({
    trigger: '#works',
    start: 'top top',
    end: () => '+=' + getScrollWidth(),
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    animation: gsap.to(track, {
      x: () => -getScrollWidth(),
      ease: 'none',
    }),
    invalidateOnRefresh: true,
  });

  /* 카드 입장 효과 */
  cards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#works',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
}

/* ===== Contact 섹션 ===== */
function initContact() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
      toggleActions: 'play none none none',
    }
  });

  tl.to('.contact-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to('.contact-btn', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .to('.contact-links', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
}

/* ===== 네비 스무스 스크롤 ===== */
function initNavScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const mailto = link.closest('a[href^="mailto"]');
    if (mailto) return;
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (target === '#' || !document.querySelector(target)) return;
      e.preventDefault();
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: target, offsetY: 0 },
        ease: 'power3.inOut',
      });
    });
  });
}

/* ===== tsParticles ===== */
function initLabParticles() {
  if (typeof tsParticles === 'undefined') return;
  const el = document.getElementById('tsparticles-mount');
  if (!el) return;

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();

    tsParticles.load('tsparticles-mount', {
      fullScreen: { enable: false },
      background: { color: 'transparent' },
      particles: {
        number: { value: 90, density: { enable: true, area: 900 } },
        color: { value: ['#38bdf8', '#818cf8', '#34d399'] },
        links: { enable: true, distance: 140, color: '#38bdf8', opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1.2, outModes: { default: 'bounce' } },
        opacity: { value: { min: 0.3, max: 0.7 } },
        size: { value: { min: 1, max: 3 } },
        shape: { type: 'circle' },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: true, mode: 'explode' },
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          explode: { count: 8 },
        },
      },
      detectRetina: true,
    });
  }, { threshold: 0.1 });

  io.observe(el);
}

/* ===== Typed.js ===== */
function initLabTyped() {
  if (typeof Typed === 'undefined') return;
  const target = document.getElementById('typed-el');
  if (!target) return;

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();

    new Typed('#typed-el', {
      strings: [
        'Front-end Developer입니다.',
        'UI/UX Designer입니다.',
        'Motion Coder입니다.',
        'Creative Developer입니다.',
        '웹을 만드는 사람입니다.',
      ],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 1800,
      startDelay: 300,
      loop: true,
      cursorChar: '|',
    });
  }, { threshold: 0.3 });

  io.observe(document.getElementById('lab-typed'));
}

/* ===== Vanta.js ===== */
function initLabVanta() {
  const mount = document.getElementById('vanta-mount');
  if (!mount || typeof VANTA === 'undefined') return;

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();

    VANTA.NET({
      el: '#vanta-mount',
      mouseControls: true,
      touchControls: true,
      color: 0x38bdf8,
      backgroundColor: 0x0a0e1a,
      points: 12,
      maxDistance: 26,
      spacing: 18,
      showDots: true,
    });
  }, { threshold: 0.1 });

  io.observe(mount);
}

/* ===== Canvas 2D 오로라 ===== */
function initLabCanvas() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let raf, t = 0;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    for (let j = 0; j < 8; j++) {
      const hue = 180 + j * 22;
      const alpha = 0.13 - j * 0.01;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,   `hsla(${hue},90%,65%,0)`);
      grad.addColorStop(0.35,`hsla(${hue},90%,65%,${alpha})`);
      grad.addColorStop(0.65,`hsla(${hue},90%,65%,${alpha * 0.7})`);
      grad.addColorStop(1,   `hsla(${hue},90%,65%,0)`);

      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 3) {
        const y = H * 0.48
          + Math.sin(x * (0.004 + j * 0.001) + t * (0.28 + j * 0.07)) * H * 0.22
          + Math.sin(x * (0.009 + j * 0.002) - t * (0.18 + j * 0.04) + j) * H * 0.1
          + Math.cos(x * 0.003 + t * 0.1 + j * 1.3) * H * 0.07;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
    t += 0.007;
    raf = requestAnimationFrame(draw);
  }

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { if (!raf) draw(); }
    else { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0.05 });
  io.observe(canvas);
}

/* ===== Three.js 와이어프레임 큐브 ===== */
function initLabThree() {
  const section = document.getElementById('lab-threejs');
  const canvas  = document.getElementById('three-canvas');
  if (!section || !canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000510, 1);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 4.5;

  /* ── 큐브 그룹 ── */
  const group = new THREE.Group();
  scene.add(group);

  /* 바깥 큐브 (흰색 엣지) */
  const SIZE = 2;
  const outerEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE, SIZE, SIZE));
  const outerMat   = new THREE.LineBasicMaterial({ color: 0xffffff });
  const outerCube  = new THREE.LineSegments(outerEdges, outerMat);
  group.add(outerCube);

  /* 중간 큐브 (60% 크기, 반투명) */
  const midEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE * 0.6, SIZE * 0.6, SIZE * 0.6));
  const midMat   = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
  const midCube  = new THREE.LineSegments(midEdges, midMat);
  group.add(midCube);

  /* 안쪽 큐브 (30% 크기, 더 연하게) */
  const inEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE * 0.3, SIZE * 0.3, SIZE * 0.3));
  const inMat   = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 });
  const inCube  = new THREE.LineSegments(inEdges, inMat);
  group.add(inCube);

  /* ── 마우스 드래그 회전 ── */
  let dragging = false;
  let px = 0, py = 0;
  let rotX = 0.4, rotY = 0.6;
  let velX = 0, velY = 0;

  const onDown = (x, y) => { dragging = true;  px = x; py = y; velX = 0; velY = 0; };
  const onUp   = ()      => { dragging = false; };
  const onMove = (x, y)  => {
    if (!dragging) return;
    const dx = (x - px) * 0.009, dy = (y - py) * 0.009;
    velX = dx; velY = dy;
    rotY += dx; rotX += dy;
    px = x; py = y;
  };

  canvas.addEventListener('mousedown',  e => onDown(e.clientX, e.clientY));
  window.addEventListener('mouseup',    onUp);
  window.addEventListener('mousemove',  e => onMove(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', e => { e.preventDefault(); onDown(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
  canvas.addEventListener('touchend',   e => { e.preventDefault(); onUp(); }, { passive: false });
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });

  /* ── 스크롤 줌 ── */
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    camera.position.z = Math.max(2, Math.min(9, camera.position.z + e.deltaY * 0.006));
  }, { passive: false });

  /* ── 리사이즈 ── */
  function resize() {
    const w = section.offsetWidth, h = section.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(section);

  /* ── 애니메이션 루프 ── */
  let raf;
  function animate() {
    raf = requestAnimationFrame(animate);

    if (!dragging) {
      velX *= 0.93; velY *= 0.93;
      rotY += velX + 0.003;   /* 자동 회전 + 관성 */
      rotX += velY;
    }

    group.rotation.x = rotX;
    group.rotation.y = rotY;

    /* 내부 큐브들은 반대 방향으로 살짝 회전 */
    midCube.rotation.y -= 0.005;
    inCube.rotation.x  += 0.007;

    renderer.render(scene, camera);
  }

  /* ── IntersectionObserver로 탭 숨김 시 중지 ── */
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { if (!raf) animate(); }
    else { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0.1 });
  io.observe(section);
}

/* ===== 토스트 ===== */
function initToast() {
  const btn = document.getElementById('mailBtn');
  const toast = document.getElementById('toast');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  });
}
