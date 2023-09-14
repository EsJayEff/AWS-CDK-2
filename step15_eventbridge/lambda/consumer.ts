exports.handler = async function (event:any) {
  console.log("Request: \n" + JSON.stringify(event, undefined, 2));
  return{
   statusCode: 200,
   headers: {"Content-Type": "text/plain"},
   body: `Consumer Event, CDK! You've hit ${event}\n`
  }
};
