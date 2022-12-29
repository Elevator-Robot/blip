import { Construct } from 'constructs';
export interface MyConstructProps {
    readonly domainName: string;
    readonly webAssetPath: string;
}
export declare class MyConstruct extends Construct {
    constructor(scope: Construct, id: string, props: MyConstructProps);
}
