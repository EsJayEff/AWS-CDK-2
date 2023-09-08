import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class Step04AppsyncLambdaDynamodbStack2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'Step04AppsyncLambdaDynamodbStack2Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    new s3.Bucket(this, 'MySixthBucket', {
      versioned: true   
      })
    
    
        const api = new appsync.GraphqlApi(this, "MYDB_API_1", {
          name: 'cdk-appsync-dynamodb-api-1',
          schema: appsync.SchemaFile.fromAsset('schema/schema.gql'),       ///Path specified for lambda
          authorizationConfig: {
            defaultAuthorization: {
              authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type
              apiKeyConfig: {
                expires: cdk.Expiration.after(cdk.Duration.days(365))   ///set expiration for API Key
              }
            },
          },
        })
    
    ///Print Graphql Api Url on console after deploy
    new cdk.CfnOutput(this, "APIGraphQlURL", {
      value: api.graphqlUrl
    })
    
    ///Print API Key on console after deploy
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });
    
    const lambda_function = new lambda.Function(this, "DynamoDBLambda", {
          runtime: lambda.Runtime.NODEJS_18_X,            ///set nodejs runtime environment
          code: lambda.Code.fromAsset("lambda"),          ///path for lambda function directory
          handler: 'index.handler',                       ///specfic function in specific file
          // timeout: cdk.Duration.seconds(10)               ///Time for function to break. limit upto 15 mins
        })
    
    const lambda_DataSource = api.addLambdaDataSource('LambdaDataSource', lambda_function);
    
    // Describing resolver for datasource
    // lambda_DataSource.createResolver("resolver1",{
    //   typeName: 'Query',
    //   fieldName: 'welcome',
    // });
    
    lambda_DataSource.createResolver("resolver2",{
      typeName: 'Mutation',
      fieldName: 'addProduct',
    });

    lambda_DataSource.createResolver("resolver3",{
      typeName: 'Mutation',
      fieldName: 'deleteProduct',
    });

    lambda_DataSource.createResolver("resolver4",{
      typeName: 'Query',
      fieldName: 'showProduct',
    });
   
    lambda_DataSource.createResolver("resolver5",{
      typeName: 'Mutation',
      fieldName: 'updateProduct',
    });
   
    



    const productTable = new ddb.Table(this, 'ProductTable', {
      tableName:"ProductsTest",
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    
    productTable.grantFullAccess(lambda_function)
    lambda_function.addEnvironment('TABLE_NAME', productTable.tableName);
    }
}

