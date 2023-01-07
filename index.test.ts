import {Application} from './src/index';

const test = new Application({
    domainName: 'aaronwest.me',
    webAssetPath: 'dist',
});

console.log(test);