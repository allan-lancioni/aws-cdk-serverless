import { handler } from "../src/services/spaces/handlers";
import * as dotenv from "dotenv";
dotenv.config();

handler({
  httpMethod: "POST",
  body: JSON.stringify({
    location: "California",
  }),
} as any, {} as any);
