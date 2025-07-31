export const signUpValidation = (data) => {
  const { email, username, fullName, password } = data;

  if (!email || !username || !fullName || !password) {
    return { valid: false, error: "All fields are required" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Invalid email address" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Invalid password" };
  }

  return { valid: true };
};

export const signInValidation = (data) => {
  if (!email || !username || !fullName || !password) {
    return { valid: false, error: "All fields are required" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Invalid password" };
  }

  return { valid: true };
};


