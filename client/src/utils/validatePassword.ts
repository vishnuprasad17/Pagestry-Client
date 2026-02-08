export const validatePassword = (password: string) => {
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return checks.minLength && checks.hasUppercase && checks.hasNumber && checks.hasSymbol;
  };