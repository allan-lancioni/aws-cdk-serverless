import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  APIError,
  MethodNotAllowed,
  InternalServerError,
} from "../shared/utils/APIErrors";
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
        return await getSpaces(event, ddbClient);
      case "POST":
        return await postSpaces(event, ddbClient);
      case "PUT":
        return await putSpace(event, ddbClient);
      case "DELETE":
        return await deleteSpace(event, ddbClient);
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
