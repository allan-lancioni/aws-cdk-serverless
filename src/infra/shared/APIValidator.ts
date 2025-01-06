import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BadRequest, Unauthorized } from "./APIErrors";

export class APIValidator {
  static validateRequestBody(
    event: APIGatewayProxyEvent,
    requiredFields: string[]
  ) {
    if (!event.body) {
      throw new BadRequest("Missing request body");
    }
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      throw new BadRequest("Invalid JSON format");
    }

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      const fields = missingFields.join(", ");
      throw new BadRequest(
        `The following fields are required in the request body: ${fields}`
      );
    }

    return body;
  }

  static hasAdminAccess(event: APIGatewayProxyEvent): boolean {
    const groups = event.requestContext?.authorizer?.claims["cognito:groups"];
    return groups?.includes("Admin") ?? false;
  }

  static validateAdminAccess(event: APIGatewayProxyEvent): void {
    if (!this.hasAdminAccess(event)) {
      throw new Unauthorized();
    }
  }

  static validateModal() {}
}