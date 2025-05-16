import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as { firstname: string; lastname: string; username: string; email: string } | null,
  }),
  actions: {
    setUser(user: { firstname: string; lastname: string; username: string; email: string } | null) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
  persist: true,
});
