import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import HistoryPage from "@/pages/history";
import SettingsPage from "@/pages/settings";
import BottomNavigation from "@/components/BottomNavigation";

function Router() {
  const [location] = useLocation();
  
  return (
    <>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Only show navigation on main pages */}
      {["/", "/history", "/settings"].includes(location) && (
        <BottomNavigation currentPath={location} />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
