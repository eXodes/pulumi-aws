import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const bucket = new aws.s3.Bucket("s3-bucket", {
    bucket: "pulumi-aws-s3-bucket",
});

const ami = aws.ec2.getAmi({
    filters: [
        { name: "name", values: ["amzn-ami-hvm-*-x86_64-ebs"] },
    ],
    owners: ["137112412989"], // Amazon
    mostRecent: true,
}).then(result => result.id)

const group = new aws.ec2.SecurityGroup("ec2-security-group", {
    name: "pulumi-aws-ec2-security-group",
    ingress: [
        { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
    ],
});

const server = new aws.ec2.Instance("ec2-instance", {
    tags: { "Name": "pulumi-aws-ec2-instance" },
    instanceType: "t2.micro",
    vpcSecurityGroupIds: [ group.id ],
    ami: ami,
});

export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;
export const bucketName = bucket.id;
