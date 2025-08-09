import { User } from "../generated/prisma/index.js";

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
