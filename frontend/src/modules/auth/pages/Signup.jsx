import React from "react";
import { UserPlus2Icon, User, Phone, Mail, Loader2 } from "lucide-react";
import {
  AuthHeader,
  AuthFooterLink,
  FormInput,
  PasswordInput,
  RoleSelector,
  SellerFields,
  DriverFields,
} from "../components";
import { useSignupForm } from "../hooks/useSignupForm";
import { STORE_CATEGORIES } from "../constants/storeCategories";
import { useModal, MODAL_TYPES } from "../../../components";

export default function Signup() {
  const {
    formData,
    formErrors,
    currentRole,
    setCurrentRole,
    isPassVisible,
    isLoading,
    handleChange,
    handleShowPassword,
    handleSubmit,
  } = useSignupForm();

  const { openModal } = useModal();

  return (
    <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <AuthHeader
        icon={UserPlus2Icon}
        title="Create account"
        subtitle="Join us today"
      />

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <RoleSelector
          currentRole={currentRole}
          onChange={setCurrentRole}
        />

        <FormInput
          icon={User}
          label="Username"
          name="username"
          type="text"
          placeholder="Username..."
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          required
        />

        {formErrors.username && (
          <p className="text-sm text-red-500 -mt-3">
            {formErrors.username}
          </p>
        )}

        <FormInput
          icon={Mail}
          label="Email"
          name="email"
          type="email"
          placeholder="Email..."
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        {formErrors.email && (
          <p className="text-sm text-red-500 -mt-3">
            {formErrors.email}
          </p>
        )}

        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          visible={isPassVisible}
          onToggle={handleShowPassword}
          autoComplete="new-password"
        />

        {formErrors.password && (
          <p className="text-sm text-red-500 -mt-3">
            {formErrors.password}
          </p>
        )}

        <FormInput
          icon={Phone}
          label="Phone"
          name="phone"
          type="tel"
          placeholder="Enter 10-digit phone number..."
          value={formData.phone}
          onChange={handleChange}
          maxLength={10}
          required
        />

        {formErrors.phone && (
          <p className="text-sm text-red-500 -mt-3">
            {formErrors.phone}
          </p>
        )}

        {currentRole === "seller" && (
          <SellerFields
            formData={formData}
            formErrors={formErrors}
            onChange={handleChange}
            categories={STORE_CATEGORIES}
          />
        )}

        {currentRole === "driver" && (
          <DriverFields
            formData={formData}
            formErrors={formErrors}
            onChange={handleChange}
          />
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1c1917] active:scale-95 flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <UserPlus2Icon size={20} />
          )}

          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        <AuthFooterLink
          text="Already have an account?"
          linkText="Log in"
          onClick={() => openModal(MODAL_TYPES.LOGIN)}
        />
      </form>
    </div>
  );
}