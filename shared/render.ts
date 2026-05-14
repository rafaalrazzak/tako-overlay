import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";

export type OverlayProps = { css: string; mieAyamSrc: string };

export function createRender(
  Component: (props: OverlayProps) => ReactElement,
  cssFn: (bgUri: string) => string,
  postProcess?: (html: string) => string,
) {
  return function render(bgUri: string, mieAyamUri: string): string {
    let html = "<!doctype html>" + renderToStaticMarkup(
      Component({ css: cssFn(bgUri), mieAyamSrc: mieAyamUri }),
    );
    html = html.replace(/<link rel="preload" as="image"[^>]*>/g, "");
    if (postProcess) html = postProcess(html);
    return html;
  };
}
