import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTrades } from '../../hooks/queries/useTrades';
import { useDivisions } from '../../hooks/queries/useDivisions';
import { tradeSchema, type TradeFormData } from '../../forms/tradeSchema';
import { TradeCreate } from '../../types';
import { Euro, Calendar, Package, Users } from 'lucide-react';
import { Button } from '../atoms';

interface TradeCaptureFormProps {
  onSuccess?: () => void;
}

const TEXT = {
  TITLE: 'New Trade Capture',
  SECTIONS: {
    COUNTERPARTIES: 'Counterparties',
    PRODUCT_DETAILS: 'Product & Division',
    PRICING_DELIVERY: 'Pricing & Delivery',
    SUMMARY: 'Trade Summary',
  },
  UNITS: {
    CURRENCY: '€',
    QUANTITY: 'MWh',
  },
  LABELS: {
    SELLER: 'Seller',
    BUYER: 'Buyer',
    PRODUCT: 'Product',
    DIVISION: 'Division',
    QUANTITY: 'Quantity (MWh)',
    PRICE: 'Price (EUR)',
    DELIVERY_DATE: 'Delivery Date',
  },
  PLACEHOLDERS: {
    SELLER: 'e.g. Energy Corp A',
    BUYER: 'e.g. Trading Co B',
    PRODUCT: 'e.g. NL SOLAR GVO',
    DIVISION: 'Select Division...',
  },
  SUMMARY: {
    QUANTITY: 'Total Quantity',
    UNIT_PRICE: 'Unit Price',
    TOTAL_PRICE: 'Total Price',
  },
  SUBMIT: 'Capture Trade',
  SUCCESS: 'Trade captured successfully!',
};

export const TradeCaptureForm: React.FC<TradeCaptureFormProps> = ({ onSuccess }) => {
  const { createTrade, isCreating } = useTrades();
  const { data: divisions } = useDivisions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      quantity: 0,
      price: 0,
      delivery_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    },
  });

  const quantity = useWatch({ control, name: 'quantity' });
  const price = useWatch({ control, name: 'price' });
  const totalPrice = (Number(quantity) || 0) * (Number(price) || 0);

  const onSubmit = (data: TradeFormData) => {
    createTrade(data as TradeCreate, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-zinc-100 rounded-lg">
          <Package className="w-5 h-5 text-zinc-900" />
        </div>
        <h2 className="text-lg font-bold text-zinc-800">{TEXT.TITLE}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Counterparties */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {TEXT.SECTIONS.COUNTERPARTIES}
            </h3>
            <div>
              <label htmlFor="seller" className="block text-sm font-medium text-zinc-700 mb-1">
                {TEXT.LABELS.SELLER}
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  id="seller"
                  {...register('seller')}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1"
                  placeholder={TEXT.PLACEHOLDERS.SELLER}
                />
              </div>
              {errors.seller && (
                <p className="mt-1 text-xs text-red-500">{errors.seller.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="buyer" className="block text-sm font-medium text-zinc-700 mb-1">
                {TEXT.LABELS.BUYER}
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  id="buyer"
                  {...register('buyer')}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1"
                  placeholder={TEXT.PLACEHOLDERS.BUYER}
                />
              </div>
              {errors.buyer && <p className="mt-1 text-xs text-red-500">{errors.buyer.message}</p>}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {TEXT.SECTIONS.PRODUCT_DETAILS}
            </h3>
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-zinc-700 mb-1">
                {TEXT.LABELS.PRODUCT}
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  id="product"
                  {...register('product')}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1"
                  placeholder={TEXT.PLACEHOLDERS.PRODUCT}
                />
              </div>
              {errors.product && (
                <p className="mt-1 text-xs text-red-500">{errors.product.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="division_id" className="block text-sm font-medium text-zinc-700 mb-1">
                {TEXT.LABELS.DIVISION}
              </label>
              <select
                id="division_id"
                {...register('division_id')}
                className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1"
              >
                <option value="">{TEXT.PLACEHOLDERS.DIVISION}</option>
                {divisions?.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </select>
              {errors.division_id && (
                <p className="mt-1 text-xs text-red-500">{errors.division_id.message}</p>
              )}
            </div>
          </div>

          {/* Pricing & Delivery */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {TEXT.SECTIONS.PRICING_DELIVERY}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-zinc-700 mb-1">
                  {TEXT.LABELS.QUANTITY}
                </label>
                <input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('quantity', { valueAsNumber: true })}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1"
                />
                {errors.quantity && (
                  <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-zinc-700 mb-1">
                  {TEXT.LABELS.PRICE}
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="delivery_date"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                {TEXT.LABELS.DELIVERY_DATE}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  id="delivery_date"
                  type="date"
                  {...register('delivery_date')}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1"
                />
              </div>
              {errors.delivery_date && (
                <p className="mt-1 text-xs text-red-500">{errors.delivery_date.message}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {TEXT.SECTIONS.SUMMARY}
            </h3>
            <div className="p-4 bg-zinc-900 rounded-xl text-white space-y-3">
              <div className="flex justify-between items-center text-sm opacity-70">
                <span>{TEXT.SUMMARY.QUANTITY}</span>
                <span>
                  {quantity || 0} {TEXT.UNITS.QUANTITY}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm opacity-70">
                <span>{TEXT.SUMMARY.UNIT_PRICE}</span>
                <span>
                  {TEXT.UNITS.CURRENCY}
                  {price || 0}
                </span>
              </div>
              <div className="h-px bg-white/20 my-2" />
              <div className="flex justify-between items-center">
                <span className="font-medium">{TEXT.SUMMARY.TOTAL_PRICE}</span>
                <span className="text-xl font-bold">
                  {TEXT.UNITS.CURRENCY}
                  {totalPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" isLoading={isCreating} className="w-full py-3 rounded-xl font-bold">
          {TEXT.SUBMIT}
        </Button>
      </form>
    </div>
  );
};
