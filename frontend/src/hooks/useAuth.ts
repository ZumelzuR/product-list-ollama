export function useAuth() {
  const isAuthenticated = (): boolean => {
    return !!sessionStorage.getItem("token");
  };

  const logout = (): void => {
    sessionStorage.removeItem("token");
    window.location.reload();
  };

  return {
    isAuthenticated,
    logout,
  };
} 