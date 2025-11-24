import { Navigation } from "@/components/Navigation";
import { DashboardCard } from "@/components/DashboardCard";
import { getCurrentUserRole, hasModuleAccess } from "@/utils/salesPermissionUtils";
import { useEffect, useState } from "react";
import { 
  Calculator, 
  Receipt, 
  BarChart3, 
  Users,
  ShoppingCart,
  Package,
  Percent,
  Settings,
  Scan,
  FileText
} from "lucide-react";

interface SalesDashboardProps {
  username: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (module: string) => void;
}

export const SalesDashboard = ({ username, onBack, onLogout, onNavigate }: SalesDashboardProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getCurrentUserRole();
      setUserRole(role);
    };
    
    fetchUserRole();
  }, []);
  
  const allSalesModules = [
    {
      id: "cart",
      title: "Sales Terminal",
      description: "Process new sales transactions and manage customer orders",
      icon: Calculator,
      color: "bg-white border border-gray-200"
    },
    {
      id: "orders",
      title: "Sales Orders",
      description: "View and manage all sales orders and transactions",
      icon: FileText,
      color: "bg-white border border-gray-200"
    },
    {
      id: "transactions",
      title: "Transaction History",
      description: "View and manage past sales transactions and receipts",
      icon: Receipt,
      color: "bg-white border border-gray-200"
    },
    {
      id: "analytics",
      title: "Sales Analytics",
      description: "Analyze sales performance, trends, and customer insights",
      icon: BarChart3,
      color: "bg-white border border-gray-200"
    },
    {
      id: "customers",
      title: "Customer Management",
      description: "Manage customer information and purchase history",
      icon: Users,
      color: "bg-white border border-gray-200"
    },
    {
      id: "products",
      title: "Product Management",
      description: "Manage product inventory and pricing",
      icon: Package,
      color: "bg-white border border-gray-200"
    },
    {
      id: "discounts",
      title: "Discount Management",
      description: "Manage promotional discounts and offers",
      icon: Percent,
      color: "bg-white border border-gray-200"
    },
    {
      id: "settings",
      title: "System Settings",
      description: "Configure POS system preferences and options",
      icon: Settings,
      color: "bg-white border border-gray-200"
    },
    {
      id: "scanner",
      title: "Scan Items",
      description: "Quickly add products to cart using barcode scanner",
      icon: Scan,
      color: "bg-white border border-gray-200"
    },
    {
      id: "test-data",
      title: "Test Data View",
      description: "View raw data for debugging purposes",
      icon: FileText,
      color: "bg-yellow-50 border border-yellow-200"
    },
  ];
  
  // Filter modules based on user role
  const salesModules = allSalesModules.filter(module => hasModuleAccess(userRole, module.id));

  // If no modules are available for this user, redirect back
  useEffect(() => {
    if (userRole && salesModules.length === 0) {
      // User has no access to any sales modules, redirect back
      onBack();
    }
  }, [userRole, salesModules.length, onBack]);

  // Wrapper function for onNavigate that checks permissions
  const handleNavigate = async (module: string) => {
    // Check if user has access to the requested module
    if (!hasModuleAccess(userRole, module)) {
      console.log("User does not have access to module:", module);
      // Optionally show an error message
      return;
    }
    
    onNavigate(module);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        title="Sales Dashboard" 
        onBack={onBack}
        onLogout={onLogout} 
        username={username}
      />
      
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Sales Management</h2>
          <p className="text-muted-foreground">
            Choose a sales module to manage your transactions and customer data
          </p>
        </div>
        
        {salesModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesModules.map((module) => (
              <DashboardCard
                key={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                onClick={() => handleNavigate(module.id)}
                className={module.color}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Access</h3>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access any sales modules.
            </p>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};