import React from 'react';

const Alert = ({ type, message }) => {
  if (!message) return null;

  const alertClass = type === 'error' ? 'alert-error' : 'alert-success';

  return <div className={`alert ${alertClass}`}>{message}</div>;
};

export default Alert;
