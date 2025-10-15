import React, { ReactNode } from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  const handleConfirmClick = () => {
    onConfirm();
    // The modal will be closed by the parent component logic after confirmation.
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-isabelline/90">
        {children}
      </div>
      <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-raisin-black/50">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-onyx text-isabelline rounded-lg hover:bg-raisin-black transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmClick}
          className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-900/40"
        >
          Excluir
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
