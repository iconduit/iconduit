const SVG = "http://www.w3.org/2000/svg";
const seenHrefs = {};
const idMap = {};
let idSequence = 0;

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
  const svgHref = new URL(hrefAttribute, window.location.href);
  svgHref.hash = "";
  const svg = await loadSvg(svgHref);

  if (svg == null) return;

  const symbol = createSymbolFromSvg(svg, svgHref);
  use.ownerDocument.documentElement.appendChild(symbol);

  const useHref = new URL(hrefAttribute, window.location.href);
  const mappedId = idMap[useHref.toString()];

  use.setAttribute("href", `#${mappedId}`);
  use.dataset.__fixSvgUseHref = shortenUrl(useHref);
}

async function loadSvg(href) {
  seenHrefs[href.toString()] = true;
  const res = await fetch(href);

  if (!res.ok) return undefined;

  const domParser = new DOMParser();
  const document = domParser.parseFromString(await res.text(), "text/xml");

  return document.documentElement;
}

function createSymbolFromSvg(svg, href) {
  const symbol = document.createElementNS(SVG, "symbol");
  symbol.setAttribute("id", svg.getAttribute("id") ?? "");
  symbol.setAttribute("viewBox", svg.getAttribute("viewBox") ?? "");
  symbol.replaceChildren(...svg.children);
  symbol.dataset.__fixSvgUseHref = shortenUrl(href);
  remapId(symbol, href);

  for (const element of symbol.querySelectorAll('*[id]:not([id=""])')) {
    remapId(element, href);
  }

  remapAllUrlReferences(symbol, "fill", href);

  return symbol;
}

function remapId(element, documentHref) {
  const elementId = element.getAttribute("id");

  if (!elementId) return;

  const anchor = `#${encodeURIComponent(element.getAttribute("id"))}`;
  const elementHref = new URL(anchor, documentHref);
  const mappedId = nextId();
  idMap[elementHref.toString()] = mappedId;
  element.setAttribute("id", mappedId);
  element.dataset.__fixSvgUseId = elementId;
}

function remapAllUrlReferences(node, type, documentHref) {
  for (const element of node.querySelectorAll(`*[${type}]:not([${type}=""])`)) {
    const remappedAttribute = remapUrlReference(
      element.getAttribute(type) ?? "",
      documentHref
    );

    if (remappedAttribute) {
      element.setAttribute(type, remappedAttribute);
    } else {
      element.removeAttribute(type);
    }

    const remappedStyle = remapUrlReference(
      element.style[type] ?? "",
      documentHref
    );

    if (remappedStyle) {
      element.style[type] = remappedStyle;
    } else {
      element.style.removeProperty(type);
    }
  }
}

function remapUrlReference(reference, documentHref) {
  const match = reference.match(/^url\(([^)]+)\)$/);

  if (!match) return reference;

  const [, content] = match;
  const href = content.startsWith('"') ? JSON.parse(content) : content;
  const fullHref = new URL(href, documentHref);

  const mappedId = idMap[fullHref.toString()];

  return mappedId ? `url(${JSON.stringify(`#${mappedId}`)})` : undefined;
}

function shortenUrl(url) {
  if (url.origin !== window.location.origin) return url.toString();

  return url.toString().substring(url.origin.length);
}

function nextId() {
  return `__fix_svg_use_${idSequence++}`;
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
