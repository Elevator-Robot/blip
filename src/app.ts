import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HostedSite as site } from '@elevator-robot/cdk-s3-site'

/**
 * IStaticSiteProps
 * @readonly
 * @property domainName   - domain name to depoy for
 * @property webAssetPath -  Path to your web asset build folder [e.g. .dist || .build || .out]
 */
interface IStaticSiteProps {
    readonly domainName: string;
    readonly webAssetPath: string;
}

/**
 * Hosted Site Construct
 */
class HostedSite extends Construct {
    /**
     * @param scope - scope as Construct
     * @param id    - identifier
     * @param props - IStaticSiteProps
     */
    constructor(scope: Construct, id: string, props: IStaticSiteProps) {
        super(scope, id);

        const stack = Stack.of(this);

        new site(stack, 'BlipSite', {
            domainName: props.domainName,
            webAssetPath: props.webAssetPath,
        });

    }
}

/**
 * IStaticSiteStackProps
 * @readonly
 * @param domainName   - domain name to depoy for
 * @param webAssetPath -  Path to your web asset build folder [e.g. .dist || .build || .out]
 */
interface IStaticSiteStackProps extends StackProps {
    readonly domainName: string;
    readonly webAssetPath: string;
}

export class StaticSiteStack extends Stack {
    constructor(scope: Construct, id: string, props: IStaticSiteStackProps) {
        super(scope, id, props);

        const stack = Stack.of(this);

        new HostedSite(stack, 'Blip', {
            domainName: props.domainName,
            webAssetPath: props.webAssetPath,
        });
    }
}
