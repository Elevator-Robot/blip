import { App } from 'aws-cdk-lib';
import { type CloudFormationStackArtifact } from 'aws-cdk-lib/cx-api';
import { StaticSiteStack } from './app';

/**
 * AWS environment
 * @typeParam account - AWS account ID
 * @typeParam region  - AWS deploy region 
 */
type environment = { account: string, region: string }

/**
* IApplicationProps
* @readonly
* @param domainName   - domain name to depoy for
* @param webAssetPath -  Path to your web asset build folder [e.g. .dist || .build || .out]
* @typeParam env      - Object containing your AWS #account ID and #region
*/
interface IApplicationProps {
    readonly domainName: string;
    readonly webAssetPath: string;
    readonly env: environment;
}

/**
 * Returns a CloudFormationStackArtifact
 * @returns templater
 */
export class Application {
    /**
     * @param props 
     */
    constructor(props: IApplicationProps) {
        const app = new App();
        const stack = new StaticSiteStack(app, 'StaticSiteStack', {
            env: {
                account: props.env.account,
                region: props.env.region,
            },
            domainName: props.domainName,
            webAssetPath: props.webAssetPath,
        });
        const synth = app.synth();
        const template: CloudFormationStackArtifact = synth.getStackByName(stack.stackName).template;
        return template;
    }
}