type LogoutListener = () => void;

const listeners = new Set<LogoutListener>();

export const authEvents = {
  addLogoutListener(listener: LogoutListener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  removeLogoutListener(listener: LogoutListener) {
    listeners.delete(listener);
  },
  triggerLogout() {
    listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Error in logout listener:', e);
      }
    });
  },
};
