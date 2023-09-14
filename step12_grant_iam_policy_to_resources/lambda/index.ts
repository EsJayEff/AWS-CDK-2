import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient();

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    product: Product;
    productId: string;
  };
};

type Product = {
  id: string;
  p_name: string;
  price: number;
};




exports.handler = async (event: AppSyncEvent) => {
 
  if (event.info.fieldName == "showProduct") {
    const params = {
      TableName: process.env.TABLE_NAME || "",
    };
    const data = await documentClient.scan(params).promise();
    return data.Items;
  } 

  else  if (event.info.fieldName == "getOneProduct") {
    const params = {
        TableName: process.env.TABLE_NAME || "",
        Key: {
          id: event.arguments.productId,
        },
      };
      const data = await documentClient.get(params).promise();
      console.log("After Fetching = ", data);
      return data.Item;
  } 
  
  else if (event.info.fieldName == "addProduct") {
    event.arguments.product.id = "Key-" + Math.random();
    const params = {
      TableName: process.env.TABLE_NAME || "",
      Item: event.arguments.product,
    };
    const data = await documentClient.put(params).promise();
    console.log("After adding = ", data);
    return event.arguments.product;
  } 
  
  else if (event.info.fieldName == "deleteProduct") {
    const params = {
      TableName: process.env.TABLE_NAME || "",
      Key: {
        id: event.arguments.productId,
      },
    };
    const data = await documentClient.delete(params).promise();
    console.log("After deleting= ", data);
    return "Deleted";
  } 


  
  else if (event.info.fieldName == "updateProduct") {
    const myId:string = event.arguments.product.id
    const params = {
      TableName: process.env.TABLE_NAME || "",
      Key:{ 
           id: myId
          },
      UpdateExpression: "SET price = :newPrice, p_name =:newProductName",
      ExpressionAttributeValues: {
        ':newPrice': event.arguments.product.price,
        ':newProductName': event.arguments.product.p_name,
    },
    };
    const data = await documentClient.update(params).promise();
    console.log("After Updating= ", data);
    return "Data Has been Updated"
  }
  else {
    return "Not Found";
  }
};


