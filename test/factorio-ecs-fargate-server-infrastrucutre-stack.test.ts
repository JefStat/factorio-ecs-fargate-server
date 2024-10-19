import './test-env';
import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import {
  FactorioEcsFargateServerInfrastructureStack
} from '../src/lib/factorio-ecs-fargate-server-infrastructure-stack/factorio-ecs-fargate-server-infrastructure-stack';

const env = {
  region: 'us-east-1',
  account: '111222333444',
};

describe('FactorioEcsFargateServerInfrastructureStack', () => {
  test('Synths Stack', async () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new FactorioEcsFargateServerInfrastructureStack(app, 'MyTestStack', {env});
    // WHEN
    const synth = SynthUtils.toCloudFormation(stack);
    // THEN
    expect(synth).toMatchSnapshot();
  });
});
