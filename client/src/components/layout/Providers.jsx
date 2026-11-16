import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { queryClient } from "@/lib/queryClient";

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          {children}
          <Toaster closeButton position="top-right" richColors theme="dark" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
