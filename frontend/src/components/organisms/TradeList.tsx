import React from 'react';
import { useTrades } from '../../hooks/queries/useTrades';
import { useAuthStore } from '../../stores/authStore';
import { CheckCircle2, Clock, Filter, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../atoms';

const TEXT = {
  TITLE: 'Trade Dashboard',
  SEARCH_PLACEHOLDER: 'Search trades...',
  LOADING: 'Loading trades...',
  EMPTY: 'No trades found. Start by capturing a new trade.',
  COLUMNS: {
    ID: 'Trade ID',
    PRODUCT: 'Product',
    PARTIES: 'Seller / Buyer',
    QUANTITY: 'Quantity',
    TOTAL: 'Total Price',
    STATUS: 'Status',
    ACTIONS: 'Actions',
  },
  STATUS: {
    APPROVED: 'Approved',
    PENDING: 'Pending',
  },
  APPROVE_BUTTON: 'Approve',
};

export const TradeList: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { trades, isLoading, approveTrade, isApproving } = useTrades();

  if (isLoading) return <div className="p-8 text-center text-zinc-500">{TEXT.LOADING}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-800">{TEXT.TITLE}</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              className="pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder={TEXT.SEARCH_PLACEHOLDER}
            />
          </div>
          <button className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50">
            <Filter className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-zinc-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {TEXT.COLUMNS.ID}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {TEXT.COLUMNS.PRODUCT}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {TEXT.COLUMNS.PARTIES}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {TEXT.COLUMNS.QUANTITY}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {TEXT.COLUMNS.TOTAL}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {TEXT.COLUMNS.STATUS}
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">
                {TEXT.COLUMNS.ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {trades?.map((trade) => (
              <tr key={trade.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono text-sm font-bold text-zinc-900">{trade.trade_id}</div>
                  <div className="text-[10px] text-zinc-400">{trade.deal_date}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-zinc-800">{trade.product}</div>
                  <div className="text-xs text-zinc-500">{trade.division?.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span className="text-zinc-600">{trade.seller}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-zinc-600">{trade.buyer}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-zinc-800">{trade.quantity} MWh</div>
                  <div className="text-xs text-zinc-400">@ €{trade.price}</div>
                </td>
                <td className="px-6 py-4 font-bold text-zinc-900">
                  €{Number(trade.total_price).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold',
                      trade.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700',
                    )}
                  >
                    {trade.status === 'approved' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> {TEXT.STATUS.APPROVED}
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> {TEXT.STATUS.PENDING}
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user?.role === 'manager' && trade.status === 'pending' && (
                    <Button
                      onClick={() => approveTrade(trade.id)}
                      isLoading={isApproving}
                      size="sm"
                      className="px-4 py-1.5 text-xs font-bold"
                    >
                      {TEXT.APPROVE_BUTTON}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {trades?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 text-sm">
                  {TEXT.EMPTY}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
