export const reset = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
`.trim();

export const base = `
html,body{width:100%;height:100%;overflow:hidden;background:transparent;font-family:Inter,"Segoe UI",Arial,sans-serif}
`.trim();

export const tokens = `
:root{
  --bg:url("background.jpg");
  --surface:#fffaf0;
  --row:rgba(255,255,255,.72);
  --text:#0f172a;
  --text-sub:#475569;
  --accent:#c2410c;
  --border:rgba(255,255,255,.72);
  --divider:rgba(15,23,42,.06);
  --r:28px;
  --r-sm:20px;
}
`.trim();

export const mieAyamStyles = `
.mie-ayam{position:absolute;right:0;bottom:-56px;width:245px;height:215px;z-index:2;pointer-events:none;animation:ma-enter 850ms cubic-bezier(.2,.9,.2,1) both}
.mie-ayam-inner{position:absolute;inset:0;animation:ma-float 4s ease-in-out infinite;transform-origin:60% 82%}
.mie-ayam-glow{position:absolute;right:24px;bottom:12px;width:180px;height:72px;border-radius:999px;background:radial-gradient(circle,rgba(251,191,36,.24),transparent 70%);filter:blur(10px);animation:glow-pulse 3.5s ease-in-out infinite}
.mie-ayam-img{position:absolute;right:0;bottom:0;width:230px;height:auto;display:block;filter:drop-shadow(0 16px 18px rgba(15,23,42,.18)) saturate(1.04);animation:ma-breathe 4s ease-in-out infinite}
.mie-ayam-effects{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.steam{fill:none;stroke:#7c2d12;stroke-width:3;stroke-linecap:round;opacity:0;stroke-dasharray:42;stroke-dashoffset:42;animation:steam-rise 2.8s ease-in-out infinite}
.steam.two{animation-delay:.55s}
.heart{transform-origin:center;animation:heart-float 2.6s ease-in-out infinite;filter:drop-shadow(0 5px 8px rgba(239,68,68,.26))}
.sparkle{transform-origin:center;animation:sparkle 1.8s ease-in-out infinite}
.sparkle.two{animation-delay:.45s}
.sparkle.three{animation-delay:.85s}
.sparkle.four{animation-delay:1.15s}
`.trim();

export const animations = `
@keyframes ma-enter{from{opacity:0;transform:translate(34px,28px) scale(.82) rotate(4deg)}to{opacity:1;transform:translate(0,0) scale(1) rotate(0deg)}}
@keyframes ma-float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-7px) rotate(-1deg)}}
@keyframes ma-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}
@keyframes glow-pulse{0%,100%{opacity:.5;transform:scaleX(1)}50%{opacity:.85;transform:scaleX(1.08)}}
@keyframes avatar-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes check-pop{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
@keyframes card-enter{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes steam-rise{0%{opacity:0;stroke-dashoffset:42;transform:translateY(12px)}35%{opacity:.75}100%{opacity:0;stroke-dashoffset:0;transform:translateY(-16px)}}
@keyframes heart-float{0%,100%{transform:translateY(0) rotate(-8deg) scale(1)}50%{transform:translateY(-11px) rotate(7deg) scale(1.08)}}
@keyframes sparkle{0%,100%{opacity:.22;transform:scale(.7) rotate(0deg)}50%{opacity:1;transform:scale(1.18) rotate(18deg)}}
`.trim();
