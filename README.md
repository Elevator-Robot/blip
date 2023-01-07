# Blip

<!-- create dashboard for circleci status -->

[![CircleCI](https://circleci.com/gh/Elevator-Robot/blip/tree/main.svg?style=shield)](https://circleci.com/gh/Elevator-Robot/blip/tree/main)
[![npm version](https://badge.fury.io/js/%40elevator-robot%2Fblip.svg)](https://badge.fury.io/js/%40elevator-robot%2Fblip)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
## What is Blip?
Blip is a CDK construct that deploys a static website to AWS. It creates a CloudFront distribution, S3 bucket, and Route53 record set. It also creates a certificate for the domain name if one does not already exist.

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
import { MyConstruct } from "@elevator-robot/blip";
import * as cdk from "aws-cdk-lib";

const app = new cdk.App();
const stack = new MyConstruct(app, "MyConstruct", {
  domainName: "example.com",
  webAssetPath: "path-to-build-artifacts",
});
```

## Contribution guide
1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a PR
