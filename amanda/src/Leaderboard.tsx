import { renderToStaticMarkup } from "react-dom/server";
import { MieAyam } from "./shared/MieAyam";
import { reset, base, tokens, mieAyamStyles, animations } from "./shared/styles";

const css = `
${reset}
${tokens}
${base}
body{padding:12px}

.leaderboard{position:relative;height:100%;border-radius:var(--r);background:var(--surface);border:1px solid var(--border);isolation:isolate}
.leaderboard::before{content:"";position:absolute;inset:0;z-index:-2;background:linear-gradient(180deg,rgba(255,255,255,.58),rgba(255,255,255,.82)),var(--bg),var(--surface);background-size:cover;background-position:center;background-repeat:no-repeat}
.leaderboard::after{content:"";position:absolute;inset:10px;z-index:-1;border-radius:calc(var(--r) - 8px);border:1px solid rgba(255,255,255,.58);pointer-events:none}

.header{padding:24px 20px 16px;text-align:center;border-bottom:1px solid var(--divider)}
.header h2{color:var(--text);font-size:24px;font-weight:900;line-height:1.1;letter-spacing:-.04em;text-transform:uppercase}

#ranking-list{height:calc(100% - 65px);padding:8px;display:flex;flex-direction:column;gap:8px;overflow:hidden}

.entry{display:flex;align-items:center;gap:14px;min-height:68px;padding:12px 16px;border-radius:var(--r-sm);background:var(--row);box-shadow:inset 0 0 0 1px rgba(255,255,255,.48);backdrop-filter:blur(8px)}
.rank{flex:0 0 32px;color:var(--text-sub);font-size:18px;font-weight:900;line-height:1;text-align:center}
.entry:nth-child(1) .rank{color:#fbbf24}
.entry:nth-child(2) .rank{color:#94a3b8}
.entry:nth-child(3) .rank{color:#b45309}

.avatar-frame{flex:0 0 44px;width:44px;height:44px;padding:3px;border-radius:14px;background:#fff;box-shadow:0 4px 10px rgba(15,23,42,.06)}
.avatar-frame.is-hidden{display:none}
.avatar{width:100%;height:100%;display:block;border-radius:11px;object-fit:cover;background:#e5e7eb}

.info{min-width:0;flex:1}
.name{display:block;color:var(--text);font-size:24px;font-weight:850;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.amount{display:block;margin-top:3px;color:var(--accent);font-size:16px;font-weight:750;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.empty{padding:22px 16px;border-radius:var(--r-sm);background:var(--row);color:var(--text-sub);font-size:15px;font-weight:700;text-align:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.48)}

${mieAyamStyles}
${animations}
`.trim();

const script = `
(function(){
  var list=document.getElementById("ranking-list");
  function el(t,c){var e=document.createElement(t);if(c)e.className=c;return e;}
  function entry(r,i){
    var pic=r.picture||"";
    var wrap=el("div","entry");
    var rank=el("div","rank");rank.textContent=i+1;
    var frame=el("div","avatar-frame"+(pic?"":" is-hidden"));
    var img=el("img","avatar");img.alt="";img.src=pic;
    img.onerror=function(){this.closest(".avatar-frame").remove();};
    frame.appendChild(img);
    var info=el("div","info");
    var name=el("span","name");name.textContent=r.name||"Anonymous";
    var amt=el("span","amount");amt.textContent=r.formattedAmount||"";
    info.append(name,amt);
    wrap.append(rank,frame,info);
    return wrap;
  }
  try{
    var data=JSON.parse("{{rankings}}");
    if(!Array.isArray(data)||!data.length){
      var e=el("div","empty");e.textContent="No rankings yet";list.appendChild(e);
    }else{
      var f=document.createDocumentFragment();
      data.forEach(function(r,i){f.appendChild(entry(r,i));});
      list.appendChild(f);
    }
  }catch(_){
    var e=el("div","empty");e.textContent="Failed to load leaderboard";list.appendChild(e);
  }
})();
`.trim();

function Leaderboard() {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="leaderboard">
          <header className="header">
            <h2>{"{{title}}"}</h2>
          </header>
          <div id="ranking-list" />
          <MieAyam />
        </div>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </html>
  );
}

export function render(): string {
  return "<!doctype html>" + renderToStaticMarkup(<Leaderboard />);
}
