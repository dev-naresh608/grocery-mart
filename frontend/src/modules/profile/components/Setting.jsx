import React, { useState } from "react";
import { useSetting } from "../hooks";
import { defaultPP } from "@/assets";
import {
  User,
  Mail,
  Camera,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
  Pencil,
} from "lucide-react";

// ─── Field row ────────────────────────────────────────────────────────────────
const FieldRow = ({ icon: FieldIcon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#F5F5F4] last:border-0">
    <div className="w-8 h-8 rounded-lg bg-[#F5F5F4] flex items-center justify-center flex-shrink-0">
      {FieldIcon && <FieldIcon size={13} className="text-[#78716C]" strokeWidth={2} />}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-[#A8A29E]">{label}</p>
      <p className="text-sm font-semibold text-[#1C1917] truncate">{value}</p>
    </div>
  </div>
);

// Password input with show/hide
const PasswordInput = ({
  placeholder,
  name,
  value,
  onChange,
  isValid = true,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className={`flex items-center gap-2 bg-[#F5F5F4] border rounded-xl px-3 py-2.5 transition-colors ${
        isValid
          ? "border-[#E7E5E4] focus-within:border-[#6366F1]"
          : "border-[#EF4444]"
      }`}
    >
      <Lock
        size={13}
        className="text-[#A8A29E] flex-shrink-0"
        strokeWidth={2}
      />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="text-[#A8A29E] hover:text-[#78716C] flex-shrink-0"
      >
        {show ? (
          <EyeOff size={13} strokeWidth={2} />
        ) : (
          <Eye size={13} strokeWidth={2} />
        )}
      </button>
    </div>
  );
};

function Setting() {
  const {
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
  } = useSetting();

  return (
    <div className="space-y-5 p-2 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <h2 className="text-lg font-semibold text-[#1C1917]">Settings</h2>
        <p className="text-xs text-[#A8A29E] mt-0.5">
          Manage your account settings
        </p>
      </div>

      {/* Profile photo */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <p className="text-sm font-semibold text-[#1C1917] mb-4">
          Profile Photo
        </p>
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.imageUrl ?? defaultPP}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#E7E5E4] flex-shrink-0"
          />
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] cursor-pointer hover:text-[#4F46E5] transition-colors">
              <Camera size={13} strokeWidth={2} />
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <button
              type="button"
              onClick={handleRemoveProfilePicture}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:text-[#B91C1C] transition-colors"
            >
              <Trash2 size={13} strokeWidth={2} />
              Remove Photo
            </button>
            <p className="text-[11px] text-[#A8A29E]">JPG, PNG supported</p>
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <p className="text-sm font-semibold text-[#1C1917] mb-1">
          Account Info
        </p>
        <FieldRow icon={User} label="Username" value={currentUser.username} />
        <FieldRow icon={Mail} label="Email" value={currentUser.email} />
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#1C1917]">
            Saved Addresses
          </p>
          <button
            type="button"
            onClick={onAddAddress}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:text-[#B91C1C] transition-colors bg-transparent border-none cursor-pointer p-0 outline-none"
          >
            + Add Address
          </button>
        </div>

        {loadingAddresses ? (
          <div className="text-center py-4 text-xs text-gray-500 font-sans">
            Loading...
          </div>
        ) : addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((addr, idx) => {
              const fullAddress = `${addr.street}, ${addr.city}, ${addr.state} – ${addr.pincode}`;
              return (
                <div key={addr._id || idx} className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl p-3.5 flex items-start justify-between gap-3 font-sans">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F5F4] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={13} className="text-[#78716C]" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      {addr.name && (
                        <p className="text-xs font-semibold text-[#1C1917] truncate">
                          {addr.name}
                        </p>
                      )}
                      {addr.phone && (
                        <p className="text-[10px] text-[#78716C] mt-0.5">
                          +91 {addr.phone}
                        </p>
                      )}
                      <p className="text-xs text-[#78716C] mt-1 leading-normal font-sans">
                        {fullAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditAddress(addr)}
                      className="p-1.5 hover:bg-[#F5F5F4] rounded-lg text-[#6366F1] transition-colors"
                      title="Edit"
                    >
                      <Pencil size={12} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(addr._id)}
                      className="p-1.5 hover:bg-[#F5F5F4] rounded-lg text-[#EF4444] transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#FAFAF9] border border-dashed border-[#E7E5E4] rounded-xl p-5 text-center">
            <p className="text-xs text-[#78716C] font-sans">
              No addresses saved yet
            </p>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <p className="text-sm font-semibold text-[#1C1917] mb-4">
          Change Password
        </p>
        <form onSubmit={onFormDataSubmit} className="space-y-3">
          <div>
            <PasswordInput
              placeholder="Current Password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={onPasswordChange}
              isValid={isOldPassMatch}
            />
            {!isOldPassMatch && (
              <p className="text-[11px] text-[#EF4444] mt-1 ml-1">
                Incorrect current password
              </p>
            )}
          </div>

          <PasswordInput
            placeholder="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={onPasswordChange}
          />

          <div>
            <PasswordInput
              placeholder="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onPasswordChange}
              isValid={isConfirmPassMatch}
            />
            {!isConfirmPassMatch && (
              <p className="text-[11px] text-[#EF4444] mt-1 ml-1">
                Passwords don't match
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors mt-1"
          >
            <CheckCircle2 size={14} strokeWidth={2} />
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setting;
