"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyConstruct = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("aws-cdk-lib");
const constructs_1 = require("constructs");
const s3 = require("aws-cdk-lib/aws-s3");
const r53 = require("aws-cdk-lib/aws-route53");
const acm = require("aws-cdk-lib/aws-certificatemanager");
const uploadS3 = require("aws-cdk-lib/aws-s3-deployment");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
const iam = require("aws-cdk-lib/aws-iam");
const r53Targets = require("aws-cdk-lib/aws-route53-targets");
// create cdk construct
class MyConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
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
                StringEquals: { 'aws:Referer': certificate.certificateArn }
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
exports.MyConstruct = MyConstruct;
_a = JSII_RTTI_SYMBOL_1;
MyConstruct[_a] = { fqn: "blip.MyConstruct", version: "1.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUFtQztBQUNuQywyQ0FBdUM7QUFFdkMseUNBQXlDO0FBQ3pDLCtDQUErQztBQUMvQywwREFBMEQ7QUFDMUQsMERBQTBEO0FBQzFELHlEQUF5RDtBQUN6RCw4REFBOEQ7QUFDOUQsMkNBQTJDO0FBQzNDLDhEQUE4RDtBQU85RCx1QkFBdUI7QUFDdkIsTUFBYSxXQUFZLFNBQVEsc0JBQVM7SUFDdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDcEQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxTQUFTLEVBQUUsSUFBSTtZQUNmLFVBQVUsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVTtTQUM3QyxDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ2pELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtTQUMvQixDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3JFLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixVQUFVLEVBQUUsSUFBSTtZQUNoQixNQUFNLEVBQUUsV0FBVztTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDMUQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BELGlCQUFpQixFQUFFLE1BQU07U0FDNUIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNyRSxlQUFlLEVBQUU7Z0JBQ2pCLE1BQU0sRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUNwQyxjQUFjLEVBQUUsVUFBVSxDQUFDLGNBQWMsQ0FBQyxjQUFjO2dCQUN4RCxvQkFBb0IsRUFBRSxVQUFVLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCO2FBQ3RFO1lBQ0QsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQy9CLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGFBQWEsRUFBRSxnQ0FBZ0M7WUFDL0MsaUJBQWlCLEVBQUUsWUFBWTtTQUNsQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQy9DLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUN6QixTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDbEUsVUFBVSxFQUFFO2dCQUNaLFlBQVksRUFBRSxFQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsY0FBYyxFQUFDO2FBQ3hEO1NBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNoRCxJQUFJO1lBQ0osVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLE1BQU0sRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqRixjQUFjLEVBQUUsSUFBSTtZQUNwQixHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2hDLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDOUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxzQkFBc0I7U0FDN0MsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDbEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO1NBQzNCLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ2pDLEtBQUssRUFBRSxNQUFNLENBQUMsZ0JBQWdCO1NBQ2pDLENBQUMsQ0FBQztJQUdQLENBQUM7O0FBdEVMLGtDQXVFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHI1MyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgKiBhcyBhY20gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5pbXBvcnQgKiBhcyB1cGxvYWRTMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtZGVwbG95bWVudCc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIG9yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyByNTNUYXJnZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzLXRhcmdldHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE15Q29uc3RydWN0UHJvcHMge1xuICAgIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZztcbiAgICByZWFkb25seSB3ZWJBc3NldFBhdGg6IHN0cmluZztcbn1cblxuLy8gY3JlYXRlIGNkayBjb25zdHJ1Y3RcbmV4cG9ydCBjbGFzcyBNeUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE15Q29uc3RydWN0UHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdBYXJvbndlc3RNZUJ1Y2tldCcsIHtcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgdmVyc2lvbmVkOiB0cnVlLFxuICAgICAgICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5TM19NQU5BR0VELFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB6b25lID0gcjUzLkhvc3RlZFpvbmUuZnJvbUxvb2t1cCh0aGlzLCAnWm9uZScsIHtcbiAgICAgICAgICAgIGRvbWFpbk5hbWU6IHByb3BzLmRvbWFpbk5hbWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNlcnRpZmljYXRlID0gbmV3IGFjbS5EbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSh0aGlzLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICAgICAgICBkb21haW5OYW1lOiBwcm9wcy5kb21haW5OYW1lLFxuICAgICAgICAgICAgaG9zdGVkWm9uZTogem9uZSxcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyB1cGxvYWRTMy5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lXaXRoSW52YWxpZGF0aW9uJywge1xuICAgICAgICAgICAgc291cmNlczogW3VwbG9hZFMzLlNvdXJjZS5hc3NldChwcm9wcy53ZWJBc3NldFBhdGgpXSxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkRpc3RyaWJ1dGlvbih0aGlzLCAnTXlEaXN0cmlidXRpb24nLCB7XG4gICAgICAgICAgICBkZWZhdWx0QmVoYXZpb3I6IHtcbiAgICAgICAgICAgIG9yaWdpbjogbmV3IG9yaWdpbnMuUzNPcmlnaW4oYnVja2V0KSxcbiAgICAgICAgICAgIGFsbG93ZWRNZXRob2RzOiBjbG91ZGZyb250LkFsbG93ZWRNZXRob2RzLkFMTE9XX0dFVF9IRUFELFxuICAgICAgICAgICAgdmlld2VyUHJvdG9jb2xQb2xpY3k6IGNsb3VkZnJvbnQuVmlld2VyUHJvdG9jb2xQb2xpY3kuUkVESVJFQ1RfVE9fSFRUUFNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgZG9tYWluTmFtZXM6IFtwcm9wcy5kb21haW5OYW1lXSxcbiAgICAgICAgICAgIGNlcnRpZmljYXRlOiBjZXJ0aWZpY2F0ZSxcbiAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmc6IHRydWUsXG4gICAgICAgICAgICBsb2dGaWxlUHJlZml4OiAnYWFyb253ZXN0Lm1lL2Rpc3RyaWJ1dGlvbi1sb2dzJyxcbiAgICAgICAgICAgIGRlZmF1bHRSb290T2JqZWN0OiAnaW5kZXguaHRtbCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtidWNrZXQuYXJuRm9yT2JqZWN0cygnKicpXSxcbiAgICAgICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Nsb3VkZnJvbnQuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICAgIFN0cmluZ0VxdWFsczogeydhd3M6UmVmZXJlcic6IGNlcnRpZmljYXRlLmNlcnRpZmljYXRlQXJufVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGNvbnN0IHJlY29yZCA9IG5ldyByNTMuQVJlY29yZCh0aGlzLCAnQWxpYXNSZWNvcmQnLCB7XG4gICAgICAgICAgICB6b25lLFxuICAgICAgICAgICAgcmVjb3JkTmFtZTogcHJvcHMuZG9tYWluTmFtZSxcbiAgICAgICAgICAgIHRhcmdldDogcjUzLlJlY29yZFRhcmdldC5mcm9tQWxpYXMobmV3IHI1M1RhcmdldHMuQ2xvdWRGcm9udFRhcmdldChkaXN0cmlidXRpb24pKSxcbiAgICAgICAgICAgIGRlbGV0ZUV4aXN0aW5nOiB0cnVlLFxuICAgICAgICAgICAgdHRsOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdEaXN0cmlidXRpb25Eb21haW5OYW1lJywge1xuICAgICAgICAgICAgdmFsdWU6IGRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25Eb21haW5OYW1lLFxuICAgICAgICB9KTtcbiAgICAgICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0RvbWFpbk5hbWUnLCB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmRvbWFpbk5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQnVja2V0VXJsJywge1xuICAgICAgICAgICAgdmFsdWU6IGJ1Y2tldC5idWNrZXRXZWJzaXRlVXJsLFxuICAgICAgICB9KTtcblxuXG4gICAgfVxufSJdfQ==