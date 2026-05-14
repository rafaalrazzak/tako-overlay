import { MieAyam } from "../../../shared/MieAyam";
import { OverlayDocument } from "../../../shared/OverlayDocument";
import { createRender, type OverlayProps } from "../../../shared/render";
import { buildAlertCss } from "../../../shared/styles";

const script = `(function(){var badges="{{gifterBadges}}";var el=document.getElementById("badges");if(badges&&el){el.innerHTML=badges.split(",").map(function(b){b=b.trim();return b?'<img src="https://assets.tako.id/badges/'+b+'.png" alt="" class="badge-img"/>':""}).join("")}var msg=document.getElementById("content");if(msg){var t=msg.textContent||"";msg.innerHTML=t.replace(/\\[([a-zA-Z0-9_]+)\\]/g,function(_,n){return'<img src="https://assets.tako.id/stickers/'+n+'.png" alt="" class="sticker"/>'})}document.documentElement.style.fontSize="16px"})();`;

function Alert({ css, mieAyamSrc }: OverlayProps) {
  return (
    <OverlayDocument css={css}>
      <div className="alert">
        <div className="alert-panel">
          <div className="alert-meta">
            <div className="avatar-frame">
              <img
                alt=""
                className="avatar"
                src="{{gifterPicture}}"
                id="profile-picture"
              />
            </div>
            <span className="gifter-name">{"{{gifterName}}"}</span>
            <div className="badges" id="badges" />
            <span className="amount-separator">-</span>
            <span className="amount">{"{{formattedAmount}}"}</span>
          </div>
          <span className="message" id="content">{"{{message}}"}</span>
        </div>
        <MieAyam src={mieAyamSrc} />
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </div>
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
