import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { APIValidator } from "../shared/utils/APIValidator";
import { APIError } from "../shared/utils/ApiErrors";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const body = APIValidator.validateRequestBody(event, ["location"]);
  if (body instanceof APIError) {
    return body;
  }

  const id = randomUUID();

  const item = marshall({
    Id: id,
    Location: body.location,
  });

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
      result: id,
    }),
  };
}

export { postSpaces };
