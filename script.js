/* ===================================================
   CANVAS DE CORAZONES FLOTANTES DE FONDO
=================================================== */
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');

let hearts = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class FloatingHeart {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 50;
    this.size = Math.random() * 14 + 10;
    this.speed = Math.random() * 1.2 + 0.6;
    this.opacity = Math.random() * 0.45 + 0.25;
    this.swing = Math.random() * 2;
    this.swingSpeed = Math.random() * 0.02 + 0.01;
    this.angle = 0;
    this.color = ['#ff4b72', '#ff85a2', '#ffccd5', '#f8a5c2'][Math.floor(Math.random() * 4)];
  }
  update() {
    this.y -= this.speed;
    this.angle += this.swingSpeed;
    this.x += Math.sin(this.angle) * this.swing;
    if (this.y < -30) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    
    // Forma del corazón con curvas Bezier
    ctx.beginPath();
    const d = this.size / 2;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
    ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 35; i++) {
  const h = new FloatingHeart();
  h.y = Math.random() * canvas.height;
  hearts.push(h);
}

function animateBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    h.update();
    h.draw();
  });
  requestAnimationFrame(animateBackground);
}
animateBackground();


/* ===================================================
   LÓGICA DEL BOTÓN ESCAPISTA ("NO") Y "SÍ"
=================================================== */
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const arena = document.getElementById('arena');
const evadeCounterWrapper = document.getElementById('evade-counter-wrapper');
const evadeCountSpan = document.getElementById('evade-count');
const evadeCommentSpan = document.getElementById('evade-comment');
const avatarEmoji = document.getElementById('avatar-emoji');

let evadeCount = 0;
let yesScale = 1;

const noTexts = [
  "No 🙈",
  "¿Segura? 🥺",
  "¡Déjame escucharte un ratico! 😂",
  "Piénsalo bien mi vida...",
  "Ese botón no te deja decir que no 💕",
  "¡Atrápame si puedes! 🏃‍♀️",
  "Error 404: 'No' no existe 😜",
  "¡Dime que sí a la llamada! 🥰",
  "Solo un ratito cuando descanses 😘",
  "¡Ríndete y di que sí, mi amor! 💖"
];

const comments = [
  "¡Ni lo intentes jaja!",
  "¡Quiero escuchar tu vocecita!",
  "Parece que el destino quiere que hablemos hoy...",
  "¡No te me escapes, amorcito!",
  "¡Míralo cómo huye! 😂",
  "Solo te queda aceptar la llamada 💕"
];

const emojisReaction = ["🥺", "😲", "🏃‍♂️", "🙈", "🤭", "😜", "💖"];

function moveNoButton() {
  evadeCount++;
  evadeCounterWrapper.style.display = 'inline-flex';
  evadeCountSpan.textContent = evadeCount;

  evadeCommentSpan.textContent = comments[Math.floor(Math.random() * comments.length)];
  avatarEmoji.textContent = emojisReaction[Math.floor(Math.random() * emojisReaction.length)];

  btnNo.textContent = noTexts[evadeCount % noTexts.length];

  yesScale += 0.08;
  btnYes.style.transform = `scale(${yesScale})`;

  const arenaRect = arena.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();

  const maxX = arenaRect.width - btnRect.width - 20;
  const maxY = arenaRect.height - btnRect.height - 10;

  btnNo.style.position = 'absolute';

  const randomX = Math.max(10, Math.floor(Math.random() * maxX));
  const randomY = Math.max(10, Math.floor(Math.random() * maxY));

  btnNo.style.left = `${randomX}px`;
  btnNo.style.top = `${randomY}px`;

  playBoingSound();
}

btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });
btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});


/* ===================================================
   CELEBRACIÓN AL HACER CLIC EN "¡SÍ!"
=================================================== */
const modal = document.getElementById('celebration-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const claimRewardBtn = document.getElementById('claim-reward-btn');

function triggerCelebration() {
  modal.classList.add('active');
  playSong();
  playCelebrationMelody();

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4b72', '#ff85a2', '#ffd6e0', '#fbc02d', '#ffffff']
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4b72', '#ff85a2', '#ffffff']
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4b72', '#ff85a2', '#ffffff']
      });
    }, 400);
  }
}

btnYes.addEventListener('click', triggerCelebration);
modalCloseBtn.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

claimRewardBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  spawnFloatingHugs();
});


/* ===================================================
   LIGHTBOX DE FOTOS EN PANTALLA COMPLETA
=================================================== */
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

window.openLightbox = function(src, title, desc) {
  lightboxImg.src = src;
  lightboxTitle.textContent = title;
  lightboxDesc.textContent = desc;
  lightboxModal.classList.add('active');
  playNote(784, 'sine', 0.25, 0.1);
};

if (lightboxCloseBtn) {
  lightboxCloseBtn.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });
}

if (lightboxModal) {
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });
}


/* ===================================================
   PESTAÑAS DE NUESTROS MUNDOS VIRTUALES
=================================================== */
const worldTabs = document.querySelectorAll('.world-tab');
const worldContents = document.querySelectorAll('.world-content');

worldTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    worldTabs.forEach(t => t.classList.remove('active'));
    worldContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    const targetWorld = tab.getAttribute('data-world');
    const activeContent = document.getElementById(`world-${targetWorld}`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
  });
});


/* ===================================================
   RULETA DE CITAS VIRTUALES PARA HOY
=================================================== */
const datePlans = [
  {
    icon: "⛏️",
    title: "Noche de Casita en Minecraft",
    desc: "Entramos a nuestro mundo, recolectamos flores, cuidamos nuestros perritos y miramos la lluvia juntos al calor de las velas."
  },
  {
    icon: "🌟",
    title: "Vuelo Romántico en Sky: CotL",
    desc: "Nos tomamos de la manita, volamos por las nubes doradas, recargamos alitas y tocamos melodías en el piano bajo las estrellas."
  },
  {
    icon: "🎮",
    title: "Torneo de Risas en Roblox",
    desc: "Probamos un obby imposible, nos caemos mil veces, nos reímos por llamada y hacemos juego con nuestros skins."
  },
  {
    icon: "🎬",
    title: "Cine en Discord con Pijamita",
    desc: "Compartimos pantalla, nos ponemos ropa calientita, pedimos o preparamos comidita rica y vemos una peli abrazados en espíritu."
  },
  {
    icon: "☕",
    title: "Llamada de Relajo y Desconexión",
    desc: "Cero prisas ni pantallas ocupadas: solo tú contándome cómo te fue trabajando con tu mami y yo escuchándote con todo mi amor."
  }
];

const btnSpinRoulette = document.getElementById('btn-spin-roulette');
const rouletteIcon = document.getElementById('roulette-icon');
const rouletteTitle = document.getElementById('roulette-title');
const rouletteDesc = document.getElementById('roulette-desc');

let isSpinning = false;

btnSpinRoulette.addEventListener('click', () => {
  if (isSpinning) return;
  isSpinning = true;
  btnSpinRoulette.disabled = true;

  let counter = 0;
  const maxTicks = 16;
  const interval = setInterval(() => {
    const randomPlan = datePlans[counter % datePlans.length];
    rouletteIcon.textContent = randomPlan.icon;
    rouletteTitle.textContent = randomPlan.title;
    rouletteDesc.textContent = "Barajando planes para hoy...";
    playChimeTick();
    counter++;

    if (counter >= maxTicks) {
      clearInterval(interval);
      const chosen = datePlans[Math.floor(Math.random() * datePlans.length)];
      rouletteIcon.textContent = chosen.icon;
      rouletteTitle.textContent = `✨ ${chosen.title} ✨`;
      rouletteDesc.textContent = chosen.desc;
      isSpinning = false;
      btnSpinRoulette.disabled = false;
      playCelebrationMelody();

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }
  }, 100);
});


/* ===================================================
   TARJETAS "ABRE ESTA CARTA CUANDO..."
=================================================== */
const letterCards = document.querySelectorAll('.letter-card');

letterCards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('opened');
    if (card.classList.contains('opened')) {
      playNote(659.25, 'sine', 0.5, 0.12); // Sonido suave de abrir carta
    }
  });
});


/* ===================================================
   MEDIDOR DE AMOR INTERACTIVO
=================================================== */
const loveSlider = document.getElementById('love-slider');
const loveValue = document.getElementById('love-value');
const meterFeedback = document.getElementById('meter-feedback');
const btnBurstHearts = document.getElementById('btn-burst-hearts');

const feedbackQuotes = [
  "Mmm... ¿tan poquito? Dale más a la derecha, tramposa 😜",
  "Nivel lindo: Suficiente para darte 10 besitos.",
  "Nivel alto: Ya me haces falta desde este momento 💕",
  "Nivel estratosférico: Más que todas las estrellas del universo 🌌",
  "¡ALERTA DE DESBORDAMIENTO! Mi amor por ti desafía las leyes de la física cuántica 💖✨"
];

loveSlider.addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  if (val < 20) {
    loveValue.textContent = `${val * 10}%`;
    meterFeedback.textContent = feedbackQuotes[0];
  } else if (val < 50) {
    loveValue.textContent = `${val * 100}%`;
    meterFeedback.textContent = feedbackQuotes[1];
  } else if (val < 80) {
    loveValue.textContent = `${val * 5000}%`;
    meterFeedback.textContent = feedbackQuotes[2];
  } else if (val < 99) {
    loveValue.textContent = `${val * 50000}%`;
    meterFeedback.textContent = feedbackQuotes[3];
  } else {
    loveValue.textContent = `¡INFINITO %! 🔥`;
    meterFeedback.textContent = feedbackQuotes[4];
  }
});

btnBurstHearts.addEventListener('click', () => {
  spawnFloatingHugs();
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff4070', '#ff85a2']
    });
  }
});


/* ===================================================
   GENERADOR DE CORAZONES FLOTANTES
=================================================== */
function spawnFloatingHugs() {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const heartEl = document.createElement('div');
      heartEl.innerHTML = ['💖', '💕', '🥰', '✨', '🌸', '😘', '⛏️', '🌟', '🎮'][Math.floor(Math.random() * 9)];
      heartEl.style.position = 'fixed';
      heartEl.style.left = `${Math.random() * 80 + 10}vw`;
      heartEl.style.bottom = '10px';
      heartEl.style.fontSize = `${Math.random() * 24 + 20}px`;
      heartEl.style.zIndex = '9999';
      heartEl.style.pointerEvents = 'none';
      heartEl.style.transition = 'all 2.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
      heartEl.style.opacity = '1';
      heartEl.style.transform = `translateY(0) scale(0.6)`;

      document.body.appendChild(heartEl);

      requestAnimationFrame(() => {
        heartEl.style.opacity = '0';
        heartEl.style.transform = `translateY(-${Math.random() * 400 + 200}px) scale(1.4) rotate(${Math.random() * 60 - 30}deg)`;
      });

      setTimeout(() => heartEl.remove(), 2300);
    }, i * 70);
  }
}


/* ===================================================
   SINTETIZADOR DE MÚSICA Y EFECTOS (Web Audio API)
=================================================== */
let audioCtx = null;
let isPlayingMelody = false;
let melodyInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playNote(freq, type = 'sine', duration = 0.6, volume = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {}
}

function playBoingSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch(e) {}
}

function playChimeTick() {
  playNote(784, 'sine', 0.08, 0.08);
}

function playCelebrationMelody() {
  const notes = [
    { f: 523.25, d: 0.3 }, // C5
    { f: 659.25, d: 0.3 }, // E5
    { f: 783.99, d: 0.3 }, // G5
    { f: 1046.50, d: 0.9 } // C6
  ];
  notes.forEach((n, idx) => {
    setTimeout(() => playNote(n.f, 'triangle', n.d, 0.2), idx * 160);
  });
}

// Efectos temáticos para los mundos
window.playGameSound = function(type) {
  if (type === 'minecraft') {
    // Sonido retro 8-bit estilo Minecraft level-up / exp
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      setTimeout(() => playNote(freq, 'square', 0.15, 0.08), idx * 70);
    });
    spawnFloatingHugs();
  } else if (type === 'sky') {
    // Tintineo celestial de arpa de Sky: Children of the Light
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => playNote(freq, 'sine', 1.0, 0.12), idx * 120);
    });
    spawnFloatingHugs();
  } else if (type === 'roblox') {
    // Sonidito alegre de rebote
    playNote(300, 'sawtooth', 0.2, 0.1);
    setTimeout(() => playNote(600, 'triangle', 0.3, 0.15), 120);
    spawnFloatingHugs();
  }
};

/* ===================================================
   REPRODUCTOR DE NUESTRA CANCIÓN: LABIOS ROTOS - ZOÉ
=================================================== */
const bgMusic = document.getElementById('bg-music');
const musicPlayerPill = document.getElementById('music-player-pill');
const musicToggleBtn = document.getElementById('music-toggle');
const playIcon = document.getElementById('play-icon');

let isMusicPlaying = false;

function playSong() {
  if (!bgMusic) return;
  bgMusic.volume = 0.85;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isMusicPlaying = true;
      if (musicPlayerPill) musicPlayerPill.classList.add('playing');
      if (playIcon) playIcon.textContent = '⏸️';
    }).catch(() => {
      // Navegadores bloquean autoplay hasta interacción del usuario
    });
  }
}

function pauseSong() {
  if (!bgMusic) return;
  bgMusic.pause();
  isMusicPlaying = false;
  if (musicPlayerPill) musicPlayerPill.classList.remove('playing');
  if (playIcon) playIcon.textContent = '▶️';
}

function toggleSong() {
  if (isMusicPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSong();
  });
}

if (musicPlayerPill) {
  musicPlayerPill.addEventListener('click', toggleSong);
}

// Iniciar reproducción suave al primer toque/clic en cualquier parte de la página
let userInteracted = false;
function onFirstInteraction() {
  if (!userInteracted) {
    userInteracted = true;
    playSong();
    window.removeEventListener('click', onFirstInteraction);
    window.removeEventListener('touchstart', onFirstInteraction);
  }
}
window.addEventListener('click', onFirstInteraction, { once: true });
window.addEventListener('touchstart', onFirstInteraction, { once: true });
