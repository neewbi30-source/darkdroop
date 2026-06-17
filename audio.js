(function () {
  const BPM = 126;
  const TRACK = {
    src: 'audio/if-only.mp3',
    title: 'If Only — Glass Vocal Mix',
    artist: 'Luke Bergs ft. Iva Rii',
  };

  let ctx = null;
  let analyser = null;
  let source = null;
  let gainNode = null;
  let audio = null;
  let playing = false;
  let vizFrame = null;

  function init() {
    if (audio) return;

    audio = new Audio(TRACK.src);
    audio.crossOrigin = 'anonymous';
    audio.loop = true;
    audio.preload = 'auto';

    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    gainNode = ctx.createGain();
    gainNode.gain.value = 0.7;

    source = ctx.createMediaElementSource(audio);
    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(ctx.destination);

    audio.addEventListener('ended', () => {
      if (audio.loop) return;
      stop();
    });
  }

  function startViz() {
    const bars = document.querySelectorAll('#player-viz span');
    const data = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
      if (!playing) return;
      analyser.getByteFrequencyData(data);
      bars.forEach((bar, i) => {
        const val = data[i + 1] || 0;
        bar.style.height = `${Math.max(12, (val / 255) * 100)}%`;
      });
      vizFrame = requestAnimationFrame(draw);
    }
    draw();
  }

  function stopViz() {
    cancelAnimationFrame(vizFrame);
    document.querySelectorAll('#player-viz span').forEach((bar) => {
      bar.style.height = '12%';
    });
  }

  async function start() {
    init();
    if (ctx.state === 'suspended') await ctx.resume();
    try {
      await audio.play();
      playing = true;
      startViz();
      document.getElementById('audio-player').classList.add('is-playing');
      document.body.classList.add('audio-sync');
    } catch (err) {
      console.warn('Playback blocked:', err);
    }
  }

  function stop() {
    if (!audio) return;
    audio.pause();
    playing = false;
    stopViz();
    document.getElementById('audio-player').classList.remove('is-playing');
    document.body.classList.remove('audio-sync');
  }

  const playBtn = document.getElementById('player-play');
  const volSlider = document.getElementById('player-volume');
  const bpmEl = document.getElementById('player-bpm');
  const trackEl = document.querySelector('.player-track');

  if (bpmEl) bpmEl.textContent = BPM + ' BPM';
  if (trackEl) trackEl.textContent = 'DR. FOSS — ' + TRACK.title;

  playBtn?.addEventListener('click', () => {
    if (playing) stop();
    else start();
  });

  volSlider?.addEventListener('input', () => {
    if (gainNode) gainNode.gain.value = volSlider.value / 100;
  });

  document.documentElement.style.setProperty('--dance-beat', (60 / BPM) + 's');
})();