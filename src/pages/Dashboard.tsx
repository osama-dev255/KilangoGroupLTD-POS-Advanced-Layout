import { DashboardCard } from "@/components/DashboardCard";
import { Navigation } from "@/components/Navigation";
import { getCurrentUserRole, hasModuleAccess } from "@/utils/salesPermissionUtils";
import { useEffect, useState } from "react";
import { 
  Package, 
  ShoppingCart, 
  ShoppingBag, 
  Wallet,
  Users,
  Receipt,
  BarChart3,
  User,
  Truck
} from "lucide-react";

interface DashboardProps {
  username: string;
  onNavigate: (dashboard: string) => void;
  onLogout: () => void;
}

export const Dashboard = ({ username, onNavigate, onLogout }: DashboardProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getCurrentUserRole();
      setUserRole(role);
    };
    
    fetchUserRole();
  }, []);
  
  const allDashboards = [
    {
      id: "inventory",
      title: "Inventory Management",
      description: "Manage your products, stock levels, and inventory tracking",
      icon: Package,
      color: "bg-white border border-gray-200"
    },
    {
      id: "sales",
      title: "Sales Dashboard",
      description: "Process sales, manage transactions, and view sales analytics",
      icon: ShoppingCart,
      color: "bg-white border border-gray-200"
    },
    {
      id: "purchase",
      title: "Purchase Management",
      description: "Handle supplier orders, track purchases, and manage vendors",
      icon: ShoppingBag,
      color: "bg-white border border-gray-200"
    },
    {
      id: "finance",
      title: "Financial Management",
      description: "Manage expenses, debts, and financial reporting",
      icon: Wallet,
      color: "bg-white border border-gray-200"
    },
    {
      id: "customers",
      title: "Customer Management",
      description: "Manage customer information and loyalty programs",
      icon: Users,
      color: "bg-white border border-gray-200"
    },
    {
      id: "transactions",
      title: "Transaction History",
      description: "View and manage all sales transactions",
      icon: Receipt,
      color: "bg-white border border-gray-200"
    },
    {
      id: "reports",
      title: "Business Analytics",
      description: "Analyze sales performance and business metrics",
      icon: BarChart3,
      color: "bg-white border border-gray-200"
    },
    {
      id: "employees",
      title: "Employee Management",
      description: "Manage staff members and permissions",
      icon: User,
      color: "bg-white border border-gray-200"
    },
  ];
  
  // Filter dashboards based on user role
  const dashboards = allDashboards.filter(dashboard => hasModuleAccess(userRole, dashboard.id));
  
  // Wrapper function for onNavigate that checks permissions
  const handleNavigate = async (dashboardId: string) => {
    // Check if user has access to the requested dashboard
    if (!hasModuleAccess(userRole, dashboardId)) {
      console.log("User does not have access to dashboard:", dashboardId);
      // Optionally show an error message
      return;
    }
    
    onNavigate(dashboardId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        title="Business POS Dashboard" 
        onLogout={onLogout} 
        username={username}
      />
      
      <main className="container-responsive py-6">
        <div className="mb-6 xs:mb-8">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-2">Welcome back, {username}!</h2>
          <p className="text-muted-foreground text-responsive-base">
            Select a dashboard to manage your business operations
          </p>
        </div>
        
        {dashboards.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 auto-rows-fr">
            {dashboards.map((dashboard) => (
              <div key={dashboard.id} className="flex">
                <DashboardCard
                  title={dashboard.title}
                  description={dashboard.description}
                  icon={dashboard.icon}
                  onClick={() => handleNavigate(dashboard.id)}
                  className={`${dashboard.color} card-padding`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Access</h3>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access any dashboards.
            </p>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  );
};