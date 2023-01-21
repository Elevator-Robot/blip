import * as cfn from 'aws-sdk/clients/cloudformation';

const cfnClient = new cfn({
    region: 'us-east-1',
});

interface IDeployProps {
    readonly StackName: string;
    readonly TemplateBody: string;
}

export class Deploy {
    readonly StackName: string;
    readonly TemplateBody: string;
    constructor(props: IDeployProps) {
        this.StackName = props.StackName;
        this.TemplateBody = props.TemplateBody;

        try {
            cfnClient.createChangeSet({
                ChangeSetName: 'test',
                ChangeSetType: 'CREATE',
                StackName: this.StackName,
            }).promise();
        } catch (error) {
            console.log(error);
        }
    }
}