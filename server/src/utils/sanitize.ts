import { User } from "@prisma/client";


export const sanitizeUser = ({
  id,
  fullname,
  username,
  email,
  role,
  isEmailVerified,
  avatarUrl,
  bio,
  createdAt,
  updatedAt,
}: User) => {
  return {
    id,
    fullname,
    username,
    email,
    role,
    isEmailVerified,
    avatarUrl,
    bio,
    createdAt,
    updatedAt,
  };
};
