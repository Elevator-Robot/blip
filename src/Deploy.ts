import { CloudFormation } from '@aws-sdk/client-cloudformation';
import { IDeployProps } from './types';

const cfnClient = new CloudFormation({
    region: 'us-east-1',
});

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
            });
        } catch (error) {
            console.log(error);
        }
    }
}