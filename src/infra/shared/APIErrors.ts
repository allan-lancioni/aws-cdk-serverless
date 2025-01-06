import { APIGatewayProxyResult } from "aws-lambda";

type Response = string | Record<string, unknown>;

export class APIError implements APIGatewayProxyResult {
  statusCode: number;
  body: string;

  constructor(statusCode: number, response: Response) {
    this.statusCode = statusCode;
    this.body = JSON.stringify({ response });
  }
}

export class BadRequest extends APIError {
  constructor(response: Response) {
    super(400, response);
  }
}

export class Unauthorized extends APIError {
  constructor(response: Response = "Unauthorized") {
    super(401, response);
  }
}

export class MethodNotAllowed extends APIError {
  constructor(response: Response = "Method Not Allowed") {
    super(405, response);
  }
}

export class InternalServerError extends APIError {
  constructor(response: Response = "Internal Server Error") {
    super(500, response);
  }
}