import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const userPoolId = "sa-east-1_pAAwYjeLB"
const userPoolClientId = "3p7o2o3jehirogu2ul26ks35fn"
const identityPoolId = "sa-east-1:f8a72715-3c4f-4937-a90d-715bcaa968bb"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      identityPoolId,
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

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${userPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId,
        logins: {
          [cognitoIdentityPool]: idToken
        }
      })
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }

}