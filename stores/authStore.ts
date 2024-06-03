import type { IUser } from "~/interfaces";

interface IAuthState {
  accessToken: string;
  user: IUser | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): IAuthState => {
    const accessToken = localStorage.getItem("accessToken") || "";
    const user = localStorage.getItem("user") || "";
    return {
      accessToken,
      user: user ? JSON.parse(user) : null,
    };
  },

  actions: {
    async login(accessToken: string) {
      this.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    },
    async fetchProfile() {
      const nuxtApp = useNuxtApp();
      const { $toast } = nuxtApp;
      try {
        const config = useRuntimeConfig();
        const res: any = await $fetch(
          `${config.public.apiBase}/authentication/profile`,
          { headers: makeHeaders(this.accessToken) }
        );

        this.user = res.data;
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error: any) {
        console.error(error);
        $toast(error?.data?.message || "Fetch profile failed.", {
          type: "error",
        });
        navigateTo("/login", { replace: true });
      }
    },

    logout() {
      localStorage.clear();
      this.accessToken = "";
      this.user = null;
      navigateTo("/login", { replace: true });
    },
  },
});
