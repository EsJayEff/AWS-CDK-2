import {SNSEvent , Context } from 'aws-lambda';

export async function handler(event: SNSEvent, context: Context){

  // logging the event generated by SNS
  console.log(event.Records[0].Sns)
 
}