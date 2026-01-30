import { GoogleAuth } from "google-auth-library";

export const auth = new GoogleAuth({
  keyFile: "./credentials/google-service.json",
  scopes: ["https://www.googleapis.com/auth/generative-language"],
});
