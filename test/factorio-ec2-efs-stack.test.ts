import './test-env';
import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import { FactorioEc2EfsStack } from '../src/lib/factorio-ec2-efs-stack/factorio-ec2-efs-stack';

const env = {
  region: 'us-east-1',
  account: '111222333444',
};

describe('FactorioEc2EfsStack', () => {
  test('Synths Stack', async () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new FactorioEc2EfsStack(app, 'MyTestStack', {env});
    // WHEN
    const synth = SynthUtils.toCloudFormation(stack);
    // THEN
    expect(synth).toMatchSnapshot();
  });
});
