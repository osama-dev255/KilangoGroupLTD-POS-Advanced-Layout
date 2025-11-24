import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import "../App.css";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Hide splash screen after 3 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-primary/20 flex items-center justify-center splash-screen z-50">
      <div className="text-center max-w-md w-full px-4">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
          <div className="relative bg-primary rounded-full p-6 shadow-lg mx-auto w-24 h-24 flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground splash-fade-in">
          Kilango Group
        </h1>
        
        <p className="text-lg md:text-xl mb-2 text-muted-foreground splash-fade-in">
          Food Suppliers & General
        </p>

        <div className="w-24 h-1 bg-primary mx-auto mb-6 splash-fade-in"></div>

        <p className="text-base md:text-lg mb-8 text-muted-foreground splash-fade-in">
          Biashara kidigitaly 💫
        </p>

        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex space-x-2">
            {["Inventory", "Sales", "Analytics"].map((text, index) => (
              <div
                key={index}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium splash-fade-in"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6 splash-fade-in">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
};