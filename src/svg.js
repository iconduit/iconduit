const {cssifyObject: css} = require('css-in-js-utils')

module.exports = {
  createSvgTransformer,
}

function createSvgTransformer (withBrowserPage) {
  return async function transformSvg (url, options = {}) {
    const {maskColor, style = {}} = options

    return withBrowserPage(async page => {
      await page.goto(url)

      return page.evaluate(
        ({maskColor, style}) => {
          const svg = document.documentElement
          const childNodes = Array.from(svg.childNodes)

          const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g')
          wrapper.setAttribute('style', style)

          svg.appendChild(wrapper)
          childNodes.forEach(wrapper.appendChild.bind(wrapper))

          if (maskColor) {
            const maskStyle = document.createElementNS('http://www.w3.org/2000/svg', 'style')
            maskStyle.appendChild(document.createTextNode(`*{stroke:none!important;fill:${maskColor}!important}`))

            svg.appendChild(maskStyle)
          }

          return svg.outerHTML + '\n'
        },

        {maskColor, style: css({transformOrigin: 'center', ...style})}
      )
    })
  }
}
