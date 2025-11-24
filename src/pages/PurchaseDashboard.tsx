import { Navigation } from "@/components/Navigation";
import { DashboardCard } from "@/components/DashboardCard";
import { 
  Truck,
  ShoppingCart,
  Package,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  History
} from "lucide-react";

interface PurchaseDashboardProps {
  username: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (module: string) => void;
}

export const PurchaseDashboard = ({ username, onBack, onLogout, onNavigate }: PurchaseDashboardProps) => {
  const purchaseModules = [
    {
      id: "suppliers",
      title: "Supplier Management",
      description: "Manage supplier information and vendor relationships",
      icon: Truck,
      color: "bg-white border border-gray-200"
    },
    {
      id: "purchase-orders",
      title: "Purchase Orders",
      description: "Create, track, and manage purchase orders",
      icon: ShoppingCart,
      color: "bg-white border border-gray-200"
    },
    {
      id: "purchase-terminal",
      title: "Purchase Terminal",
      description: "Process supplier purchases and manage incoming inventory",
      icon: CreditCard,
      color: "bg-white border border-gray-200"
    },
    {
      id: "purchase-transactions",
      title: "Purchase History",
      description: "View and manage purchase transaction history",
      icon: History,
      color: "bg-white border border-gray-200"
    },
    {
      id: "purchase-reports",
      title: "Purchase Reports",
      description: "Analyze purchasing trends and supplier performance",
      icon: FileText,
      color: "bg-white border border-gray-200"
    },
    {
      id: "analytics",
      title: "Spending Analytics",
      description: "Track spending patterns and budget analysis",
      icon: BarChart3,
      color: "bg-white border border-gray-200"
    },
    {
      id: "settings",
      title: "System Settings",
      description: "Configure POS system preferences and options",
      icon: Settings,
      color: "bg-white border border-gray-200"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        title="Purchase Management" 
        onBack={onBack}
        onLogout={onLogout} 
        username={username}
      />
      
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Purchase Management</h2>
          <p className="text-muted-foreground">
            Manage suppliers, purchase orders, and inventory replenishment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchaseModules.map((module) => (
            <DashboardCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              onClick={() => onNavigate(module.id)}
              className={module.color}
            />
          ))}
        </div>
      </main>
    </div>
  );
};