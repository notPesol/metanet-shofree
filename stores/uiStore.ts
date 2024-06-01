interface IUiState {
  isLoading: boolean;
}

export const useUiStore = defineStore("ui", {
  state: (): IUiState => {
    return { isLoading: false };
  },

  actions: {
    setLoading(value: boolean) {
      this.isLoading = value;
    },
  },
});
