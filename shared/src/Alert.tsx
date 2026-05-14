import { MieAyam } from "../MieAyam";
import { OverlayDocument } from "../OverlayDocument";
import { createRender, type OverlayProps } from "../render";
import { buildAlertCss } from "../styles";

const script = `(function(){var badges="{{gifterBadges}}";var el=document.getElementById("badges");if(badges&&el){el.innerHTML=badges.split(",").map(function(b){b=b.trim();return b?'<img src="https://assets.tako.id/badges/'+b+'.png" alt="" class="size-6 shrink-0"/>':""}).join("")}var msg=document.getElementById("content");if(msg){var t=msg.textContent||"";msg.innerHTML=t.replace(/\\[([a-zA-Z0-9_]+)\\]/g,function(_,n){return'<img src="https://assets.tako.id/stickers/'+n+'.png" alt="" class="align-middle h-10 inline-block"/>'})}document.documentElement.style.fontSize="16px"})();`;

/** SVG star decoration */
function DecoStar() {
  return (
    <svg className="deco deco-star" viewBox="0 0 16 16" fill="#facc15" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0l2.2 5.5L16 6.1l-4.2 3.7 1.3 5.7L8 12.5l-5.1 3 1.3-5.7L0 6.1l5.8-.6z" />
    </svg>
  );
}

function Alert({ css, mieAyamSrc }: OverlayProps) {
  return (
    <OverlayDocument css={css}>
      <body className="p-2 pr-0 pt-0 text-2xl overflow-hidden">
        <main className="relative flex flex-col pb-10">
          {/* Panel */}
          <div className="alert-panel animate-panel-enter relative z-2 min-h-[178px] px-8 pt-7 pb-10 flex flex-col justify-center gap-3.5 rounded-[28px] bg-[rgba(255,253,245,.9)] border border-white/80 outline outline-1 outline-offset-[-5px] outline-[rgba(250,204,21,.56)] overflow-hidden">
            {/* Meta row */}
            <div className="flex items-center gap-2 text-[21px] leading-none">
              <div className="avatar-frame size-9 shrink-0 rounded-full bg-[#fef3c7]">
                <img
                  alt=""
                  className="size-full rounded-full object-cover border border-yellow-300/70 bg-gray-200"
                  src="{{gifterPicture}}"
                  id="profile-picture"
                />
              </div>
              <span className="min-w-0 truncate font-[850] text-[#2f2a2e]">{"{{gifterName}}"}</span>
              <div className="badges flex items-center gap-1 shrink-0" id="badges" />
              <span className="shrink-0 font-extrabold text-[#2f2a2e]/40">-</span>
              <span className="shrink-0 font-black text-[#92400e] whitespace-nowrap">{"{{formattedAmount}}"}</span>
            </div>
            {/* Message */}
            <span
              className="message text-[34px] font-[780] leading-[1.28] tracking-tight text-[#2f2a2e] [overflow-wrap:anywhere] [text-shadow:0_1px_0_rgba(255,255,255,.72)] animate-fade-in w-full pr-10"
              id="content"
            >
              {"{{message}}"}
            </span>

            {/* Decorations — floating shapes inside panel */}
            <div className="deco deco-dot deco-dot-1" />
            <div className="deco deco-dot deco-dot-2" />
            <div className="deco deco-dot deco-dot-3" />
            <div className="deco deco-ring" />
            <div className="deco deco-diamond" />
            <div className="deco deco-cross" />
            <DecoStar />
          </div>

          {/* Mie-ayam mascot */}
          <div className="absolute -bottom-2 -right-2 w-[220px] h-[190px] z-10 pointer-events-none">
            <MieAyam src={mieAyamSrc} />
          </div>
        </main>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </OverlayDocument>
  );
}

export const render = createRender(
  Alert,
  buildAlertCss,
  (html) => html.replace(
    /<img([^>]*id="profile-picture"[^>]*)\/>/,
    `<img$1 onerror="this.closest('.avatar-frame').remove()">`,
  ),
);
