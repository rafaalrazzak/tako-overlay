import { renderToStaticMarkup } from "react-dom/server";
import { MieAyam } from "./shared/MieAyam";
import { reset, base, tokens, mieAyamStyles, animations } from "./shared/styles";

const css = `
${reset}
${tokens}
${base}
body{padding:8px}

.alert{position:relative;border-radius:var(--r);background:var(--surface);box-shadow:0 20px 60px rgba(15,23,42,.18),inset 0 0 0 1px rgba(255,255,255,.72);animation:card-enter 700ms cubic-bezier(.2,.9,.2,1) both}
.alert::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at 88% 80%,rgba(251,191,36,.18),transparent 28%),linear-gradient(180deg,rgba(255,255,255,.52),rgba(255,255,255,.78)),var(--bg,none);background-size:cover;background-position:center;opacity:.95;z-index:0}
.alert::after{content:"";position:absolute;inset:12px;border-radius:var(--r-sm);border:1px solid rgba(255,255,255,.72);pointer-events:none;z-index:1}

.alert-content{position:relative;z-index:3;min-height:220px;display:flex;align-items:center;justify-content:center;gap:18px;text-align:center}

.avatar-frame{flex:0 0 86px;width:86px;height:86px;padding:5px;border-radius:26px;background:rgba(255,255,255,.82);box-shadow:0 10px 26px rgba(15,23,42,.13),inset 0 0 0 1px rgba(255,255,255,.9);animation:avatar-float 3.5s ease-in-out infinite}
.avatar-frame:has(.avatar[src=""]), .avatar-frame:has(.avatar:not([src])){display:none}
.avatar{width:100%;height:100%;display:block;object-fit:cover;border-radius:21px;background:#e5e7eb}
.avatar[src=""],.avatar:not([src]){display:none}

.main{min-width:0;max-width:590px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.title{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--text);font-size:28px;font-weight:900;line-height:1.1;letter-spacing:-.045em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.name{min-width:0;overflow:hidden;text-overflow:ellipsis}
.check{flex:0 0 21px;width:21px;height:21px;filter:drop-shadow(0 4px 8px rgba(34,197,94,.26));animation:check-pop 1.8s ease-in-out infinite}
.amount{margin-top:8px;color:var(--accent);font-size:28px;font-weight:900;line-height:1.1;letter-spacing:-.04em;text-shadow:0 6px 18px rgba(251,146,60,.25)}
.message{margin-top:10px;max-width:560px;color:var(--text-sub);font-size:28px;font-weight:650;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

${mieAyamStyles}
${animations}
`.trim();

function CheckIcon() {
  return (
    <svg className="check" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx={10} cy={10} r={10} fill="#22c55e" />
      <path d="M5.2 10.3 8.4 13.4 14.8 7" fill="none" stroke="#fff"
            strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Alert() {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="alert">
          <div className="alert-content">
            <div className="avatar-frame">
              <img className="avatar" src="{{gifterPicture}}" alt="" />
            </div>
            <main className="main">
              <div className="title">
                <span className="name">{"{{gifterName}}"}</span>
                <CheckIcon />
              </div>
              <div className="amount">{"{{formattedAmount}}"}</div>
              <div className="message">{"\"{{message}}\""}</div>
            </main>
          </div>
          <MieAyam />
        </div>
      </body>
    </html>
  );
}

export function render(): string {
  let html = "<!doctype html>" + renderToStaticMarkup(<Alert />);
  // React drops inline event attrs — restore onerror on the avatar img
  html = html.replace(
    `<img class="avatar" src="{{gifterPicture}}" alt=""/>`,
    `<img class="avatar" src="{{gifterPicture}}" alt="" onerror="this.closest('.avatar-frame').remove()"/>`
  );
  return html;
}
