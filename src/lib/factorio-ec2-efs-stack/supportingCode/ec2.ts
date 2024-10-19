import {
  Instance, Vpc, InstanceType, InstanceClass, InstanceSize, MachineImage,
  KeyPair, SecurityGroup, Peer, Port, SubnetType
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { vpcName } from '../../resources/constants';

export function createEc2(stack: Construct) {
  const {deploymentType, publicKey, localIp} = process.env;
  const vpc = Vpc.fromLookup(stack, "vpc", {
    vpcName,
  });

  const keyPair = new KeyPair(stack, 'KeyPair', {
    publicKeyMaterial: publicKey,
  });

  const ec2SecurityGroupName = "factorio-ec2-efs-access-security-group"
  const securityGroup = new SecurityGroup(stack, ec2SecurityGroupName, {
    vpc,
    allowAllOutbound: true,
    securityGroupName: `${deploymentType}-${ec2SecurityGroupName}`,
  });
  securityGroup.addIngressRule(Peer.ipv4(`${localIp}/32`), Port.tcp(22), 'Allow SSH access from local');

  // Amazon Linux 2
  new Instance(stack, 'efs-access-ec2', {
    instanceName: `${deploymentType}-factorio-efs-access`,
    vpc,
    vpcSubnets: {
      subnetType: SubnetType.PUBLIC
    },
    instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
    machineImage: MachineImage.latestAmazonLinux2023(),
    associatePublicIpAddress: true,
    securityGroup,
    keyPair,
  });
}