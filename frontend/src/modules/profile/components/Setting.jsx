import React, { useState } from "react";
import { useSetting } from "../hooks";
import {
  User,
  Mail,
  Phone,
  Camera,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
  Pencil,
  Loader2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

// Password input with show/hide and red ring validation
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
      className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all ${
        isValid
          ? "bg-[#F5F5F4] border-[#E7E5E4] focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/10"
          : "bg-red-50/30 border-[#EF4444] ring-2 ring-[#EF4444]/20"
      }`}
    >
      <Lock
        size={13}
        className={isValid ? "text-[#A8A29E] flex-shrink-0" : "text-[#EF4444] flex-shrink-0"}
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
        className="text-[#A8A29E] hover:text-[#78716C] flex-shrink-0 bg-transparent border-none p-0 cursor-pointer"
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
  } = useSetting();

  return (
    <div className="space-y-5 p-2 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <h2 className="text-lg font-semibold text-[#1C1917]">Settings</h2>
        <p className="text-xs text-[#A8A29E] mt-0.5">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile photo */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <p className="text-sm font-semibold text-[#1C1917] mb-4">
          Profile Photo
        </p>
        <div className="flex items-center gap-5">
          {currentUser?.imageUrl || currentUser?.profile_picture ? (
            <img
              src={currentUser.imageUrl || currentUser.profile_picture}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-orange-400 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-50 to-amber-100 text-orange-600 border-2 border-orange-300 flex items-center justify-center flex-shrink-0">
              <User size={36} strokeWidth={1.75} />
            </div>
          )}
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
              className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:text-[#B91C1C] transition-colors bg-transparent border-none p-0 cursor-pointer outline-none"
            >
              <Trash2 size={13} strokeWidth={2} />
              Remove Photo
            </button>
            <p className="text-[11px] text-[#A8A29E]">JPG, PNG, WEBP supported (Max 5MB)</p>
          </div>
        </div>
      </div>

      {/* Account Info Cards - Icon-only In-card Edit */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#1C1917]">
            Account Information
          </p>
          <span className="text-xs text-[#A8A29E]">Click edit icon to update</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Username Card */}
          <div className={`bg-[#FAFAF9] border rounded-2xl p-3.5 transition-all ${
            editingField === "username" ? "border-[#6366F1] ring-2 ring-[#6366F1]/10 bg-white shadow-sm" : "border-[#E7E5E4] hover:border-[#6366F1]/40"
          }`}>
            {editingField === "username" ? (
              <form onSubmit={(e) => handleSingleFieldSubmit(e, "username")} className="flex items-center gap-2.5 w-full">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center flex-shrink-0">
                  <User size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#A8A29E] font-medium leading-none mb-1">Username</p>
                  <input
                    type="text"
                    name="username"
                    value={accountData.username}
                    onChange={onAccountChange}
                    placeholder="Username"
                    className="w-full bg-white border border-[#6366F1] rounded-lg px-2 py-1 text-xs font-semibold text-[#1C1917] outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="submit"
                    disabled={savingAccount}
                    className="w-7 h-7 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center justify-center cursor-pointer border-none shadow-sm transition-colors disabled:opacity-50"
                    title="Save Username"
                  >
                    {savingAccount ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelEdit("username")}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Cancel"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center flex-shrink-0">
                    <User size={16} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#A8A29E] font-medium leading-none mb-1">Username</p>
                    <p className="text-xs font-semibold text-[#1C1917] truncate">
                      {currentUser?.username || "—"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("username")}
                  className="w-7 h-7 rounded-lg bg-white border border-[#E7E5E4] hover:bg-[#6366F1] hover:text-white text-[#6366F1] flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                  title="Edit Username"
                >
                  <Pencil size={12} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>

          {/* Email Card */}
          <div className={`bg-[#FAFAF9] border rounded-2xl p-3.5 transition-all ${
            editingField === "email" ? "border-[#10B981] ring-2 ring-[#10B981]/10 bg-white shadow-sm" : "border-[#E7E5E4] hover:border-[#10B981]/40"
          }`}>
            {editingField === "email" ? (
              <form onSubmit={(e) => handleSingleFieldSubmit(e, "email")} className="flex items-center gap-2.5 w-full">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center flex-shrink-0">
                  <Mail size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#A8A29E] font-medium leading-none mb-1">Email Address</p>
                  <input
                    type="email"
                    name="email"
                    value={accountData.email}
                    onChange={onAccountChange}
                    placeholder="Email Address"
                    className="w-full bg-white border border-[#10B981] rounded-lg px-2 py-1 text-xs font-semibold text-[#1C1917] outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="submit"
                    disabled={savingAccount}
                    className="w-7 h-7 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center cursor-pointer border-none shadow-sm transition-colors disabled:opacity-50"
                    title="Save Email"
                  >
                    {savingAccount ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelEdit("email")}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Cancel"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center flex-shrink-0">
                    <Mail size={16} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#A8A29E] font-medium leading-none mb-1">Email Address</p>
                    <p className="text-xs font-semibold text-[#1C1917] truncate">
                      {currentUser?.email || "—"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("email")}
                  className="w-7 h-7 rounded-lg bg-white border border-[#E7E5E4] hover:bg-[#10B981] hover:text-white text-[#10B981] flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                  title="Edit Email"
                >
                  <Pencil size={12} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>

          {/* Phone Card */}
          <div className={`bg-[#FAFAF9] border rounded-2xl p-3.5 transition-all ${
            editingField === "phone" ? "border-[#F59E0B] ring-2 ring-[#F59E0B]/10 bg-white shadow-sm" : "border-[#E7E5E4] hover:border-[#F59E0B]/40"
          }`}>
            {editingField === "phone" ? (
              <form onSubmit={(e) => handleSingleFieldSubmit(e, "phone")} className="flex items-center gap-2.5 w-full">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center flex-shrink-0">
                  <Phone size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#A8A29E] font-medium leading-none mb-1">Phone Number</p>
                  <input
                    type="tel"
                    name="phone"
                    value={accountData.phone}
                    onChange={onAccountChange}
                    placeholder="Phone Number"
                    className="w-full bg-white border border-[#F59E0B] rounded-lg px-2 py-1 text-xs font-semibold text-[#1C1917] outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="submit"
                    disabled={savingAccount}
                    className="w-7 h-7 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-white flex items-center justify-center cursor-pointer border-none shadow-sm transition-colors disabled:opacity-50"
                    title="Save Phone"
                  >
                    {savingAccount ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelEdit("phone")}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center cursor-pointer border-none transition-colors"
                    title="Cancel"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <Phone size={16} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#A8A29E] font-medium leading-none mb-1">Phone Number</p>
                    <p className="text-xs font-semibold text-[#1C1917] truncate">
                      {currentUser?.phone ? `+91 ${currentUser.phone}` : "Not added"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingField("phone")}
                  className="w-7 h-7 rounded-lg bg-white border border-[#E7E5E4] hover:bg-[#F59E0B] hover:text-white text-[#F59E0B] flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                  title="Edit Phone"
                >
                  <Pencil size={12} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>
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
                      className="p-1.5 hover:bg-[#F5F5F4] rounded-lg text-[#6366F1] transition-colors border-none bg-transparent cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={12} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(addr._id)}
                      className="p-1.5 hover:bg-[#F5F5F4] rounded-lg text-[#EF4444] transition-colors border-none bg-transparent cursor-pointer"
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
              isValid={!oldPasswordError}
            />
            {oldPasswordError && (
              <p className="text-[11px] text-[#EF4444] mt-1 ml-1 font-medium flex items-center gap-1">
                <AlertCircle size={12} /> {oldPasswordError}
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
              <p className="text-[11px] text-[#EF4444] mt-1 ml-1 font-medium flex items-center gap-1">
                <AlertCircle size={12} /> Passwords don't match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors mt-1 border-none cursor-pointer disabled:opacity-50"
          >
            {changingPassword ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} strokeWidth={2} />
            )}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setting;
