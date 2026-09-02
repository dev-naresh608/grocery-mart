import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { toast } from "react-toastify";
import { useModal, MODAL_TYPES } from "../../../components";
import {
  updateAccountFieldApi,
  uploadProfilePictureApi,
  removeProfilePictureApi,
  changePasswordApi,
} from "../services";
import {
  handleGetAddressApi,
  handleDeleteAddressApi,
} from "../../address/services/address.service.api";

export const useSetting = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { openModal } = useModal();

  // Account Info Form State
  const [accountData, setAccountData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });

  const [editingField, setEditingField] = useState(null); // 'username' | 'email' | 'phone' | null
  const [savingAccount, setSavingAccount] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setAccountData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser?.username, currentUser?.email, currentUser?.phone]);

  const onAccountChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "phone") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setAccountData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const cancelEdit = (fieldName) => {
    setAccountData((prev) => ({
      ...prev,
      [fieldName]: currentUser?.[fieldName] || "",
    }));
    setEditingField(null);
  };

  // Submit ONLY the single updated field in API payload
  const handleSingleFieldSubmit = async (e, fieldName) => {
    if (e) e.preventDefault();
    const val = (accountData[fieldName] || "").trim();
    if (!val) {
      return toast.error(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot be empty`);
    }

    if (fieldName === "phone" && val.length !== 10) {
      return toast.error("Phone number must be exactly 10 digits");
    }

    // Comparison Check: If unchanged, skip server request!
    const currentValue = (currentUser?.[fieldName] || "").trim();
    if (val.toLowerCase() === currentValue.toLowerCase()) {
      toast.info("No changes detected");
      setEditingField(null);
      return;
    }

    try {
      setSavingAccount(true);
      const userId = currentUser?._id || currentUser?.id;

      // Call modular service with single field payload { userId, [fieldName]: val }
      const data = await updateAccountFieldApi(userId, fieldName, val);

      if (data && data.success) {
        dispatch(updateUser(data.user));
        toast.success(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`);
        setEditingField(null);
      } else {
        toast.error(data.message || "Failed to update account info");
      }
    } catch (error) {
      console.error("Account update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update account info"
      );
    } finally {
      setSavingAccount(false);
    }
  };

  // Password Form State
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [isConfirmPassMatch, setIsConfirmPassMatch] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);

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

  // Live confirm password match
  useEffect(() => {
    if (formData.confirmPassword.length > 0) {
      setIsConfirmPassMatch(formData.newPassword === formData.confirmPassword);
    } else {
      setIsConfirmPassMatch(true);
    }
  }, [formData.newPassword, formData.confirmPassword]);

  const onPasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") {
      setOldPasswordError("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Profile picture upload via Cloudinary service
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

      const uploadData = new FormData();
      uploadData.append("image", file);
      uploadData.append("userId", currentUser?._id || currentUser?.id);

      const data = await uploadProfilePictureApi(uploadData);

      if (data && data.success) {
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

  // Remove profile picture via service
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
          const userId = currentUser?._id || currentUser?.id;
          const data = await removeProfilePictureApi(userId);

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

  // Submit password change with error highlighting for wrong current password
  const onFormDataSubmit = async (e) => {
    e.preventDefault();
    setOldPasswordError("");

    if (!formData.oldPassword) {
      setOldPasswordError("Please enter your current password");
      return toast.error("Please enter your current password");
    }
    if (!formData.newPassword) {
      return toast.error("Please enter a new password");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    if (formData.oldPassword === formData.newPassword) {
      return toast.error("New password must be different from current password");
    }
    if (formData.newPassword.length < 3) {
      return toast.error("Password must be at least 3 characters");
    }

    try {
      setChangingPassword(true);
      const userId = currentUser?._id || currentUser?.id;
      const data = await changePasswordApi(userId, formData.oldPassword, formData.newPassword);

      if (data && data.success) {
        toast.success("Password updated successfully!");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setOldPasswordError("");
      } else {
        const msg = data.message || "Failed to update password";
        if (msg.toLowerCase().includes("current password")) {
          setOldPasswordError(msg);
        }
        toast.error(msg);
      }
    } catch (error) {
      console.error("Password update error:", error);
      const msg = error.response?.data?.message || "Failed to update password. Check current password.";
      if (msg.toLowerCase().includes("current password")) {
        setOldPasswordError(msg);
      }
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  return {
    currentUser,
    accountData,
    onAccountChange,
    editingField,
    setEditingField,
    cancelEdit,
    handleSingleFieldSubmit,
    savingAccount,
    formData,
    oldPasswordError,
    isConfirmPassMatch,
    changingPassword,
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
