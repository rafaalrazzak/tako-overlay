import { OverlayDocument } from "../OverlayDocument";
import { createRender, type OverlayProps } from "../render";
import { buildLeaderboardCss } from "../styles";

const script = `(function(){var list=document.getElementById("ranking-list");var data=document.getElementById("ranking-data");function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}try{var rankings=JSON.parse(data.textContent||"[]");if(!Array.isArray(rankings)||!rankings.length){list.innerHTML='<div class="rounded-2xl border border-white/50 bg-white/76 px-4 py-5 text-center text-[15px] font-bold text-slate-500">No rankings yet</div>';return;}list.innerHTML=rankings.map(function(r,i){return'<div class="flex min-h-[68px] items-center gap-4 rounded-2xl border border-white/50 bg-white/76 px-4 py-3"><span class="rank w-8 shrink-0 text-center text-lg font-black leading-none text-slate-500">'+(i+1)+'</span><span class="min-w-0 flex-1 truncate text-2xl font-[850] leading-tight text-[#2f2a2e]">'+esc(r.name||"Anonymous")+'</span><span class="max-w-[8rem] shrink-0 truncate text-base font-[750] leading-tight text-amber-600">'+esc(r.formattedAmount||"")+'</span></div>';}).join("");}catch(e){list.innerHTML='<div class="rounded-2xl border border-white/50 bg-white/76 px-4 py-5 text-center text-[15px] font-bold text-slate-500">Failed to load</div>';if(window.console)console.error(e);}})();`;

function Leaderboard({ css }: OverlayProps) {
  return (
    <OverlayDocument css={css}>
      <body className="overflow-hidden">
        <div className="leaderboard relative isolate w-full rounded-[28px] border border-white/50 bg-[rgba(255,253,245,.9)] outline outline-1 outline-offset-[-6px] outline-[rgba(250,204,21,.56)] overflow-hidden">
          <header className="border-b border-black/5 px-5 pt-6 pb-4 text-center">
            <h2 className="truncate text-2xl font-black uppercase leading-none text-[#2f2a2e]">{"{{title}}"}</h2>
          </header>
          <div id="ranking-list" className="flex flex-col gap-2 p-2" />
        </div>
        <script
          id="ranking-data"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: "{{rankings}}" }}
        />
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </OverlayDocument>
  );
}

export const render = createRender(Leaderboard, buildLeaderboardCss);
