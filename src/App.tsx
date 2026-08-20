import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { Paywall } from "./components/Paywall";
import { initPurchases, hasActiveSubscription } from "./lib/purchases";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [subscribed, setSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    initPurchases()
      .then(hasActiveSubscription)
      .then(setSubscribed)
      .catch(() => setSubscribed(false));
  }, []);

  if (subscribed === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!subscribed) {
    return (
      <Routes>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Paywall onUnlocked={() => setSubscribed(true)} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/privacy" element={<Privacy />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
