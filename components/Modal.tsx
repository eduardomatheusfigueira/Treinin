import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-raisin-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-wenge border border-raisin-black rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sticky top-0 bg-wenge border-b border-raisin-black z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-isabelline">{title}</h2>
            <button
              onClick={onClose}
              className="text-bone/70 hover:text-bone transition-colors p-1 rounded-full bg-raisin-black/50 hover:bg-onyx"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;