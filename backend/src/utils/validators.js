const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validatePhone = (phone) => {
  return validator.isMobilePhone(phone, 'any', { strictMode: false });
};

const validateName = (name) => {
  return name && name.trim().length >= 2;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
};
