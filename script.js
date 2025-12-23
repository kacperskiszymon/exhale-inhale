let totalSeconds = 0;
let isRunning = false;
let isMuted = false;

let currentPhaseIndex = 0;
let phaseTimeLeft = 0;

let ring;
const RING_LENGTH = 502;

const phases = [
  { text: "WDECH", seconds: 4 },
  { text: "ZATRZYMAJ", seconds: 2 },
  { text: "WYDECH", seconds: 8 },
  { text: "ZATRZYMAJ", seconds: 2 }
];

function setDuration(minutes, button) {
  totalSeconds = minutes * 60;
  document.getElementById("startBtn").disabled = false;

  document.querySelectorAll(".time-btn").forEach(btn =>
    btn.classList.remove("active")
  );
  button.classList.add("active");
}

/* ===== AUDIO UNLOCK (MOBILE) ===== */
function unlockAudio() {
  const msg = new SpeechSynthesisUtterance(" ");
  msg.lang = "pl-PL";
  window.speechSynthesis.speak(msg);
}

/* ===== SPEAK ===== */
function speak(text) {
  if (isMuted) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "pl-PL";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

function toggleMute() {
  isMuted = !isMuted;
  document.getElementById("muteBtn").innerText =
    isMuted ? "🔇 Głos: OFF" : "🔊 Głos: ON";
}

/* ===== START ===== */
function startBreathing() {
  unlockAudio(); // 🔓 kluczowe na mobile

  isRunning = true;

  document.getElementById("timeSelection").classList.add("hidden");
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("breathing").classList.remove("hidden");

  ring = document.getElementById("ring");
  ring.style.strokeDasharray = RING_LENGTH;
  ring.style.strokeDashoffset = RING_LENGTH;

  currentPhaseIndex = 0;
  phaseTimeLeft = phases[0].seconds;

  applyPhase();
  tick(); // 🔁 start pętli czasu
}

/* ===== TIME LOOP (MOBILE SAFE) ===== */
function tick() {
  if (!isRunning) return;

  setTimeout(() => {
    if (!isRunning) return;

    totalSeconds--;
    phaseTimeLeft--;

    document.getElementById("counter").innerText = phaseTimeLeft;

    if (phaseTimeLeft <= 0) {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      phaseTimeLeft = phases[currentPhaseIndex].seconds;
      applyPhase();
    }

    if (totalSeconds <= 0) {
      finish();
      return;
    }

    tick(); // 🔁 rekurencja zamiast setInterval
  }, 1000);
}

/* ===== PHASE LOGIC ===== */
function applyPhase() {
  const phase = phases[currentPhaseIndex];

  document.getElementById("phase").innerText = phase.text;
  document.getElementById("counter").innerText = phase.seconds;

  speak(phase.text);

  ring.style.transition = "none";

  if (phase.text === "WDECH") {
    ring.style.strokeDashoffset = RING_LENGTH;
    ring.getBoundingClientRect();
    ring.style.transition = `stroke-dashoffset ${phase.seconds}s linear`;
    ring.style.strokeDashoffset = 0;
  }

  else if (phase.text === "WYDECH") {
    ring.style.strokeDashoffset = 0;
    ring.getBoundingClientRect();
    ring.style.transition = `stroke-dashoffset ${phase.seconds}s linear`;
    ring.style.strokeDashoffset = RING_LENGTH;
  }
}

/* ===== CONTROLS ===== */
function stopBreathing() {
  isRunning = false;
  speak("Ćwiczenie przerwane");
}

function resetBreathing() {
  location.reload();
}

function finish() {
  isRunning = false;
  document.getElementById("breathing").classList.add("hidden");
  document.getElementById("done").classList.remove("hidden");
  speak("Gotowe. Dobra robota.");
}
