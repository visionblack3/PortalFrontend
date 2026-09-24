import client from "./client";

// Backend's /register endpoint binds directly to the User entity
// (name, email, password, phone, role), not the unused RegisterRequest DTO.
export function register({ name, email, password, phone, role }) {
  return client
    .post("/auth/register", { name, email, password, phone, role })
    .then((res) => res.data);
}

export function login({ email, password }) {
  return client.post("/auth/login", { email, password }).then((res) => res.data);
}

export function sendResetOtp(email) {
  return client
    .post("/auth/forgot-password/send-otp", { email })
    .then((res) => res.data);
}

export function resetPassword({ email, otp, newPassword }) {
  return client
    .post("/auth/forgot-password/reset", { email, otp, newPassword })
    .then((res) => res.data);
}
