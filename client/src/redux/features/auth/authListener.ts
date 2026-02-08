import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import { setUser, clearUser } from "../slices/authSlice";
import authApi from "./authApi";
import { AppDispatch } from "../../store";

interface Store {
  dispatch: AppDispatch;
}

export const authListener = (store: Store) => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    //console.log("🔥 Firebase Auth Changed:", firebaseUser);

    if (firebaseUser) {
      try {
        const idToken = await firebaseUser.getIdToken(true);
        // Sync user data with the backend API
        const response = await store
          .dispatch(
            authApi.endpoints.userLogin.initiate({
              idToken,
            })
          )
          .unwrap();
        store.dispatch(
          setUser({
            uid: firebaseUser.uid,
            mongoUserId: response.mongoUserId,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            profileImage: response.profileImage,
          })
        );
      } catch (error) {
        signOut(auth);
        store.dispatch(clearUser());
        console.error("❌ Error syncing user:", error);
      }
    } else {
      store.dispatch(clearUser());
    }
  });
};
