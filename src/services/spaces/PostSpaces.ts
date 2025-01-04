import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidV4 } from "uuid";
import { APIHelper } from "../../infra/shared/APIHelper";
import { APIError } from "../../infra/shared/ApiErrors";

async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const body = APIHelper.validateRequestBody(event, ["location"]);
  if (body instanceof APIError) {
    return body;
  }

  const id = uuidV4();

  const item = {
    Id: { S: id },
    Location: { S: body.location },
  };

  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: item,
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Space created!",
      result: JSON.stringify(id),
    }),
  };
}

export { postSpaces };
