// import { SESClient, SendEmailCommand} from "aws-sdk/clients/ses";
// import ses from "aws-sdk/clients/ses";
// import * as SendEmailCommand from "aws-sdk/clients/ses";
import { SES } from "aws-sdk";


const ses = new SES({ region: "us-west-2" });

export const handler = async(event:any) => {

const params = {
    Destination: {
        ToAddresses: ["shiraz.javed.farooq@gmail.com"],
    },
    Message: {
        Body: {
            Text: { Data: "Test" },
        },
        Subject: { Data: "Test Email" },
    },
    Source: "info@fcpsdissertation.com",
};


try {
    await ses.sendEmail(params).promise();
    // process data.
    return Responses._200({ message: 'The email has been sent' });
  }
  catch (error) {
    // error handling.
    console.log('error sending email ', error);
    return Responses._400 ({ message: 'The email failed to send' });
  }
};


const Responses = {
    _200(data: Object) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
            body: JSON.stringify(data),
        };
    },

    _400(data: Object) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 400,
            body: JSON.stringify(data),
        };
    },
};