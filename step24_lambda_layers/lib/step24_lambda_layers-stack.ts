import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";

export class Step24LambdaLayersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   // The code that defines your stack goes here

   const lambdaLayer = new lambda.LayerVersion(this, "LambdaLayer", {
    code: lambda.Code.fromAsset('lambda-layer'),
  })

  new lambda.Function(this, 'LambdaWithLambdaLayer', {
    runtime: lambda.Runtime.NODEJS_18_X, // execution environment
    code: lambda.Code.fromAsset('lambda-fns'),  // code loaded from the "lambda" directory
    handler: 'lambda.handler',  // file is "lambda", function is "handler"
    layers: [lambdaLayer]
  })

  }
}
