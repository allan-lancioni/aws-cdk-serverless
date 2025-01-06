import { AuthService } from "./AuthService";

async function testAuth() {
  const authService = new AuthService();
  const loginResult = await authService.login(
    process.env.TEST_USER_NAME as string,
    process.env.TEST_USER_PWD as string
  );
  const token = await authService.getIdToken();
  console.log({ loginResult, token });
  return token;
}

testAuth();