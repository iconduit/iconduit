const SVG = "http://www.w3.org/2000/svg";
const seenHrefs = {};
let useNumber = 0;

main().catch((error) => {
  console.error(error);
});

async function main() {
  await domReady();

  for (let i = 0; i < 100; ++i) {
    const external = findExternalUses();

    if (external.length < 1) {
      break;
    }

    await flattenUses(external);
  }
}

function findExternalUses() {
  const uses = document.getElementsByTagNameNS(SVG, "use");

  return [...uses].filter((use) => {
    const hrefAttribute = use.getAttribute("href");

    if (hrefAttribute.startsWith("#")) return false;

    const href = new URL(hrefAttribute, window.location.href);
    href.hash = "";

    return seenHrefs[href.toString()] == null;
  });
}

async function flattenUses(uses) {
  await Promise.all(uses.map((use) => flattenUse(use)));
}

async function flattenUse(use) {
  const hrefAttribute = use.getAttribute("href");
  const href = new URL(hrefAttribute, window.location.href);
  // const hash = href.hash;
  href.hash = "";
  const svg = await loadSvg(href);

  if (svg == null) return;

  const symbol = createSymbolFromSvg(svg);
  symbol.dataset.__fixSvgUseHref = hrefAttribute;

  use.ownerDocument.documentElement.appendChild(symbol);
  use.setAttribute("href", `#${symbol.getAttribute("id")}`);
  use.dataset.__fixSvgUseHref = hrefAttribute;
}

async function loadSvg(href) {
  seenHrefs[href.toString()] = true;
  const res = await fetch(href);

  if (!res.ok) return undefined;

  const domParser = new DOMParser();
  const document = domParser.parseFromString(await res.text(), "text/xml");

  return document.documentElement;
}

function createSymbolFromSvg(svg) {
  const symbol = document.createElementNS(SVG, "symbol");
  symbol.setAttribute("id", `__fix_svg_use_${useNumber++}`);
  symbol.setAttribute("viewBox", svg.getAttribute("viewBox"));
  symbol.replaceChildren(...svg.children);

  // const idElements = symbol.querySelectorAll('*[id]:not([id=""])');
  // console.log(idElements);

  return symbol;
}

function domReady() {
  return new Promise((resolve) => {
    if (document.readyState !== "loading") {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        resolve();
      });
    }
  });
}
