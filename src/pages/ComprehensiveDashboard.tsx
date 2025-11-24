import { Navigation } from "@/components/Navigation";
import { DashboardCard } from "@/components/DashboardCard";
import { getCurrentUserRole, hasModuleAccess } from "@/utils/salesPermissionUtils";
import { useEffect, useState } from "react";
import { 
  ShoppingCart,
  Package,
  Users,
  Truck,
  Wallet,
  Receipt,
  BarChart3,
  User,
  Shield,
  RotateCcw,
  Percent,
  AlertTriangle,
  Settings,
  Scan,
  Bot,
  TrendingUp,
  FileText,
  CreditCard,
  Building,
  Bell,
  Search,
  FilterIcon,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DashboardProps {
  username: string;
  onNavigate: (module: string) => void;
  onLogout: () => void;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: string;
}

export const ComprehensiveDashboard = ({ username, onNavigate, onLogout }: DashboardProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getCurrentUserRole();
      setUserRole(role);
    };
    
    fetchUserRole();
  }, []);
  
  const allModules: Module[] = [
    {
      id: "sales",
      title: "Sales Management",
      description: "Process sales, manage transactions, and handle customer orders",
      icon: ShoppingCart,
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200",
      category: "sales"
    },
    {
      id: "inventory",
      title: "Inventory Management",
      description: "Manage products, stock levels, and inventory tracking",
      icon: Package,
      color: "bg-gradient-to-br from-green-50 to-green-100 border border-green-200",
      category: "inventory"
    },
    {
      id: "customers",
      title: "Customer Management",
      description: "Manage customer information and loyalty programs",
      icon: Users,
      color: "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200",
      category: "crm"
    },
    {
      id: "suppliers",
      title: "Supplier Management",
      description: "Manage supplier information and vendor relationships",
      icon: Truck,
      color: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200",
      category: "procurement"
    },
    {
      id: "purchase",
      title: "Purchase Orders",
      description: "Create, track, and manage purchase orders",
      icon: Receipt,
      color: "bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200",
      category: "procurement"
    },
    {
      id: "expenses",
      title: "Expense Tracking",
      description: "Track and manage business expenses and cash flow",
      icon: Wallet,
      color: "bg-gradient-to-br from-red-50 to-red-100 border border-red-200",
      category: "finance"
    },
    {
      id: "returns",
      title: "Returns & Damages",
      description: "Manage product returns and damaged inventory",
      icon: RotateCcw,
      color: "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200",
      category: "inventory"
    },
    {
      id: "debts",
      title: "Debt Management",
      description: "Manage customer and supplier debts",
      icon: CreditCard,
      color: "bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200",
      category: "finance"
    },
    {
      id: "customer-settlements",
      title: "Customer Settlements",
      description: "Manage customer debt settlements and payments",
      icon: Users,
      color: "bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200",
      category: "finance"
    },
    {
      id: "supplier-settlements",
      title: "Supplier Settlements",
      description: "Manage supplier payments and settlements",
      icon: Building,
      color: "bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200",
      category: "finance"
    },
    {
      id: "discounts",
      title: "Discount Management",
      description: "Manage promotional discounts and offers",
      icon: Percent,
      color: "bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200",
      category: "sales"
    },
    {
      id: "audit",
      title: "Inventory Audit",
      description: "Track and manage inventory discrepancies",
      icon: AlertTriangle,
      color: "bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200",
      category: "inventory"
    },
    {
      id: "reports",
      title: "Reports & Analytics",
      description: "View financial reports and business analytics",
      icon: BarChart3,
      color: "bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200",
      category: "analytics"
    },
    {
      id: "employees",
      title: "Employee Management",
      description: "Manage staff members and permissions",
      icon: User,
      color: "bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200",
      category: "hr"
    },
    {
      id: "access-logs",
      title: "Access Logs",
      description: "Monitor user activity and system access",
      icon: Shield,
      color: "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200",
      category: "security"
    },
    {
      id: "settings",
      title: "System Settings",
      description: "Configure POS system preferences and options",
      icon: Settings,
      color: "bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200",
      category: "system"
    },
    {
      id: "scanner",
      title: "Scan Items",
      description: "Quickly add products using barcode scanner",
      icon: Scan,
      color: "bg-gradient-to-br from-lime-50 to-lime-100 border border-lime-200",
      category: "tools"
    },
    {
      id: "automated",
      title: "Automated Dashboard",
      description: "View automated business insights and recommendations",
      icon: Bot,
      color: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border border-fuchsia-200",
      category: "analytics"
    }
  ];
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(allModules.map(module => module.category)))];
  
  // Filter modules based on user role
  const accessibleModules = allModules.filter(module => hasModuleAccess(userRole, module.id));
  
  // Filter modules based on search term and category
  const filteredModules = accessibleModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Group modules by category
  const groupedModules: Record<string, Module[]> = {};
  filteredModules.forEach(module => {
    if (!groupedModules[module.category]) {
      groupedModules[module.category] = [];
    }
    groupedModules[module.category].push(module);
  });
  
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
  
  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      "sales": "Sales & Transactions",
      "inventory": "Inventory Management",
      "crm": "Customer Relations",
      "procurement": "Procurement",
      "finance": "Financial Management",
      "analytics": "Analytics & Reports",
      "hr": "Human Resources",
      "security": "Security",
      "system": "System Management",
      "tools": "Tools & Utilities"
    };
    
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    // Enhanced comprehensive dashboard with advanced layout and filtering
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.03)_0%,transparent_70%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,197,94,0.03)_0%,transparent_70%)]"></div>
      </div>
      
      <Navigation 
        title="Professional POS Dashboard" 
        onLogout={onLogout} 
        username={username}
      />
      
      <main className="container mx-auto p-4 sm:p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Welcome back, {username}!
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Select a module to manage your business operations
          </p>
        </motion.div>
        
        {/* Enhanced search and filter section with advanced styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 bg-card/80 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-border/50"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-5 text-base rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Enhanced filter section with dropdown */}
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 rounded-xl border-muted-foreground/20 hover:bg-muted/50"
              >
                <FilterIcon className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
          
          {/* Enhanced category filter dropdown */}
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-border/50"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsFilterOpen(false);
                    }}
                    className={`capitalize rounded-full px-4 py-2 transition-all ${
                      selectedCategory === category 
                        ? "shadow-md hover:shadow-lg" 
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {category === "all" ? "All Modules" : getCategoryDisplayName(category)}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {filteredModules.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedModules).map(([category, modules], index) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  <span className="mr-2">
                    {category === "sales" && <TrendingUp className="h-5 w-5" />}
                    {category === "inventory" && <Package className="h-5 w-5" />}
                    {category === "crm" && <Users className="h-5 w-5" />}
                    {category === "procurement" && <Truck className="h-5 w-5" />}
                    {category === "finance" && <Wallet className="h-5 w-5" />}
                    {category === "analytics" && <BarChart3 className="h-5 w-5" />}
                    {category === "hr" && <User className="h-5 w-5" />}
                    {category === "security" && <Shield className="h-5 w-5" />}
                    {category === "system" && <Settings className="h-5 w-5" />}
                    {category === "tools" && <Scan className="h-5 w-5" />}
                  </span>
                  {getCategoryDisplayName(category)}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">({modules.length})</span>
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 auto-rows-fr">
                  {modules.map((module) => (
                    <div key={module.id} className="flex">
                      <DashboardCard
                        title={module.title}
                        description={module.description}
                        icon={module.icon}
                        onClick={() => {
                          console.log("Module clicked:", module.id);
                          handleNavigate(module.id);
                        }}
                        className={module.color}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-card/80 backdrop-blur-lg rounded-2xl shadow-xl border border-border/50"
          >
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Modules Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? `No modules match your search for "${searchTerm}". Try a different search term.` 
                : "You don't have permission to access any modules in this category."}
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm("")} 
                variant="outline"
                className="rounded-xl"
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};