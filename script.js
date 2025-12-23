let totalMinutes = 0;
let totalSeconds = 0;
let timerInterval;
let phaseInterval;

const phases = [
  { text: "WDECH", seconds: 4 },
  { text: "ZATRZYMAJ", seconds: 2 },
  { text: "WYDECH", seconds: 8 },
  { text: "ZATRZYMAJ", seconds: 2 }
];

function setDuration(minutes) {
  totalMinutes = minutes;
  totalSeconds = minutes * 60;
  document.getElementById("startBtn").disabled = false;
}

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "pl-PL";
  window.speechSynthesis.speak(msg);
}

function startBreathing() {
  document.getElementById("timeSelection").classList.add("hidden");
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("breathing").classList.remove("hidden");

  let phaseIndex = 0;
  let phaseTime = phases[0].seconds;

  speak(phases[0].text);

  document.getElementById("phase").innerText = phases[0].text;
  document.getElementById("counter").innerText = phaseTime;

  timerInterval = setInterval(() => {
    totalSeconds--;
    if (totalSeconds <= 0) finish();
  }, 1000);

  phaseInterval = setInterval(() => {
    phaseTime--;
    document.getElementById("counter").innerText = phaseTime;

    if (phaseTime <= 0) {
      phaseIndex = (phaseIndex + 1) % phases.length;
      phaseTime = phases[phaseIndex].seconds;
      document.getElementById("phase").innerText = phases[phaseIndex].text;
      speak(phases[phaseIndex].text);
    }
  }, 1000);
}

function finish() {
  clearInterval(timerInterval);
  clearInterval(phaseInterval);
  document.getElementById("breathing").classList.add("hidden");
  document.getElementById("done").classList.remove("hidden");
  speak("Gotowe. Dobra robota.");
}
