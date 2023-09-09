import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class Step12GrantIamPolicyToResourcesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'Step12GrantIamPolicyToResourcesQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    new s3.Bucket(this, 'MySeventhBucket', {
      versioned: true   
      })
    

  const api = new appsync.GraphqlApi(this, "GRAPHQL_API", {
      name: 'cdk-api',
      schema: appsync.SchemaFile.fromAsset('graphql/schema.gql'),       ///Path specified for lambda
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))   ///set expiration for API Key
          }
        },
      },
      xrayEnabled: true                                             ///Enables xray debugging
    })

    ///Print Graphql Api Url on console after deploy
    new cdk.CfnOutput(this, "APIGraphQlURL", {
      value: api.graphqlUrl
    })

    ///Print API Key on console after deploy
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });


    ///Defining a DynamoDB Table
    const dynamoDBTable = new ddb.Table(this, 'Table', {
      tableName:"DataTable",
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    

    ///create a specific role for Lambda function
    const role = new Role(this, 'LambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    ///Attaching DynamoDb access to policy
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['dynamodb:*', "logs:*"],
      resources: ['*']
    });

    //granting IAM permissions to role
    role.addToPolicy(policy);

    ///Lambda Fucntion
    const lambda_function = new lambda.Function(this, "LambdaFucntion", {
      runtime: lambda.Runtime.NODEJS_18_X,            ///set nodejs runtime environment
      code: lambda.Code.fromAsset("lambda"),          ///path for lambda function directory
      handler: 'index.handler',                       ///specfic fucntion in specific file
      timeout: cdk.Duration.seconds(10),              ///Time for function to break. limit upto 15 mins
      role: role,                                     ///Defining role to Lambda
      environment : {                                 ///Setting Environment Variables
        "TABLE": dynamoDBTable.tableName
      },
    })

    const lambda_data_source = api.addLambdaDataSource("LamdaDataSource", lambda_function);
    lambda_function.addEnvironment('TABLE_NAME', dynamoDBTable.tableName);

    ///Resolver mapping template reference for Lambda is also being used in it it will customize the way you want the data in your lambda function
    ////NOTE: No need to write response Mapping Template for it if you also want to customize the response then you can write response Mapping Template.
  // Describing resolver for datasource

  lambda_data_source.createResolver("resolver1",{
      typeName: 'Mutation',
      fieldName: 'getOneProduct',
    });
    
    lambda_data_source.createResolver("resolver2",{
      typeName: 'Mutation',
      fieldName: 'addProduct',
    });

    lambda_data_source.createResolver("resolver3",{
      typeName: 'Mutation',
      fieldName: 'deleteProduct',
    });

    lambda_data_source.createResolver("resolver4",{
      typeName: 'Query',
      fieldName: 'showProduct',
    });
   
    lambda_data_source.createResolver("resolver5",{
      typeName: 'Mutation',
      fieldName: 'updateProduct',
    });


  }
}
