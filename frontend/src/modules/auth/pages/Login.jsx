import React from "react";
import { LogIn, Mail, Loader2 } from "lucide-react";
import {
  AuthHeader,
  AuthFooterLink,
  FormInput,
  PasswordInput,
} from "../components";
import { useLoginForm } from "../hooks/useLoginForm";
import { useModal, MODAL_TYPES } from "../../../components";

export default function Login() {
  const {
    formData,
    formErrors,
    isPassVisible,
    isLoading,
    handleChange,
    handleShowPassword,
    handleSubmit,
  } = useLoginForm();

  const { openModal } = useModal();

  return (
    <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <AuthHeader
        icon={LogIn}
        title="Welcome Back"
        subtitle="Sign in to your account"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          icon={Mail}
          label="Email Address"
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          autoComplete="username"
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
        />

        {formErrors.password && (
          <p className="text-sm text-red-500 -mt-3">
            {formErrors.password}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1c1917] active:scale-95 flex items-center justify-center gap-2 text-white py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <LogIn size={20} />
          )}

          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <AuthFooterLink
          text="Don't have an account?"
          linkText="Sign up"
          onClick={() => openModal(MODAL_TYPES.SIGNUP)}
        />
      </form>
    </div>
  );
}