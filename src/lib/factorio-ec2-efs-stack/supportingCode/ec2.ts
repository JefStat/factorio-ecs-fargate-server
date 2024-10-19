import { Fn } from 'aws-cdk-lib';
import {
  Instance, Vpc, InstanceType, InstanceClass, InstanceSize, MachineImage,
  KeyPair, SecurityGroup, Peer, Port, SubnetType
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { factorioFileSystemId_CFN_Output, vpcName } from '../../resources/constants';

export function createEc2(stack: Construct) {
  const {deploymentType, publicKey, localIp, region} = process.env;
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
  const instance = new Instance(stack, 'efs-access-ec2', {
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


  instance.userData.addCommands(
    "yum check-update -y",
    "yum upgrade -y",
    "yum install -y amazon-efs-utils",
    "yum install -y nfs-utils",
    "file_system_id_1=" + Fn.importValue(factorioFileSystemId_CFN_Output),
    "efs_mount_point_1=/mnt/efs/fs1",
    'mkdir -p "${efs_mount_point_1}"',
    'test -f "/sbin/mount.efs" && echo "${file_system_id_1}:/ ${efs_mount_point_1} efs defaults,_netdev" >> /etc/fstab || ' + 'echo "${file_system_id_1}.efs.' + region + '.amazonaws.com:/ ${efs_mount_point_1} nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport,_netdev 0 0" >> /etc/fstab',
    "mount -a -t efs,nfs4 defaults"
  );
}