import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  LogOut, 
  User, 
  Menu, 
  X,
  Building2,
  Bell,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavigationProps {
  title: string;
  onBack?: () => void;
  onLogout: () => void;
  username?: string;
}

export const Navigation = ({ title, onBack, onLogout, username }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    // Enhanced navigation with advanced styling and animations
    <header className="border-b bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-white sticky top-0 z-50 shadow-xl backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            {onBack ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack} 
                className="px-2 text-white hover:bg-white/20 btn-touch transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            ) : (
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-md"></div>
                  <Building2 className="h-8 w-8 mr-2 relative z-10" />
                </div>
                <span className="font-bold text-xl hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  POS Pro
                </span>
              </div>
            )}
          </div>
          
          <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[120px] sm:max-w-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Desktop view - always visible */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right bg-white/10 rounded-lg py-1 px-3 backdrop-blur-sm">
              <div className="text-sm font-medium">{formatTime(currentTime)}</div>
              <div className="text-xs opacity-80">{formatDate(currentTime)}</div>
            </div>
            
            {username && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-full py-1 px-3 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-sm"></div>
                  <User className="h-5 w-5 relative z-10" />
                </div>
                <span className="text-sm font-medium">{username}</span>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout} 
              className="px-3 text-white hover:bg-white/20 btn-touch transition-all duration-300 hover:scale-105"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile view - with dropdown menu */}
          <div className="md:hidden flex items-center">
            <div className="text-right mr-2 hidden xs:block">
              <div className="text-xs font-medium">{formatTime(currentTime)}</div>
              <div className="text-[0.6rem] opacity-80">{formatDate(currentTime)}</div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-2 text-white hover:bg-white/20 btn-touch transition-all duration-300 hover:scale-105"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu dropdown with enhanced styling */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-xl border-t border-white/20 animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              {username && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{username}</span>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout} 
                className="px-2 text-white hover:bg-white/20 btn-touch"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};