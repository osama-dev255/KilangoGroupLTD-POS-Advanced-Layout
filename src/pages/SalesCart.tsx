import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Minus, Trash2, ShoppingCart, Search, User, Percent, CreditCard, Wallet, Scan, Star, Printer, Download, QrCode, FileText, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { AutomationService } from "@/services/automationService";
import { PrintUtils } from "@/utils/printUtils";
import WhatsAppUtils from "@/utils/whatsappUtils";
// Import Supabase database service
import { getProducts, getCustomers, updateProductStock, createCustomer, createSale, createSaleItem, createDebt, Product, Customer as DatabaseCustomer } from "@/services/databaseService";
import { canCreateSales, getCurrentUserRole, hasModuleAccess } from "@/utils/salesPermissionUtils";
import { useAuth } from "@/contexts/AuthContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  loyaltyPoints: number;
  address?: string;
  email?: string;
  phone?: string;
}

// Update the temporary product interface to match the Product type
interface TempProduct {
  id: string;
  name: string;
  selling_price: number;
  barcode?: string;
  sku?: string;
  cost_price: number;
  stock_quantity: number;
}

interface SalesCartProps {
  username: string;
  onBack: () => void;
  onLogout: () => void;
  autoOpenScanner?: boolean;
}

export const SalesCart = ({ username, onBack, onLogout }: SalesCartProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isTransactionCompleteDialogOpen, setIsTransactionCompleteDialogOpen] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null); // Store completed transaction for printing
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false); // State for adding new customer
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: ""
  }); // State for new customer data
  const { toast } = useToast();

  // Check user permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      const userRole = await getCurrentUserRole();
      if (!hasModuleAccess(userRole, "sales")) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the sales terminal.",
          variant: "destructive",
        });
        onBack(); // Redirect back to the previous view
      }
    };
    
    checkPermissions();
  }, [onBack, toast]);

  // Load products and customers from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load products
        const productData = await getProducts();
        // Fix: Set products directly without mapping to a different structure
        setProducts(productData);
        
        // Load customers
        const customerData = await getCustomers();
        const formattedCustomers = customerData.map(customer => ({
          id: customer.id || '',
          name: `${customer.first_name} ${customer.last_name}`,
          loyaltyPoints: customer.loyalty_points || 0,
          address: customer.address || '',
          email: customer.email || '',
          phone: customer.phone || ''
        }));
        setCustomers(formattedCustomers);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load products and customers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter(product => 
    (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.barcode && product.barcode.includes(searchTerm)) ||
    (product.sku && product.sku.includes(searchTerm))
  );

  const addToCart = (product: Product) => {
    // Check if product is out of stock
    if (product.stock_quantity <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock`,
        variant: "destructive",
      });
      return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: product.id || '',
        name: product.name,
        price: product.selling_price,
        quantity: 1, // Changed to 1 as requested
      };
      setCart([...cart, newItem]);
    }
    
    setSearchTerm("");
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const discountAmount = discountType === "percentage" 
    ? subtotal * (parseFloat(discountValue) / 100 || 0)
    : parseFloat(discountValue) || 0;
    
  const total = subtotal - discountAmount;
  
  // Tax is displayed as 18% but doesn't affect calculation (for display purposes only)
  const tax = total * 0.18; // 18% tax for display
  const totalWithTax = total; // Tax doesn't affect the actual total
  
  const amountReceivedNum = parseFloat(amountReceived) || 0;
  const change = amountReceivedNum - total; // Change calculation based on actual total without tax

  const processTransaction = () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentDialogOpen(true);
  };

  const completeTransaction = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    // Check if payment method is Debt and customer details are required
    if (paymentMethod === "debt" && !selectedCustomer) {
      toast({
        title: "Error",
        description: "Customer details are required for Debt transactions",
        variant: "destructive",
      });
      setIsCustomerDialogOpen(true); // Open customer selection dialog
      return;
    }

    if (paymentMethod === "cash" && change < 0) {
      toast({
        title: "Error",
        description: "Insufficient payment amount",
        variant: "destructive",
      });
      return;
    }

    // Check if user has permission to create sales
    const hasPermission = await canCreateSales();
    if (!hasPermission) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create sales. Only salesmen and admins can create sales.",
        variant: "destructive",
      });
      return;
    }

    // Calculate loyalty points automatically
    const loyaltyPoints = selectedCustomer 
      ? AutomationService.calculateLoyaltyPoints(total) // Use total without tax for loyalty points
      : 0;

    try {
      // Create the sale record in the database
      const saleData = {
        customer_id: selectedCustomer?.id || null,
        user_id: null, // In In a real app, this would be the current user ID
        invoice_number: `INV-${Date.now()}`,
        sale_date: new Date().toISOString(),
        subtotal: subtotal,
        discount_amount: discountAmount,
        tax_amount: tax, // Display only tax (18%)
        total_amount: totalWithTax, // Actual total without tax effect
        amount_paid: paymentMethod === "debt" ? 0 : (parseFloat(amountReceived) || totalWithTax),
        change_amount: paymentMethod === "debt" ? 0 : change,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "debt" ? "unpaid" : "paid",
        sale_status: "completed",
        notes: paymentMethod === "debt" ? "Debt transaction - payment pending" : ""
      };

      const createdSale = await createSale(saleData);
      
      if (!createdSale) {
        throw new Error("Failed to create sale record");
      }

      // Create sale items for each product in the cart
      const itemsWithQuantity = cart.filter(item => item.quantity > 0);
      for (const item of itemsWithQuantity) {
        const saleItemData = {
          sale_id: createdSale.id || '',
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          discount_amount: 0, // In a real app, this would be calculated
          tax_amount: item.price * item.quantity * 0.18, // Display only tax (18%)
          total_price: item.price * item.quantity
        };
        
        await createSaleItem(saleItemData);
      }

      // Create debt record for debt transactions
      if (paymentMethod === "debt" && selectedCustomer) {
        const debtData = {
          customer_id: selectedCustomer.id,
          debt_type: "customer",
          amount: totalWithTax,
          description: `Debt for sale ${createdSale.id || 'unknown'}`,
          status: "outstanding",
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        };

        const createdDebt = await createDebt(debtData);
        if (!createdDebt) {
          console.warn("Failed to create debt record for transaction");
        }
      }

      // Update stock quantities for each item in the cart
      for (const item of itemsWithQuantity) {
        // Find the original product to get current stock
        const product = products.find(p => p.id === item.id);
        if (product) {
          // Calculate new stock quantity
          const newStock = Math.max(0, product.stock_quantity - item.quantity);
          // Update stock in database
          await updateProductStock(item.id, newStock);
        }
      }
      
      // Reload products to get updated stock quantities
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);

      // Create transaction object for printing
      const transaction = {
        id: createdSale.id || Date.now().toString(),
        date: createdSale.sale_date || new Date().toISOString(),
        items: cart,
        subtotal: subtotal,
        tax: tax, // Display only tax (18%)
        discount: discountAmount,
        total: totalWithTax, // Actual total without tax effect
        paymentMethod: paymentMethod,
        amountReceived: paymentMethod === "debt" ? 0 : (parseFloat(amountReceived) || 0),
        change: paymentMethod === "debt" ? 0 : change,
        customer: selectedCustomer // Include customer information
      };

      // Store transaction for potential printing
      setCompletedTransaction(transaction);

      // Show transaction complete dialog instead of toast
      setIsPaymentDialogOpen(false);
      setIsTransactionCompleteDialogOpen(true);
      
      // DISABLED: Send WhatsApp notification to business numbers only for the first sale of the day
      // try {
      //   // Check if this is the first sale of the business day
      //   if (WhatsAppUtils.isFirstSaleOfDay()) {
      //     const message = WhatsAppUtils.generateSalesNotificationMessage(
      //       createdSale.id || Date.now().toString(),
      //       totalWithTax,
      //       paymentMethod,
      //       selectedCustomer?.name
      //     );
      //      
      //     // Send message to all business numbers
      //     WhatsAppUtils.sendWhatsAppMessageToBusiness(message);
      //   }
      // } catch (whatsappError) {
      //   console.warn("Failed to send WhatsApp notification:", whatsappError);
      //   // Don't block the transaction if WhatsApp fails
      // }
      
      // Clear cart and reset form (but don't show toast yet)
      setCart([]);
      setSelectedCustomer(null);
      setDiscountValue("");
      setAmountReceived("");
      
      toast({
        title: "Success",
        description: `Transaction completed successfully${paymentMethod === "debt" ? " as Debt" : ""}`,
      });
    } catch (error) {
      console.error("Error completing transaction:", error);
      toast({
        title: "Error",
        description: "Failed to complete transaction: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Print receipt
  const printReceipt = () => {
    // In a real app, this would fetch the transaction details
    const mockTransaction = {
      id: Date.now().toString(),
      items: cart,
      subtotal: subtotal,
      tax: tax, // Display only tax (18%)
      discount: discountAmount,
      total: totalWithTax, // Actual total without tax effect
      paymentMethod: paymentMethod,
      amountReceived: parseFloat(amountReceived) || totalWithTax,
      change: change
    };
    PrintUtils.printReceipt(mockTransaction);
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.first_name || !newCustomer.last_name) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const customerData = {
        first_name: newCustomer.first_name,
        last_name: newCustomer.last_name,
        email: newCustomer.email || "",
        phone: newCustomer.phone || "",
        address: newCustomer.address || "",
        loyalty_points: 0,
        is_active: true
      };

      const createdCustomer = await createCustomer(customerData);
      
      if (createdCustomer) {
        // Format the created customer to match our Customer interface
        const formattedCustomer: Customer = {
          id: createdCustomer.id || '',
          name: `${createdCustomer.first_name} ${createdCustomer.last_name}`,
          loyaltyPoints: createdCustomer.loyalty_points || 0,
          address: createdCustomer.address || '',
          email: createdCustomer.email || '',
          phone: createdCustomer.phone || ''
        };
        
        // Add the new customer to the customers list
        setCustomers([...customers, formattedCustomer]);
        
        // Select the newly created customer
        setSelectedCustomer(formattedCustomer);
        
        // Close the dialog
        setIsCustomerDialogOpen(false);
        
        // Reset the new customer form
        setNewCustomer({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address: ""
        });
        
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
      } else {
        throw new Error("Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    }
  };

  return (
    // Enhanced sales cart with professional styling
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.02)_0%,transparent_70%)]"></div>
      </div>
      
      <Navigation 
        title="Sales Terminal" 
        onBack={onBack} 
        onLogout={onLogout} 
        username={username}
      />
      
      <main className="container mx-auto p-4 sm:p-6 relative z-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Sales Terminal</h1>
          <p className="text-muted-foreground">Process sales and manage customer transactions</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Search Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Product Search
                </CardTitle>
                <CardDescription>
                  Search for products by name, barcode, or SKU
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-5 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsScannerOpen(true)}
                    className="rounded-xl border-muted-foreground/20 hover:bg-muted/50"
                  >
                    <Scan className="h-5 w-5" />
                  </Button>
                </div>
                
                {searchTerm && (
                  <div className="mt-4 max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredProducts.length > 0 ? (
                      <div className="space-y-2">
                        {filteredProducts.map((product) => (
                          <div 
                            key={product.id} 
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => addToCart(product)}
                          >
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.barcode && `Barcode: ${product.barcode} | `}
                                {product.sku && `SKU: ${product.sku} | `}
                                Stock: {product.stock_quantity}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(product.selling_price)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No products found matching "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Cart Items Section */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Cart
                </CardTitle>
                <CardDescription>
                  {cart.length} items in cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length > 0 ? (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(item.price)} × {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 rounded-lg"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 rounded-lg"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>Your cart is empty</p>
                    <p className="text-sm mt-1">Add products to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="font-medium text-destructive">-{formatCurrency(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(total)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-1">
                    Tax: {formatCurrency(tax)} (18% for display purposes)
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customer" className="text-sm font-medium">Customer</Label>
                    <div className="flex gap-2 mt-1">
                      <Select 
                        value={selectedCustomer?.id || ""} 
                        onValueChange={(value) => {
                          const customer = customers.find(c => c.id === value);
                          setSelectedCustomer(customer || null);
                        }}
                      >
                        <SelectTrigger className="flex-1 rounded-lg">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {customer.name}
                                {customer.loyaltyPoints > 0 && (
                                  <Badge variant="secondary" className="ml-2">
                                    <Star className="h-3 w-3 mr-1" />
                                    {customer.loyaltyPoints} pts
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setIsCustomerDialogOpen(true)}
                        className="rounded-lg"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="discount" className="text-sm font-medium">Discount</Label>
                    <div className="flex gap-2 mt-1">
                      <Select value={discountType} onValueChange={(value) => setDiscountType(value as "percentage" | "amount")}>
                        <SelectTrigger className="w-24 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="discount"
                        type="number"
                        placeholder={discountType === "percentage" ? "0%" : "0.00"}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="flex-1 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment" className="text-sm font-medium">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value)}>
                      <SelectTrigger className="mt-1 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Cash
                          </div>
                        </SelectItem>
                        <SelectItem value="card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Card
                          </div>
                        </SelectItem>
                        <SelectItem value="mobile">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Mobile Money
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  className="w-full rounded-xl py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                  onClick={() => setIsPaymentDialogOpen(true)}
                  disabled={cart.length === 0}
                >
                  Process Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Customer Selection Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="max-w-md xs:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-responsive-xl font-bold text-foreground">Select Customer</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            <div className="space-y-2 mb-4">
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2 rounded-lg"
              />
              {customers
                .filter(customer => 
                  customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (customer.phone && customer.phone.includes(searchTerm))
                )
                .map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsCustomerDialogOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{customer.loyaltyPoints} points</span>
                        {customer.phone && (
                          <span>| {customer.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <Button 
              onClick={() => {
                setIsAddingNewCustomer(true);
                setIsCustomerDialogOpen(false);
              }} 
              variant="outline" 
              className="w-full rounded-lg border-primary/30 hover:bg-primary/5"
            >
              <User className="h-4 w-4 mr-2 text-primary" />
              Add New Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-responsive-xl font-bold text-foreground">Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total">Total Amount</Label>
                <div className="text-2xl font-bold mt-1 text-primary">{formatCurrency(total)}</div>
              </div>
              <div>
                <Label htmlFor="amountReceived">Amount Received</Label>
                <Input
                  id="amountReceived"
                  type="number"
                  placeholder="0.00"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="text-lg rounded-lg"
                />
              </div>
            </div>
            
            {amountReceivedNum > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span>Change</span>
                  <span className={`font-bold ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(change)}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button 
                onClick={completeTransaction}
                disabled={amountReceivedNum < total || change < 0}
                className="rounded-lg bg-primary hover:bg-primary/90"
              >
                Complete Sale
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Complete Dialog */}
      <Dialog open={isTransactionCompleteDialogOpen} onOpenChange={setIsTransactionCompleteDialogOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-responsive-xl text-center font-bold text-foreground">Transaction Complete!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-muted-foreground mb-2">Transaction ID: {transactionId}</p>
            <p className="text-2xl font-bold mb-4 text-primary">{formatCurrency(total)}</p>
            <p className="text-muted-foreground">Payment Method: {paymentMethod}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => {
              // Just close the dialog and reset
              setIsTransactionCompleteDialogOpen(false);
            }} className="rounded-lg">
              Quit Cart
            </Button>
            <Button onClick={() => {
              // Print receipt and then close
              if (completedTransaction) {
                PrintUtils.printReceipt(completedTransaction);
              }
              setIsTransactionCompleteDialogOpen(false);
              toast({
                title: "Transaction Processed",
                description: `Sale completed for ${formatCurrency(totalWithTax)}${selectedCustomer ? ` (${AutomationService.calculateLoyaltyPoints(total)} points earned)` : ''}`,
              });
            }} className="rounded-lg bg-primary hover:bg-primary/90">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-foreground">Scan Barcode</DialogTitle>
          </DialogHeader>
          <BarcodeScanner 
            onItemsScanned={(items) => {
              // Convert scanned items to cart items
              const cartItems = items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
              }));
              setCart([...cart, ...cartItems]);
            }}
            onCancel={() => setIsScannerOpen(false)}
            autoAddToCart={true} // Enable auto-add for better sales experience
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};