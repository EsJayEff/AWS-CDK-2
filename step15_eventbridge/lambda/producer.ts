import {EventBridge} from "aws-sdk";

exports.handler = async function (event:any) {
const eventBridge = new EventBridge();

const result = await eventBridge.putEvents({
  Entries:[
    {
     EventBusName:"default",
     Source: "orderService",
     DetailType:"AddOrder",
     Detail: JSON.stringify({
      productName:"T-Shirt",
      productPrice:"56"
     })
    }
  ]
}).promise();

  console.log("Request: \n" + JSON.stringify(result));
  const testResult = JSON.stringify(result);
  return{
   statusCode: 200,
   headers: {"Content-Type": "text/plain"},
   body: `Producer Event, CDK! You've hit ${testResult}\n`
  }
};
