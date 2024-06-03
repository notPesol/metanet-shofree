import type { HttpMethod } from "~/interfaces";

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const fetchData = async <R> (
    path: string,
    options?: { method?: HttpMethod; body?: any; query?: Record<string, any> }
  ) => {
    let response: R | null = null;
    let error: any;
    try {
      const res: any = await $fetch<R>(`${config.public.apiBase}/${path}`, {
        headers: makeHeaders(authStore.accessToken),
        ...options,
      });
      response = res;
    } catch (e: any) {
      console.error(e);
      error = e;
    }

    return { response, error };
  };

  return { fetchData };
};
