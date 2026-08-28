import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import api from "@/configs/api";
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

  // Profile picture upload via Cloudinary
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        if (e.target) e.target.value = "";
        return toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      }

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        if (e.target) e.target.value = "";
        return toast.error("File size exceeds 5MB limit. Please select a smaller image.");
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", currentUser?._id || currentUser?.id);

      const { data } = await api.post("/profile/upload-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        dispatch(updateUser({ imageUrl: data.imageUrl, profile_picture: data.imageUrl }));
        toast.success("Profile photo updated successfully!");
      } else {
        toast.error(data.message || "Failed to upload profile photo");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload profile photo");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Remove profile picture (DB-first remove + Cloudinary background delete + Error popup on DB failure)
  const handleRemoveProfilePicture = async () => {
    if (!currentUser?.imageUrl && !currentUser?.profile_picture) {
      return toast.info("No profile picture to remove");
    }

    openModal(MODAL_TYPES.CONFIRM, {
      title: "Remove Profile Photo",
      message: "Are you sure you want to remove your profile photo?",
      confirmText: "Remove",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          const { data } = await api.post("/profile/remove-picture", {
            userId: currentUser?._id || currentUser?.id,
          });

          if (data && data.success) {
            dispatch(updateUser({ imageUrl: "", profile_picture: "" }));
            toast.success("Profile photo removed successfully");
          } else {
            toast.error(data.message || "Failed to remove profile picture from database");
          }
        } catch (error) {
          console.error("Remove profile photo error:", error);
          toast.error(
            error.response?.data?.message || "Failed to remove profile picture from database"
          );
        }
      },
    });
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
