import { Prisma } from "../config/Prisma.js";
export const registerUserService = async ({ fullname, username, email, password }) => {
  const user = await Prisma.user.create({ data: { fullname, username, email, password } });
  return user;
};
