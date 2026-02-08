interface ShippingAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

interface DeliveryDetails {
    partner: string;
    trackingId: string;
    estimatedDeliveryDate: Date;
    deliveredAt?: Date;
}

type PaymentMethod = "RAZORPAY" | "COD";
type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
type OrderStatus = "PENDING" | "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED";

interface PaymentDetails {
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    currency: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paidAt?: Date;
    failureReason?: string;
}

interface OrderItem {
    bookId: string;
    quantity: number;
    unitPrice: number;
    title: string;
    category: string;
    coverImage: string;
}

interface OrderData {
    id: string;
    orderId: string;
    userId: string;
    email: string;
    shippingAddress: ShippingAddress;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    totalPrice: number;
    status: OrderStatus;
    paymentDetails: PaymentDetails;
    idempotencyKey: string;
    deliveryDetails: DeliveryDetails | null;
    cancellationReason?: string;
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateOrderData {
    success: boolean;
    order: OrderData;
    razorpayOrderId: string;
    message: string;
}

interface CreateOrderResponse {
    success: boolean;
    data: CreateOrderData;
    message: string;
}

interface Item {
    bookId: string;
    quantity: number;
    unitPrice: number;
}

interface CreateOrderArgs {
    idempotencyKey: string;
    userId: string;
    email: string;
    addressId: string;
    items: Item[];
    subtotal: number;
    deliveryCharge: number;
    totalPrice: number;
    paymentMethod: PaymentMethod;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Get Orders
interface PaginatedOrderData {
    orders: OrderData[];
    totalPages: number;
    currentPage: number;
    totalOrders: number;
}
interface GetOrdersResponse {
    success: boolean;
    data: PaginatedOrderData;
    message: string;
}

// Get Single Order
interface OrderResponse {
  id: string;
  orderId: string;
  userId: string;
  email: string;
  items: {
    bookId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: string;
    coverImage: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  deliveryDetails: DeliveryDetails | null;
  cancellationInfo?: {
    reason?: string;
    cancelledAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
interface GetSingleOrderResponse {
    success: boolean;
    data: OrderResponse;
    message: string;
}

// Get Razorpay Key
interface RazorpayKeyData {
    keyId: string | undefined;
}
interface GetRazorpayKeyResponse {
    success: boolean;
    data: RazorpayKeyData;
    message: string;
}

// Verify Payment
interface PaymentData {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface VerifyPayment {
  success: boolean;
  order?: OrderData;
  outOfStockIds?: string[];
  message: string;
}
interface VerifyPaymentResponse {
    success: boolean;
    data: VerifyPayment;
    message: string;
}

interface VerifyPaymentArgs {
    orderId: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

// Cancel Order
interface CancelOrderResultData {
  success: boolean;
  message: string;
}
interface CancelOrderResponse {
    result: CancelOrderResultData;
}

interface CancelOrderArgs {
    orderId: string;
    reason: string;
}

export type {
    OrderData,
    PaymentMethod,
    PaymentStatus,
    OrderStatus,
    OrderResponse,
    CreateOrderResponse,
    CreateOrderArgs,
    RazorpayPaymentResponse,
    GetOrdersResponse,
    PaginatedOrderData,
    GetSingleOrderResponse,
    RazorpayKeyData,
    GetRazorpayKeyResponse,
    PaymentData,
    VerifyPayment,
    VerifyPaymentResponse,
    VerifyPaymentArgs,
    CancelOrderResponse,
    CancelOrderArgs
}