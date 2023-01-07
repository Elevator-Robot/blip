import { Application } from './index';
// const { Application } = require('@elevator-robot/blip');


const test = new Application({
    env: {
        account: '764114738171',
        region: 'us-east-1',
    },
    domainName: 'aaronwest.me',
    webAssetPath: 'dist',
});

console.log(test);