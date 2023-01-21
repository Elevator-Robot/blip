import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HostedSite } from '@elevator-robot/cdk-s3-site'
import { IStaticSiteStackProps } from './types';

const app = new App();

class stack extends Stack {
    constructor(scope: Construct, id: string, props: IStaticSiteStackProps) {
        super(scope, id, props);
        new HostedSite(this, 'StaticSite', {
            domainName: props.domainName,
            webAssetPath: props.webAssetPath,
        });
    }
}

export class Synthisize {
    constructor(props: IStaticSiteStackProps) {

        new stack(app, 'StaticSiteStack', props);

        const template = app.synth().getStackArtifact('StaticSiteStack').template;

        return template;

    }
}