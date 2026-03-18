import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { TradeCaptureForm, TradeList } from '../components/organisms';
import { ShieldCheck, Plus } from 'lucide-react';
import { Button } from '../components/atoms';
import { Modal } from '../components/molecules';

const TEXT = {
  TITLE: 'Trade Console',
  SUBTITLE: 'Manage and monitor your energy trades in real-time.',
  CREATE_BUTTON: 'Capture New Trade',
  MANAGER_TITLE: 'Manager Oversight Active',
  MANAGER_DESC:
    'You are currently authorized to approve pending trades. Use the dashboard below to finalize capture requests.',
  MODAL_TITLE: 'Capture New Energy Trade',
};

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{TEXT.TITLE}</h1>
          <p className="text-zinc-500 font-medium">{TEXT.SUBTITLE}</p>
        </div>

        {user?.role === 'trader' && (
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="shadow-lg shadow-zinc-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            {TEXT.CREATE_BUTTON}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Info (Optional for Managers) */}
        {user?.role === 'manager' && (
          <div className="lg:col-span-12">
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-center gap-6 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-indigo-900 text-lg">{TEXT.MANAGER_TITLE}</h3>
                <p className="text-indigo-700/80 leading-relaxed font-medium">
                  {TEXT.MANAGER_DESC}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trade List Dashboard */}
        <div className="lg:col-span-12">
          <TradeList />
        </div>
      </div>

      {/* Reusable Modal for Trade Capture */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={TEXT.MODAL_TITLE}>
        <TradeCaptureForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default HomePage;
