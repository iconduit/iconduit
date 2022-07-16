const SVG = "http://www.w3.org/2000/svg";
let useNumber = 0;

main().catch((error) => {
  console.error(error);
});

async function main() {
  await domReady();

  for (let i = 0; i < 100; ++i) {
    const uses = findUses();

    if (uses.length < 1) {
      break;
    }

    await flattenUses(uses);
  }
}

function findUses() {
  const uses = document.getElementsByTagNameNS(SVG, "use");

  return [...uses].filter((use) => !isLocalHref(use.getAttribute("href")));
}

function isLocalHref(hrefAttribute) {
  const windowHref = new URL(window.location.href);
  windowHref.hash = "";
  windowHref.search = "";

  const href = new URL(hrefAttribute, window.location.href);
  href.hash = "";
  href.search = "";

  return href.href === windowHref.href;
}

async function flattenUses(uses) {
  await Promise.all(uses.map((use) => flattenUse(use)));
}

async function flattenUse(use) {
  console.log("Flattening", use);

  const href = new URL(use.getAttribute("href"), window.location.href);

  try {
    const svg = await loadSvg(href);
    const symbol = createSymbolFromSvg(svg);

    use.parentNode.insertBefore(symbol, use);
    use.setAttribute("href", `#${symbol.getAttribute("id")}`);
  } catch {}
}

async function loadSvg(href) {
  const res = await fetch(href);

  if (!res.ok) {
    throw new Error(
      `Unexpected HTTP status ${res.status} when fetching ${href}`
    );
  }

  const domParser = new DOMParser();
  const document = domParser.parseFromString(await res.text(), "text/xml");

  return document.documentElement;
}

function createSymbolFromSvg(svg) {
  const symbol = document.createElementNS(SVG, "symbol");
  symbol.setAttribute("id", `__fix_svg_use_${useNumber++}`);
  symbol.setAttribute("viewBox", svg.getAttribute("viewBox"));
  symbol.replaceChildren(...svg.children);

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
