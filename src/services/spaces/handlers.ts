import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpaces } from "./PostSpaces";
import * as APIErrors from "../../infra/shared/ApiErrors";

const ddbClient = new DynamoDBClient();
async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    switch (event.httpMethod) {
      // case "GET":
      //   message = "GET: Hello World";
      //   break;
      // return getHandler(event, context);
      case "POST":
        return postSpaces(event, ddbClient);
      default:
        return new APIErrors.MethodNotAllowed();
    }
  } catch (error) {
    if (error instanceof APIErrors.APIError) {
      return error;
    }

    return new APIErrors.InternalServerError();
  }
}

export { handler };
