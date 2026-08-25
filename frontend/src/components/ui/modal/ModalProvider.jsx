import React, { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ModalContext } from "./ModalContext";
import Modal from "./Modal";

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [payload, setPayload] = useState(null);
  const location = useLocation();
  const isOpenRef = useRef(isOpen);

  // Keep ref in sync with state
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const openModal = useCallback((type, data = null) => {
    setModalType(type);
    setPayload(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Delay resetting type and payload slightly to let close animations complete smoothly
    setTimeout(() => {
      setModalType(null);
      setPayload(null);
    }, 200);
  }, []);

  // Close modal only when the route changes (not when isOpen changes)
  useEffect(() => {
    if (isOpenRef.current) {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalType,
        payload,
        openModal,
        closeModal,
      }}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};
