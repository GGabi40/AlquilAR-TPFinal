export const isEmpty = (value) => !value || value.trim() === "";

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const hasMinLength = (value, min) => value && value.length >= min;

export const doPasswordsMatch = (pass1, pass2) => pass1 === pass2;

export const hasSQLInjection = (value) => {
  if (!value) return false;
  const sqlPattern = /\b(SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|--|;|\/\*|\*\/)\b/i;
  return sqlPattern.test(value);
};

export const hasScriptInjection = (value) => {
  if (!value) return false;
  const xssPattern = /<script.*?>.*?<\/script>|<.*?on\w+=.*?>/i;
  return xssPattern.test(value);
};

export const sanitizeInput = (value) => {
  if (!value) return "";
  return value.replace(/<.*?>/g, "").replace(/['";]/g, "");
};