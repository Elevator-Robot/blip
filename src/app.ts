import { RemovalPolicy, CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { RecordTarget, ARecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, AllowedMethods, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

/**
 * @typedef IStaticSiteProps
 * @property {string}         domainName   - domain name to depoy for
 * @property {string}         webAssetPath -  Path to your web asset build folder [e.g. .dist || .build || .out]
 */
interface IStaticSiteProps {
    readonly domainName: string;
    readonly webAssetPath: string;
}

/**
 * @class
 */
class HostedSite extends Construct {
    /**
     * 
     * @param {Construct} scope 
     * @param {string} id 
     * @param {IStaticSiteProps} props 
     */
    constructor(scope: Construct, id: string, props: IStaticSiteProps) {
        super(scope, id);

        const stack = Stack.of(this);

        const bucket = new Bucket(stack, 'Bucket', {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            versioned: true,
            encryption: BucketEncryption.S3_MANAGED,
        });

        const zone = HostedZone.fromLookup(stack, 'Zone', {
            domainName: props.domainName,
        });

        const certificate = new DnsValidatedCertificate(stack, 'Certificate', {
            domainName: props.domainName,
            hostedZone: zone,
            region: 'us-east-1',
        });

        new BucketDeployment(stack, 'DeployToBucket', {
            sources: [Source.asset(props.webAssetPath)],
            destinationBucket: bucket,
        });

        const distribution = new Distribution(stack, 'Distribution', {
            defaultBehavior: {
                origin: new S3Origin(bucket),
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
            enabled: true,
            domainNames: [props.domainName],
            certificate: certificate,
            enableLogging: true,
            logFilePrefix: 'aaronwest.me/distribution-logs',
            defaultRootObject: 'index.html',
        });

        bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [bucket.arnForObjects('*')],
            principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
            conditions: {
                StringEquals: { 'aws:Referer': certificate.certificateArn }
            },
        }));

        const record = new ARecord(stack, 'AliasRecord', {
            zone,
            recordName: props.domainName,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
            deleteExisting: true,
            ttl: Duration.seconds(60),
        });

        new CfnOutput(stack, 'DistributionDomainName', {
            value: distribution.distributionDomainName,
        });
        new CfnOutput(stack, 'DomainName', {
            value: record.domainName,
        });
        new CfnOutput(stack, 'BucketUrl', {
            value: bucket.bucketWebsiteUrl,
        });
    }
}

/**
 * @typedef IStaticSiteStackProps
 * @property {string}         domainName   - domain name to depoy for
 * @property {string}         webAssetPath -  Path to your web asset build folder [e.g. .dist || .build || .out]
 * @extends StackProps
 */
interface IStaticSiteStackProps extends StackProps {
    readonly domainName: string;
    readonly webAssetPath: string;
}

export class StaticSiteStack extends Stack {
    constructor(scope: Construct, id: string, props: IStaticSiteStackProps) {
        super(scope, id, props);

        new HostedSite(stack, 'Blip', {
            domainName: props.domainName,
            webAssetPath: props.webAssetPath,
        });
    }
}
