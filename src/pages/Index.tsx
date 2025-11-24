import { useState, useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import RegisterPage from "./RegisterPage";
import { Dashboard } from "@/pages/Dashboard";
import { SalesDashboard } from "@/pages/SalesDashboard";
import { SalesCart } from "@/pages/SalesCart";
import { SalesOrders } from "@/pages/SalesOrders";
import { TestSalesOrders } from "@/pages/TestSalesOrders";
import { ProductManagement } from "@/pages/ProductManagement";
import { CustomerManagement } from "@/pages/CustomerManagement";
import { TransactionHistory } from "@/pages/TransactionHistory";
import { SalesAnalytics } from "@/pages/SalesAnalytics";
import { SpendingAnalytics } from "@/pages/SpendingAnalytics";
import { EmployeeManagement } from "@/pages/EmployeeManagement";
import { SupplierManagement } from "@/pages/SupplierManagement";
import { PurchaseOrders } from "@/pages/PurchaseOrders";
import { PurchaseDashboard } from "@/pages/PurchaseDashboard";
import { PurchaseTerminal } from "@/pages/PurchaseTerminal";
import { PurchaseTransactionHistory } from "@/pages/PurchaseTransactionHistory";
import { PurchaseReports } from "@/pages/PurchaseReports";
import { ExpenseManagement } from "@/pages/ExpenseManagement";
import { ReturnsManagement } from "@/pages/ReturnsManagement";
import { DebtManagement } from "@/pages/DebtManagement";
import { CustomerSettlements } from "@/pages/CustomerSettlements";
import { SupplierSettlements } from "@/pages/SupplierSettlements";
import { DiscountManagement } from "@/pages/DiscountManagement";
import { InventoryAudit } from "@/pages/InventoryAudit";
import { AccessLogs } from "@/pages/AccessLogs";
import { ComprehensiveDashboard } from "@/pages/ComprehensiveDashboard";
import { FinanceDashboard } from "@/pages/FinanceDashboard";
import { FinancialReports } from "@/pages/FinancialReports";
import { IncomeStatement } from "@/pages/IncomeStatement";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import { AutomatedDashboard } from "@/pages/AutomatedDashboard";
import { SplashScreen } from "@/components/SplashScreen";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUserRole, hasModuleAccess } from "@/utils/salesPermissionUtils";

type ViewState = "login" | "register" | "dashboard" | "sales" | "sales-cart" | "sales-orders" | "test-sales-orders" | "inventory" | "products" | "purchase" | "finance" | "customers" | "transactions" | "analytics" | "sales-analytics" | "spending-analytics" | "employees" | "suppliers" | "purchase-orders" | "purchase-terminal" | "purchase-transactions" | "purchase-reports" | "expenses" | "returns" | "debts" | "customer-settlements" | "supplier-settlements" | "discounts" | "audit" | "access-logs" | "comprehensive" | "reports" | "financial-reports" | "income-statement" | "statements-reports" | "settings" | "automated";

const Index = () => {
  const { user, login } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(user ? "comprehensive" : "login");
  const [showSplash, setShowSplash] = useState(true);

  // Check URL hash on initial load
  useEffect(() => {
    console.log("Checking URL hash for registration, current hash:", window.location.hash);
    if (window.location.hash === "#register") {
      console.log("Hash matches #register, setting currentView to 'register'");
      setCurrentView("register");
    }
  }, []);

  // Hide splash screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      // Try Supabase authentication first
      const result = await login(credentials.username, credentials.password);
      
      if (result.error) {
        // If Supabase auth fails due to email confirmation, show specific error
        if (result.error.message && result.error.message.includes('Email not confirmed')) {
          console.warn("Email not confirmed:", result.error.message);
          // Show error to user
          console.warn("Email not confirmed. Please check email and confirm before logging in.");
        }
        // Don't fall back to mock authentication - just show error
        console.warn("Supabase auth failed:", result.error);
        return;
      } else {
        // Supabase auth successful
        console.log("Supabase auth successful:", result);
        
        // Get user role and redirect based on role
        const userRole = await getCurrentUserRole();
        
        // For staff members, we need to check what modules they have access to
        if (userRole === 'staff') {
          // Staff members should not have access to sales management
          // Redirect to comprehensive dashboard which will filter modules
          setCurrentView("comprehensive");
        } else {
          // For other roles, use the existing logic
          switch (userRole) {
            case 'admin':
              setCurrentView("comprehensive");
              break;
            case 'manager':
              setCurrentView("comprehensive");
              break;
            case 'cashier':
              setCurrentView("sales");
              break;
            default:
              // Default to comprehensive dashboard for unknown roles
              setCurrentView("comprehensive");
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    setCurrentView("login");
  };

  const handleNavigate = async (destination: string) => {
    console.log("handleNavigate called with destination:", destination);
    
    // Get user role to check permissions
    const userRole = await getCurrentUserRole();
    
    // Check if user has access to the requested module
    if (!hasModuleAccess(userRole, destination)) {
      console.log("User does not have access to module:", destination);
      // Optionally show an error message or redirect to a default view
      return;
    }
    
    switch (destination) {
      case "sales":
        setCurrentView("sales");
        break;
      case "cart":
        setCurrentView("sales-cart");
        break;
      case "orders":
        setCurrentView("sales-orders");
        break;
      case "test-sales-orders":
        setCurrentView("test-sales-orders");
        break;
      case "inventory":
      case "products":
        setCurrentView("products");
        break;
      case "purchase":
        setCurrentView("purchase");
        break;
      case "finance":
        setCurrentView("finance");
        break;
      case "customers":
        setCurrentView("customers");
        break;
      case "transactions":
        setCurrentView("transactions");
        break;
      case "analytics":
        setCurrentView("sales-analytics");
        break;
      case "employees":
        setCurrentView("employees");
        break;
      case "suppliers":
        setCurrentView("suppliers");
        break;
      case "purchase-orders":
        setCurrentView("purchase-orders");
        break;
      case "purchase-terminal":
        setCurrentView("purchase-terminal");
        break;
      case "purchase-transactions":
        setCurrentView("purchase-transactions");
        break;
      case "purchase-reports":
        setCurrentView("purchase-reports");
        break;
      case "expenses":
        setCurrentView("expenses");
        break;
      case "returns":
        setCurrentView("returns");
        break;
      case "debts":
        setCurrentView("debts");
        break;
      case "customer-settlements":
        setCurrentView("customer-settlements");
        break;
      case "supplier-settlements":
        setCurrentView("supplier-settlements");
        break;
      case "discounts":
        setCurrentView("discounts");
        break;
      case "audit":
        setCurrentView("audit");
        break;
      case "access-logs":
        setCurrentView("access-logs");
        break;
      case "comprehensive":
        setCurrentView("comprehensive");
        break;
      case "reports":
        // Show financial management dashboard instead of going directly to reports
        setCurrentView("finance");
        break;
      case "financial-reports":
        // Show financial reports page
        setCurrentView("financial-reports");
        break;
      case "statements-reports":
        // Show statements and reports page
        setCurrentView("statements-reports");
        break;
      case "income-statement":
        // Show income statement view
        setCurrentView("income-statement");
        break;
      case "settings":
        setCurrentView("settings");
        break;
      case "scanner":
        setCurrentView("sales-cart");
        break;
      case "automated":
        setCurrentView("automated");
        break;
      case "register":
        console.log("Setting currentView to 'register'");
        setCurrentView("register");
        break;
      default:
        setCurrentView("comprehensive");
        break;
    }
  };

  const handleBack = () => {
    // For components that need to call handleBack synchronously, we'll use the sync version
    // The async version is only needed when we need to check permissions
    
    switch (currentView) {
      case "sales":
        setCurrentView("comprehensive");
        break;
      case "sales-cart":
        setCurrentView("sales");
        break;
      case "sales-orders":
        setCurrentView("sales");
        break;
      case "test-sales-orders":
        setCurrentView("comprehensive");
        break;
      case "products":
        setCurrentView("comprehensive");
        break;
      case "customers":
        setCurrentView("sales");
        break;
      case "transactions":
        setCurrentView("sales");
        break;
      case "analytics":
      case "sales-analytics":
        setCurrentView("sales");
        break;
      case "spending-analytics":
        setCurrentView("purchase");
        break;
      case "employees":
        setCurrentView("comprehensive");
        break;
      case "suppliers":
        setCurrentView("purchase");
        break;
      case "purchase-orders":
        setCurrentView("purchase");
        break;
      case "purchase-terminal":
        setCurrentView("purchase");
        break;
      case "purchase-transactions":
        setCurrentView("purchase");
        break;
      case "purchase-reports":
        setCurrentView("purchase");
        break;
      case "purchase":
        setCurrentView("comprehensive");
        break;
      case "expenses":
        setCurrentView("finance");
        break;
      case "returns":
        setCurrentView("comprehensive");
        break;
      case "debts":
        setCurrentView("finance");
        break;
      case "customer-settlements":
        setCurrentView("finance");
        break;
      case "supplier-settlements":
        setCurrentView("finance");
        break;
      case "discounts":
        setCurrentView("sales");
        break;
      case "audit":
        setCurrentView("comprehensive");
        break;
      case "access-logs":
        setCurrentView("comprehensive");
        break;
      case "finance":
        setCurrentView("comprehensive");
        break;
      case "settings":
        setCurrentView("comprehensive");
        break;
      case "financial-reports":
        setCurrentView("finance");
        break;
      case "income-statement":
        setCurrentView("financial-reports");
        break;
      case "register":
        setCurrentView("login");
        break;
      default:
        setCurrentView("comprehensive");
    }
  };

  // Async version of handleBack that checks permissions
  const handleBackAsync = async () => {
    // Get user role to check permissions
    const userRole = await getCurrentUserRole();
    
    switch (currentView) {
      case "sales":
        setCurrentView("comprehensive");
        break;
      case "sales-cart":
        setCurrentView("sales");
        break;
      case "sales-orders":
        setCurrentView("sales");
        break;
      case "test-sales-orders":
        setCurrentView("comprehensive");
        break;
      case "products":
        setCurrentView("comprehensive");
        break;
      case "customers":
        // Check if user has access to sales module before going back to sales
        if (hasModuleAccess(userRole, "sales")) {
          setCurrentView("sales");
        } else {
          setCurrentView("comprehensive");
        }
        break;
      case "transactions":
        // Check if user has access to sales module before going back to sales
        if (hasModuleAccess(userRole, "sales")) {
          setCurrentView("sales");
        } else {
          setCurrentView("comprehensive");
        }
        break;
      case "analytics":
      case "sales-analytics":
        // Check if user has access to sales module before going back to sales
        if (hasModuleAccess(userRole, "sales")) {
          setCurrentView("sales");
        } else {
          setCurrentView("comprehensive");
        }
        break;
      case "spending-analytics":
        setCurrentView("purchase");
        break;
      case "employees":
        setCurrentView("comprehensive");
        break;
      case "suppliers":
        setCurrentView("purchase");
        break;
      case "purchase-orders":
        setCurrentView("purchase");
        break;
      case "purchase-terminal":
        setCurrentView("purchase");
        break;
      case "purchase-transactions":
        setCurrentView("purchase");
        break;
      case "purchase-reports":
        setCurrentView("purchase");
        break;
      case "purchase":
        setCurrentView("comprehensive");
        break;
      case "expenses":
        setCurrentView("finance");
        break;
      case "returns":
        setCurrentView("comprehensive");
        break;
      case "debts":
        setCurrentView("finance");
        break;
      case "customer-settlements":
        setCurrentView("finance");
        break;
      case "supplier-settlements":
        setCurrentView("finance");
        break;
      case "discounts":
        // Check if user has access to sales module before going back to sales
        if (hasModuleAccess(userRole, "sales")) {
          setCurrentView("sales");
        } else {
          setCurrentView("comprehensive");
        }
        break;
      case "audit":
        setCurrentView("comprehensive");
        break;
      case "access-logs":
        setCurrentView("comprehensive");
        break;
      case "finance":
        setCurrentView("comprehensive");
        break;
      case "settings":
        setCurrentView("comprehensive");
        break;
      case "financial-reports":
        setCurrentView("finance");
        break;
      case "income-statement":
        setCurrentView("financial-reports");
        break;
      case "register":
        setCurrentView("login");
        break;
      default:
        setCurrentView("comprehensive");
    }
  };

  // Wrapper function for calling handleBack in components that expect a synchronous function
  const handleBackSync = () => {
    handleBack();
  };

  // Show splash screen first, then login form
  if (showSplash) {
    return <SplashScreen />;
  }

  console.log("Rendering Index, currentView:", currentView, "user:", user);
  if (currentView === "login" || !user) {
    console.log("Rendering LoginForm");
    return <LoginForm onLogin={handleLogin} onNavigate={handleNavigate} />;
  }
  
  if (currentView === "register") {
    console.log("Rendering RegisterPage");
    return <RegisterPage onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {(() => {
        console.log("Rendering currentView:", currentView);
        switch (currentView) {
          case "comprehensive":
            console.log("Rendering ComprehensiveDashboard");
            return (
              <ComprehensiveDashboard
                username={user?.email || "admin"}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            );
          case "dashboard":
            console.log("Rendering Dashboard");
            return (
              <Dashboard
                username={user?.email || "admin"}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            );
          case "sales":
            console.log("Rendering SalesDashboard");
            return (
              <SalesDashboard
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            );
          case "sales-cart":
            console.log("Rendering SalesCart");
            return (
              <SalesCart
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                autoOpenScanner={true}
              />
            );
          case "sales-orders":
            console.log("Rendering SalesOrders");
            return (
              <SalesOrders
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "test-sales-orders":
            console.log("Rendering TestSalesOrders");
            return (
              <TestSalesOrders
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "products":
            console.log("Rendering ProductManagement");
            return (
              <ProductManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "customers":
            console.log("Rendering CustomerManagement");
            return (
              <CustomerManagement
                username={user?.email || "admin"}
                onBack={handleBackAsync}
                onLogout={handleLogout}
              />
            );
          case "transactions":
            console.log("Rendering TransactionHistory");
            return (
              <TransactionHistory
                username={user?.email || "admin"}
                onBack={handleBackAsync}
                onLogout={handleLogout}
              />
            );
          case "analytics":
          case "sales-analytics":
            console.log("Rendering SalesAnalytics");
            return (
              <SalesAnalytics
                username={user?.email || "admin"}
                onBack={handleBackAsync}
                onLogout={handleLogout}
              />
            );
          case "spending-analytics":
            console.log("Rendering SpendingAnalytics");
            return (
              <SpendingAnalytics
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "employees":
            console.log("Rendering EmployeeManagement");
            return (
              <EmployeeManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "purchase":
            console.log("Rendering PurchaseDashboard");
            return (
              <PurchaseDashboard
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            );
          case "purchase-terminal":
            console.log("Rendering PurchaseTerminal");
            return (
              <PurchaseTerminal
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "purchase-transactions":
            console.log("Rendering PurchaseTransactionHistory");
            return (
              <PurchaseTransactionHistory
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "purchase-reports":
            console.log("Rendering PurchaseReports");
            return (
              <PurchaseReports
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "suppliers":
            console.log("Rendering SupplierManagement");
            return (
              <SupplierManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "purchase-orders":
            console.log("Rendering PurchaseOrders");
            return (
              <PurchaseOrders
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "finance":
            console.log("Rendering FinanceDashboard");
            return (
              <FinanceDashboard
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            );
          case "statements-reports":
            console.log("Rendering Reports");
            return (
              <Reports
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "expenses":
            console.log("Rendering ExpenseManagement");
            return (
              <ExpenseManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "returns":
            console.log("Rendering ReturnsManagement");
            return (
              <ReturnsManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "debts":
            console.log("Rendering DebtManagement");
            return (
              <DebtManagement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "customer-settlements":
            console.log("Rendering CustomerSettlements");
            return (
              <CustomerSettlements
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "supplier-settlements":
            console.log("Rendering SupplierSettlements");
            return (
              <SupplierSettlements
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "discounts":
            console.log("Rendering DiscountManagement");
            return (
              <DiscountManagement
                username={user?.email || "admin"}
                onBack={handleBackAsync}
                onLogout={handleLogout}
              />
            );
          case "audit":
            console.log("Rendering InventoryAudit");
            return (
              <InventoryAudit
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "access-logs":
            console.log("Rendering AccessLogs");
            return (
              <AccessLogs
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "financial-reports":
            console.log("Rendering FinancialReports");
            return (
              <FinancialReports
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            );
          case "income-statement":
            console.log("Rendering IncomeStatement");
            return (
              <IncomeStatement
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "settings":
            console.log("Rendering Settings");
            return (
              <Settings
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          case "automated":
            console.log("Rendering AutomatedDashboard");
            return (
              <AutomatedDashboard
                username={user?.email || "admin"}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            );
          default:
            console.log("Rendering default fallback for:", currentView);
            return (
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center p-6 max-w-md">
                  <h1 className="text-2xl font-bold mb-4">
                    {String(currentView).charAt(0).toUpperCase() + String(currentView).slice(1)} Dashboard
                  </h1>
                  <p className="text-muted-foreground mb-4">This module is coming soon!</p>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBack();
                    }}
                    className="text-primary hover:underline px-4 py-2 border border-primary rounded-md"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default Index;