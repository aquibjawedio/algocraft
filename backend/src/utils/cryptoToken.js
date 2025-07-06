import crypto from "crypto";

export const generateTemporaryToken = () => {
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = Date.now() + 10 * 60 * 1000;
  return { unHashedToken, hashedToken, tokenExpiry };
};
