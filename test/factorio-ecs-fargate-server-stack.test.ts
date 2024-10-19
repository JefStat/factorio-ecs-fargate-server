import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import {
  FactorioEcsFargateServerStack
} from '../src/lib/factorio-ecs-fargate-server-stack/factorio-ecs-fargate-server-stack';

const env = {
  region: 'us-east-1',
  account: '111222333444',
};
process.env.deploymentType = 'test';

describe('FactorioEcsFargateServerStack', () => {
  test('Synths Stack', async () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new FactorioEcsFargateServerStack(app, 'MyTestStack', {env});
    // WHEN
    const synth = SynthUtils.toCloudFormation(stack);
    // THEN
    expect(synth).toMatchSnapshot();
  });
});
