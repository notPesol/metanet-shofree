<template>
  <div
    class="min-h-screen min-w-full absolute top-0 left-0 z-50 opacity-80 bg-slate-500 flex items-center justify-center"
  >
    <div class="w-12 h-12 rounded-full border-4 loader"></div>
  </div>
</template>

<style>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
