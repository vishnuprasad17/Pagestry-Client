import { auth } from "../../../firebase/firebase.config";
import { store } from "../../store";
import { clearUser } from "../slices/authSlice";
import { signOut } from "firebase/auth";

export function checkManualReduxDelete() {
  const reduxUser = store.getState().auth.user;
  const firebaseUser = auth.currentUser;

  if (firebaseUser && !reduxUser) {
    console.warn("⚠️ Redux manually cleared → Logging out Firebase");

    signOut(auth);
    store.dispatch(clearUser());
  }
};