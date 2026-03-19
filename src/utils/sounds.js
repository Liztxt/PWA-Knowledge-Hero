const AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function playTone({ frequency, duration, type = "sine", volume = 0.3 }) {
  const context = getCtx();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gainNode.gain.setValueAtTime(volume, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
}

export function playCorrect() {
  // Melodía ascendente corta
  playTone({ frequency: 523, duration: 0.15 }); // Do
  setTimeout(() => playTone({ frequency: 659, duration: 0.15 }), 100); // Mi
  setTimeout(() => playTone({ frequency: 784, duration: 0.25 }), 200); // Sol
}

export function playIncorrect() {
  // Sonido descendente
  playTone({ frequency: 300, duration: 0.15, type: "sawtooth" });
  setTimeout(() => playTone({ frequency: 200, duration: 0.25, type: "sawtooth" }), 150);
}

export function playLevelComplete() {
  // Fanfarria corta
  [523, 659, 784, 1046].forEach((freq, i) => {
    setTimeout(() => playTone({ frequency: freq, duration: 0.2, volume: 0.4 }), i * 120);
  });
}