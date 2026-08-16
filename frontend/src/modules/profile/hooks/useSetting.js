import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import { db } from "../../../db";
import { useModal, MODAL_TYPES } from "../../../components";
import {
  handleGetAddressApi,
  handleDeleteAddressApi,
} from "../../address/services/address.service.api";

export const useSetting = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { openModal } = useModal();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isOldPassMatch, setIsOldPassMatch] = useState(true);
  const [isConfirmPassMatch, setIsConfirmPassMatch] = useState(true);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const fetchAddresses = React.useCallback(async () => {
    if (!currentUser?._id) return;
    setLoadingAddresses(true);
    try {
      const data = await handleGetAddressApi(currentUser._id);
      if (data && data.success) {
        setAddresses(data.addressList || []);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const onDeleteAddress = (addressId) => {
    openModal(MODAL_TYPES.CONFIRM, {
      title: "Delete Address",
      message: "Are you sure you want to delete this saved address?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await handleDeleteAddressApi(addressId);
          if (response && response.success) {
            toast.success("Address deleted successfully");
            fetchAddresses();
          }
        } catch (error) {
          console.error("Error deleting address:", error);
        }
      },
    });
  };

  const onAddAddress = () => {
    openModal(MODAL_TYPES.ADDRESS, {
      userId: currentUser?._id,
      setAddress: () => {
        fetchAddresses();
      },
    });
  };

  const onEditAddress = (address) => {
    openModal(MODAL_TYPES.ADDRESS, {
      userId: currentUser?._id,
      address: address,
      setAddress: () => {
        fetchAddresses();
      },
    });
  };

  // Live password validation
  useEffect(() => {
    if (formData.oldPassword.length > 0) {
      setIsOldPassMatch(formData.oldPassword === currentUser?.password);
    } else {
      setIsOldPassMatch(true);
    }

    if (formData.confirmPassword.length > 0) {
      setIsConfirmPassMatch(formData.newPassword === formData.confirmPassword);
    } else {
      setIsConfirmPassMatch(true);
    }
  }, [formData.oldPassword, formData.newPassword, formData.confirmPassword, currentUser?.password]);

  const onPasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Profile picture upload
  const handleImageUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = async () => {
        dispatch(updateUser({ imageUrl: reader.result }));
        if (currentUser?.id) {
          try {
            await db.localUserData.update(currentUser.id, {
              imageUrl: reader.result,
            });
          } catch (err) {
            console.error("Failed updating IndexedDB:", err);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  // Remove profile picture
  const handleRemoveProfilePicture = async () => {
    dispatch(updateUser({ imageUrl: null }));
    if (currentUser?.id) {
      try {
        const user = await db.localUserData.get(currentUser.id);
        if (user && Object.prototype.hasOwnProperty.call(user, "imageUrl")) {
          delete user.imageUrl;
          await db.localUserData.put(user);
        }
      } catch (err) {
        console.error("Failed removing profile picture from IndexedDB:", err);
      }
    }
  };

  // Submit password change
  const onFormDataSubmit = async (e) => {
    e.preventDefault();

    if (formData.oldPassword !== currentUser?.password) {
      toast.error("Current password is incorrect");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (formData.oldPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }
    if (formData.newPassword.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }

    dispatch(updateUser({ password: formData.newPassword }));
    if (currentUser?.id) {
      try {
        await db.localUserData.update(currentUser.id, {
          password: formData.newPassword,
        });
      } catch (err) {
        console.error("Failed updating password in IndexedDB:", err);
      }
    }

    toast.success("Password updated successfully!");
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return {
    currentUser,
    formData,
    isOldPassMatch,
    isConfirmPassMatch,
    onPasswordChange,
    handleImageUpload,
    handleRemoveProfilePicture,
    onFormDataSubmit,
    addresses,
    loadingAddresses,
    onDeleteAddress,
    onAddAddress,
    onEditAddress,
  };
};
