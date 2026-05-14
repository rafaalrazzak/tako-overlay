export function buildAlertCss(bgUri: string): string {
  return `
*,::after,::before{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:url("${bgUri}");
  --surface:rgba(255,253,245,.9);
  --row:rgba(255,255,255,.76);
  --text:#2f2a2e;
  --text-sub:#475569;
  --accent:#d97706;
  --accent-soft:#fef3c7;
  --accent-line:#facc15;
  --amount:#92400e;
  --border:rgba(255,255,255,.82);
  --border-gold:rgba(250,204,21,.56);
  --divider:rgba(15,23,42,.06);
  --r:28px;
  --r-sm:16px;
  --mie-w:245px;
  --mie-h:215px;
  --avatar-bg:#e5e7eb;
}
body,html{width:100%;background:0 0;font-family:Poppins,"Segoe UI",Arial,sans-serif}
body{padding:10px 0 10px 10px;font-size:16px}
.avatar-frame{display:block;flex:0 0 36px;width:36px;height:36px;padding:0;border-radius:999px;background:var(--accent-soft);box-shadow:none;animation:none}
.avatar-frame.is-hidden,.avatar-frame:has(.avatar:not([src])),.avatar-frame:has(.avatar[src=""]){display:none}
.avatar{width:100%;height:100%;display:block;object-fit:cover;background:var(--avatar-bg);border:1px solid rgba(250,204,21,.7);border-radius:999px}
.avatar:not([src]),.avatar[src=""]{display:none}
.alert{position:relative;width:100%;max-width:900px;padding:0 54px 42px 0;overflow:visible;color:var(--text)}
.alert-panel{position:relative;z-index:2;min-height:178px;padding:28px 212px 36px 32px;display:flex;flex-direction:column;justify-content:center;gap:14px;border-radius:var(--r);background:var(--surface);border:1px solid var(--border);outline:1px solid var(--border-gold);outline-offset:-5px;overflow:hidden}
.alert-panel::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,253,245,.72),rgba(255,253,245,.9)),var(--bg,none);background-size:cover;background-position:center;opacity:1;z-index:-1}
.alert-panel::after{content:"";position:absolute;left:32px;right:212px;bottom:20px;height:3px;border-radius:999px;background:linear-gradient(90deg,var(--accent-line),rgba(250,204,21,0));opacity:.78}
.alert-meta{display:flex;align-items:center;gap:9px;min-width:0;max-width:100%;color:var(--text);font-size:21px;line-height:1}
.gifter-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:850}
.badges{display:flex;align-items:center;gap:5px;flex:0 1 auto;min-width:0}
.badges:empty{display:none}
.badge-img{width:25px;height:25px;flex:0 0 25px}
.amount-separator{flex:0 0 auto;color:rgba(47,42,46,.42);font-weight:800}
.amount{flex:0 0 auto;color:var(--amount);font-weight:900;white-space:nowrap}
.message{min-width:0;max-width:100%;color:var(--text);font-size:34px;font-weight:780;line-height:1.22;letter-spacing:0;overflow-wrap:anywhere;word-break:normal;text-shadow:0 1px 0 rgba(255,255,255,.72);animation:fade-in .45s ease-in-out .18s both}
.message:empty::before{content:"Tidak Ada Pesan";font-style:italic;font-weight:500;color:rgba(47,42,46,.72)}
.sticker{display:inline-block;width:auto;height:48px;margin:0 4px;vertical-align:middle}
.mie-ayam{position:absolute;right:0;bottom:-56px;width:var(--mie-w);height:var(--mie-h);z-index:2;pointer-events:none;animation:ma-enter 850ms cubic-bezier(.2,.9,.2,1) both}
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
.alert .mie-ayam{z-index:4;right:-16px;bottom:-28px}
.alert .mie-ayam-img{width:168px;filter:drop-shadow(0 10px 12px rgba(15,23,42,.12)) saturate(1.03)}
.alert .mie-ayam-glow{right:14px;bottom:8px;width:136px;height:48px;opacity:.65}
.alert .mie-ayam-effects{transform:scale(.74);transform-origin:right bottom}
@keyframes fade-in{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}
@keyframes ma-enter{from{opacity:0;transform:translate(34px,28px) scale(.82) rotate(4deg)}to{opacity:1;transform:translate(0,0) scale(1) rotate(0)}}
@keyframes ma-float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-7px) rotate(-1deg)}}
@keyframes ma-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}
@keyframes glow-pulse{0%,100%{opacity:.5;transform:scaleX(1)}50%{opacity:.85;transform:scaleX(1.08)}}
@keyframes steam-rise{0%{opacity:0;stroke-dashoffset:42;transform:translateY(12px)}35%{opacity:.75}100%{opacity:0;stroke-dashoffset:0;transform:translateY(-16px)}}
@keyframes heart-float{0%,100%{transform:translateY(0) rotate(-8deg) scale(1)}50%{transform:translateY(-11px) rotate(7deg) scale(1.08)}}
@keyframes sparkle{0%,100%{opacity:.22;transform:scale(.7) rotate(0)}50%{opacity:1;transform:scale(1.18) rotate(18deg)}}
`.trim();
}

export function buildLeaderboardCss(bgUri: string): string {
  return `
*,::after,::before{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:url("${bgUri}");
  --surface:rgba(255,253,245,.9);
  --row:rgba(255,255,255,.76);
  --text:#2f2a2e;
  --text-sub:#475569;
  --accent:#d97706;
  --accent-soft:#fef3c7;
  --accent-line:#facc15;
  --amount:#92400e;
  --border:rgba(255,255,255,.82);
  --border-gold:rgba(250,204,21,.56);
  --divider:rgba(15,23,42,.06);
  --r:28px;
  --r-sm:16px;
  --avatar-bg:#e5e7eb;
}
body,html{width:100%;height:100%;overflow:hidden;background:0 0;font-family:Poppins,"Segoe UI",Arial,sans-serif}
body{font-size:16px}
.leaderboard{position:relative;isolation:isolate;height:100%;border-radius:var(--r);border:1px solid rgba(255,255,255,.5);background:var(--surface);outline:1px solid var(--border-gold);outline-offset:-6px}
.leaderboard::before{content:"";position:absolute;inset:0;z-index:-2;background:linear-gradient(180deg,rgba(255,253,245,.42),rgba(255,253,245,.74)),var(--bg,none),var(--surface);background-size:cover;background-position:center;background-repeat:no-repeat;opacity:.96}
.leaderboard::after{content:"";position:absolute;inset:10px;z-index:-1;border-radius:20px;border:1px solid rgba(255,255,255,.54);pointer-events:none}
.header{border-bottom:1px solid var(--divider);padding:24px 20px 16px;text-align:center}
.header-title{font-size:24px;font-weight:900;text-transform:uppercase;line-height:1;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ranking-list{display:flex;height:calc(100% - 65px);flex-direction:column;gap:8px;padding:8px}
.ranking-entry{display:flex;min-height:68px;align-items:center;gap:16px;border-radius:16px;border:1px solid rgba(255,255,255,.5);background:var(--row);padding:12px 16px;backdrop-filter:blur(4px)}
.ranking-rank{width:32px;flex-shrink:0;text-align:center;font-size:18px;font-weight:900;line-height:1;color:var(--text-sub)}
.ranking-name{display:block;min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:24px;font-weight:850;line-height:1.25;color:var(--text)}
.ranking-amount{margin-top:4px;display:block;max-width:128px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px;font-weight:750;line-height:1.25;color:var(--accent)}
.ranking-empty{border-radius:16px;border:1px solid rgba(255,255,255,.5);background:var(--row);padding:20px 16px;text-align:center;font-size:15px;font-weight:700;color:var(--text-sub)}
.entry:nth-child(1) .rank{color:#d97706}
.entry:nth-child(2) .rank{color:#94a3b8}
.entry:nth-child(3) .rank{color:#b45309}
.mie-ayam{position:absolute;right:-18px;bottom:-62px;width:201px;height:176px;z-index:2;pointer-events:none;animation:ma-enter 850ms cubic-bezier(.2,.9,.2,1) both}
.mie-ayam-inner{position:absolute;inset:0;animation:ma-float 4s ease-in-out infinite;transform-origin:60% 82%}
.mie-ayam-glow{position:absolute;right:20px;bottom:10px;width:148px;height:60px;border-radius:999px;background:radial-gradient(circle,rgba(251,191,36,.24),transparent 70%);filter:blur(10px);animation:glow-pulse 3.5s ease-in-out infinite}
.mie-ayam-img{position:absolute;right:0;bottom:0;width:189px;height:auto;display:block;filter:drop-shadow(0 16px 18px rgba(15,23,42,.18)) saturate(1.04);animation:ma-breathe 4s ease-in-out infinite}
.mie-ayam-effects{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.steam{fill:none;stroke:#7c2d12;stroke-width:3;stroke-linecap:round;opacity:0;stroke-dasharray:42;stroke-dashoffset:42;animation:steam-rise 2.8s ease-in-out infinite}
.steam.two{animation-delay:.55s}
.heart{transform-origin:center;animation:heart-float 2.6s ease-in-out infinite;filter:drop-shadow(0 5px 8px rgba(239,68,68,.26))}
.sparkle{transform-origin:center;animation:sparkle 1.8s ease-in-out infinite}
.sparkle.two{animation-delay:.45s}
.sparkle.three{animation-delay:.85s}
.sparkle.four{animation-delay:1.15s}
@keyframes ma-enter{from{opacity:0;transform:translate(34px,28px) scale(.82) rotate(4deg)}to{opacity:1;transform:translate(0,0) scale(1) rotate(0)}}
@keyframes ma-float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-7px) rotate(-1deg)}}
@keyframes ma-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}
@keyframes glow-pulse{0%,100%{opacity:.5;transform:scaleX(1)}50%{opacity:.85;transform:scaleX(1.08)}}
@keyframes steam-rise{0%{opacity:0;stroke-dashoffset:42;transform:translateY(12px)}35%{opacity:.75}100%{opacity:0;stroke-dashoffset:0;transform:translateY(-16px)}}
@keyframes heart-float{0%,100%{transform:translateY(0) rotate(-8deg) scale(1)}50%{transform:translateY(-11px) rotate(7deg) scale(1.08)}}
@keyframes sparkle{0%,100%{opacity:.22;transform:scale(.7) rotate(0)}50%{opacity:1;transform:scale(1.18) rotate(18deg)}}
`.trim();
}

/** @deprecated kept for backward compat — use buildAlertCss or buildLeaderboardCss */
export function buildCss(bgUri: string, _fullHeight = true): string {
  return buildAlertCss(bgUri);
}
