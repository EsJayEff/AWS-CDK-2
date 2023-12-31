import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient();

type AppSyncEvent = {
  info: {
    fieldName: String;
  };
  arguments: {
    product: Product;
    productId: String;
  };
};

type Product = {
  id: String;
  name: String;
  price: Number;
};


exports.handler = async (event: AppSyncEvent) => {
 
  if (event.info.fieldName == "showProduct") {
    const params = {
      TableName: process.env.TABLE_NAME || "",
    };
    const data = await documentClient.scan(params).promise();
    return data.Items;
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

    const params = {
      TableName: process.env.TABLE_NAME || "",
      Key: event.arguments.product,
    };

    const data = await documentClient.update(params).promise();
    console.log("After Updating= ", data);
    return "Updated"
  }   
  else {
    return "Not Found";
  }
};


