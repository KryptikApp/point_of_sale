export function formatPhoneNumber(phone: string) {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function validatePhoneNumber(phone: string) {
  // for now just check if valid characters
  const match = phone.match(/\d/g);
  if (!match) return false;
  return match.length === 10;
}
