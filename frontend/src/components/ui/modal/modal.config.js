import React from "react";
import { MODAL_TYPES } from "./modal.types";

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.LOGIN]: React.lazy(
    () => import("../../../modules/auth/pages/Login"),
  ),
  [MODAL_TYPES.SIGNUP]: React.lazy(
    () => import("../../../modules/auth/pages/Signup"),
  ),
  [MODAL_TYPES.ADDRESS]: React.lazy(
    () => import("../../../modules/address/components/AddressForm"),
  ),
  [MODAL_TYPES.CONFIRM]: React.lazy(() => import("./ConfirmModal")),
};
