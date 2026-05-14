/**
 * Tako Overlay Styles
 * Tailwind Browser CDN + custom CSS for pseudo-elements, decorations, and animations.
 * All animations: transform/opacity only (GPU-accelerated, no layout shifts).
 */

export function buildAlertCss(bgUri: string): string {
  return `
:root {
  --bg: url("${bgUri}");
}

/* Panel background & accent line */
.alert-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,253,245,.72), rgba(255,253,245,.9)), var(--bg, none);
  background-size: cover;
  background-position: center;
  z-index: -1;
  border-radius: inherit;
}
.alert-panel::after {
  content: "";
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 20px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #facc15, rgba(250,204,21,0));
  opacity: .78;
}

/* Hide empty/broken elements */
#profile-picture[src=""] { display: none; }
.avatar-frame:has(#profile-picture[src=""]) { display: none; }
.badges:empty { display: none; }
.message:empty::before {
  content: "Tidak Ada Pesan";
  font-style: italic;
  font-weight: 500;
  color: rgba(47,42,46,.72);
}

/* ─── Decorations ─── */

.deco {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

/* Floating sparkle dots */
.deco-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
}
.deco-dot-1 { top: 18%; right: 38%; background: #facc15; animation: dot-pop .6s ease .4s both, dot-float 3s ease-in-out .4s infinite; }
.deco-dot-2 { top: 45%; right: 28%; background: #fb923c; animation: dot-pop .6s ease .55s both, dot-float 3.4s ease-in-out .55s infinite; }
.deco-dot-3 { bottom: 30%; right: 42%; background: #f472b6; animation: dot-pop .6s ease .7s both, dot-float 2.8s ease-in-out .7s infinite; }

/* Floating shapes */
.deco-ring {
  width: 14px;
  height: 14px;
  border: 2.5px solid #fb923c;
  border-radius: 50%;
  opacity: 0;
  top: 22%;
  right: 22%;
  animation: dot-pop .5s ease .5s both, dot-float 4s ease-in-out .5s infinite;
}
.deco-diamond {
  width: 10px;
  height: 10px;
  background: #a78bfa;
  opacity: 0;
  top: 55%;
  right: 18%;
  transform: rotate(45deg);
  animation: dot-pop .5s ease .65s both, dot-float 3.6s ease-in-out .65s infinite;
}
.deco-cross {
  width: 12px;
  height: 12px;
  opacity: 0;
  bottom: 22%;
  right: 30%;
  animation: dot-pop .5s ease .8s both, dot-float 3.2s ease-in-out .8s infinite;
}
.deco-cross::before,
.deco-cross::after {
  content: "";
  position: absolute;
  background: #34d399;
  border-radius: 2px;
}
.deco-cross::before { width: 12px; height: 3px; top: 4.5px; left: 0; }
.deco-cross::after { width: 3px; height: 12px; top: 0; left: 4.5px; }

.deco-star {
  width: 16px;
  height: 16px;
  opacity: 0;
  top: 12%;
  right: 15%;
  animation: dot-pop .5s ease .35s both, star-spin 6s linear infinite;
}

/* ─── Animations ─── */

/* Panel entrance */
@keyframes panel-enter {
  from { opacity: 0; transform: translateY(12px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Message text fade in */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Mascot entrance with spring */
@keyframes mascot-enter {
  0%   { opacity: 0; transform: translate(30px, 8px) scale(.8) rotate(5deg); }
  60%  { opacity: 1; transform: translate(-4px, -2px) scale(1.02) rotate(-1deg); }
  100% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
}

/* Mascot idle float */
@keyframes mascot-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-5px) rotate(-1.5deg); }
}

/* Decoration dot pop in */
@keyframes dot-pop {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}

/* Decoration float */
@keyframes dot-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

/* Star spin */
@keyframes star-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Accent line shimmer */
@keyframes line-shimmer {
  0%   { opacity: .5; }
  50%  { opacity: .9; }
  100% { opacity: .5; }
}
.alert-panel::after {
  animation: line-shimmer 3s ease-in-out infinite;
}

/* ─── Mie-Ayam Component Animations ─── */

.mie-ayam {
  position: relative;
  width: 100%;
  height: 100%;
}
.mie-ayam-inner {
  position: absolute;
  inset: 0;
  transform-origin: 50% 80%;
  animation: mieAyamFloat 4.5s ease-in-out infinite;
}
.mie-ayam-img {
  position: absolute;
  right: 10px;
  bottom: 5px;
  width: 150px;
  height: auto;
  display: block;
  filter: drop-shadow(0 10px 14px rgba(15,23,42,.15)) saturate(1.04);
  animation: mieAyamPop 0.9s cubic-bezier(0.2, 1.4, 0.35, 1) both;
}
.mie-ayam-effects {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.mie-ayam-effects .steam {
  fill: none;
  stroke: rgba(120, 53, 15, 0.42);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 34;
  stroke-dashoffset: 34;
  animation: steamRise 2.8s ease-in-out infinite;
}
.steam-two { animation-delay: 0.35s; }
.steam-three { animation-delay: 0.7s; }
.decor-float { animation: decorFloat 3.4s ease-in-out infinite; transform-origin: center; }
.sparkle { animation: sparklePop 2.4s ease-in-out infinite; transform-origin: center; }
.sparkle-two { animation-delay: 0.35s; }
.sparkle-three { animation-delay: 0.7s; }
.sparkle-four { animation-delay: 1s; }
.leaf { animation: leafWiggle 3.2s ease-in-out infinite; transform-origin: center; }
.leaf-two { animation-delay: 0.5s; }
.noodle-dots, .sauce-drops { animation: softBounce 3s ease-in-out infinite; transform-origin: center; }
.sauce-drops { animation-delay: 0.4s; }

@keyframes mieAyamPop {
  from { opacity: 0; transform: translateY(20px) scale(0.85) rotate(-4deg); }
  to   { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
}
@keyframes mieAyamFloat {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50%      { transform: translateY(-9px) rotate(1deg); }
}
@keyframes steamRise {
  0%   { opacity: 0; stroke-dashoffset: 34; transform: translateY(10px); }
  35%  { opacity: 1; }
  100% { opacity: 0; stroke-dashoffset: -34; transform: translateY(-22px); }
}
@keyframes sparklePop {
  0%, 100% { opacity: 0.55; transform: scale(0.8) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1.15) rotate(16deg); }
}
@keyframes decorFloat {
  0%, 100% { transform: translateY(0) rotate(-4deg) scale(1); }
  50%      { transform: translateY(-10px) rotate(5deg) scale(1.04); }
}
@keyframes leafWiggle {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  50%      { transform: rotate(6deg) translateY(-4px); }
}
@keyframes softBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-5px) scale(1.05); }
}

@media (prefers-reduced-motion: reduce) {
  .mie-ayam-inner, .mie-ayam-img, .mie-ayam-effects * {
    animation: none !important;
  }
}

.animate-panel-enter {
  animation: panel-enter .5s cubic-bezier(.22, .61, .36, 1) both;
}
.animate-fade-in {
  animation: fade-in .4s ease-out .25s both;
}
.animate-mascot-enter {
  animation: mascot-enter .7s cubic-bezier(.34, 1.56, .64, 1) .2s both;
}
.animate-mascot-float {
  animation: mascot-float 3.5s ease-in-out infinite;
}
`.trim();
}

export function buildLeaderboardCss(bgUri: string): string {
  return `
:root {
  --bg: url("${bgUri}");
}

.leaderboard::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255,253,245,.42), rgba(255,253,245,.74)), var(--bg, none), rgba(255,253,245,.9);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: .96;
}
.leaderboard::after {
  content: "";
  position: absolute;
  inset: 10px;
  z-index: -1;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,.54);
  pointer-events: none;
}
`.trim();
}
