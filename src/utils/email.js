export function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

export function emailValido(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
