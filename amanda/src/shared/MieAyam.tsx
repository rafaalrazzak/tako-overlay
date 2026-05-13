export function MieAyam() {
  return (
    <div className="mie-ayam" aria-hidden="true">
      <div className="mie-ayam-inner">
        <div className="mie-ayam-glow" />
        <img className="mie-ayam-img" src="mie-ayam.png" alt="" />
        <svg className="mie-ayam-effects" viewBox="0 0 245 215" xmlns="http://www.w3.org/2000/svg">
          <g className="heart">
            <path
              d="M62 35 C50 26 39 37 46 50 C52 62 66 65 74 68 C82 57 92 47 84 36 C78 28 69 28 62 35Z"
              fill="#ef4444" stroke="#4b1d16" strokeWidth={4} strokeLinejoin="round"
            />
            <circle cx={77} cy={38} r={3} fill="#fecaca" />
            <circle cx={80} cy={44} r={2} fill="#fecaca" />
          </g>
          <path className="steam" d="M92 88 C79 76 99 69 88 55" />
          <path className="steam two" d="M112 84 C99 71 118 64 109 49" />
          <g className="sparkle">
            <path d="M35 158 L40 169 L51 174 L40 179 L35 190 L30 179 L19 174 L30 169 Z" fill="#fbbf24" />
          </g>
          <g className="sparkle two">
            <path d="M210 116 L214 125 L223 129 L214 133 L210 142 L206 133 L197 129 L206 125 Z" fill="#fbbf24" />
          </g>
          <g className="sparkle three">
            <circle cx={55} cy={120} r={3} fill="#f59e0b" />
            <circle cx={220} cy={92} r={3} fill="#f59e0b" />
          </g>
          <g className="sparkle four">
            <circle cx={198} cy={174} r={3} fill="#fbbf24" />
            <circle cx={28} cy={108} r={2.5} fill="#fbbf24" />
          </g>
        </svg>
      </div>
    </div>
  );
}
