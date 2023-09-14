import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as events from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";


export class Step15EventbridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

 // lambda that will produce our custom event.
 const producerFn = new lambda.Function(this, "producerLambda", {
  code: lambda.Code.fromAsset("lambda"),
  handler: "producer.handler",
  runtime: lambda.Runtime.NODEJS_18_X,
});

// Grant the lambda permission to put custom events on eventbridge
events.EventBus.grantAllPutEvents(producerFn);

// The lambda function which our eventbridge rule will trigger when it matches the country as PK
const consumerFn = new lambda.Function(this, "consumerLambda", {
  code: lambda.Code.fromAsset("lambda"),
  handler: "consumer.handler",
  runtime: lambda.Runtime.NODEJS_18_X,
});

// Api gateway to be able to send custom events from frontend
// const api = new apigateway.LambdaRestApi(this, "testApi", {
//   handler: producerFn,
// });


// The rule that filters events to match country == "PK" and sends them to the consumer Lambda.
const rule = new events.Rule(this, "EventRule", {
  ruleName:"FirstEventRule",
  targets: [new eventTargets.LambdaFunction(consumerFn)],
  description:
    "Filter events that come from country PK and invoke lambda with it.",
  eventPattern: {
    source:["orderService"],
    // detail:{
    // price:["50","21","70"]
    // },
  },
});
  }
}

