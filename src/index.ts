import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as r53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as uploadS3 from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as r53Targets from 'aws-cdk-lib/aws-route53-targets';

export interface MyConstructProps {
    readonly domainName: string;
    readonly webAssetPath: string;
}

// create cdk construct
export class MyConstruct extends Construct {
    constructor(scope: Construct, id: string, props: MyConstructProps) {
        super(scope, id);

        const bucket = new s3.Bucket(this, 'AaronwestMeBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            versioned: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
        });

        const zone = r53.HostedZone.fromLookup(this, 'Zone', {
            domainName: props.domainName,
        });

        const certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
            domainName: props.domainName,
            hostedZone: zone,
            region: 'us-east-1',
        });

        new uploadS3.BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [uploadS3.Source.asset(props.webAssetPath)],
            destinationBucket: bucket,
        });

        const distribution = new cloudfront.Distribution(this, 'MyDistribution', {
            defaultBehavior: {
            origin: new origins.S3Origin(bucket),
            allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
            enabled: true,
            domainNames: [props.domainName],
            certificate: certificate,
            enableLogging: true,
            logFilePrefix: 'aaronwest.me/distribution-logs',
            defaultRootObject: 'index.html',
        });

        bucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [bucket.arnForObjects('*')],
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
            conditions: {
            StringEquals: {'aws:Referer': certificate.certificateArn}
            },
        }));

        const record = new r53.ARecord(this, 'AliasRecord', {
            zone,
            recordName: props.domainName,
            target: r53.RecordTarget.fromAlias(new r53Targets.CloudFrontTarget(distribution)),
            deleteExisting: true,
            ttl: cdk.Duration.seconds(60),
        });

        new cdk.CfnOutput(this, 'DistributionDomainName', {
            value: distribution.distributionDomainName,
        });
        new cdk.CfnOutput(this, 'DomainName', {
            value: record.domainName,
        });
        new cdk.CfnOutput(this, 'BucketUrl', {
            value: bucket.bucketWebsiteUrl,
        });


    }
}