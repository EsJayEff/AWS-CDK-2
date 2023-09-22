import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent} from "aws-lambda";

exports.handleApiRequest = async (
  event: APIGatewayProxyEvent
) => {
  // prepare SQL command
  const rdsData = new AWS.RDSDataService();

  if (event.httpMethod == "GET") {
    console.log(event.httpMethod);
    const sqlParams = {
      secretArn: process.env.secretArn,
      resourceArn: process.env.dbClusterArn,
        sql: `CREATE TABLE IF NOT EXISTS books (serialNo INT,book_name VARCHAR(255),author VARCHAR(255) )`,
      database: "rdsPostgresqlDb",
      includeResultMetadata: true,
    } as AWS.RDSDataService.ExecuteStatementRequest;

    try {
      const result = await rdsData
        .executeStatement(sqlParams, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        })
        .promise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "command completed successfully",
          result: result,
          event: event,
        }),
      };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal The Server error",
              }),
        }
    }


  }
  else if (event.httpMethod == "POST") {
    const newBooks = await event.body
    const sqlParams = {
      secretArn: process.env.secretArn,
      resourceArn: process.env.dbClusterArn,
      sql: "INSERT INTO books (serialNo, book_name, author) VALUES (123, 'The Great Gatsby', 'F. Scott Fitzgerald');",
      database: "rdsPostgresqlDb",
      includeResultMetadata: true,
    } as AWS.RDSDataService.ExecuteStatementRequest;

    try {
      const result = await rdsData
        .executeStatement(sqlParams, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        })
        .promise();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "command completed successfully",
          result: result,
          event: event,
        }),
      };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal The Server error",
              }),
        }
    }
  }
 return {
    message: "HTTP method not found"
 }

};
