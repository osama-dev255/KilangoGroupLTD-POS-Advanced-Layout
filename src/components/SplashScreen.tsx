import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import "../App.css";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Hide splash screen after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;
  
  // Ensure splash screen is completely removed from DOM when not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-primary/10 flex items-center justify-center splash-screen">
      <div className="text-center">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
          <div className="relative bg-primary rounded-full p-6 shadow-lg">
            <ShoppingCart className="h-16 w-16 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground splash-fade-in">
          Kilango Group Food Suppliers & General 🫱🏽‍🫲🏻
        </h1>

        <div className="w-24 h-1 bg-primary mx-auto mb-6 splash-fade-in"></div>

        <p className="text-lg md:text-xl mb-8 text-muted-foreground splash-fade-in">
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

        <div className="flex items-center justify-center space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
};