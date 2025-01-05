import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { APIValidator } from "../shared/utils/APIValidator";
import { APIError, BadRequest } from "../shared/utils/ApiErrors";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

async function putSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const body = APIValidator.validateRequestBody(event, ["location"]);
  if (body instanceof APIError) {
    return body;
  }

  if (typeof event.queryStringParameters?.id !== "string") {
    return new BadRequest('Invalid query string parameter. Missing "id".');
  }
  const spaceId = event.queryStringParameters.id;

  const result = await ddbClient.send(
    new UpdateItemCommand({
      Key: marshall({ Id: spaceId }),
      TableName: process.env.TABLE_NAME,
      UpdateExpression: `SET #Location = :location`,
      ExpressionAttributeValues: {
        ":location": marshall(body.location),
      },
      ExpressionAttributeNames: {
        "#Location": "Location",
      },
      ReturnValues: "UPDATED_NEW"
    })
  );

  console.log(result);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Item "${spaceId}" updated!`,
      result: unmarshall(result.Attributes || {}),
    }),
  };
}

export { putSpace };
