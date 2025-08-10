export type UserDTO = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};
