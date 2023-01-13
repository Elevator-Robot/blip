# Blip
[![Test](https://github.com/Elevator-Robot/blip/actions/workflows/ci.yml/badge.svg)](https://github.com/Elevator-Robot/blip/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/%40elevator-robot%2Fblip.svg)](https://badge.fury.io/js/%40elevator-robot%2Fblip)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
## What is Blip?
Blip is a web deployment tool that uses AWS CDK to synthisize a cloudformation template capable of deploying a static website to AWS. It uses AWS CloudFront, S3, and Route53 to deploy a static website to AWS. It also uses AWS Certificate Manager to create a certificate for the domain name. Blip is a work in progress and is not ready for production use.
## Prerequisites
1. AWS programmatic credentials with necessary permissions to do this deployment
2. A registered domain on Route53
3. Web asset folder

## Using the Blip NPM package

1. make sure you have the latest version of the CDK CLI installed.
2. make sure your AWK CLI credentials && profile are setup.

   ```output
   nano ~/.aws/credentials
       [default]
       aws_access_key_id = ############
       aws_secret_access_key = ############
   ```

   ```output
   nano ~/.aws/config
       [default]
       region = <your region>
       output = json
   ```

3. install dependancies with npm
   ```bash
   npm install
   ```

### Example

```typescript
const { Application } = require('@elevator-robot/blip');

const test = new Application({
    env: {
        account: '764114738171',
        region: 'us-east-1',
    },
    domainName: 'aaronwest.me',
    webAssetPath: 'dist',
});

console.log(test);
```

## Contribution guide
1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a PR
