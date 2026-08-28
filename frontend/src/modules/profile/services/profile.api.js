import api from "@/configs/api";

// Update individual account field (username, email, phone) with single field payload
export const updateAccountFieldApi = async (userId, fieldName, value) => {
  const { data } = await api.put("/profile/update-account", {
    userId,
    [fieldName]: value,
  });
  return data;
};

// Upload profile picture to Cloudinary
export const uploadProfilePictureApi = async (formData) => {
  const { data } = await api.post("/profile/upload-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Remove profile picture
export const removeProfilePictureApi = async (userId) => {
  const { data } = await api.post("/profile/remove-picture", { userId });
  return data;
};

// Change password via backend API with bcrypt verification
export const changePasswordApi = async (userId, oldPassword, newPassword) => {
  const { data } = await api.put("/profile/change-password", {
    userId,
    oldPassword,
    newPassword,
  });
  return data;
};
