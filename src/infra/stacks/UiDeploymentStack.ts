import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../utils/NamingUtils";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import {
  AccessLevel,
  Distribution,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);
    const deploymentBucket = new Bucket(this, "UiDeploymentBucket", {
      bucketName: `space-finder-frontend-${suffix}`,
    });

    const uiDir = join(__dirname, "../../frontend/dist");
    if (!existsSync(uiDir)) {
      console.warn("Ui dir not found: " + uiDir);
      return;
    }

    new BucketDeployment(this, "SpacesFinderDeployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
    });

    const originIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    deploymentBucket.grantRead(originIdentity);

    const distribution = new Distribution(this, "SpacesFinderDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
          originAccessLevels: [AccessLevel.READ],
        }),
      },
    });

    new CfnOutput(this, 'SpacesFinderUrl', {
      value: distribution.distributionDomainName
    })
  }
}
