import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  onClick: () => void;
  className?: string;
}

export const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  className 
}: DashboardCardProps) => {
  const handleClick = () => {
    console.log("DashboardCard clicked:", title);
    onClick();
  };
  
  return (
    // Enhanced dashboard card with professional styling and advanced animations
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group btn-touch h-full flex flex-col dashboard-card p-0 overflow-hidden border-0 shadow-lg backdrop-blur-sm bg-white/80 hover:bg-white/90",
        className
      )}
      onClick={handleClick}
    >
      {/* Enhanced gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Enhanced card header with improved styling */}
      <CardHeader className="pb-3 flex-shrink-0 px-5 pt-5 relative z-10">
        <div className="dashboard-card-header flex items-start justify-between">
          {/* Enhanced icon container with advanced styling */}
          <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 flex-shrink-0 dashboard-card-icon p-3 shadow-inner">
            <Icon className="text-primary flex-shrink-0 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="min-w-0 flex-grow ml-4">
            <CardTitle className="text-base font-bold card-title text-foreground truncate bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      {/* Enhanced card content with improved styling */}
      <CardContent className="flex-grow pt-0 px-5 pb-5 relative z-10">
        <p className="text-sm text-muted-foreground leading-relaxed card-description line-clamp-2">
          {description}
        </p>
        {/* Enhanced call-to-action with advanced styling */}
        <div className="mt-3 flex items-center text-primary text-sm font-medium group-hover:text-primary/90 transition-colors duration-300">
          <span className="group-hover:translate-x-1 transition-transform duration-300">Open</span>
          <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};