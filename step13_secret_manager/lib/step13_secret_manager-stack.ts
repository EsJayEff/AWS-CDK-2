import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class Step13SecretManagerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   
   const secret = new secretsmanager.Secret(this, 'Secret',{
      generateSecretString:{
       secretStringTemplate:JSON.stringify({username: 'esjay', password:'12345'}),
       generateStringKey:'randomKey',
     },
     });  
     // SecretsManager generate a new secret value automatically

   const secretValue = secretsmanager.Secret.fromSecretNameV2(this,'secretValueId', secret.secretName);
  
   }
}
