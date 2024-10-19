import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createEc2 } from "./supportingCode/ec2";

export class FactorioEc2EfsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    createEc2(this);
  }
}