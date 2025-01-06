import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BadRequest } from "../shared/utils/APIErrors";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIValidator } from "../shared/utils/APIValidator";

async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  
  APIValidator.validateAdminAccess(event); 

  if (typeof event.queryStringParameters?.id !== "string") {
    return new BadRequest('Invalid query string parameter. Missing "id".');
  }
  const spaceId = event.queryStringParameters.id;

  await ddbClient.send(
    new DeleteItemCommand({
      Key: marshall({ Id: spaceId }),
      TableName: process.env.TABLE_NAME,
      ReturnValues: "NONE"
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Item "${spaceId}" deleted!`,
    }),
  };
}

export { deleteSpace };
