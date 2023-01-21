import { StackProps } from 'aws-cdk-lib';



/**
 * IStaticSiteProps
 * @readonly
 * @property domainName   - domain name to depoy for
 * @property webAssetPath -  Path to your web asset build folder [e.g. .dist || .build || .out]
 */
export interface IStaticSiteProps extends StackProps {
    readonly domainName: string;
    readonly webAssetPath: string;
}

export interface IStaticSiteStackProps extends IStaticSiteProps {
    readonly env: {
        account: string;
        region: string;
    }
}

export interface IDeployProps {
    readonly StackName: string;
    readonly TemplateBody: string;
}


