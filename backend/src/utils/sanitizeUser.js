const sanitizeUser = ({
  id,
  fullname,
  username,
  email,
  role,
  createdAt,
  updatedAt,
  avatarUrl,
  isEmailVerified,
}) => {
  if (!id) return null;

  return {
    id,
    fullname,
    username,
    email,
    role,
    isEmailVerified,
    avatarUrl,
    createdAt,
    updatedAt,
  };
};

export { sanitizeUser };
