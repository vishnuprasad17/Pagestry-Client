import { createContext } from "react";
import { UserCredential } from "firebase/auth";

export interface AuthContextType {
  checkExistingUser: (email: string) => Promise<string[]>;
  registerUser: (email: string, password: string, name: string) => Promise<UserCredential>;
  loginUser: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  getProviderId: () => string | undefined;
  changePassword: (
    email: string,
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);