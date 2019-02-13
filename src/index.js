const puppeteer = require('puppeteer');
const BlinkDiff = require('blink-diff');

export default async function compare(options) {
  return new Promise(async (resolve, reject) => {
    const testUrl = options.testUrl;
    const masterUrl = options.masterUrl;
    const selector = options.selector;

    const testScreenShot = selector ?
      await screenshotDOMElement(testUrl, selector) :
      await getScreenshot(testUrl);
    const masterScreenShot = selector ?
      await screenshotDOMElement(masterUrl, selector) :
      await getScreenshot(masterUrl);

    const diff = new BlinkDiff({
      imageA: testScreenShot,
      imageB: masterScreenShot,

      thresholdType: BlinkDiff.THRESHOLD_PERCENT,
      threshold: 0,

      imageOutputPath: './diff.png'
    });

    diff.run(function (error, result) {
      if (error) {
        reject(error);
      } else {
        if (result.differences === 0){
          resolve("Passed with no differences");
        } else {
          reject("Failed with "+result.differences);
        }
      }
    });
  });
}


export async function getScreenshot(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const snap = await page.screenshot();
  await browser.close();

  return snap;
}

export async function getBrowser() {
  const browser = await puppeteer.launch();
  return await browser.newPage();
}

async function screenshotDOMElement(url, selector) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const {x, y, width, height} = await page.$eval(selector, el =>
    JSON.parse(JSON.stringify(el.getBoundingClientRect())) // Hacks on hacks
  );

  const screenshot = await page.screenshot({
    clip: {
      x,
      y,
      width,
      height,
    }
  });

  await browser.close();
  return screenshot;
}
