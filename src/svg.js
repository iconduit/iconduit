import { cssifyObject as css } from "css-in-js-utils";

export function createSvgTransformer(withBrowserPage) {
  return async function transformSvg(url, options = {}) {
    const { maskColor, style = {} } = options;

    return withBrowserPage(async (page) => {
      await page.goto(url);

      return page.evaluate(
        ({ maskColor, style }) => {
          const svg = document.documentElement;
          const createElement = document.createElementNS.bind(
            document,
            "http://www.w3.org/2000/svg"
          );

          const wrapper = createElement("g");
          wrapper.setAttribute("style", style);

          const childNodes = Array.from(svg.childNodes);
          svg.appendChild(wrapper);
          childNodes.forEach(wrapper.appendChild.bind(wrapper));

          if (maskColor) {
            const maskStyle = createElement("style");
            maskStyle.appendChild(
              document.createTextNode(
                `*{stroke:none!important;fill:${maskColor}!important}`
              )
            );

            svg.appendChild(maskStyle);
          }

          return svg.outerHTML + "\n";
        },

        { maskColor, style: css({ transformOrigin: "center", ...style }) }
      );
    });
  };
}
