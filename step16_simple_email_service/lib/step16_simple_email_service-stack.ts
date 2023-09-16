import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as actions from 'aws-cdk-lib/aws-ses-actions';
import * as ses from 'aws-cdk-lib/aws-ses';

export class Step16SimpleEmailServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

       // The code that defines your stack goes here
 
    // Creating a IAM role for lambda to give access of ses send email
    const role = new Role(this, 'LambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    ///Attaching ses access to policy
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["ses:SendEmail", "ses:SendRawEmail", "logs:*"],
      resources: ['*']
    });

    //granting IAM permissions to role
    role.addToPolicy(policy);


const actionLambda = new lambda.Function(this, "SES_ACTION_LAMBDA", {
      runtime: lambda.Runtime.NODEJS_18_X,            ///set nodejs runtime environment
      code: lambda.Code.fromAsset("lambda"),          ///path for lambda function directory
      handler: 'index.handler',                       ///specfic function in specific file
      role: role
    })

    
  }
}