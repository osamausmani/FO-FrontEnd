export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (userData: RegisterUserData) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (passwordData: PasswordChangeData) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}
