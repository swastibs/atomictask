import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function notifyError(error) {
  if (error?.response?.status === 401 || error?.response?.status === 429) return;
  toast.error(error?.response?.data?.message || "That didn't work — let's try again.");
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: notifyError }),
  mutationCache: new MutationCache({ onError: notifyError }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) =>
        count < 1 && ![401, 403, 404].includes(error?.response?.status),
      refetchOnWindowFocus: true,
    },
    mutations: { retry: 0 },
  },
});
