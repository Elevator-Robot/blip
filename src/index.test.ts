import { Application } from "./index";
// import { Template } from "aws-cdk-lib/assertions";

describe("TestStack", () => {
  test("synthesizes the way we expect", () => {

    const app = new Application({
      domainName: "aaronwest.me",
      webAssetPath: "./",
      env: {
        account: "123456789",
        region: "us-east-1",
      },
    });

    expect(app) // this needs to be beafed up

    });
});
