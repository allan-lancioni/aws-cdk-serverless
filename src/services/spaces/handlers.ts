import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  APIError,
  MethodNotAllowed,
  InternalServerError,
} from "../shared/utils/ApiErrors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { putSpace } from "./PutSpace";
import { deleteSpace } from "./DeleteSpace";

const ddbClient = new DynamoDBClient();
async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    switch (event.httpMethod) {
      case "GET":
        return getSpaces(event, ddbClient);
      case "POST":
        return postSpaces(event, ddbClient);
      case "PUT":
        return putSpace(event, ddbClient);
      case "DELETE":
        return deleteSpace(event, ddbClient);
      default:
        return new MethodNotAllowed();
    }
  } catch (error) {
    if (error instanceof APIError) {
      return error;
    }

    return new InternalServerError();
  }
}

export { handler };
