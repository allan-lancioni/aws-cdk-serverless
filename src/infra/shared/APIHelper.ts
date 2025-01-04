import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BadRequest } from "./ApiErrors";

export class APIHelper {
  static validateRequestBody(
    event: APIGatewayProxyEvent,
    requiredFields: string[]
  ) {
    if (!event.body) {
      return new BadRequest("Missing request body");
    }
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      return new BadRequest("Invalid JSON format");
    }

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      const fields = missingFields.join(", ");
      return new BadRequest(
        `The following fields are required in the request body: ${fields}`
      );
    }

    return body;
  }
}
