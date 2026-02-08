import { auth } from "../../../firebase/firebase.config";

export const getToken = async (): Promise<string> => {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error("Firebase user not ready");
  }

  const token = await firebaseUser.getIdToken(true);

  return token;
};