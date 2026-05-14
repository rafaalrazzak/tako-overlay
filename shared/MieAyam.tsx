export function MieAyam({ src }: { src: string }) {
  return (
    <div className="mie-ayam" aria-hidden="true">
      {/* Float wrapper */}
      <div className="mie-ayam-inner">
        <img className="mie-ayam-img" src={src} alt="" />
        {/* SVG effects */}
        <svg className="mie-ayam-effects" viewBox="0 0 245 215" xmlns="http://www.w3.org/2000/svg">
          {/* Steam */}
          <path className="steam" d="M105 95 C95 80 110 72 100 58" />
          <path className="steam steam-two" d="M120 90 C110 75 125 67 117 52" />
          <path className="steam steam-three" d="M135 93 C125 78 140 70 132 55" />
          {/* Sparkles */}
          <g className="sparkle">
            <path d="M40 160 L44 170 L54 174 L44 178 L40 188 L36 178 L26 174 L36 170 Z" fill="#fbbf24" />
          </g>
          <g className="sparkle sparkle-two">
            <path d="M200 50 L203 58 L211 61 L203 64 L200 72 L197 64 L189 61 L197 58 Z" fill="#fbbf24" />
          </g>
          <g className="sparkle sparkle-three">
            <path d="M55 45 L57 51 L63 53 L57 55 L55 61 L53 55 L47 53 L53 51 Z" fill="#f59e0b" />
          </g>
          <g className="sparkle sparkle-four">
            <path d="M210 150 L213 157 L220 159 L213 161 L210 168 L207 161 L200 159 L207 157 Z" fill="#fbbf24" />
          </g>
          {/* Leaves */}
          <g className="leaf">
            <ellipse cx="35" cy="120" rx="8" ry="4" fill="#86efac" transform="rotate(-20 35 120)" />
          </g>
          <g className="leaf leaf-two">
            <ellipse cx="215" cy="100" rx="7" ry="3.5" fill="#86efac" transform="rotate(15 215 100)" />
          </g>
          {/* Noodle dots */}
          <g className="noodle-dots">
            <circle cx="70" cy="185" r="3" fill="#fcd34d" />
            <circle cx="82" cy="192" r="2.5" fill="#fcd34d" />
            <circle cx="60" cy="195" r="2" fill="#fde68a" />
          </g>
          {/* Sauce drops */}
          <g className="sauce-drops">
            <circle cx="180" cy="185" r="3" fill="#f97316" opacity=".7" />
            <circle cx="192" cy="190" r="2" fill="#fb923c" opacity=".6" />
          </g>
          {/* Floating decor */}
          <g className="decor-float">
            <circle cx="25" cy="80" r="4" fill="#c084fc" opacity=".6" />
            <circle cx="225" cy="40" r="3" fill="#fb7185" opacity=".5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
