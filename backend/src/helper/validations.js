// Función de validación de String
// Recibe como primer parámetro el String, como segundo la logitud mínima y 
// como tercer parámetro la longitud máxima
export const validateString = (str, minLength, maxLength) => {
  if (minLength && str.length < minLength) return false;
  else if (maxLength && str.length > maxLength) return false;

  return true;
};


// Validación de Email, funciona con REGEX (expresión regular)
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


// Valida contraseña, recibe la contraseña, la logitud mínima, la longitud máxima, 
// luego un boolean por si hay mayuscula y un boolean por si necesita numero
export const validatePassword = (
  password,
  minLength,
  maxLength,
  needsUppercase,
  needsNumber
) => {
  if (minLength && password.length < minLength) return false;
  else if (maxLength && password.length > maxLength) return false;
  else if (needsUppercase && !/[A-Z]/.test(password)) return false;
  else if (needsNumber && !/\d/.test(password)) return false;

  return true;
};

// Valida fecha, recibe como argumento: fecha
export const validateDate = (reqDate, allowFutureDate) => {
  if (!reqDate) return false;

  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;   // YYYY-MM-DD
  if (!dateFormat.test(reqDate)) return false;

  const date = new Date(reqDate);

  // verif si la fecha es válida
  if (isNaN(date.getTime())) return false;

  // verif si se permite fecha futura, si no se permite (false):
  //    verif que lo ingresado no sea una fecha futura
  if (!allowFutureDate) {
    const today = new Date();
    if (date > today) return false;
  }

  return true;
};