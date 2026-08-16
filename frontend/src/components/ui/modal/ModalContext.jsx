import { createContext } from "react";

export const ModalContext = createContext({
  isOpen: false,
  modalType: null,
  payload: null,
  openModal: () => {},
  closeModal: () => {},
});
