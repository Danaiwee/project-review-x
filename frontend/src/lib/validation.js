export function signUpValidation(data) {
  const { email, username, fullName, password } = data;
  if (!fullName || !email || !password || !username) {
    throw new Error("All fields are required");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters long");
  }

  return true;
}

export function signInValidation(data) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("All fields are required");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least 6 characters long");
  }

  return true;
}

export function createPost(data) {
  const { text, image } = data;

  if (!text || !image) {
    throw new Error("Post must contain text or image");
  }

  return true;
}
