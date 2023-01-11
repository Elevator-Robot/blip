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

        const bucket = new Bucket(this, 'Bucket', {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            versioned: true,
            encryption: BucketEncryption.S3_MANAGED,
        });

        const zone = HostedZone.fromLookup(this, 'Zone', {
            domainName: props.domainName,
        });

        const certificate = new DnsValidatedCertificate(this, 'Certificate', {
            domainName: props.domainName,
            hostedZone: zone,
            region: 'us-east-1',
        });

        new BucketDeployment(this, 'DeployToBucket', {
            sources: [Source.asset(props.webAssetPath)],
            destinationBucket: bucket,
        });

        const distribution = new Distribution(this, 'Distribution', {
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

        const record = new ARecord(this, 'AliasRecord', {
            zone,
            recordName: props.domainName,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
            deleteExisting: true,
            ttl: Duration.seconds(60),
        });

        new CfnOutput(this, 'DistributionDomainName', {
            value: distribution.distributionDomainName,
        });
        new CfnOutput(this, 'DomainName', {
            value: record.domainName,
        });
        new CfnOutput(this, 'BucketUrl', {
            value: bucket.bucketWebsiteUrl,
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

        new HostedSite(this, 'Blip', {
            domainName: props.domainName,
            webAssetPath: props.webAssetPath,
        });
    }
}
