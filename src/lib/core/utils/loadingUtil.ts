import { isLoading } from "$lib/stores/LoadingStore";

export function startLoading() {
  isLoading.set(true);
}

export function stopLoading() {
  isLoading.set(false);
}