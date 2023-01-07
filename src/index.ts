import { App } from 'aws-cdk-lib';
import { StaticSiteStack } from './app';

interface ApplicationProps {
    readonly domainName: string;
    readonly webAssetPath: string;
    readonly env: { account: string, region: string };
}
export class Application {
    constructor(props: ApplicationProps) {

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
        const template = synth.getStackByName(stack.stackName).template;

        return template;

    }

}
