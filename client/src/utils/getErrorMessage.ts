export const getErrorMessage = (error: any) => {
  const code =
    typeof error === "string"
      ? error
      : error?.code || error?.error?.code;

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address";

    case "auth/user-not-found":
      return "No account found with this email";

    case "auth/email-already-in-use":
      return "An account already exists with this email";

    case "auth/missing-email":
      return "Email is required";

    case "auth/wrong-password":
      return "Incorrect email or password";

    case "auth/weak-password":
      return "Password should be at least 8 characters";

    case "auth/missing-password":
      return "Password is required";

    case "auth/requires-recent-login":
      return "Please login again to continue";

    case "auth/user-disabled":
      return "Your account has been blocked. Contact support";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later";

    case "auth/popup-closed-by-user":
      return "Login popup was closed before completing";

    case "auth/cancelled-popup-request":
      return "Login was cancelled. Please try again";

    case "auth/account-exists-with-different-credential":
      return "Account exists with another login method";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection";

    case "auth/invalid-credential":
      return "Invalid email or password";

    default:
      return "Something went wrong. Please try again";
  }
};