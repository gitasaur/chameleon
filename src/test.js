import { compare } from './index'

const options = {
    testUrl: 'http://google.com',
    masterUrl: 'http://google.com',
    viewport: {
        width: 1024,
        height: 768
    },
    selector: '.A8SBwf', // CSS Selector
    controlPage: async page => {
        // page is a puppeteer page object (https://pptr.dev/#?product=Puppeteer&version=v1.12.2&show=api-class-page)
        await page.type('.gLFyf', 'hello world');
        await page.waitFor(300);
    }
};

async function init() {
    console.log(await compare(options).catch(e => console.log(e)))
}

init();