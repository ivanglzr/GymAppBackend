import bcrypt from "bcrypt";

export function validateId(id) {
  return id === undefined || id === null || id.length !== 24;
}

export async function validatePassword(password, userPassword) {
  return bcrypt.compare(password, userPassword);
}
