import { App } from 'aws-cdk-lib';
import { type CloudFormationStackArtifact } from 'aws-cdk-lib/cx-api';
import { StaticSiteStack } from './app';

/**
 * @typedef environment
 * @property {string} account - AWS account ID
 * @property {string} region  - AWS deploy region 
 */
type environment = { account: string, region: string }

/**
* @typedef IApplicationProps
* @property {string}         domainName   - domain name to depoy for
* @property {string}         webAssetPath -  Path to your web asset build folder [e.g. .dist || .build || .out]
* @property {environment}    env          - Object containing your AWS #account ID and #region
* @exports IApplicationProps
*/
interface IApplicationProps {
    readonly domainName: string;
    readonly webAssetPath: string;
    readonly env: environment;
}

/**
 * @class
 * @exports Application
 */
export class Application {
    /**
     * @constructor
     * @param {IApplicationProps} props 
     * @returns {CloudFormationStackArtifact} temlate
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
