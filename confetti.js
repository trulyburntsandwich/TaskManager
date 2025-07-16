// Simple confetti cannon for canvas

let confettiParticles = [];
let confettiActive = false;
const confettiColors = ['#0ff', '#ff6f61','#ffd600','#8ac926','#00e676','#00b0ff','#fff'];

function runConfetti() {
  if (confettiActive) return;
  confettiActive = true;
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  resizeConfettiCanvas();

  confettiParticles = [];
  for (let i = 0; i < 140; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: window.innerHeight - 80,
      r: Math.random() * 7 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      d: Math.random() * 7 + 4,
      tilt: Math.random() * 18 - 9,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + .05,
      vx: (Math.random() - 0.5) * 11,
      vy: -(Math.random() * 16 + 14)
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(p => {
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 3, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.r);
      ctx.stroke();
    });
  }
  function updateConfetti() {
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.54; // gravity
      p.tiltAngle += p.tiltAngleIncremental;
      p.tilt = Math.sin(p.tiltAngle) * 14;
    });
  }
  let frame = 0;
  function animate() {
    updateConfetti();
    drawConfetti();
    frame++;
    if (frame < 90) requestAnimationFrame(animate);
    else confettiActive = false;
  }
  animate();
}

function clearConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles = [];
  confettiActive = false;
}

function resizeConfettiCanvas() {
  const canvas = document.getElementById('confetti');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeConfettiCanvas);
