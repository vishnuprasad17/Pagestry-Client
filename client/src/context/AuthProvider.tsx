import { ReactNode, useMemo } from "react";
import { AuthContext } from "./authContext";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  UserCredential,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

  // check if already have account, Check sign-in methods
  const checkExistingUser = async (email: string): Promise<string[]> => {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods;
  }

  // register 
  const registerUser = async (email: string, password: string, name: string): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }

    return userCredential;
  };

  // login
  const loginUser = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // google auth
  const signInWithGoogle = (): Promise<UserCredential> => {
    return signInWithPopup(auth, googleProvider);
  };

  // forgot password
  const forgotPassword = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };

  // providerId
  const getProviderId = (): string | undefined => auth.currentUser?.providerData[0]?.providerId;
  
  // change password
  const changePassword = async (email: string, currentPassword: string, newPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user || !user.email) return;
    const providerId = user.providerData[0]?.providerId;
    if (providerId !== "password") return;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    await signOut(auth);
  };

  // logout
  const logout = (): Promise<void> => signOut(auth);

  const value = useMemo(() => ({
    checkExistingUser,
    registerUser,
    loginUser,
    signInWithGoogle,
    forgotPassword,
    logout,
    getProviderId,
    changePassword
  }), []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};