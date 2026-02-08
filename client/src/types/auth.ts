// UserLogin
interface UserData {
  mongoUserId: string;
  username: string;
  name: string;
  profileImage?: string;
}
interface UserLoginResponse {
  success: boolean;
  data: UserData;
  message: string;
}
interface UserLoginArgs {
  idToken: string;
}

// AdminLogin
interface AdminData {
  id: string;
  username: string;
  role: string;
}
interface AdminLoginResponse {
  data: AdminData;
}
interface AdminLoginArgs {
  username: string;
  password: string;
}

// Logout
interface LogoutResponse {
  success: boolean;
  data: {};
  message: string;
}

export type { UserData, AdminData, UserLoginResponse, UserLoginArgs, AdminLoginResponse, AdminLoginArgs, LogoutResponse };