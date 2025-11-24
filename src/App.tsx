import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { SalesDashboard } from "./pages/SalesDashboard";
import { SalesCart } from "./pages/SalesCart";
import { SalesOrders } from "./pages/SalesOrders";
import { TestSalesOrders } from "./pages/TestSalesOrders";
import { PurchaseTerminal } from "./pages/PurchaseTerminal";
import TestPage from "./pages/TestPage";
import { TestQRCode } from "./pages/TestQRCode";
import { TestReceiptQR } from "./pages/TestReceiptQR";
import { QRDebugTest } from "./pages/QRDebugTest";
import QRTestPage from "./pages/QRTestPage";
import { useEffect } from "react";
// Import authentication context
import { AuthProvider } from "@/contexts/AuthContext";
// Import language context
import { LanguageProvider } from "@/contexts/LanguageContext";

// Import Supabase test function
import { testSupabaseConnection } from "@/services/supabaseService";
import { testRLSPolicies } from "@/services/databaseService";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Test Supabase connection on app start
    testSupabaseConnection().then((isConnected) => {
      if (isConnected) {
        console.log("Successfully connected to Supabase!");
      } else {
        console.warn("Failed to connect to Supabase. Please check your credentials in the .env file.");
      }
    });
    
    // Test RLS policies
    testRLSPolicies().then((policiesOk) => {
      if (policiesOk) {
        console.log("RLS policies are correctly configured!");
      } else {
        console.warn("RLS policies need to be configured. Please run the FIX_RLS_POLICIES.sql script in your Supabase SQL editor.");
      }
    });
  }, []);

  return (
    // Enhanced main app container with gradient background and improved styling
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)]"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/register" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard username="admin" onNavigate={() => {}} onLogout={() => {}} />} />
                  <Route path="/sales" element={<SalesDashboard username="admin" onBack={() => {}} onLogout={() => {}} onNavigate={() => {}} />} />
                  <Route path="/sales/cart" element={<SalesCart username="admin" onBack={() => {}} onLogout={() => {}} />} />
                  <Route path="/sales/orders" element={<SalesOrders username="admin" onBack={() => {}} onLogout={() => {}} />} />
                  <Route path="/test/sales-orders" element={<TestSalesOrders username="admin" onBack={() => {}} onLogout={() => {}} />} />
                  <Route path="/purchase/terminal" element={<PurchaseTerminal username="admin" onBack={() => {}} onLogout={() => {}} />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/test/qr" element={<TestQRCode />} />
                  <Route path="/test/receipt-qr" element={<TestReceiptQR />} />
                  <Route path="/test/qr-debug" element={<QRDebugTest />} />
                  <Route path="/test/qr-test" element={<QRTestPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;