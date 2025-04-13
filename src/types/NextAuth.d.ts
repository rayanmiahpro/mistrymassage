import "next-auth"


declare module "next-auth" { 
  interface User {
      _id?: string;
      username?: string;
      isVarified?: boolean;
      isMassageAllowed?: boolean;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVarified?: boolean;
      isMassageAllowed?: boolean;
    } & DefaultSession["user"];
  } 
}