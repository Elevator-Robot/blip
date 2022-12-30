# Blip

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
