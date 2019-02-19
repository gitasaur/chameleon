import { compare } from './index'

const options = {
    testUrl: 'http://google.com',
    masterUrl: 'http://google.com',
    viewport: {
        width: 1024,
        height: 768
    },
    controlPage: async page => {
        await page.type('.gLFyf', 'hello world');
        await page.waitFor(300);
    }
};

async function init() {
    console.log(await compare(options))
}

init();