const puppeteer = require('puppeteer');
const BlinkDiff = require('blink-diff');

export async function compare(options) {
  const { testUrl, masterUrl, selector, controlPage, viewport } = options;
  const browser = await puppeteer.launch();

  const pageUrls = [testUrl, masterUrl];
  const screenshots = [];

    for (let i = 0; i < pageUrls.length; i++) {
        let page = await browser.newPage();

        // Set viewport
        if (viewport) {
            page.setViewport(viewport);
        }

        // Go to URL
        await page.goto(pageUrls[i], { waitUntil: 'networkidle2' });

        // Apply optional page actions
        if (controlPage) {
            await controlPage(page)
        }

        const screenshot = selector ?
            await screenshotBySelector(page, selector) :
            await screenshotPage(page);

        screenshots.push(screenshot);
    }

    await browser.close();
    return await compareImages(...screenshots);
}

export async function compareImages(testImage, masterImage) {
    return new Promise((resolve, reject) => {
        const diff = new BlinkDiff({
            imageA: testImage,
            imageB: masterImage,

            thresholdType: BlinkDiff.THRESHOLD_PIXEL,
            threshold: 500,

            imageOutputPath: './diff.png'
        });

        diff.run((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(diff.hasPassed(result.code));
            }
        });
    });
}

export async function screenshotPage(page) {
  return await page.screenshot({ fullPage: true });
}

async function screenshotBySelector(page, selector) {
  const { x, y, width, height } = await page.$eval(selector, el =>
    JSON.parse(JSON.stringify(el.getBoundingClientRect())) // Hacks on hacks
  );

  return await page.screenshot({ clip: { x, y, width, height } });
}
