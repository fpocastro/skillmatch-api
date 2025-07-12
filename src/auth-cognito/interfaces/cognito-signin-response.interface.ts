export interface ICognitoSignInResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}
