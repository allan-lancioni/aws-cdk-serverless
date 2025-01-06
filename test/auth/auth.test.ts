import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
  const authService = new AuthService();
  const loginResult = await authService.login(
    process.env.TEST_USER_NAME as string,
    process.env.TEST_USER_PWD as string
  );
  const token = await authService.getIdToken();
  // console.log({ loginResult, token });

  const credentials = await authService.generateTemporaryCredentials();
  console.log(credentials);
  const buckets = await listBuckets(credentials);
  console.log(buckets);
  return token;
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials,
  });
  const command = new ListBucketsCommand({});
  const response = await client.send(command);
  console.log(response)
  return response;
}
 
testAuth();