import React, { useState } from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { TradeCaptureForm, TradeList } from '../components/organisms';
import { Button } from '../components/atoms';
import { Modal } from '../components/molecules';

const TEXT = {
  CREATE_BUTTON: 'Capture New Trade',
  MODAL_TITLE: 'Capture New Energy Trade',
};

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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

      <TradeList />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={TEXT.MODAL_TITLE}>
        <TradeCaptureForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default HomePage;
