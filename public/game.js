const c = document.getElementById("game");
const x = c.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const W = c.width, H = c.height;

let paused = false, over = false, score = 0;
let best = Number(localStorage.getItem("circled_best") || "0") || 0;
bestEl.textContent = String(best);
scoreEl.textContent = "0";

const p = { w: 140, h: 16, x: W / 2, y: H - 90, v: 8 };
const b = { r: 10, x: W / 2, y: 160, vx: 1.2, vy: -3.5, g: 0.08, maxVy: 5.5 };
let L = false, R = false;

function clamp(v, a, z) { return v < a ? a : v > z ? z : v; }

function reset() {
  paused = false; over = false; score = 0;
  scoreEl.textContent = "0";
  p.x = W / 2;
  b.x = W / 2; b.y = 160;
  b.vx = Math.random() < 0.5 ? -1.2 : 1.2;
  b.vy = -3.5;
}

addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") L = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") R = true;
  if (e.code === "Space") paused = !paused;
  if (e.code === "KeyR") reset();
});
addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") L = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") R = false;
});

function update() {
  if (paused || over) return;

  if (L) p.x -= p.v;
  if (R) p.x += p.v;
  p.x = clamp(p.x, p.w / 2, W - p.w / 2);

  const prevBottom = b.y + b.r;
  b.vy += b.g;
  b.vy = clamp(b.vy, -b.maxVy, b.maxVy);
  b.x += b.vx; b.y += b.vy;
  const nextBottom = b.y + b.r;

  if (b.x - b.r <= 0 || b.x + b.r >= W) b.vx *= -1;
  b.x = clamp(b.x, b.r, W - b.r);
  if (b.y - b.r <= 0) { b.y = b.r; b.vy *= -1; }

  const left = p.x - p.w / 2, right = p.x + p.w / 2, top = p.y - p.h / 2;
  const withinX = (b.x + b.r) >= left && (b.x - b.r) <= right;
  const crossedTop = prevBottom <= top && nextBottom >= top;
  if (b.vy > 0 && withinX && crossedTop) {
    b.y = top - b.r;
    b.vy = -3.8;
    b.vx = clamp(b.vx + (b.x - p.x) * 0.03, -7, 7);
    scoreEl.textContent = String(++score);
    if (score > best) { best = score; bestEl.textContent = String(best); localStorage.setItem("circled_best", String(best)); }
  }

  if (b.y - b.r > H) over = true;
}

function render() {
  x.clearRect(0, 0, W, H);
  x.fillStyle = "rgba(255,255,255,0.08)"; x.fillRect(0, 0, W, H);
  x.fillStyle = "rgba(124,92,255,0.95)"; x.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
  x.beginPath(); x.arc(b.x, b.y, b.r, 0, Math.PI * 2); x.fillStyle = "rgba(255,255,255,0.95)"; x.fill();
  if (paused || over) {
    x.fillStyle = "rgba(0,0,0,0.55)"; x.fillRect(0, 0, W, H);
    x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "rgba(255,255,255,0.92)";
    x.font = "700 34px ui-sans-serif, system-ui, Segoe UI, Arial";
    x.fillText(over ? "Поражение" : "Пауза", W / 2, H / 2);
  }
}

function loop() { update(); render(); requestAnimationFrame(loop); }
reset(); requestAnimationFrame(loop);

