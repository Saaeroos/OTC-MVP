import { z } from 'zod';

export const tradeSchema = z.object({
  seller: z.string().min(1, 'Seller is required'),
  buyer: z.string().min(1, 'Buyer is required'),
  product: z.string().min(1, 'Product is required'),
  division_id: z.string().uuid('Please select a division'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  delivery_date: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  }, 'Delivery date must be in the future'),
});

export type TradeFormData = z.infer<typeof tradeSchema>;
