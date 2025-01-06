import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BadRequest } from "../shared/utils/APIErrors";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if (typeof event.queryStringParameters.id !== "string") {
      return new BadRequest('Invalid query string parameter. Missing "id".');
    }
    return getSpaceById(event.queryStringParameters.id, ddbClient);
  }

  return getAllSpaces(ddbClient);
}

async function getSpaceById(spaceId: string, ddbClient: DynamoDBClient) {
  const result = await ddbClient.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({ Id: spaceId }),
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item ? unmarshall(result.Item) : null),
  };
}

async function getAllSpaces(ddbClient: DynamoDBClient) {
  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items?.map((item => unmarshall(item)))),
  };
}

export { getSpaces };
