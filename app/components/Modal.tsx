'use client'
import { useEffect, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 z-50 flex items-start justify-end bg-black bg-opacity-50 h-screen w-screen">
      <div className="bg-gray-100 text-black rounded-lg shadow-lg w-full max-w-lg p-6 relative mt-20 mr-4">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &#10005;
        </button>

        {/* Modal content */}
        <div>{children}</div>
      </div>
    </div>

  );
}
