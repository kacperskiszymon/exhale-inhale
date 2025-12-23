let totalSeconds = 0;

let timerInterval;
let phaseInterval;

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

function startBreathing() {
  isRunning = true;

  document.getElementById("timeSelection").classList.add("hidden");
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("breathing").classList.remove("hidden");

  ring = document.getElementById("ring");
  ring.style.strokeDasharray = RING_LENGTH;

  // ZAWSZE zaczynamy od pustego
  ring.style.transition = "none";
  ring.style.strokeDashoffset = RING_LENGTH;
  ring.getBoundingClientRect();

  currentPhaseIndex = 0;
  phaseTimeLeft = phases[0].seconds;

  applyPhase();

  timerInterval = setInterval(() => {
    if (!isRunning) return;
    totalSeconds--;
    if (totalSeconds <= 0) finish();
  }, 1000);

  phaseInterval = setInterval(() => {
    if (!isRunning) return;

    phaseTimeLeft--;
    document.getElementById("counter").innerText = phaseTimeLeft;

    if (phaseTimeLeft <= 0) {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      phaseTimeLeft = phases[currentPhaseIndex].seconds;
      applyPhase();
    }
  }, 1000);
}

function applyPhase() {
  const phase = phases[currentPhaseIndex];

  document.getElementById("phase").innerText = phase.text;
  document.getElementById("counter").innerText = phase.seconds;

  speak(phase.text);

  // STOP animacji
  ring.style.transition = "none";

  if (phase.text === "WDECH") {
    // start: pusty → animuj do pełnego
    ring.style.strokeDashoffset = RING_LENGTH;
    ring.getBoundingClientRect();

    ring.style.transition = `stroke-dashoffset ${phase.seconds}s linear`;
    ring.style.strokeDashoffset = 0;
  }

  else if (phase.text === "WYDECH") {
    // start: pełny → animuj do pustego
    ring.style.strokeDashoffset = 0;
    ring.getBoundingClientRect();

    ring.style.transition = `stroke-dashoffset ${phase.seconds}s linear`;
    ring.style.strokeDashoffset = RING_LENGTH;
  }

  else {
    // ZATRZYMAJ – brak animacji, zostaje w aktualnej pozycji
    ring.style.transition = "none";
  }
}

function stopBreathing() {
  isRunning = false;
  clearInterval(timerInterval);
  clearInterval(phaseInterval);
  speak("Ćwiczenie przerwane");
}

function resetBreathing() {
  location.reload();
}

function finish() {
  clearInterval(timerInterval);
  clearInterval(phaseInterval);
  document.getElementById("breathing").classList.add("hidden");
  document.getElementById("done").classList.remove("hidden");
  speak("Gotowe. Dobra robota.");
}
