const {firefox} = require('playwright-firefox')

main().catch(error => { console.error(error) })

async function main () {
  const timeout = 10000

  const browser = await firefox.launch({timeout})
  const context = await browser.newContext({deviceScaleFactor: 3})
  context.setDefaultTimeout(timeout)
  const page = await context.newPage()
  await page.setViewportSize({width: 180, height: 180})

  await page.goto('file:///Users/erin/grit/github.com/iconduit/iconduit/test/fixture/iconduit/icon.png')

  try {
    await page.screenshot({type: 'png', path: 'sample.png'})
  } finally {
    await page.close()
    await context.close()
    await browser.close()
  }
}
