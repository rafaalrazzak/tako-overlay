import type { ReactNode } from "react";

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";

export function OverlayDocument({ children, css }: { children: ReactNode; css: string }) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
        <style dangerouslySetInnerHTML={{ __html: `@import url("${FONTS_URL}");* { font-family: "Poppins", sans-serif; }\n${css}` }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
