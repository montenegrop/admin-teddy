const PASSWORD_KEY = 'teddy_admin_password';

export const AuthStorage = {
  getPassword: (): string | null => {
    return localStorage.getItem(PASSWORD_KEY);
  },
  setPassword: (password: string): void => {
    localStorage.setItem(PASSWORD_KEY, password);
  },
  clearPassword: (): void => {
    localStorage.removeItem(PASSWORD_KEY);
  },
};