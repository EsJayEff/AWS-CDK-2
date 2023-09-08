import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class Step01HelloLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'Step01HelloLambdaQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

  new s3.Bucket(this, 'MySecondyBucket', {
  versioned: true   
  })

    const hello = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    const api = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: hello,
      proxy : false,
    });

    const api2 = new apigw.LambdaRestApi(this, "Endpoint2", {
      handler: hello,
      proxy : false,
    });

const items = api.root.addResource('cars');
const items_2 = api.root.addResource('helloworld');
items.addMethod('GET');
items_2.addMethod('GET');


const items2 = api2.root.addResource('trucks');
items2.addMethod('GET');

  }
}
