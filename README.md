# chameleon
Visual Regression Testing for Front End Applications

## Install

`npm install @mgrk/charmeleon --save-dev`

## Usage

For use within a test:

```
it('should match vr', async () => {
  const options = {
    testUrl: 'http://localhost:4200',
    masterUrl: 'http://localhost:4201',
    selector: 'img'
  };

  expect(await compare(options)).toBe(true);
});
```