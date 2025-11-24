import { Navigation } from "@/components/Navigation";
import { DashboardCard } from "@/components/DashboardCard";
import { 
  Wallet,
  TrendingUp,
  PieChart,
  FileText,
  BarChart3,
  Settings,
  Bot
} from "lucide-react";

interface FinanceDashboardProps {
  username: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (module: string) => void;
}

export const FinanceDashboard = ({ username, onBack, onLogout, onNavigate }: FinanceDashboardProps) => {
  const financeModules = [
    {
      id: "expenses",
      title: "Expense Tracking",
      description: "Track and manage business expenses and cash flow",
      icon: Wallet,
      color: "bg-white border border-gray-200"
    },
    {
      id: "debts",
      title: "Debt Management",
      description: "Manage customer and supplier debts",
      icon: Wallet,
      color: "bg-white border border-gray-200"
    },
    {
      id: "customer-settlements",
      title: "Customer Settlements",
      description: "Manage customer debt settlements and payments",
      icon: TrendingUp,
      color: "bg-white border border-gray-200"
    },
    {
      id: "supplier-settlements",
      title: "Supplier Settlements",
      description: "Manage supplier payments and settlements",
      icon: PieChart,
      color: "bg-white border border-gray-200"
    },
    {
      id: "reports",
      title: "Financial Reports",
      description: "View detailed financial reports and statements",
      icon: FileText,
      color: "bg-white border border-gray-200"
    },
    {
      id: "financial-statements",
      title: "Financial Statements",
      description: "Access income statement, balance sheet, and cash flow statements",
      icon: FileText,
      color: "bg-white border border-gray-200"
    },
    {
      id: "analytics",
      title: "Financial Analytics",
      description: "Analyze financial performance and trends",
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
    {
      id: "automated",
      title: "Automated Dashboard",
      description: "View automated business insights and recommendations",
      icon: Bot,
      color: "bg-white border border-gray-200"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        title="Financial Management" 
        onBack={onBack}
        onLogout={onLogout} 
        username={username}
      />
      
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Financial Management</h2>
          <p className="text-muted-foreground">
            Manage expenses, debts, and financial reporting
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeModules.map((module) => (
            <DashboardCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              onClick={() => {
                // Special handling for reports module
                if (module.id === "reports") {
                  console.log("Financial reports module clicked");
                  onNavigate("statements-reports");
                  return;
                }
                // Special handling for financial statements module
                if (module.id === "financial-statements") {
                  console.log("Financial statements module clicked");
                  onNavigate("financial-reports");
                  return;
                }
                onNavigate(module.id);
              }}
              className={module.color}
            />
          ))}
        </div>
        

      </main>
    </div>
  );
};