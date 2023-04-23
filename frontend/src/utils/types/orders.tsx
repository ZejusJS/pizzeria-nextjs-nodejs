export interface IOrder {
    createdAt?: string;
    orderNo?: string | number;
    payId?: string | number;
    items?: [];
    totalPrice?: string | number;
    shippingPrice?: string | number;
    invoiceInfo?: any;
    shippingAdress?: any;
    paymentStatus?: Number
}