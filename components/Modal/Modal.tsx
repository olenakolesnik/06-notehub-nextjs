"use client";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { useEffect } from "react";


interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  useEffect(() => {
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
        document.addEventListener("keydown", handleKeydown);
        document.body.style.overflow = "hidden";
      return () => {
          document.removeEventListener("keydown", handleKeydown);
          document.body.style.overflow = "";
      };
    }, [onClose]);
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
          onClose();
      }
  };
  
  return createPortal(
      <div
          className={css.backdrop}
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
      >
          <div className={css.modal}>
             {children}
          </div>
      </div>,
      document.getElementById("modal-root") as HTMLDivElement,
  );
}