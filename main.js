/* ==========================================================================
   Ribbit.io - Apple Design & 60FPS Creative Motion Engine
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Live Frog Mood Status
   -------------------------------------------------------------------------- */
const moods = [
  { emoji: '😄', label: 'Happy', color: '#059669' },
  { emoji: '🪷', label: 'Calm',  color: '#0d9488' },
  { emoji: '🍽️', label: 'Hungry', color: '#ea580c' },
  { emoji: '⚡', label: 'Hyped', color: '#10b981' },
  { emoji: '😴', label: 'Sleepy', color: '#6366f1' }
];

const moodEmojiEl = document.getElementById('moodEmoji');
const moodLabelEl = document.getElementById('moodLabel');
let moodIdx = 0;

function setMood() {
  if (!moodEmojiEl || !moodLabelEl) return;
  const m = moods[moodIdx % moods.length];
  moodEmojiEl.textContent = m.emoji;
  moodLabelEl.textContent = m.label;
  moodLabelEl.style.color = m.color;
  moodIdx++;
}

setMood();
setInterval(setMood, 7000);

/* --------------------------------------------------------------------------
   2. 60FPS Ambient Particle Spore Canvas (Hero Background)
   -------------------------------------------------------------------------- */
const canvas = document.getElementById('ambientCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const COUNT = 36;

  function resizeCanvas() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.2 - Math.random() * 0.45,
      alpha: 0.15 + Math.random() * 0.45,
      color: Math.random() > 0.4 ? '16, 185, 129' : '56, 189, 248'
    });
  }

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(renderParticles);
  }
  requestAnimationFrame(renderParticles);
}

/* --------------------------------------------------------------------------
   3. Apple 3D Perspective Card Tilt & Specular Light Glare
   -------------------------------------------------------------------------- */
document.querySelectorAll('.apple-tilt-card').forEach(card => {
  const glare = card.querySelector('.specular-glare');
  let isHovered = false;

  card.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  card.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle Apple-style tilt (max ±5 degrees)
    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

    if (glare) {
      glare.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
      glare.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
      glare.style.opacity = '1';
    }
  });

  card.addEventListener('mouseleave', () => {
    isHovered = false;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (glare) glare.style.opacity = '0';
  });
});

/* --------------------------------------------------------------------------
   4. Apple Tactile Magnetic Buttons
   -------------------------------------------------------------------------- */
document.querySelectorAll('.apple-magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px)';
  });
});

/* --------------------------------------------------------------------------
   5. Biological Frog Animation Dynamics (Eye Tracking + Blinking + Leap)
   -------------------------------------------------------------------------- */
const pupilLeft = document.getElementById('heroPupilLeft');
const pupilRight = document.getElementById('heroPupilRight');
const heroFrogSvg = document.querySelector('#heroFrogClick svg');

if (pupilLeft && pupilRight && heroFrogSvg) {
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = heroFrogSvg.getBoundingClientRect();
    if (!rect.width) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.4;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 4.5;
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist * 0.025, maxRadius);
    targetX = Math.cos(angle) * clampedDist;
    targetY = Math.sin(angle) * clampedDist;
  });

  function updateEyes() {
    curX += (targetX - curX) * 0.14;
    curY += (targetY - curY) * 0.14;
    const transformStr = `translate(${curX}px, ${curY}px)`;
    pupilLeft.style.transform = transformStr;
    pupilRight.style.transform = transformStr;
    requestAnimationFrame(updateEyes);
  }
  requestAnimationFrame(updateEyes);
}

// Natural Eyelid Blinking
const eyelids = document.querySelectorAll('.frog-eyelid');
function scheduleBlink() {
  eyelids.forEach(el => el.classList.add('blinking'));
  setTimeout(() => {
    eyelids.forEach(el => el.classList.remove('blinking'));
  }, 160);
  const nextTime = 3200 + Math.random() * 3800;
  setTimeout(scheduleBlink, nextTime);
}
setTimeout(scheduleBlink, 2500);

// Hero Frog Spring Leap
const heroFrog = document.getElementById('heroFrogClick');
if (heroFrog) {
  heroFrog.addEventListener('click', () => {
    heroFrog.classList.remove('apple-jumping');
    void heroFrog.offsetWidth;
    heroFrog.classList.add('apple-jumping');
    croak({ freq: 850, dur: 0.1, vol: 0.25 });
  });
}

/* --------------------------------------------------------------------------
   6. 60FPS Apple Siri / Voice Memos Live Waveform Canvas
   -------------------------------------------------------------------------- */
const waveCanvas = document.getElementById('audioWaveformCanvas');
let boostWaveFunc = null;

if (waveCanvas) {
  const wctx = waveCanvas.getContext('2d');
  let wavePhase = 0;
  let waveIntensity = 0.2; // idle breathing amplitude
  let targetIntensity = 0.2;

  function renderWave() {
    if (!waveCanvas.parentElement) return;
    const w = waveCanvas.width = waveCanvas.parentElement.offsetWidth;
    const h = waveCanvas.height = 64;
    wctx.clearRect(0, 0, w, h);

    waveIntensity += (targetIntensity - waveIntensity) * 0.07;
    wavePhase += 0.04 + waveIntensity * 0.06;

    // Render 3 layered harmonic sine waves with specular glow
    const layers = [
      { color: 'rgba(16, 185, 129, 0.9)', amp: 20 * waveIntensity, freq: 0.018, offset: 0, lineWidth: 2.5 },
      { color: 'rgba(56, 189, 248, 0.7)', amp: 14 * waveIntensity, freq: 0.026, offset: 1.4, lineWidth: 1.8 },
      { color: 'rgba(5, 150, 105, 0.5)', amp: 8 * waveIntensity, freq: 0.034, offset: 2.8, lineWidth: 1.2 }
    ];

    layers.forEach(layer => {
      wctx.beginPath();
      wctx.lineWidth = layer.lineWidth;
      wctx.strokeStyle = layer.color;
      wctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
      wctx.shadowBlur = 6;
      for (let x = 0; x < w; x++) {
        // Window function (taper at edges)
        const envelope = Math.sin((x / w) * Math.PI);
        const y = h / 2 + Math.sin(x * layer.freq + wavePhase + layer.offset) * layer.amp * envelope;
        if (x === 0) wctx.moveTo(x, y);
        else wctx.lineTo(x, y);
      }
      wctx.stroke();
    });

    requestAnimationFrame(renderWave);
  }
  requestAnimationFrame(renderWave);

  boostWaveFunc = (intensity = 0.95, duration = 1200) => {
    targetIntensity = intensity;
    setTimeout(() => { targetIntensity = 0.2; }, duration);
  };
}

/* --------------------------------------------------------------------------
   7. Web Audio Synthesizer Choir
   -------------------------------------------------------------------------- */
let actx = null;

function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!actx) actx = new AC();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}

function croak(opts = {}) {
  const ctx = audio();
  if (!ctx) return;
  if (boostWaveFunc) boostWaveFunc(opts.boost || 0.9, opts.durWave || 1000);

  const freq = opts.freq || 900;
  const dur = opts.dur || 0.09;
  const vol = opts.vol || 0.3;
  const pan = opts.pan || 0;
  const gap = opts.gap || 0.05;
  const t0 = ctx.currentTime + (opts.t || 0);
  const syllables = [
    { f: freq * 1.2, d: dur, g: vol, s: 0 },
    { f: freq * 0.78, d: dur * 1.6, g: vol * 1.25, s: dur + gap }
  ];

  syllables.forEach(syl => {
    const start = t0 + syl.s;
    ['sawtooth', 'triangle'].forEach((type, idx) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(syl.f * (1 + idx * 0.04), start);
      osc.frequency.exponentialRampToValueAtTime(syl.f * 0.4, start + syl.d);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(syl.g * (idx ? 0.5 : 1), start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + syl.d);
      osc.connect(gain);
      let dest = gain;
      if (idx === 0 && pan !== 0 && ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.value = pan;
        gain.connect(panner);
        dest = panner;
      }
      dest.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + syl.d + 0.05);
    });
  });
}

const soundActions = {
  smallFrog: () => croak({ freq: 1000, dur: 0.07, vol: 0.2, gap: 0.04, boost: 0.7, durWave: 700 }),
  bigFrog: () => croak({ freq: 170, dur: 0.24, vol: 0.5, pan: -0.3, gap: 0.12, boost: 1.1, durWave: 1200 }),
  chorusBtn: () => {
    if (boostWaveFunc) boostWaveFunc(1.3, 2000);
    for (let n = 0; n < 7; n++) {
      croak({
        freq: 140 + Math.random() * 980,
        dur: 0.06 + Math.random() * 0.2,
        vol: 0.12 + Math.random() * 0.3,
        pan: Math.random() * 2 - 1,
        gap: 0.04 + Math.random() * 0.06,
        t: n * 0.18 + Math.random() * 0.05,
        boost: 1.2,
        durWave: 1800
      });
    }
  }
};

Object.keys(soundActions).forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', () => {
    el.classList.add('playing');
    soundActions[id]();
    setTimeout(() => el.classList.remove('playing'), 750);
  });
});

/* --------------------------------------------------------------------------
   8. Instant Croak Generator
   -------------------------------------------------------------------------- */
const ribbitBtn = document.getElementById("ribbitBtn");
const ribbitOut = document.getElementById("ribbitOut");
const frogLines = [
  '"Ribbit! (Roughly translated: more flies, please)"',
  '"CROOOAK! High-velocity leap primed and ready."',
  'Fun fact: Frogs push their food down with their eyeballs!',
  'Fun fact: A group of frogs is officially called an "army" 🫡',
  'Fun fact: The Alaskan wood frog can freeze 65% solid all winter and hop away in spring!',
  'Fun fact: Frogs drink water through their belly skin, not their mouths!',
  '"Gribbit-gribbit! Zero storage limits on this lily pad."'
];
let lineIdx = 0;

if (ribbitBtn && ribbitOut) {
  ribbitBtn.addEventListener("click", () => {
    const line = frogLines[lineIdx++ % frogLines.length];
    ribbitOut.textContent = line;
    croak({ freq: 700 + Math.random() * 300, dur: 0.1, vol: 0.3, boost: 0.85, durWave: 800 });
  });
}

/* --------------------------------------------------------------------------
   9. Framer-Grade Scroll Entrance Revealer
   -------------------------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal-on-scroll');
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-revealed'));
}

/* --------------------------------------------------------------------------
   10. 60FPS Animated Number Counters (easeOutExpo)
   -------------------------------------------------------------------------- */
const counterEls = document.querySelectorAll('.stat-counter');
if ('IntersectionObserver' in window) {
  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        animateCounter(el, 0, target, 1200);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterEls.forEach(el => counterObs.observe(el));
}

function animateCounter(el, start, end, duration) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.round(start + (end - start) * ease);
    el.textContent = String(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = String(end);
  }
  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   11. Interactive Pond Fly-Catching Game Arena
   -------------------------------------------------------------------------- */
const pond = document.getElementById('pond');
const frogEl = document.getElementById('gameFrog');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const missEl = document.getElementById('miss');
const msgEl = document.getElementById('pondMsg');
const overlay = document.getElementById('overlay');
const finalScoreEl = document.getElementById('finalScore');
const newHighEl = document.getElementById('newHigh');
const restartBtn = document.getElementById('restart');

const HIGH_KEY = 'frogHighScore';
let high = parseInt(localStorage.getItem(HIGH_KEY) || '0', 10) || 0;
if (bestEl) bestEl.textContent = String(high);

let state = 'idle';
let score = 0;
let misses = 0;
let flies = [];
let spawnTimer = null;
let lastT = 0;
let jumpUntil = 0;
let raf = null;

function updateHud() {
  if (scoreEl) scoreEl.textContent = String(score);
  if (missEl) missEl.textContent = String(misses);
}

function spawnFly() {
  if (!pond) return;
  const w = pond.clientWidth;
  flies.push({
    el: null,
    x: 30 + Math.random() * (w - 60),
    y: -34,
    speed: 75 + Math.random() * 110,
    sway: Math.random() * Math.PI * 2,
    swayAmp: 12 + Math.random() * 18
  });
  const f = flies[flies.length - 1];
  f.el = document.createElement('div');
  f.el.className = 'pond-fly';
  f.el.textContent = Math.random() < 0.2 ? '🦟' : '🪰';
  f.el.style.left = f.x + 'px';
  f.el.style.top = f.y + 'px';
  pond.appendChild(f.el);
}

function scheduleSpawn() {
  spawnTimer = setTimeout(() => {
    if (state !== 'running') return;
    spawnFly();
    scheduleSpawn();
  }, 700 + Math.random() * 900);
}

function catchPop(x, y, txt) {
  if (!pond) return;
  const p = document.createElement('div');
  p.className = 'catch-pop';
  p.textContent = txt;
  p.style.left = x + 'px';
  p.style.top = y + 'px';
  pond.appendChild(p);
  setTimeout(() => p.remove(), 750);
}

function gameOver() {
  state = 'over';
  clearTimeout(spawnTimer);
  flies.forEach(f => f.el && f.el.remove());
  flies = [];
  const isNewHigh = score > high;
  if (isNewHigh) {
    high = score;
    localStorage.setItem(HIGH_KEY, String(high));
    if (bestEl) bestEl.textContent = String(high);
  }
  if (finalScoreEl) finalScoreEl.textContent = String(score);
  if (newHighEl) {
    newHighEl.textContent = isNewHigh ? '🏆 New High Score!' : 'Best: ' + high;
    newHighEl.style.color = isNewHigh ? '#ff8b06' : '#86868b';
  }
  if (overlay) overlay.style.display = 'flex';
}

function startGame() {
  score = 0;
  misses = 0;
  flies.forEach(f => f.el && f.el.remove());
  flies = [];
  if (pond) {
    pond.querySelectorAll('.ripple').forEach(r => r.remove());
    pond.querySelectorAll('.catch-pop').forEach(p => p.remove());
  }
  if (overlay) overlay.style.display = 'none';
  if (msgEl) msgEl.style.display = 'none';
  state = 'running';
  updateHud();
  lastT = performance.now();
  jumpUntil = 0;
  scheduleSpawn();
  if (!raf) raf = requestAnimationFrame(loop);
}

function jump() {
  if (!frogEl) return;
  frogEl.classList.remove('apple-jumping');
  void frogEl.offsetWidth;
  frogEl.classList.add('apple-jumping');
  jumpUntil = performance.now() + 680;
  croak({ freq: 920, dur: 0.08, vol: 0.2 });
}

function loop(now) {
  if (state !== 'running') { raf = null; return; }
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;

  if (!pond || !frogEl) return;
  const pondRect = pond.getBoundingClientRect();
  const jumping = now < jumpUntil;
  let zone = null;
  if (jumping) {
    const fr = frogEl.getBoundingClientRect();
    zone = {
      left: fr.left - pondRect.left - 60,
      right: fr.right - pondRect.left + 60,
      top: fr.top - pondRect.top - 74,
      bottom: fr.bottom - pondRect.top + 8
    };
  }

  const h = pond.clientHeight;
  for (let i = flies.length - 1; i >= 0; i--) {
    const f = flies[i];
    f.sway += dt * 3.2;
    f.x += Math.sin(f.sway) * f.swayAmp * dt;
    f.y += f.speed * dt;
    if (f.el) {
      f.el.style.left = f.x + 'px';
      f.el.style.top = f.y + 'px';
    }

    const fx = f.x + 17;
    const fy = f.y + 17;
    if (jumping && zone && fy > zone.top && fy < zone.bottom && fx > zone.left && fx < zone.right) {
      catchPop(fx, f.y + 6, '+1');
      if (f.el) f.el.remove();
      flies.splice(i, 1);
      score++;
      updateHud();
    } else if (fy > h - 6) {
      if (f.el) f.el.remove();
      flies.splice(i, 1);
      misses++;
      updateHud();
      if (misses >= 3) gameOver();
    }
  }

  if (state === 'running') raf = requestAnimationFrame(loop);
  else raf = null;
}

if (frogEl) {
  frogEl.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    if (state === 'idle') startGame();
    if (state === 'running') jump();
  });
}

if (restartBtn) {
  restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
  });
}

if (pond) {
  pond.addEventListener('pointerdown', (e) => {
    if (state === 'over') return;
    if (state === 'idle') { startGame(); return; }
    if (e.target.closest('#gameFrog, .pond-pad, .hud, #overlay, #pondMsg, .pond-fly')) return;
    const r = pond.getBoundingClientRect();
    const ring = document.createElement('div');
    ring.className = 'ripple';
    ring.style.left = (e.clientX - r.left) + 'px';
    ring.style.top = (e.clientY - r.top) + 'px';
    pond.appendChild(ring);
    setTimeout(() => ring.remove(), 900);
  });
}

// Lily pads bob on click
document.querySelectorAll('.pond-pad').forEach(pad => {
  pad.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    pad.classList.remove('bobbing');
    void pad.offsetWidth;
    pad.classList.add('bobbing');
  });
  pad.addEventListener('animationend', () => pad.classList.remove('bobbing'));
});

/* --------------------------------------------------------------------------
   12. Interactive Amphibian Quiz Engine
   -------------------------------------------------------------------------- */
const quizData = [
  { q: "How many species of frogs and toads inhabit the Earth?", opts: ["~1,000", "~3,500", "~7,000", "~15,000"], ans: 2 },
  { q: "What anatomical feature do frogs push downward to swallow food?", opts: ["Tongue muscle", "Eyeballs", "Forearms", "Palate ridge"], ans: 1 },
  { q: "Which cold-climate frog freezes solid during winter and survives?", opts: ["Tree frog", "Alaskan Wood frog", "Bullfrog", "Poison dart frog"], ans: 1 },
  { q: "How far can an athletic rocket frog jump in a single bound?", opts: ["~2 meters", "~4 meters", "~7 meters", "~10 to 12 meters"], ans: 3 },
  { q: "What is an organized group of frogs officially called?", opts: ["A pod", "A flock", "An army", "A colony"], ans: 2 },
  { q: "How do adult frogs absorb the vast majority of their water?", opts: ["Through mouth gulps", "Through belly skin", "By condensation", "They don't drink"], ans: 1 }
];

let quizIdx = 0, quizScore = 0;
let quizQuestions = [];

const quizStartView = document.getElementById('quizStartView');
const quizBox = document.getElementById('quizBox');
const quizStart = document.getElementById('quizStart');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizNext = document.getElementById('quizNext');
const quizProgress = document.getElementById('quizProgress');
const quizProgressBar = document.getElementById('quizProgressBar');
const quizResult = document.getElementById('quizResult');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

if (quizStart) {
  quizStart.addEventListener('click', () => {
    quizIdx = 0;
    quizScore = 0;
    quizQuestions = shuffle(quizData).slice(0, 5);
    if (quizStartView) quizStartView.style.display = 'none';
    if (quizBox) quizBox.style.display = 'block';
    if (quizResult) quizResult.style.display = 'none';
    showQuestion();
  });
}

function showQuestion() {
  const total = 5;
  if (quizProgress) quizProgress.textContent = `Question ${quizIdx + 1} of ${total}`;
  if (quizProgressBar) quizProgressBar.style.width = `${((quizIdx + 1) / total) * 100}%`;
  const q = quizQuestions[quizIdx];
  if (quizQuestion) quizQuestion.textContent = q.q;
  if (quizOptions) quizOptions.innerHTML = '';
  if (quizFeedback) quizFeedback.textContent = '';
  if (quizNext) quizNext.style.display = 'none';

  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'apple-magnetic-btn w-full text-left p-4 rounded-2xl bg-white border border-[#dde5ed] hover:border-[#10b981] hover:-translate-y-0.5 transition-all text-sm font-medium text-[#1d1d1f] flex items-center gap-3 shadow-sm';
    btn.innerHTML = `<span class="w-6 h-6 rounded-full bg-[#edf1f4] flex items-center justify-center text-xs font-mono font-bold text-[#86868b] flex-shrink-0">${String.fromCharCode(65 + i)}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => handleQuizAnswer(i, q.ans, btn));
    if (quizOptions) quizOptions.appendChild(btn);
  });
}

function handleQuizAnswer(chosen, correct, clickedBtn) {
  const q = quizQuestions[quizIdx];
  const buttons = quizOptions ? quizOptions.querySelectorAll('button') : [];
  buttons.forEach((b, i) => {
    b.style.pointerEvents = 'none';
    if (i === correct) {
      b.className = 'w-full text-left p-4 rounded-2xl bg-[#ecfdf5] border-2 border-[#10b981] text-sm font-semibold text-[#065f46] flex items-center gap-3 shadow-sm';
    }
    if (i === chosen && chosen !== correct) {
      b.className = 'w-full text-left p-4 rounded-2xl bg-[#fef2f2] border-2 border-[#f51c23] text-sm font-semibold text-[#991b1b] flex items-center gap-3 shadow-sm';
    }
  });

  if (chosen === correct) {
    quizScore++;
    if (quizFeedback) {
      quizFeedback.textContent = '✅ Correct! High five (or webbed foot).';
      quizFeedback.className = 'text-sm font-semibold text-[#10b981] min-h-[28px] mb-4';
    }
    croak({ freq: 1100, dur: 0.08, vol: 0.25 });
  } else {
    if (quizFeedback) {
      quizFeedback.textContent = `❌ Not quite — the answer is: ${q.opts[correct]}`;
      quizFeedback.className = 'text-sm font-semibold text-[#f51c23] min-h-[28px] mb-4';
    }
    croak({ freq: 300, dur: 0.2, vol: 0.3 });
  }

  if (quizNext) quizNext.style.display = 'inline-flex';
}

if (quizNext) {
  quizNext.addEventListener('click', () => {
    quizIdx++;
    if (quizIdx >= 5) {
      if (quizBox) quizBox.style.display = 'none';
      if (quizResult) {
        quizResult.style.display = 'block';
        const pct = Math.round((quizScore / 5) * 100);
        let badge = pct === 100 ? '🏆 Master Herpetologist' : pct >= 80 ? '🐸 Certified Frog Naturalist' : '🌱 Emerging Tadpole';
        quizResult.innerHTML = `
          <div class="apple-glass inline-block p-6 rounded-3xl border border-white/80 shadow-md mb-6 max-w-sm">
            <span class="text-4xl block mb-2">${pct >= 80 ? '🎉' : '📚'}</span>
            <div class="font-display text-2xl font-bold text-[#1d1d1f] mb-1">Score: ${quizScore}/5 (${pct}%)</div>
            <div class="text-xs font-mono font-bold text-[#10b981] uppercase tracking-wider mb-2">${badge}</div>
            <p class="text-xs text-[#86868b]">You've officially tested your amphibian biological knowledge.</p>
          </div>
          <br>
          <button class="apple-magnetic-btn px-8 py-3 rounded-full text-sm font-semibold text-white bg-[#1d1d1f] hover:bg-black hover:-translate-y-0.5 transition-all shadow-md" onclick="location.reload()">
            Hop Again ↻
          </button>
        `;
      }
      return;
    }
    showQuestion();
  });
}

/* --------------------------------------------------------------------------
   13. Interactive Monthly/Yearly Billing Toggle
   -------------------------------------------------------------------------- */
const billingToggle = document.getElementById('billingToggle');
const billingCircle = document.getElementById('billingCircle');
const monthlyLabel = document.getElementById('monthlyLabel');
const yearlyLabel = document.getElementById('yearlyLabel');
const starterPrice = document.getElementById('starterPrice');
const starterPeriod = document.getElementById('starterPeriod');
const agencyPrice = document.getElementById('agencyPrice');
const agencyPeriod = document.getElementById('agencyPeriod');

let isYearlyBilling = false;

function applyBilling() {
  if (isYearlyBilling) {
    if (billingCircle) billingCircle.className = 'w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 translate-x-6';
    if (starterPrice) starterPrice.textContent = '$29';
    if (starterPeriod) starterPeriod.textContent = '/year';
    if (agencyPrice) agencyPrice.textContent = '$290';
    if (agencyPeriod) agencyPeriod.textContent = '/year';
    if (yearlyLabel) yearlyLabel.className = 'text-[15px] font-semibold text-[#1d1d1f]';
    if (monthlyLabel) monthlyLabel.className = 'text-[15px] font-medium text-[#86868b] cursor-pointer';
  } else {
    if (billingCircle) billingCircle.className = 'w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 translate-x-0';
    if (starterPrice) starterPrice.textContent = '$5';
    if (starterPeriod) starterPeriod.textContent = '/month';
    if (agencyPrice) agencyPrice.textContent = '$29';
    if (agencyPeriod) agencyPeriod.textContent = '/month';
    if (monthlyLabel) monthlyLabel.className = 'text-[15px] font-semibold text-[#1d1d1f]';
    if (yearlyLabel) yearlyLabel.className = 'text-[15px] font-medium text-[#86868b] cursor-pointer';
  }
}

if (billingToggle) {
  billingToggle.addEventListener('click', () => {
    isYearlyBilling = !isYearlyBilling;
    applyBilling();
  });
}

if (monthlyLabel) {
  monthlyLabel.addEventListener('click', () => {
    isYearlyBilling = false;
    applyBilling();
  });
}

const yearlyWrapper = document.getElementById('yearlyWrapper');
if (yearlyWrapper) {
  yearlyWrapper.addEventListener('click', () => {
    isYearlyBilling = true;
    applyBilling();
  });
}

/* --------------------------------------------------------------------------
   14. FAQ Accordion Logic with Smooth 60FPS Grid Slide
   -------------------------------------------------------------------------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-btn');
  const grid = item.querySelector('.faq-grid-content');
  const icon = item.querySelector('.faq-icon');
  if (!btn || !grid || !icon) return;

  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      btn.setAttribute('aria-expanded', 'false');
      grid.classList.remove('is-open');
      icon.classList.remove('rotate-45', 'bg-[#10b981]', 'text-white');
      icon.classList.add('bg-[#edf1f4]', 'text-[#1d1d1f]');
    } else {
      btn.setAttribute('aria-expanded', 'true');
      grid.classList.add('is-open');
      icon.classList.add('rotate-45', 'bg-[#10b981]', 'text-white');
      icon.classList.remove('bg-[#edf1f4]', 'text-[#1d1d1f]');
    }
  });
});
