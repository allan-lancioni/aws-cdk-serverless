import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "sa-east-1_pAAwYjeLB",
      userPoolClientId: "3p7o2o3jehirogu2ul26ks35fn",
    }
  },
});

export class AuthService {
  
  public async login(username: string, password: string): Promise<SignInOutput> {
    const signInOutput = await signIn({
      username, 
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      }
    });

    return signInOutput;
  }

  public async getIdToken(): Promise<string> {
    const authSession = await fetchAuthSession();
    const token = authSession.tokens?.idToken?.toString();
    if (!token) {
      throw new Error("Token not found");
    }
    return token;
  }

}