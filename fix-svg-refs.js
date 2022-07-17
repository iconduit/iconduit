// const NS_SVG = "http://www.w3.org/2000/svg";
const NS_XLINK = "http://www.w3.org/1999/xlink";
const SVG_REFERENCE_HREF_TAG_NAMES = [
    "image",
    "linearGradient",
    "pattern",
    "radialGradient",
    "textPath",
    "use",
];
const SVG_REFERENCE_ATTRIBUTES = [
    "clip-path",
    "fill",
    "filter",
    "marker-end",
    "marker-mid",
    "marker-start",
    "mask",
    "stroke",
];
main().catch((error) => {
    console.error(error);
});
async function main() {
    await domReady();
    const svgLoader = createSvgLoader();
    await svgLoader.loadSvgs();
}
function createSvgLoader() {
    const domParser = new DOMParser();
    const loadedDocuments = {};
    const svgs = {};
    return {
        async loadSvgs() {
            const references = {};
            const documentHref = new URL(window.location.href);
            // const container = createContainer();
            for (const svg of document.getElementsByTagName("svg")) {
                findReferences(references, documentHref, svg);
            }
            const documents = findDocuments(references);
            const documentsToLoad = filterLoadedDocuments(documents);
            await Promise.all(Object.values(documentsToLoad).map((href) => loadSvg(href)));
            console.log(svgs);
        },
    };
    // function createContainer(): HTMLElement | SVGElement {
    //   if (document.documentElement instanceof SVGSVGElement) {
    //     return document.createElementNS(NS_SVG, "defs");
    //   }
    //   const container = document.createElementNS(NS_SVG, "svg");
    //   container.setAttribute("hidden", "");
    //   return container;
    // }
    async function loadSvg(href) {
        const hrefString = href.toString();
        loadedDocuments[hrefString] = href;
        const res = await fetch(href);
        if (!res.ok)
            return;
        try {
            const loaded = domParser.parseFromString(await res.text(), "text/xml");
            if (loaded.documentElement instanceof SVGSVGElement) {
                svgs[hrefString] = loaded.documentElement;
            }
        }
        catch { }
    }
    function findReferences(references, documentHref, svg) {
        for (const tagName of SVG_REFERENCE_HREF_TAG_NAMES) {
            const elements = svg.getElementsByTagName(tagName);
            for (const element of elements) {
                const reference = element.getAttribute("href") ?? "";
                const xlinkReference = element.getAttributeNS(NS_XLINK, "href") ?? "";
                if (reference) {
                    const href = new URL(reference, documentHref);
                    references[href.toString()] = createReference(href);
                }
                if (xlinkReference) {
                    const href = new URL(xlinkReference, documentHref);
                    references[href.toString()] = createReference(href);
                }
            }
        }
        for (const attribute of SVG_REFERENCE_ATTRIBUTES) {
            const elements = svg.querySelectorAll(`[${attribute}]:not([${attribute}=""]`);
            for (const element of elements) {
                const reference = element.getAttribute(attribute) ?? "";
                const referenceUrl = parseCssUrlReference(reference);
                if (referenceUrl) {
                    const href = new URL(referenceUrl, documentHref);
                    references[href.toString()] = createReference(href);
                }
            }
        }
        return references;
    }
    function createReference(href) {
        const documentHref = new URL(href);
        documentHref.hash = "";
        const fragment = href.hash.replace(/^#/, "");
        return { href, documentHref, fragment };
    }
    function findDocuments(references) {
        const documents = {};
        for (const { documentHref } of Object.values(references)) {
            documents[documentHref.toString()] = documentHref;
        }
        return documents;
    }
    function filterLoadedDocuments(documents) {
        const filtered = {};
        for (const href in documents) {
            if (!loadedDocuments[href])
                filtered[href] = documents[href];
        }
        return filtered;
    }
}
function parseCssUrlReference(value) {
    let remainder = value.trimStart();
    if (!remainder.startsWith("url("))
        return ""; // non-url
    remainder = remainder.substring(4).trimStart();
    const quoteStyle = (() => {
        if (remainder.startsWith('"'))
            return '"';
        if (remainder.startsWith("'"))
            return "'";
        return "";
    })();
    if (quoteStyle)
        remainder = remainder.substring(1);
    let state = "consume";
    let endChar = "";
    let result = "";
    for (const c of remainder) {
        if (state === "consume") {
            if (c === " " || c === ")" || c === quoteStyle) {
                state = "end";
                endChar = c;
                break;
            }
            if (c === "\\") {
                state = "escape";
            }
            else {
                result += c;
            }
        }
        else if (state === "escape") {
            result += c;
            state = "consume";
        }
    }
    if (state !== "end")
        return "";
    if (quoteStyle && endChar !== quoteStyle)
        return "";
    return result;
}
// function findExternalUses() {
//   const uses = document.getElementsByTagNameNS(SVG, "use");
//   return [...uses].filter((use) => {
//     const hrefAttribute = use.getAttribute("href");
//     if (hrefAttribute.startsWith("#")) return false;
//     const href = new URL(hrefAttribute, window.location.href);
//     href.hash = "";
//     return seenHrefs[href.toString()] == null;
//   });
// }
// async function flattenUses(uses) {
//   await Promise.all(uses.map((use) => flattenUse(use)));
// }
// async function flattenUse(use) {
//   const hrefAttribute = use.getAttribute("href");
//   const svgHref = new URL(hrefAttribute, window.location.href);
//   svgHref.hash = "";
//   const svg = await loadSvg(svgHref);
//   if (svg == null) return;
//   const symbol = createSymbolFromSvg(svg, svgHref);
//   use.ownerDocument.documentElement.appendChild(symbol);
//   const useHref = new URL(hrefAttribute, window.location.href);
//   const mappedId = idMap[useHref.toString()];
//   use.setAttribute("href", `#${mappedId}`);
//   use.dataset.__fixSvgUseHref = shortenUrl(useHref);
// }
// async function loadSvg(href) {
//   seenHrefs[href.toString()] = true;
//   const res = await fetch(href);
//   if (!res.ok) return undefined;
//   const domParser = new DOMParser();
//   const document = domParser.parseFromString(await res.text(), "text/xml");
//   return document.documentElement;
// }
// function createSymbolFromSvg(svg, href) {
//   const symbol = document.createElementNS(SVG, "symbol");
//   symbol.setAttribute("id", svg.getAttribute("id") ?? "");
//   symbol.setAttribute("viewBox", svg.getAttribute("viewBox") ?? "");
//   symbol.replaceChildren(...svg.children);
//   symbol.dataset.__fixSvgUseHref = shortenUrl(href);
//   remapId(symbol, href);
//   for (const element of symbol.querySelectorAll('*[id]:not([id=""])')) {
//     remapId(element, href);
//   }
//   remapAllUrlReferences(symbol, "fill", href);
//   return symbol;
// }
// function remapId(element, documentHref) {
//   const elementId = element.getAttribute("id");
//   if (!elementId) return;
//   const anchor = `#${encodeURIComponent(element.getAttribute("id"))}`;
//   const elementHref = new URL(anchor, documentHref);
//   const mappedId = nextId();
//   idMap[elementHref.toString()] = mappedId;
//   element.setAttribute("id", mappedId);
//   element.dataset.__fixSvgUseId = elementId;
// }
// function remapAllUrlReferences(node, type, documentHref) {
//   for (const element of node.querySelectorAll(`*[${type}]:not([${type}=""])`)) {
//     const remappedAttribute = remapUrlReference(
//       element.getAttribute(type) ?? "",
//       documentHref
//     );
//     if (remappedAttribute) {
//       element.setAttribute(type, remappedAttribute);
//     } else {
//       element.removeAttribute(type);
//     }
//     const remappedStyle = remapUrlReference(
//       element.style[type] ?? "",
//       documentHref
//     );
//     if (remappedStyle) {
//       element.style[type] = remappedStyle;
//     } else {
//       element.style.removeProperty(type);
//     }
//   }
// }
// function remapUrlReference(reference, documentHref) {
//   const match = reference.match(/^url\(([^)]+)\)$/);
//   if (!match) return reference;
//   const [, content] = match;
//   const href = content.startsWith('"') ? JSON.parse(content) : content;
//   const fullHref = new URL(href, documentHref);
//   const mappedId = idMap[fullHref.toString()];
//   return mappedId ? `url(${JSON.stringify(`#${mappedId}`)})` : undefined;
// }
// function shortenUrl(url) {
//   if (url.origin !== window.location.origin) return url.toString();
//   return url.toString().substring(url.origin.length);
// }
// function nextId() {
//   return `__fix_svg_use_${idSequence++}`;
// }
function domReady() {
    return new Promise((resolve) => {
        if (document.readyState !== "loading") {
            resolve();
        }
        else {
            document.addEventListener("DOMContentLoaded", () => {
                resolve();
            });
        }
    });
}
