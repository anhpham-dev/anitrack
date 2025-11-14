import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-xl shadow-primary/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-subtle-bounce border border-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;