import { MieAyam } from "../../../shared/MieAyam";
import { OverlayDocument } from "../../../shared/OverlayDocument";
import { createRender, type OverlayProps } from "../../../shared/render";
import { buildLeaderboardCss } from "../../../shared/styles";

const script = `(function(){var list=document.getElementById("ranking-list");var data=document.getElementById("ranking-data");function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}try{var rankings=JSON.parse(data.textContent||"[]");if(!Array.isArray(rankings)||!rankings.length){list.innerHTML='<div class="ranking-empty">No rankings yet</div>';return;}list.innerHTML=rankings.map(function(r,i){return'<p class="entry ranking-entry"><span class="rank ranking-rank">'+(i+1)+'</span><span class="ranking-name">'+esc(r.name||"Anonymous")+'</span><span class="ranking-amount">'+esc(r.formattedAmount||"")+'</span></p>';}).join("");}catch(e){list.innerHTML='<div class="ranking-empty">Failed to load leaderboard</div>';if(window.console)console.error("Leaderboard rankings parse failed",e);}})();`;

function Leaderboard({ css, mieAyamSrc }: OverlayProps) {
  return (
    <OverlayDocument css={css}>
      <div className="leaderboard">
        <header className="header">
          <h2 className="header-title">{"{{title}}"}</h2>
        </header>
        <div id="ranking-list" className="ranking-list" />
        <MieAyam src={mieAyamSrc} />
      </div>
      <script
        id="ranking-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: "{{rankings}}" }}
      />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </OverlayDocument>
  );
}

export const render = createRender(Leaderboard, buildLeaderboardCss);
