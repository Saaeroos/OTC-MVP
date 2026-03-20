import { z } from 'zod';

const ERROR_TEXT = {
  SELLER: 'Seller is required',
  BUYER: 'Buyer is required',
  PRODUCT: 'Product is required',
  DIVISION_ID: 'Please select a division',
  QUANTITY: 'Quantity must be positive',
  PRICE: 'Price must be positive',
  DELIVERY_DATE: 'Delivery Date must be in the future',
}

export const tradeSchema = z.object({
  seller: z.string().min(1, ERROR_TEXT.SELLER),
  buyer: z.string().min(1, ERROR_TEXT.BUYER),
  product: z.string().min(1, ERROR_TEXT.PRODUCT),
  division_id: z.string().uuid(ERROR_TEXT.DIVISION_ID),
  quantity: z.number().positive(ERROR_TEXT.QUANTITY),
  price: z.number().positive(ERROR_TEXT.PRICE),
  delivery_date: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  }, ERROR_TEXT.DELIVERY_DATE),
});

export type TradeFormData = z.infer<typeof tradeSchema>;
