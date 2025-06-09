import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  RefreshCw,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react";
import { useMobile } from "@/hooks/useMobile";
import MobileNavigation from "@/components/ui/mobile-navigation";
import { useOnboarding } from "@/hooks/useOnboarding";

// Order interfaces
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  image?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  shippingAddress: Address;
  billingAddress: Address;
  orderDate: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: {
      id: "cust1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      avatar: "/api/placeholder/32/32",
    },
    items: [
      {
        id: "item1",
        name: "Premium Marketing Analytics Package",
        quantity: 1,
        price: 299.99,
        sku: "PMA-001",
      },
      {
        id: "item2",
        name: "Facebook Ads Management (3 months)",
        quantity: 1,
        price: 899.99,
        sku: "FAM-003",
      },
    ],
    status: "processing",
    total: 1279.98,
    subtotal: 1199.98,
    tax: 80.0,
    shipping: 0,
    paymentMethod: "Credit Card (**** 4567)",
    paymentStatus: "paid",
    shippingAddress: {
      street: "123 Business Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
    },
    billingAddress: {
      street: "123 Business Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
    },
    orderDate: new Date("2024-01-15T10:30:00Z"),
    estimatedDelivery: new Date("2024-01-18T17:00:00Z"),
    notes: "Rush delivery requested",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: {
      id: "cust2",
      name: "Michael Chen",
      email: "mike.chen@company.com",
      phone: "+1 (555) 987-6543",
      avatar: "/api/placeholder/32/32",
    },
    items: [
      {
        id: "item3",
        name: "Google Ads Setup & Optimization",
        quantity: 1,
        price: 599.99,
        sku: "GAO-001",
      },
      {
        id: "item4",
        name: "Landing Page Design Package",
        quantity: 2,
        price: 249.99,
        sku: "LPD-001",
      },
    ],
    status: "shipped",
    total: 1139.97,
    subtotal: 1099.97,
    tax: 40.0,
    shipping: 0,
    paymentMethod: "PayPal",
    paymentStatus: "paid",
    shippingAddress: {
      street: "456 Tech Street",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "United States",
    },
    billingAddress: {
      street: "456 Tech Street",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "United States",
    },
    orderDate: new Date("2024-01-14T14:20:00Z"),
    estimatedDelivery: new Date("2024-01-17T12:00:00Z"),
    trackingNumber: "TRK123456789",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customer: {
      id: "cust3",
      name: "Emily Rodriguez",
      email: "emily.r@startup.io",
      phone: "+1 (555) 456-7890",
      avatar: "/api/placeholder/32/32",
    },
    items: [
      {
        id: "item5",
        name: "Social Media Management Bundle",
        quantity: 1,
        price: 1299.99,
        sku: "SMM-BUNDLE",
      },
    ],
    status: "delivered",
    total: 1379.99,
    subtotal: 1299.99,
    tax: 80.0,
    shipping: 0,
    paymentMethod: "Credit Card (**** 8901)",
    paymentStatus: "paid",
    shippingAddress: {
      street: "789 Innovation Blvd",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States",
    },
    billingAddress: {
      street: "789 Innovation Blvd",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States",
    },
    orderDate: new Date("2024-01-10T09:15:00Z"),
    estimatedDelivery: new Date("2024-01-13T16:00:00Z"),
    actualDelivery: new Date("2024-01-13T14:30:00Z"),
    trackingNumber: "TRK987654321",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customer: {
      id: "cust4",
      name: "David Wilson",
      email: "david.w@enterprise.com",
      avatar: "/api/placeholder/32/32",
    },
    items: [
      {
        id: "item6",
        name: "Enterprise Analytics Dashboard",
        quantity: 1,
        price: 2499.99,
        sku: "EAD-001",
      },
      {
        id: "item7",
        name: "Custom Integration Setup",
        quantity: 1,
        price: 899.99,
        sku: "CIS-001",
      },
    ],
    status: "pending",
    total: 3519.98,
    subtotal: 3399.98,
    tax: 120.0,
    shipping: 0,
    paymentMethod: "Bank Transfer",
    paymentStatus: "pending",
    shippingAddress: {
      street: "321 Corporate Way",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    billingAddress: {
      street: "321 Corporate Way",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    orderDate: new Date("2024-01-16T16:45:00Z"),
    estimatedDelivery: new Date("2024-01-20T17:00:00Z"),
  },
];

const Orders: React.FC = () => {
  const mobile = useMobile();
  const {
    isActive: tourActive,
    startTour,
    completeTour,
    skipTour,
  } = useOnboarding();
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
  });

  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (!tourActive) {
      const timer = setTimeout(() => {
        startTour("orders-tour");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tourActive, startTour]);

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const deliveredOrders = orders.filter(
      (o) => o.status === "delivered",
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }, [orders]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "refunded":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  return (
    <>
      {mobile.isMobile && <MobileNavigation />}
      <motion.div
        className={`min-h-screen p-4 md:p-6 ${mobile.isMobile ? "pt-20 pb-20" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          data-tour="orders-header"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Orders
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track customer orders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingOrders}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.deliveredOrders}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.averageOrderValue)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          data-tour="orders-filters"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search orders, customers, or order numbers..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Status: {statusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All Statuses
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("pending")}
                      >
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("processing")}
                      >
                        Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("shipped")}
                      >
                        Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("delivered")}
                      >
                        Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("cancelled")}
                      >
                        Cancelled
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payment: {paymentFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setPaymentFilter("all")}>
                        All Payments
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPaymentFilter("paid")}
                      >
                        Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPaymentFilter("pending")}
                      >
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPaymentFilter("failed")}
                      >
                        Failed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPaymentFilter("refunded")}
                      >
                        Refunded
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          data-tour="orders-table"
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                {filteredOrders.length} of {orders.length} orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Order
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Payment
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} items
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={order.customer.avatar} />
                              <AvatarFallback>
                                {order.customer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.orderDate)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={getPaymentStatusColor(
                              order.paymentStatus,
                            )}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {formatCurrency(order.total)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Order
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Invoice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    paymentFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No orders have been placed yet"}
                  </p>
                  <Button>Create New Order</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Order Details
                    </h2>
                    <p className="text-gray-600">{selectedOrder.orderNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowOrderDetails(false)}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Order Status
                      </h3>
                      <Badge
                        className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Payment Status
                      </h3>
                      <Badge
                        className={getPaymentStatusColor(
                          selectedOrder.paymentStatus,
                        )}
                      >
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Order Total
                      </h3>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(selectedOrder.total)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedOrder.customer.avatar} />
                        <AvatarFallback>
                          {selectedOrder.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedOrder.customer.name}
                        </h3>
                        <p className="text-gray-600">
                          {selectedOrder.customer.email}
                        </p>
                        {selectedOrder.customer.phone && (
                          <p className="text-gray-600">
                            {selectedOrder.customer.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            {item.sku && (
                              <p className="text-sm text-gray-500">
                                SKU: {item.sku}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(item.price)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Order Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">
                          {formatCurrency(selectedOrder.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span className="text-gray-900">
                          {formatCurrency(selectedOrder.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="text-gray-900">
                          {formatCurrency(selectedOrder.shipping)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-gray-600">
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state}{" "}
                          {selectedOrder.shippingAddress.zipCode}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-gray-600">
                        <p>{selectedOrder.billingAddress.street}</p>
                        <p>
                          {selectedOrder.billingAddress.city},{" "}
                          {selectedOrder.billingAddress.state}{" "}
                          {selectedOrder.billingAddress.zipCode}
                        </p>
                        <p>{selectedOrder.billingAddress.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Order placed: {formatDate(selectedOrder.orderDate)}
                        </span>
                      </div>
                      {selectedOrder.estimatedDelivery && (
                        <div className="flex items-center gap-3">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Estimated delivery:{" "}
                            {formatDate(selectedOrder.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                      {selectedOrder.actualDelivery && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            Delivered:{" "}
                            {formatDate(selectedOrder.actualDelivery)}
                          </span>
                        </div>
                      )}
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Tracking: {selectedOrder.trackingNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Orders;
