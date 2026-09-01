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

  const prevPathRef = useRef(location.pathname);

  // Close modal only when user navigates away to a new page (excluding auth redirect routes)
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      const prevPath = prevPathRef.current;
      prevPathRef.current = location.pathname;

      // If transition was from /login or /signup to /, do not immediately close the freshly opened modal
      if (
        isOpenRef.current &&
        prevPath !== "/login" &&
        prevPath !== "/signup"
      ) {
        closeModal();
      }
    }
  }, [location.pathname, closeModal]);

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
