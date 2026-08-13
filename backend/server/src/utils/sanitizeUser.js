// strips server-only fields (password hash, raw role relation) before a user
// object is sent to the client — role is flattened from Prisma's { id, name,
// permissions } relation down to its plain name string, since the frontend
// router, RoleRoute guard, and sidebar all expect `user.role` to be a string
// like "student", not an object.
function sanitizeUser(user) {
  if (!user) return user;
  const { passwordHash, roleId, role, ...rest } = user;
  return { ...rest, role: role?.name ?? role };
}

module.exports = { sanitizeUser };
