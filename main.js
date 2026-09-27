    /* ---------- 4. Live frog mood ---------- */
    const moods = [
      { emoji: '😄', label: 'Happy', color: '#ffd98e' },
      { emoji: '🪷', label: 'Calm',  color: '#a8e0d6' },
      { emoji: '🍽️', label: 'Hungry', color: '#ffb38a' },
      { emoji: '😴', label: 'Sleepy', color: '#b8c4d6' }
    ];
    const moodEmojiEl = document.getElementById('moodEmoji');
    const moodLabelEl = document.getElementById('moodLabel');
    let moodIdx = 0;
    function setMood() {
      const m = moods[moodIdx % moods.length];
      moodEmojiEl.textContent = m.emoji;
      moodLabelEl.textContent = m.label;
      moodLabelEl.style.color = m.color;
      moodIdx++;
    }
    moodEmojiEl.addEventListener('animationend', () => moodEmojiEl.classList.remove('mood-change'));
    setMood();
    setInterval(() => {
      setMood();
      moodEmojiEl.classList.remove('mood-change');
      void moodEmojiEl.offsetWidth;
      moodEmojiEl.classList.add('mood-change');
    }, 10000);

    /* ---------- 1 & 2. Frog jump game + interactive pond ---------- */
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
    bestEl.textContent = high;

    let state = 'idle';
    let score = 0;
    let misses = 0;
    let flies = [];
    let spawnTimer = null;
    let lastT = 0;
    let jumpUntil = 0;
    let raf = null;

    function updateHud() {
      scoreEl.textContent = score;
      missEl.textContent = misses;
    }

    function spawnFly() {
      const w = pond.clientWidth;
      flies.push({
        el: null,
        x: 30 + Math.random() * (w - 60),
        y: -34,
        speed: 70 + Math.random() * 120,
        sway: Math.random() * Math.PI * 2,
        swayAmp: 10 + Math.random() * 18
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
      }, 650 + Math.random() * 900);
    }

    function catchPop(x, y, txt) {
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
        bestEl.textContent = high;
      }
      finalScoreEl.textContent = score;
      newHighEl.textContent = isNewHigh ? '🏆 New high score!' : 'Best: ' + high;
      newHighEl.style.color = isNewHigh ? 'var(--sun)' : '';
      overlay.style.display = 'flex';
    }

    function startGame() {
      score = 0;
      misses = 0;
      flies.forEach(f => f.el && f.el.remove());
      flies = [];
      pond.querySelectorAll('.ripple').forEach(r => r.remove());
      pond.querySelectorAll('.catch-pop').forEach(p => p.remove());
      overlay.style.display = 'none';
      msgEl.style.display = 'none';
      state = 'running';
      updateHud();
      lastT = performance.now();
      jumpUntil = 0;
      scheduleSpawn();
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function jump() {
      frogEl.classList.remove('jumping');
      void frogEl.offsetWidth;
      frogEl.classList.add('jumping');
      jumpUntil = performance.now() + 620;
    }

    function loop(now) {
      if (state !== 'running') { raf = null; return; }
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

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
        f.el.style.left = f.x + 'px';
        f.el.style.top = f.y + 'px';

        const fx = f.x + 17;
        const fy = f.y + 17;
        if (jumping && fy > zone.top && fy < zone.bottom && fx > zone.left && fx < zone.right) {
          catchPop(fx, f.y + 6, '+1');
          f.el.remove();
          flies.splice(i, 1);
          score++;
          updateHud();
        } else if (fy > h - 6) {
          f.el.remove();
          flies.splice(i, 1);
          misses++;
          updateHud();
          if (misses >= 3) gameOver();
        }
      }

      if (state === 'running') raf = requestAnimationFrame(loop);
      else raf = null;
    }

    frogEl.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (state === 'idle') startGame();
      if (state === 'running') jump();
    });

    restartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startGame();
    });

    pond.addEventListener('pointerdown', (e) => {
      if (state === 'over') return;
      if (state === 'idle') { startGame(); return; }
      if (e.target.closest('.game-frog, .pond-pad, .hud, .overlay, .pond-msg, .pond-fly')) return;
      const r = pond.getBoundingClientRect();
      const ring = document.createElement('div');
      ring.className = 'ripple';
      ring.style.left = (e.clientX - r.left) + 'px';
      ring.style.top = (e.clientY - r.top) + 'px';
      pond.appendChild(ring);
      setTimeout(() => ring.remove(), 900);
    });

    /* lily pads bob on click */
    document.querySelectorAll('.pond-pad, .lily-pad').forEach(pad => {
      pad.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        pad.classList.remove('bobbing');
        void pad.offsetWidth;
        pad.classList.add('bobbing');
      });
      pad.addEventListener('animationend', () => pad.classList.remove('bobbing'));
    });

    /* ---------- 3. Ribbit sounds (Web Audio API) ---------- */
    let actx = null;
    function audio() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!actx) actx = new AC();
      if (actx.state === 'suspended') actx.resume();
      return actx;
    }
    function croak(opts) {
      const ctx = audio();
      if (!ctx) return;
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
          if (idx === 0 && pan !== 0) {
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
    function playSfx(fn) {
      fn();
    }
    const soundActions = {
      smallFrog: 'small',
      bigFrog: 'big',
      chorusBtn: 'chorus'
    };
    const soundDefs = {
      small: () => croak({ freq: 1000, dur: 0.07, vol: 0.2, gap: 0.04 }),
      big: () => croak({ freq: 170, dur: 0.24, vol: 0.5, pan: -0.3, gap: 0.12 }),
      chorus: () => {
        for (let n = 0; n < 7; n++) {
          croak({
            freq: 140 + Math.random() * 980,
            dur: 0.06 + Math.random() * 0.2,
            vol: 0.12 + Math.random() * 0.3,
            pan: Math.random() * 2 - 1,
            gap: 0.04 + Math.random() * 0.06,
            t: n * 0.18 + Math.random() * 0.05
          });
        }
      }
    };
    Object.keys(soundActions).forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('click', () => {
        el.classList.remove('playing');
        void el.offsetWidth;
        el.classList.add('playing');
        playSfx(soundDefs[soundActions[id]]);
        setTimeout(() => el.classList.remove('playing'), 750);
      });
    });

    /* ---------- Original ribbit button ---------- */
    const btn = document.getElementById("ribbitBtn");
    const out = document.getElementById("ribbitOut");
    const ribbits = [
      '"Ribbit!"', '"Ribbit-ribbit!"', '"CROOOAK!"',
      '"Gribbit!"', '"Ribbert-ribbert!"', '"...ribbit."', '"BIRB-BIRB!"'
    ];
    const frogFacts = [
      "Fun fact: frogs never blink — they have 3 eyelids but wave a transparent one to keep their eyes wet!",
      "Fun fact: a group of frogs is called an army. 🫡",
      "Fun fact: some frogs can survive being frozen solid during winter.",
      "Fun fact: frogs drink water through their skin, not their mouths!",
      "Fun fact: the tiny Paedophryne amauensis is smaller than a paperclip."
    ];
    let jokeIdx = 0;
    btn.addEventListener("click", () => {
      const line = (jokeIdx++ % 3 === 2)
        ? frogFacts[Math.floor(Math.random() * frogFacts.length)]
        : ribbits[Math.floor(Math.random() * ribbits.length)];
      out.textContent = line;
      out.style.animation = "none";
      void out.offsetWidth;
      out.style.animation = "pop 0.3s ease";
    });

    /* ---------- 5. Frog Quiz ---------- */
    const quizData = [
      { q: "How many species of frogs are there?", opts: ["~1,000", "~5,000", "~7,000", "~12,000"], ans: 2 },
      { q: "What do frogs use to swallow their food?", opts: ["Their tongue", "Their eyeballs", "Their hands", "Water pressure"], ans: 1 },
      { q: "Which frog can freeze solid and survive?", opts: ["Tree frog", "Wood frog", "Bullfrog", "Poison dart frog"], ans: 1 },
      { q: "How far can a rocket frog jump?", opts: ["2 meters", "~3 meters", "~5 meters", "~10-12 meters"], ans: 3 },
      { q: "What is a group of frogs called?", opts: ["A flock", "A school", "An army", "A pod"], ans: 2 },
      { q: "How do most frogs drink water?", opts: ["Through their mouth", "Through their skin", "By licking", "They don't drink"], ans: 1 },
      { q: "What is the smallest frog in the world?", opts: ["Paedophryne amauensis", "Golden frog", "Glass frog", "Poison dart frog"], ans: 0 },
      { q: "How many eyelids does a frog have?", opts: ["1", "2", "3", "4"], ans: 2 }
    ];
    let quizIdx = 0, quizScore = 0, quizDone = false;
    const quizBox = document.getElementById('quizBox');
    const quizStart = document.getElementById('quizStart');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizNext = document.getElementById('quizNext');
    const quizProgress = document.getElementById('quizProgress');
    const quizResult = document.getElementById('quizResult');

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    let quizQuestions = [];

    function startQuiz() {
      quizIdx = 0; quizScore = 0; quizDone = false;
      quizQuestions = shuffleArray([...quizData]).slice(0, 5);
      quizResult.style.display = 'none';
      quizBox.style.display = 'block';
      quizStart.style.display = 'none';
      showQuizQuestion();
    }

    function showQuizQuestion() {
      const total = 5;
      quizProgress.textContent = `Question ${quizIdx + 1} of ${total}`;
      const q = quizQuestions[quizIdx];
      quizQuestion.textContent = q.q;
      quizOptions.innerHTML = '';
      quizFeedback.textContent = '';
      quizNext.style.display = 'none';
      q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'sound-btn';
        btn.style.gridColumn = 'span 1';
        btn.style.textAlign = 'left';
        btn.style.padding = '12px 16px';
        btn.style.fontSize = '0.95rem';
        btn.innerHTML = `<span style="opacity:0.7;margin-right:8px;">${String.fromCharCode(65 + i)}</span>${opt}`;
        btn.addEventListener('click', () => answerQuiz(i, q.ans));
        quizOptions.appendChild(btn);
      });
    }

    function answerQuiz(chosen, correct) {
      const qs = quizQuestions;
      const answer = qs[quizIdx].ans;
      const buttons = quizOptions.querySelectorAll('.sound-btn');
      buttons.forEach((b, i) => {
        b.style.pointerEvents = 'none';
        if (i === answer) b.style.borderColor = 'var(--lily)';
        if (i === chosen && chosen !== answer) b.style.borderColor = '#ff6b6b';
      });
      if (chosen === answer) {
        quizScore++;
        quizFeedback.textContent = '✅ Correct!';
        quizFeedback.style.color = 'var(--lily)';
      } else {
        quizFeedback.textContent = `❌ Nope — the answer was: ${qs[quizIdx].opts[answer]}`;
        quizFeedback.style.color = '#ff6b6b';
      }
      quizNext.style.display = 'inline-block';
    }

    quizNext.addEventListener('click', () => {
      quizIdx++;
      if (quizIdx >= 5) {
        quizDone = true;
        quizBox.style.display = 'none';
        quizResult.style.display = 'block';
        const pct = Math.round((quizScore / 5) * 100);
        let msg;
        if (pct === 100) msg = '🏆 Perfect score! You\'re a frog expert!';
        else if (pct >= 80) msg = '🐸 Great job! Almost a frog expert!';
        else if (pct >= 60) msg = '👍 Not bad! A little more studying and you\'ll be a pro.';
        else msg = '📚 Keep learning! Frogs are fascinating creatures.';
        quizResult.innerHTML = `<strong>Your score: ${quizScore}/5 (${pct}%)</strong><br><span style="opacity:0.9;font-size:0.95rem;">${msg}</span>`;
        quizResult.innerHTML += ` <button class="btn" style="margin-top:10px;" onclick="location.reload()">Play again</button>`;
        return;
      }
      showQuizQuestion();
    });

    quizStart.addEventListener('click', startQuiz);

    /* ---------- 6. Dynamic pond extras: fish & dragonflies ---------- */
    const pondEl = document.getElementById('pond');

    function spawnFish() {
      if (pondEl.style.display === 'none' && document.getElementById('overlay')) return;
      const w = pondEl.clientWidth;
      const h = pondEl.clientHeight;
      const fish = document.createElement('div');
      fish.style.cssText = `position:absolute;left:${-40}px;bottom:${10 + Math.random() * (h - 60)}px;font-size:${14 + Math.random() * 10}px;opacity:0.55;pointer-events:none;z-index:1;`;
      fish.textContent = '🐟';
      pondEl.appendChild(fish);
      const speed = 20 + Math.random() * 40;
      let x = -40, dir = 1;
      const swim = () => {
        if (!pondEl.parentElement || pondEl.style.display === 'none') { fish.remove(); return; }
        x += speed * dir * 0.016;
        if (x > w + 40) { fish.remove(); return; }
        if (x < -40) dir = 1;
        fish.style.left = x + 'px';
        fish.style.transform = `scaleX(${dir})`;
        requestAnimationFrame(swim);
      };
      requestAnimationFrame(swim);
    }

    function spawnDragonfly() {
      const w = pondEl.clientWidth;
      const h = pondEl.clientHeight;
      const df = document.createElement('div');
      df.style.cssText = `position:absolute;font-size:18px;pointer-events:none;z-index:3;opacity:0.7;`;
      df.textContent = '🪰';
      df.style.left = (Math.random() * w) + 'px';
      df.style.top = (Math.random() * h * 0.5) + 'px';
      pondEl.appendChild(df);
      const start = performance.now();
      const flutter = () => {
        if (!pondEl.parentElement) { df.remove(); return; }
        const t = (performance.now() - start) / 1000;
        df.style.transform = `translate(${(Math.sin(t * 4) * 20)}px, ${Math.cos(t * 3) * 8}px) rotate(${t * 30}deg)`;
        df.style.opacity = 0.5 + Math.sin(t * 2) * 0.2;
        if (t > 8) { df.remove(); return; }
        requestAnimationFrame(flutter);
      };
      requestAnimationFrame(flutter);
    }

    setInterval(() => {
      if (Math.random() < 0.4) spawnFish();
    }, 3000);
    setInterval(() => {
      if (Math.random() < 0.3) spawnDragonfly();
    }, 5000);

    /* ---------- 7. Auto-spawn ripples on pond idle ---------- */
    setInterval(() => {
      if (document.getElementById('overlay') && document.getElementById('overlay').style.display !== 'none') return;
      if (Math.random() < 0.15) {
        const r = pondEl.getBoundingClientRect();
        const ring = document.createElement('div');
        ring.className = 'ripple';
        ring.style.left = (10 + Math.random() * (r.width - 100)) + 'px';
        ring.style.top = (r.height * 0.3 + Math.random() * (r.height * 0.5)) + 'px';
        pondEl.appendChild(ring);
        setTimeout(() => ring.remove(), 900);
      }
    }, 4000);