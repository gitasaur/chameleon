# chameleon
Visual Regression Testing for Front End Applications

## Install

`npm install @mgrk/chameleon --save-dev`

## Usage

For use within a test:

```
import compare from '@mgrk/chameleon';

...

describe('Simple First Test for VR', () => {
    it('should match vr', async (done) => {
      const options = {
        testUrl: 'http://localhost:4200',
        masterUrl: 'http://localhost:4201',
        selector: 'img'};
     expect(await compare(options).catch((err)=> {console.log(err.message)}).then).toBeTruthy();
     done();
     },50000);
});
```