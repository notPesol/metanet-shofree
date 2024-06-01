export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (!authStore.accessToken) {
    return navigateTo('/login');
  }
})